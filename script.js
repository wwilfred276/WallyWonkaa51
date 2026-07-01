// =========================
// WALLY WONKAA
// script.js
// =========================

// =========================
// CONFIGURATION
// =========================

const ACCESS_CODE = "5151"; // Change ton code ici
const SESSION_TIME = 15 * 60; // 15 minutes

// =========================
// ÉLÉMENTS
// =========================

const introLoader = document.getElementById("introLoader");
const accessPage = document.getElementById("accessPage");
const home = document.getElementById("home");

const codeInput = document.getElementById("codeInput");
const loginBtn = document.getElementById("loginBtn");

const min = document.getElementById("min");
const sec = document.getElementById("sec");

const errorMsg = document.getElementById("errorMsg");

const pages = document.querySelectorAll(".page");

// =========================
// OUVERTURE APPLICATION
// =========================

window.addEventListener("load", () => {

    // Cache toutes les pages
    pages.forEach(page => {
        page.style.display = "none";
    });

    home.style.display = "none";

    // Chargement 3 secondes
    setTimeout(() => {

        introLoader.style.opacity = "0";
        introLoader.style.transition = ".5s";

        setTimeout(() => {

            introLoader.style.display = "none";

            accessPage.style.display = "flex";

        },500);

    },3000);

});

// =========================
// TIMER 15 MINUTES
// =========================

let time = SESSION_TIME;

function updateTimer(){

    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    min.innerHTML = String(minutes).padStart(2,"0");
    sec.innerHTML = String(seconds).padStart(2,"0");

    if(time <= 0){

        errorMsg.innerHTML = "⛔ Code expiré";

        loginBtn.disabled = true;

        return;

    }

    time--;

}

setInterval(updateTimer,1000);

// =========================
// CONNEXION
// =========================

loginBtn.addEventListener("click",()=>{

    if(codeInput.value.trim() === ACCESS_CODE){

        accessPage.style.display = "none";

        showPage("home");

    }else{

        errorMsg.innerHTML = "❌ Code incorrect";

        codeInput.value = "";

    }

});

// =========================
// NAVIGATION
// =========================

function showPage(pageId){

    pages.forEach(page=>{

        page.style.display="none";

    });

    const page = document.getElementById(pageId);

    if(page){

        page.style.display="block";

    }

}

// =========================
// FONCTION RETOUR
// =========================

function backHome(){

    showPage("home");

}

// =========================
// TELEGRAM WEBAPP
// =========================

if(window.Telegram){

    Telegram.WebApp.ready();

    Telegram.WebApp.expand();

}
