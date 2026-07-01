const ACCESS_CODE = "5111";
const ACCESS_TIME = 15 * 60;
const ORDER_TIME = 10 * 60;

const introLoader = document.getElementById("introLoader");
const accessPage = document.getElementById("accessPage");
const codeInput = document.getElementById("codeInput");
const loginBtn = document.getElementById("loginBtn");
const errorMsg = document.getElementById("errorMsg");

const min = document.getElementById("min");
const sec = document.getElementById("sec");
const orderTimer = document.getElementById("orderTimer");
const orderTimerBox = document.querySelector(".order-timer");

const pages = document.querySelectorAll(".page");

let accessTime = ACCESS_TIME;
let orderTime = ORDER_TIME;
let orderInterval = null;

window.addEventListener("load", () => {
    pages.forEach(page => page.style.display = "none");

    setTimeout(() => {
        introLoader.style.opacity = "0";
        introLoader.style.transition = ".5s";

        setTimeout(() => {
            introLoader.style.display = "none";
            accessPage.style.display = "flex";
        }, 500);

    }, 3000);
});

function updateAccessTimer() {
    const minutes = Math.floor(accessTime / 60);
    const seconds = accessTime % 60;

    min.textContent = String(minutes).padStart(2, "0");
    sec.textContent = String(seconds).padStart(2, "0");

    if (accessTime <= 0) {
        errorMsg.textContent = "⛔ Code expiré";
        loginBtn.disabled = true;
        loginBtn.style.opacity = "0.5";
        return;
    }

    accessTime--;
}

setInterval(updateAccessTimer, 1000);
updateAccessTimer();

loginBtn.addEventListener("click", () => {
    if (codeInput.value.trim() === ACCESS_CODE) {
        errorMsg.textContent = "";
        accessPage.style.display = "none";
        showPage("home");
        startOrderTimer();
    } else {
        errorMsg.textContent = "❌ Code incorrect";
        codeInput.value = "";
    }
});

function startOrderTimer() {
    orderTime = ORDER_TIME;

    if (orderInterval) {
        clearInterval(orderInterval);
    }

    if (orderTimerBox) {
        orderTimerBox.classList.remove("warning", "danger");
    }

    updateOrderTimer();

    orderInterval = setInterval(() => {
        orderTime--;

        if (orderTimerBox && orderTime <= 300) {
            orderTimerBox.classList.add("warning");
        }

        if (orderTimerBox && orderTime <= 60) {
            orderTimerBox.classList.add("danger");
        }

        if (orderTime <= 0) {
            clearInterval(orderInterval);
            orderTimer.textContent = "00:00";
            alert("⏰ Session expirée. Veuillez repasser par l'accès sécurisé.");
            backToSecure();
            return;
        }

        updateOrderTimer();

    }, 1000);
}

function updateOrderTimer() {
    const minutes = Math.floor(orderTime / 60);
    const seconds = orderTime % 60;

    if (orderTimer) {
        orderTimer.textContent =
            String(minutes).padStart(2, "0") + ":" +
            String(seconds).padStart(2, "0");
    }
}

function showPage(pageId) {
    pages.forEach(page => {
        page.style.display = "none";
    });

    const page = document.getElementById(pageId);

    if (page) {
        page.style.display = "block";
        page.classList.add("page-anim");

        setTimeout(() => {
            page.classList.remove("page-anim");
        }, 400);
    }
}

function backToSecure() {
    pages.forEach(page => {
        page.style.display = "none";
    });

    accessPage.style.display = "flex";
    codeInput.value = "";
    errorMsg.textContent = "";

    if (orderInterval) {
        clearInterval(orderInterval);
    }

    if (orderTimerBox) {
        orderTimerBox.classList.remove("warning", "danger");
    }

    if (orderTimer) {
        orderTimer.textContent = "10:00";
    }
}

if (window.Telegram && Telegram.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
}
