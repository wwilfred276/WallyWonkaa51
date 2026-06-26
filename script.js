function showPage(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
}
if(window.Telegram && Telegram.WebApp){Telegram.WebApp.ready();Telegram.WebApp.expand();}
