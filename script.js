"use strict";

/* =========================================
   CONFIGURATION
========================================= */

const WW_PASSWORD = "WONKAA2025";

let wwLoadingTimer = null;
let wwAccessTimer = null;
let bannerPosition = 0;


/* =========================================
   NAVIGATION
========================================= */

function showPage(pageId) {
    document
        .querySelectorAll(".home-page, .page")
        .forEach(page => {
            page.classList.remove("active");
        });

    const page = document.getElementById(pageId);

    if (page) {
        page.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================
   INITIALISATION
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    showPage("home");

    wwShowIntro();
    wwCreateIntroParticles();

    wwStartTimer();
    wwInitializePasswordKeyboard();
});


/* =========================================
   INTRODUCTION PREMIUM
========================================= */

function wwShowIntro() {
    const intro = document.getElementById("ww-intro");
    const loading = document.getElementById("ww-loading");
    const security = document.getElementById("ww-security");

    document.body.classList.remove(
        "loading-step",
        "security-step",
        "site-ready"
    );

    document.body.classList.add("intro-step");

    if (intro) {
        intro.style.display = "flex";
        intro.classList.remove("is-leaving");
        intro.setAttribute("aria-hidden", "false");
    }

    if (loading) {
        loading.style.display = "none";
        loading.classList.remove("hide");
    }

    if (security) {
        security.classList.remove("active");
        security.style.display = "none";
    }

    document.body.style.overflow = "hidden";
}


function wwEnterExperience() {
    const intro = document.getElementById("ww-intro");
    const enterButton = document.getElementById("ww-intro-enter");

    if (!intro || intro.classList.contains("is-leaving")) {
        return;
    }

    if (enterButton) {
        enterButton.disabled = true;
        enterButton.classList.add("is-clicked");
    }

    intro.classList.add("is-leaving");

    window.setTimeout(() => {
        intro.style.display = "none";
        intro.setAttribute("aria-hidden", "true");

        document.body.classList.remove("intro-step");

        wwStartLoading();

        if (enterButton) {
            enterButton.disabled = false;
            enterButton.classList.remove("is-clicked");
        }
    }, 850);
}


function wwCreateIntroParticles() {
    const container =
        document.getElementById("ww-intro-particles");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    const colors = [
        "#d62cff",
        "#913cff",
        "#ffad1f",
        "#ffe496"
    ];

    const quantity =
        window.innerWidth <= 600 ? 30 : 46;

    for (let index = 0; index < quantity; index += 1) {
        const particle = document.createElement("span");

        particle.className = "ww-intro-particle";

        const size = wwRandomNumber(2, 6);
        const left = wwRandomNumber(0, 100);
        const duration = wwRandomNumber(7, 15);
        const delay = wwRandomNumber(-15, 0);
        const drift = wwRandomNumber(-110, 110);

        const color =
            colors[
                Math.floor(Math.random() * colors.length)
            ];

        particle.style.setProperty(
            "--particle-size",
            `${size}px`
        );

        particle.style.setProperty(
            "--particle-left",
            `${left}%`
        );

        particle.style.setProperty(
            "--particle-duration",
            `${duration}s`
        );

        particle.style.setProperty(
            "--particle-delay",
            `${delay}s`
        );

        particle.style.setProperty(
            "--particle-drift",
            `${drift}px`
        );

        particle.style.setProperty(
            "--particle-color",
            color
        );

        container.appendChild(particle);
    }
}


function wwRandomNumber(minimum, maximum) {
    return Math.random() * (maximum - minimum) + minimum;
}


/* =========================================
   ÉVÉNEMENT DU BOUTON ENTRER
========================================= */

document.addEventListener("click", event => {
    const enterButton =
        event.target.closest("#ww-intro-enter");

    if (!enterButton) {
        return;
    }

    wwEnterExperience();
});


/* =========================================
   CHARGEMENT
========================================= */

function wwStartLoading() {
    const screen = document.getElementById("ww-loading");
    const progress =
        document.getElementById("ww-loading-progress");
    const percent =
        document.getElementById("ww-loading-percent");
    const status =
        document.getElementById("ww-loading-status");

    if (!screen || !progress || !percent || !status) {
        console.error(
            "Un ou plusieurs éléments du chargement sont absents."
        );

        wwShowSecurity();
        return;
    }

    window.clearInterval(wwLoadingTimer);

    document.body.classList.remove(
        "intro-step",
        "security-step",
        "site-ready"
    );

    document.body.classList.add("loading-step");
    document.body.style.overflow = "hidden";

    screen.style.display = "flex";
    screen.classList.remove("hide");

    let value = 0;

    progress.style.width = "0%";
    percent.textContent = "0%";

    const messages = [
        "🛡️ Vérification des ressources...",
        "⚡ Chargement des données...",
        "🚚 Synchronisation...",
        "👑 Finalisation..."
    ];

    wwLoadingTimer = window.setInterval(() => {
        value += 4;

        if (value > 100) {
            value = 100;
        }

        progress.style.width = `${value}%`;
        percent.textContent = `${value}%`;

        if (value < 30) {
            status.textContent = messages[0];
        } else if (value < 60) {
            status.textContent = messages[1];
        } else if (value < 90) {
            status.textContent = messages[2];
        } else {
            status.textContent = messages[3];
        }

        if (value === 100) {
            window.clearInterval(wwLoadingTimer);
            wwLoadingTimer = null;

            window.setTimeout(() => {
                screen.classList.add("hide");
            }, 600);

            window.setTimeout(() => {
                screen.style.display = "none";
                wwShowSecurity();
            }, 1300);
        }
    }, 100);
}


/* =========================================
   ACCÈS SÉCURISÉ
========================================= */

function wwShowSecurity() {
    const security =
        document.getElementById("ww-security");

    document.body.classList.remove(
        "intro-step",
        "loading-step",
        "site-ready"
    );

    document.body.classList.add("security-step");
    document.body.style.overflow = "hidden";

    if (security) {
        security.style.display = "flex";
        security.classList.add("active");
    }

    const input =
        document.getElementById("ww-password");

    if (input) {
        input.value = "";

        window.setTimeout(() => {
            input.focus();
        }, 250);
    }
}


/* =========================================
   TIMER 24 HEURES
========================================= */

function wwStartTimer() {
    window.clearInterval(wwAccessTimer);

    let total = 24 * 60 * 60;

    wwUpdateTimerDisplay(total);

    wwAccessTimer = window.setInterval(() => {
        total -= 1;

        if (total < 0) {
            total = 24 * 60 * 60;
        }

        wwUpdateTimerDisplay(total);
    }, 1000);
}


function wwUpdateTimerDisplay(total) {
    const hoursElement =
        document.getElementById("ww-hours");
    const minutesElement =
        document.getElementById("ww-minutes");
    const secondsElement =
        document.getElementById("ww-seconds");

    if (
        !hoursElement ||
        !minutesElement ||
        !secondsElement
    ) {
        return;
    }

    const hours = Math.floor(total / 3600);
    const minutes =
        Math.floor((total % 3600) / 60);
    const seconds = total % 60;

    hoursElement.textContent =
        String(hours).padStart(2, "0");

    minutesElement.textContent =
        String(minutes).padStart(2, "0");

    secondsElement.textContent =
        String(seconds).padStart(2, "0");
}


/* =========================================
   MOT DE PASSE
========================================= */

function wwCheckPassword() {
    const input =
        document.getElementById("ww-password");
    const message =
        document.getElementById("ww-message");
    const security =
        document.getElementById("ww-security");

    if (!input || !message) {
        return;
    }

    if (input.value.trim() === WW_PASSWORD) {
        message.style.color = "#6dff5d";
        message.textContent = "✅ ACCÈS AUTORISÉ";

        window.setTimeout(() => {
            if (security) {
                security.classList.remove("active");
                security.style.display = "none";
            }

            document.body.classList.remove(
                "intro-step",
                "loading-step",
                "security-step"
            );

            document.body.classList.add("site-ready");
            document.body.style.overflow = "auto";

            showPage("home");
        }, 1000);
    } else {
        message.style.color = "#ff4c86";
        message.textContent = "❌ Code incorrect";

        input.value = "";
        input.focus();
    }
}


function wwTogglePassword() {
    const input =
        document.getElementById("ww-password");

    if (!input) {
        return;
    }

    input.type =
        input.type === "password"
            ? "text"
            : "password";

    input.focus();
}


function wwInitializePasswordKeyboard() {
    const input =
        document.getElementById("ww-password");

    if (!input) {
        return;
    }

    input.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            wwCheckPassword();
        }
    });
}


/* =========================================
   POSITION DE LA BANNIÈRE
========================================= */

function saveBannerPosition() {
    const banner =
        document.querySelector(".scroll-track");

    if (!banner) {
        return;
    }

    const matrix =
        window.getComputedStyle(banner).transform;

    if (matrix === "none") {
        return;
    }

    const values =
        matrix.match(/matrix.*\((.+)\)/);

    if (!values) {
        return;
    }

    bannerPosition =
        parseFloat(values[1].split(", ")[4]) || 0;
}


function restoreBannerPosition() {
    const banner =
        document.querySelector(".scroll-track");

    if (!banner) {
        return;
    }

    banner.style.animation = "none";
    banner.style.transform =
        `translateX(${bannerPosition}px)`;

    window.requestAnimationFrame(() => {
        banner.style.animation = "";
    });
}


/* =========================================
   FONCTIONS ACCESSIBLES DEPUIS LE HTML
========================================= */

window.showPage = showPage;
window.wwEnterExperience = wwEnterExperience;
window.wwStartLoading = wwStartLoading;
window.wwCheckPassword = wwCheckPassword;
window.wwTogglePassword = wwTogglePassword;
window.saveBannerPosition = saveBannerPosition;
window.restoreBannerPosition = restoreBannerPosition;
