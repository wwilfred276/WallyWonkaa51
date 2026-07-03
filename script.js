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
    wwStartLoading();
    wwStartTimer();
});

function wwStartLoading(){
    const screen = document.getElementById("ww-loading");
    const bar = document.getElementById("ww-loading-progress");
    const percent = document.getElementById("ww-loading-percent");
    const status = document.getElementById("ww-loading-status");

    if(!screen || !bar || !percent || !status) return;

    let value = 0;

    const messages = [
        "🛡️ INITIALISATION...",
        "🛡️ VÉRIFICATION DES RESSOURCES...",
        "⚡ CHARGEMENT DES DONNÉES...",
        "🔐 SÉCURISATION DE L'ACCÈS...",
        "👑 FINALISATION..."
    ];

    const timer = setInterval(() => {
        value += Math.floor(Math.random() * 6) + 3;

        if(value > 100) value = 100;

        bar.style.width = value + "%";
        percent.textContent = value + "%";

        if(value < 20) status.textContent = messages[0];
        else if(value < 45) status.textContent = messages[1];
        else if(value < 70) status.textContent = messages[2];
        else if(value < 95) status.textContent = messages[3];
        else status.textContent = messages[4];

        if(value === 100){
            clearInterval(timer);

            setTimeout(() => {
                screen.classList.add("hide");
            }, 700);

            setTimeout(() => {
                screen.style.display = "none";
                wwOpenSecurity();
            }, 1500);
        }
    }, 220);
}

function wwOpenSecurity(){
    const security = document.getElementById("ww-security");

    if(security){
        security.classList.add("active");
    }
}

function wwCheckPassword(){
    const input = document.getElementById("ww-password");
    const message = document.getElementById("ww-message");
    const security = document.getElementById("ww-security");

    if(input.value === WW_PASSWORD){
        message.textContent = "✅ ACCÈS AUTORISÉ";
        message.style.color = "#9dff2e";

        setTimeout(() => {
            security.classList.remove("active");
            security.style.display = "none";

            if(typeof showPage === "function"){
                showPage("home");
            }
        }, 1200);

    }else{
        message.textContent = "❌ CODE INCORRECT";
        message.style.color = "#ff3b8d";
        input.value = "";
    }
}

function wwTogglePassword(){
    const input = document.getElementById("ww-password");
    input.type = input.type === "password" ? "text" : "password";
}

function wwStartTimer(){
    let total = 24 * 60 * 60;

    setInterval(() => {
        total--;

        if(total < 0){
            total = 24 * 60 * 60;
        }

        const h = Math.floor(total / 3600);
        const m = Math.floor((total % 3600) / 60);
        const s = total % 60;

        const hours = document.getElementById("ww-hours");
        const minutes = document.getElementById("ww-minutes");
        const seconds = document.getElementById("ww-seconds");

        if(hours && minutes && seconds){
            hours.textContent = String(h).padStart(2,"0");
            minutes.textContent = String(m).padStart(2,"0");
            seconds.textContent = String(s).padStart(2,"0");
        }
    }, 1000);
}
