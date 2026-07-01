/* ================================= */
/* CONFIGURATION */
/* ================================= */

const ACCESS_CODE = "5111";
const ACCESS_TIME = 15 * 60;
const ORDER_TIME = 10 * 60;

/* ================================= */
/* ÉLÉMENTS */
/* ================================= */

const introLoader = document.getElementById("introLoader");
const accessPage = document.getElementById("accessPage");
const successPage = document.getElementById("successPage");

const loginBtn = document.getElementById("loginBtn");
const codeInput = document.getElementById("codeInput");
const errorMsg = document.getElementById("errorMsg");

const min = document.getElementById("min");
const sec = document.getElementById("sec");

const bottomNav = document.getElementById("bottomNav");

const orderTimer = document.getElementById("orderTimer");
const orderTimerBox = document.querySelector(".order-timer");

const pages = document.querySelectorAll(".page");

/* ================================= */
/* VARIABLES */
/* ================================= */

let accessTime = ACCESS_TIME;
let orderTime = ORDER_TIME;

let orderInterval = null;

/* ================================= */
/* CHARGEMENT */
/* ================================= */

window.addEventListener("load", () => {

    pages.forEach(page => page.style.display = "none");

    if(bottomNav){
        bottomNav.style.display="none";
    }

    setTimeout(()=>{

        introLoader.style.opacity="0";
        introLoader.style.transition=".5s";

        setTimeout(()=>{

            introLoader.style.display="none";
            accessPage.style.display="flex";

        },500);

    },3000);

});

/* ================================= */
/* TIMER CODE */
/* ================================= */

function updateAccessTimer(){

    const minutes=Math.floor(accessTime/60);
    const seconds=accessTime%60;

    min.textContent=String(minutes).padStart(2,"0");
    sec.textContent=String(seconds).padStart(2,"0");

    if(accessTime<=0){

        loginBtn.disabled=true;

        loginBtn.style.opacity=".5";

        errorMsg.textContent="⛔ Code expiré";

        return;

    }

    accessTime--;

}

setInterval(updateAccessTimer,1000);

updateAccessTimer();

/* ================================= */
/* CONNEXION */
/* ================================= */

loginBtn.addEventListener("click",()=>{

    if(codeInput.value.trim()!==ACCESS_CODE){

        errorMsg.textContent="❌ Code incorrect";

        codeInput.value="";

        return;

    }

    errorMsg.textContent="";

    accessPage.style.display="none";

    successPage.style.display="flex";

    setTimeout(()=>{

        successPage.style.display="none";

        if(bottomNav){

            bottomNav.style.display="flex";

        }

        showPage("home");

        startOrderTimer();

    },1800);

});

/* ================================= */
/* TIMER SESSION */
/* ================================= */

function startOrderTimer(){

    orderTime=ORDER_TIME;

    if(orderInterval){

        clearInterval(orderInterval);

    }

    orderTimerBox.classList.remove("warning");
    orderTimerBox.classList.remove("danger");

    updateOrderTimer();

    orderInterval=setInterval(()=>{

        orderTime--;

        if(orderTime<=300){

            orderTimerBox.classList.add("warning");

        }

        if(orderTime<=60){

            orderTimerBox.classList.add("danger");

        }

        if(orderTime<=0){

            clearInterval(orderInterval);

            orderTimer.textContent="00:00";

            alert("⏰ Session expirée.");

            backToSecure();

            return;

        }

        updateOrderTimer();

    },1000);

}

function updateOrderTimer(){

    const m=Math.floor(orderTime/60);
    const s=orderTime%60;

    orderTimer.textContent=

        String(m).padStart(2,"0")+

        ":"+

        String(s).padStart(2,"0");

}

/* ================================= */
/* CHANGEMENT DE PAGE */
/* ================================= */

function showPage(pageId){

    pages.forEach(page => {
        page.style.display = "none";
    });

    const page = document.getElementById(pageId);

    if(page){
        page.style.display = "block";
        page.classList.add("page-anim");

        setTimeout(() => {
            page.classList.remove("page-anim");
        }, 400);
    }
}

/* ================================= */
/* RETOUR ACCÈS SÉCURISÉ */
/* ================================= */

function backToSecure(){

    pages.forEach(page => {
        page.style.display = "none";
    });

    if(successPage){
        successPage.style.display = "none";
    }

    accessPage.style.display = "flex";

    if(bottomNav){
        bottomNav.style.display = "none";
    }

    if(orderInterval){
        clearInterval(orderInterval);
    }

    if(orderTimer){
        orderTimer.textContent = "10:00";
    }

    if(orderTimerBox){
        orderTimerBox.classList.remove("warning", "danger");
    }

    codeInput.value = "";
    errorMsg.textContent = "";
}

/* ================================= */
/* ENTRÉE CLAVIER */
/* ================================= */

codeInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter"){
        loginBtn.click();
    }
});

/* ================================= */
/* TELEGRAM MINI APP */
/* ================================= */

if(window.Telegram && Telegram.WebApp){
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
}
