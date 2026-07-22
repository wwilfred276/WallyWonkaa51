const WW_PASSWORD = "WONKAA2025";

/* ==========================
   NAVIGATION
========================== */

function showPage(pageId){

    document.querySelectorAll(".home-page, .page").forEach(page=>{
        page.classList.remove("active");
    });

    const page=document.getElementById(pageId);

    if(page){
        page.classList.add("active");
    }

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

}

/* ==========================
   AU CHARGEMENT
========================== */

document.addEventListener("DOMContentLoaded",()=>{

    document.body.classList.remove("loading-step");
    document.body.classList.add("security-step");
    document.body.classList.remove("site-ready");

    showPage("home");

    wwStartTimer();

});

/* ==========================
   TIMER 24H
========================== */

function wwStartTimer(){

    let total = 24 * 60 * 60;

    setInterval(()=>{

        total--;

        if(total < 0){
            total = 24 * 60 * 60;
        }

        const h = Math.floor(total / 3600);
        const m = Math.floor((total % 3600) / 60);
        const s = total % 60;

        document.getElementById("ww-hours").textContent = String(h).padStart(2,"0");
        document.getElementById("ww-minutes").textContent = String(m).padStart(2,"0");
        document.getElementById("ww-seconds").textContent = String(s).padStart(2,"0");

    },1000);

}

/* ==========================
   MOT DE PASSE
========================== */

function wwCheckPassword(){

    const input = document.getElementById("ww-password");
    const message = document.getElementById("ww-message");
    const security = document.getElementById("ww-security");

    if(input.value.trim() === WW_PASSWORD){

        message.style.color = "#6dff5d";
        message.textContent = "✅ ACCÈS AUTORISÉ";

        setTimeout(()=>{

            security.style.display = "none";

            document.body.classList.remove("security-step");
            document.body.classList.add("site-ready");

            showPage("home");

        },1000);

    }else{

        message.style.color = "#ff4c86";
        message.textContent = "❌ Code incorrect";

        input.value = "";

    }

}

/* ==========================
   AFFICHER / MASQUER LE MOT DE PASSE
========================== */

function wwTogglePassword(){

    const input = document.getElementById("ww-password");

    if(input.type === "password"){
        input.type = "text";
    }else{
        input.type = "password";
    }

}

/* ==========================
   MÉMORISE LA POSITION DE LA BANNIÈRE
========================== */

let bannerPosition = 0;

function saveBannerPosition(){

    const banner = document.querySelector(".scroll-track");
    if(!banner) return;

    const matrix = window.getComputedStyle(banner).transform;

    if(matrix !== "none"){

        const values = matrix.match(/matrix.*\((.+)\)/);

        if(values){
            bannerPosition = parseFloat(values[1].split(", ")[4]);
        }

    }

}

function restoreBannerPosition(){

    const banner = document.querySelector(".scroll-track");
    if(!banner) return;

    banner.style.animation = "none";
    banner.style.transform = `translateX(${bannerPosition}px)`;

    requestAnimationFrame(()=>{
        banner.style.animation = "";
    });

}
