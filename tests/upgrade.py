import sqlite3
import urllib.request
before=sqlite3.connect('/tmp/antidpi-before.sqlite3')
after=sqlite3.connect('/var/lib/haproxy-configer/panel.sqlite3')
for table in ('users','state'):
    assert sorted(before.execute('SELECT * FROM '+table).fetchall())==sorted(after.execute('SELECT * FROM '+table).fetchall()),table
with urllib.request.urlopen('http://127.0.0.1:9080/',timeout=10) as response:
    assert response.status==200
print('PASS: update preserves accounts and state; control plane responds')
