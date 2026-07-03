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

    document.body.classList.add("loading-step");
    document.body.classList.remove("security-step");
    document.body.classList.remove("site-ready");

    showPage("home");

    wwStartLoading();

    wwStartTimer();

});

/* ==========================
   LOADING
========================== */

function wwStartLoading(){

    const screen=document.getElementById("ww-loading");
    const progress=document.getElementById("ww-loading-progress");
    const percent=document.getElementById("ww-loading-percent");
    const status=document.getElementById("ww-loading-status");

    let value=0;

    const messages=[
        "🛡️ Vérification des ressources...",
        "⚡ Chargement des données...",
        "🚚 Synchronisation...",
        "👑 Finalisation..."
    ];

    const timer=setInterval(()=>{

        value+=4;

        if(value>100){
            value=100;
        }

        progress.style.width=value+"%";
        percent.textContent=value+"%";

        if(value<30){

            status.textContent=messages[0];

        }else if(value<60){

            status.textContent=messages[1];

        }else if(value<90){

            status.textContent=messages[2];

        }else{

            status.textContent=messages[3];

        }

        if(value===100){

            clearInterval(timer);

            setTimeout(()=>{

                screen.classList.add("hide");

            },600);

            setTimeout(()=>{

                screen.style.display="none";

                document.body.classList.remove("loading-step");

                document.body.classList.add("security-step");

            },1200);

        }

    },170);

}

/* ==========================
   TIMER 24H
========================== */

function wwStartTimer(){

    let total=24*60*60;

    setInterval(()=>{

        total--;

        if(total<0){

            total=24*60*60;

        }

        const h=Math.floor(total/3600);
        const m=Math.floor((total%3600)/60);
        const s=total%60;

        document.getElementById("ww-hours").textContent=String(h).padStart(2,"0");
        document.getElementById("ww-minutes").textContent=String(m).padStart(2,"0");
        document.getElementById("ww-seconds").textContent=String(s).padStart(2,"0");

    },1000);

}

/* ==========================
   MOT DE PASSE
========================== */

function wwCheckPassword(){

    const input=document.getElementById("ww-password");
    const message=document.getElementById("ww-message");
    const security=document.getElementById("ww-security");

    if(input.value.trim()===WW_PASSWORD){

        message.style.color="#6dff5d";
        message.textContent="✅ ACCÈS AUTORISÉ";

        setTimeout(()=>{

            security.style.display="none";

            document.body.classList.remove("security-step");

            document.body.classList.add("site-ready");

            showPage("home");

        },1000);

    }else{

        message.style.color="#ff4c86";
        message.textContent="❌ Code incorrect";

        input.value="";

    }

}

/* ==========================
   AFFICHER / MASQUER
========================== */

function wwTogglePassword(){

    const input=document.getElementById("ww-password");

    if(input.type==="password"){

        input.type="text";

    }else{

        input.type="password";

    }

}
