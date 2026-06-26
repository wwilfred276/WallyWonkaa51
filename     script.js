function showPage(pageId){

    // Cache toutes les pages
    document.querySelectorAll(".page").forEach(page=>{
        page.classList.remove("active");
    });

    // Affiche la page sélectionnée
    document.getElementById(pageId).classList.add("active");

}

// Si la Mini App est ouverte dans Telegram
if (window.Telegram && Telegram.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
}