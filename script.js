function showPage(pageId){
    const home = document.getElementById("home");
    const pages = document.querySelectorAll(".page");

    home.classList.remove("active");

    pages.forEach(page => {
        page.classList.remove("active");
    });

    if(pageId === "home"){
        home.classList.add("active");
    }else{
        const selectedPage = document.getElementById(pageId);
        if(selectedPage){
            selectedPage.classList.add("active");
        }
    }

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });
}

document.addEventListener("DOMContent-Loaded", function(){
    showPage("home");
});

const WW_PASSWORD = "WONKAA2025";

document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("loading-step");
    document.body.classList.remove("security-step", "site-ready");

    wwStartLoading();
    wwStartTimer();
});

function wwStartLoading(){
    const screen = document.getElementById("ww-loading");
    const bar = document.getElementById("ww-loading-progress");
    const percent = document.getElementById("ww-loading-percent");
    const status = document.getElementById("ww-loading-status");

    let value = 0;

    const timer = setInterval(() => {
        value += 5;
        if(value > 100) value = 100;

        bar.style.width = value + "%";
        percent.textContent = value + "%";

        if(value < 40) status.textContent = "🛡️ VÉRIFICATION DES RESSOURCES...";
        else if(value < 80) status.textContent = "⚡ CHARGEMENT DES DONNÉES...";
        else status.textContent = "👑 FINALISATION...";

        if(value === 100){
            clearInterval(timer);

            setTimeout(() => {
                screen.style.display = "none";

                document.body.classList.remove("loading-step");
                document.body.classList.add("security-step");
            }, 800);
        }
    }, 150);
}

function wwCheckPassword(){
    const input = document.getElementById("ww-password");
    const message = document.getElementById("ww-message");
    const security = document.getElementById("ww-security");

    if(input.value === WW_PASSWORD){
        message.textContent = "✅ ACCÈS AUTORISÉ";
        message.style.color = "#9dff2e";

        setTimeout(() => {
            security.style.display = "none";

            document.body.classList.remove("security-step");
            document.body.classList.add("site-ready");

            showPage("home");
        }, 1000);
    }else{
        message.textContent = "❌ CODE INCORRECT";
        message.style.color = "#ff3b8d";
        input.value = "";
    }
}
