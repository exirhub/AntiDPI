'use strict';
const tabs=[...document.querySelectorAll('[data-mode]')];
const command=document.querySelector('#command');
const note=document.querySelector('#mode-note');
function select(tab){
 tabs.forEach(item=>{item.setAttribute('aria-selected',String(item===tab));item.tabIndex=item===tab?0:-1;});
 document.querySelector('#command-panel').setAttribute('aria-labelledby',tab.id);
 const update=tab.dataset.mode==='update';
 command.textContent='sha256sum --check SHA256SUMS\nsudo bash AntiDPI-ubuntu24-amd64.run'+(update?' --update':'');
 note.textContent=update?'Existing accounts, routes, certificates and traffic history are preserved. Back up from the panel before updating.':'First installation generates a random password and a one-time setup link. Save them securely.';
}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>select(tab));tab.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();const next=event.key==='Home'?tabs[0]:event.key==='End'?tabs.at(-1):tabs[(index+1)%tabs.length];select(next);next.focus();}});});
document.querySelector('#copy').addEventListener('click',async()=>{
 const status=document.querySelector('#copy-status');
 try{await navigator.clipboard.writeText(command.textContent);status.textContent='Commands copied.';}
 catch{const selection=window.getSelection();const range=document.createRange();range.selectNodeContents(command);selection.removeAllRanges();selection.addRange(range);status.textContent='Select and copy the highlighted commands.';}
});
