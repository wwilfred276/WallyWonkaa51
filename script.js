function showPage(page) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(p => {
        p.classList.remove("active");
    });

    document.getElementById(page).classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// Telegram Mini App
if (window.Telegram && Telegram.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
}
