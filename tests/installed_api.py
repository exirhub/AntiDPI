"""Black-box checks of the published binary on a disposable Ubuntu runner."""
import http.client
import json
from pathlib import Path
import socket
import socketserver
import sqlite3
import ssl
import subprocess
import threading
import time

app = Path('/opt/haproxy-configer')
assert (app/'antidpi').is_file()
assert not (app/'panel').exists()
for path in app.rglob('*'):
    assert path.suffix not in ('.py','.pyc','.pyo','.map'), path
    assert not path.stat().st_mode & 0o022, path
assert 'native' in subprocess.check_output([str(app/'antidpi'),'--version'],text=True)
helper=['runuser','-u','hapcfg','--','sudo','-n',str(app/'antidpi')]
assert subprocess.run([*helper,'ops','service-status'],input='{}',text=True,capture_output=True).returncode==0
assert subprocess.run([*helper,'serve','--help'],input='{}',text=True,capture_output=True).returncode!=0
context=ssl.create_default_context(cafile='/etc/haproxy-configer/certs/panel.pem')
cookie=csrf=None

def request(path, method='GET', data=None):
    global cookie
    conn=http.client.HTTPSConnection('127.0.0.1',9443,context=context,timeout=15)
    headers={'Content-Type':'application/json'}
    if cookie: headers['Cookie']=cookie
    if csrf: headers['X-CSRF-Token']=csrf
    conn.request(method,path,json.dumps(data) if data is not None else None,headers)
    response=conn.getresponse(); body=response.read()
    if response.getheader('Set-Cookie'): cookie=response.getheader('Set-Cookie').split(';')[0]
    assert response.status<400,(path,response.status,body[:120])
    conn.close()
    return json.loads(body)

def wait(check):
    deadline=time.monotonic()+40
    while time.monotonic()<deadline:
        try:
            if check(): return
        except (OSError,http.client.HTTPException): pass
        time.sleep(.5)
    raise AssertionError('Timed out waiting for service')

with sqlite3.connect('/var/lib/haproxy-configer/panel.sqlite3') as db:
    credentials=json.loads(db.execute("SELECT value FROM state WHERE key='bootstrap'").fetchone()[0])
login=request('/api/login','POST',{k:credentials[k] for k in ('username','password')}); csrf=login['csrf']
assert 'openapi' in request('/api/v1/spec')
assert isinstance(request('/api/v1/speed'),dict)
class Echo(socketserver.BaseRequestHandler):
    def handle(self):
        while data:=self.request.recv(65536): self.request.sendall(data)
class Origin(socketserver.ThreadingTCPServer):
    allow_reuse_address=True
    daemon_threads=True
origin=Origin(('127.0.0.1',18443),Echo)
threading.Thread(target=origin.serve_forever,daemon=True).start()
try:
    current=request('/api/v1/config'); cfg=current['config']
    assert len(cfg['listeners'])==1 and cfg['listeners'][0]['mode']=='tcp'
    cfg['pools'][0]['servers']=[{'id':'testorigin','name':'Disposable test','host':'127.0.0.1','port':18443}]
    saved=request('/api/v1/config','PUT',{'revision':current['revision'],'config':cfg})
    request('/api/v1/config/apply','POST',{'revision':saved['revision']})
    with socket.create_connection(('127.0.0.1',8443),timeout=10) as tunnel:
        tunnel.sendall(b'before'); assert tunnel.recv(100)==b'before'
        cfg=saved['config']; cfg['pools'][0]['servers'][0]['weight']=150
        saved=request('/api/v1/config','PUT',{'revision':saved['revision'],'config':cfg})
        request('/api/v1/config/apply','POST',{'revision':saved['revision']})
        tunnel.sendall(b'after'); assert tunnel.recv(100)==b'after'
    before=request('/api/v1/service'); assert before['state']=='active'
    request('/api/v1/service','POST',{'action':'restart','confirm':True})
    wait(lambda:(lambda s:s['state']=='active' and s['pid']!=before['pid'])(request('/api/v1/service')))
    wait(lambda:subprocess.run(['systemctl','is-active','--quiet','haproxy-configer-control.timer']).returncode!=0)
    request('/api/v1/service','POST',{'action':'stop','confirm':True})
    wait(lambda:subprocess.check_output(['systemctl','show','--value','--property=ActiveState','haproxy-configer-proxy.service'],text=True).strip() in ('inactive','failed'))
finally:
    subprocess.run(['systemctl','start','haproxy-configer-proxy.service'],check=True)
    origin.shutdown()
wait(lambda:request('/api/v1/service')['state']=='active')
print('PASS: native-only installation, sudo boundary, HTTPS login/API, TCP reload, restart/stop/recovery')
