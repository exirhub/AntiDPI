'use strict';
const messages={
 fa:{title:'AntiDPI — نصب سریع',description:'نصب و به‌روزرسانی AntiDPI با یک دستور روی Ubuntu 24.04.',eyebrow:'مدیریت شبکه، روی سرور خودتان',headline:['شبکه‌ات،','در دست خودت.'],intro:'مدیریت مسیرهای TCP، سرورهای خروجی و بکاپ‌های x-ui در یک پنل.',feature1:'ترافیک زنده',feature2:'نصب 3x-ui با SSH',feature3:'بکاپ‌های ذخیره‌شده',install:'نصب جدید',update:'به‌روزرسانی',instruction:'این دستور را در ترمینال سرور اجرا کنید:',copy:'کپی دستور',copyLabel:'کپی دستور نصب',automatic:'دانلود، بررسی checksum و نصب، خودکار انجام می‌شوند.',installNote:'رمز ورود و لینک راه‌اندازی در پایان نصب نمایش داده می‌شوند.',updateNote:'حساب‌ها و تنظیمات حفظ می‌شوند. پیش از به‌روزرسانی بکاپ بگیرید.',download:'دانلود مستقیم',ports:'پنل: HTTPS روی پورت 9443 · مسیر TCP پیش‌فرض: 8443',back:'نصب AntiDPI',modes:'روش نصب',copied:'دستور کپی شد.',fallback:'دستور انتخاب شد؛ آن را کپی کنید.'},
 en:{title:'AntiDPI — Quick install',description:'Install or update AntiDPI on Ubuntu 24.04 with one command.',eyebrow:'Your network. Your server.',headline:['Your network.','In your hands.'],intro:'TCP routes, output servers and x-ui backups in one panel.',feature1:'Live traffic',feature2:'3x-ui over SSH',feature3:'Saved backups',install:'Fresh install',update:'Update existing',instruction:'Run this command in your server terminal:',copy:'Copy command',copyLabel:'Copy installation command',automatic:'Download, checksum verification and installation are automatic.',installNote:'Your password and setup link appear when installation finishes.',updateNote:'Accounts and settings are preserved. Back up before updating.',download:'Direct download',ports:'Panel: HTTPS on 9443 · Default TCP route: 8443',back:'Install AntiDPI',modes:'Installation mode',copied:'Command copied.',fallback:'Command selected. Copy the highlighted text.'}
};
const tabs=[...document.querySelectorAll('[data-mode]')];
const command=document.querySelector('#command');
const status=document.querySelector('#copy-status');
let language='fa',mode='install';
try{const saved=localStorage.getItem('antidpi-language');if(saved in messages)language=saved;}catch{}
function render(){
 const text=messages[language];
 document.documentElement.lang=language;
 document.documentElement.dir=language==='fa'?'rtl':'ltr';
 document.title=text.title;
 document.querySelector('meta[name="description"]').content=text.description;
 document.querySelectorAll('[data-i18n]').forEach(element=>{
  const value=text[element.dataset.i18n];
  if(Array.isArray(value))element.replaceChildren(document.createTextNode(value[0]),document.createElement('br'),document.createTextNode(value[1]));
  else element.textContent=value;
 });
 const other=language==='fa'?'en':'fa';
 const button=document.querySelector('#language');
 button.textContent=other==='en'?'English':'فارسی';button.lang=other;
 button.setAttribute('aria-label',other==='en'?'Switch to English':'تغییر زبان به فارسی');
 document.querySelector('#modes').setAttribute('aria-label',text.modes);
 document.querySelector('#copy').setAttribute('aria-label',text.copyLabel);
 tabs.forEach(tab=>{const active=tab.dataset.mode===mode;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;});
 document.querySelector('#command-panel').setAttribute('aria-labelledby','tab-'+mode);
 command.textContent='curl -fsSL https://exirhub.github.io/AntiDPI/install.sh | sudo bash'+(mode==='update'?' -s -- --update':'');
 document.querySelector('#mode-note').textContent=mode==='update'?text.updateNote:text.installNote;
 status.textContent='';
}
tabs.forEach((tab,index)=>{
 tab.addEventListener('click',()=>{mode=tab.dataset.mode;render();});
 tab.addEventListener('keydown',event=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  event.preventDefault();
  const next=event.key==='Home'?tabs[0]:event.key==='End'?tabs.at(-1):tabs[(index+1)%tabs.length];
  mode=next.dataset.mode;render();next.focus();
 });
});
document.querySelector('#language').addEventListener('click',()=>{
 language=language==='fa'?'en':'fa';try{localStorage.setItem('antidpi-language',language);}catch{}render();
});
document.querySelector('#copy').addEventListener('click',async()=>{
 try{await navigator.clipboard.writeText(command.textContent);status.textContent=messages[language].copied;}
 catch{const selection=window.getSelection();const range=document.createRange();range.selectNodeContents(command);selection.removeAllRanges();selection.addRange(range);status.textContent=messages[language].fallback;}
});
render();
