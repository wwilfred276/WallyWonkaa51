"use strict";

/* ==================================================
   CONFIGURATION
================================================== */

const WW_PASSWORD = "AJVZYIP";

let wwPasswordValidationInProgress = false;
let wwTimerInterval = null;
let wwLoadingInterval = null;

/* ==================================================
   NAVIGATION
================================================== */

function showPage(pageId, clickedButton = null) {
    const requestedPage = document.getElementById(pageId);

    if (!requestedPage) {
        console.warn(`La page "${pageId}" est introuvable.`);
        return;
    }

    document
        .querySelectorAll(".page, .home-page")
        .forEach(page => {
            page.classList.remove("active");
        });

    requestedPage.classList.add("active");

    document.body.classList.toggle(
        "home-bg",
        pageId === "home"
    );

    document
        .querySelectorAll(".bottom-nav .nav-btn")
        .forEach(button => {
            button.classList.remove("active");
        });

    const activeButton =
        clickedButton ||
        document.querySelector(
            `.bottom-nav .nav-btn[data-page="${pageId}"]`
        );

    if (activeButton) {
        activeButton.classList.add("active");
    }

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });
}

/* ==================================================
   AFFICHAGE DU SITE
================================================== */

function wwHideSite() {
    document.body.classList.remove("site-ready");
}

function wwShowSite() {
    document.body.classList.add("site-ready");
}

/* ==================================================
   INITIALISATION
================================================== */

document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.remove(
        "site-ready",
        "security-step",
        "home-bg"
    );

    document.body.classList.add("loading-step");

    const securityScreen =
        document.getElementById("ww-security");

    if (securityScreen) {
        securityScreen.classList.remove("active");
        securityScreen.style.display = "";
    }

    wwHideSite();

    showPage("home");

    wwStartLoading();
    wwStartTimer();
});

/* ==================================================
   CHARGEMENT
================================================== */

function wwStartLoading() {
    const screen =
        document.getElementById("ww-loading");

    const progress =
        document.getElementById("ww-loading-progress");

    const percent =
        document.getElementById("ww-loading-percent");

    const status =
        document.getElementById("ww-loading-status");

    if (!screen || !progress || !percent || !status) {
        console.warn(
            "Certains éléments du chargement sont introuvables."
        );

        return;
    }

    if (wwLoadingInterval) {
        clearInterval(wwLoadingInterval);
    }

    let value = 0;

    const messages = [
        "🛡️ Vérification des ressources...",
        "⚡ Chargement des données...",
        "🚚 Synchronisation...",
        "👑 Finalisation..."
    ];

    screen.style.display = "flex";
    screen.classList.remove("hide");

    progress.style.width = "0%";
    percent.textContent = "0%";
    status.textContent = messages[0];

    wwLoadingInterval = setInterval(() => {
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
            clearInterval(wwLoadingInterval);
            wwLoadingInterval = null;

            wwOpenSecurityScreen(screen);
        }
    }, 170);
}

/* ==================================================
   OUVERTURE DE LA SÉCURITÉ
================================================== */

function wwOpenSecurityScreen(loadingScreen) {
    setTimeout(() => {
        loadingScreen.classList.add("hide");
    }, 600);

    setTimeout(() => {
        loadingScreen.style.display = "none";

        document.body.classList.remove(
            "loading-step",
            "site-ready",
            "home-bg"
        );

        document.body.classList.add(
            "security-step"
        );

        const securityScreen =
            document.getElementById("ww-security");

        if (securityScreen) {
            securityScreen.style.display = "";
            securityScreen.classList.add("active");
        }

        /*
           La navigation et l’application
           restent strictement cachées.
        */

        wwHideSite();

        const passwordInput =
            document.getElementById("ww-password");

        if (passwordInput) {
            passwordInput.disabled = false;
            passwordInput.value = "";
            passwordInput.focus();
        }

        const connectButton =
            document.querySelector(".ww-connect-btn");

        if (connectButton) {
            connectButton.disabled = false;
        }
    }, 1200);
}

/* ==================================================
   COMPTEUR
================================================== */

function wwStartTimer() {
    const fullDuration =
        (24 * 60 * 60) - 1;

    let totalSeconds = fullDuration;

    if (wwTimerInterval) {
        clearInterval(wwTimerInterval);
    }

    function updateTimerDisplay() {
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

        const hours =
            Math.floor(totalSeconds / 3600);

        const minutes =
            Math.floor(
                (totalSeconds % 3600) / 60
            );

        const seconds =
            totalSeconds % 60;

        hoursElement.textContent =
            String(hours).padStart(2, "0");

        minutesElement.textContent =
            String(minutes).padStart(2, "0");

        secondsElement.textContent =
            String(seconds).padStart(2, "0");
    }

    updateTimerDisplay();

    wwTimerInterval = setInterval(() => {
        totalSeconds -= 1;

        if (totalSeconds < 0) {
            totalSeconds = fullDuration;
        }

        updateTimerDisplay();
    }, 1000);
}

/* ==================================================
   VÉRIFICATION DU MOT DE PASSE
================================================== */

function wwCheckPassword() {
    if (wwPasswordValidationInProgress) {
        return;
    }

    const input =
        document.getElementById("ww-password");

    const message =
        document.getElementById("ww-message");

    const securityScreen =
        document.getElementById("ww-security");

    const connectButton =
        document.querySelector(".ww-connect-btn");

    if (!input || !message || !securityScreen) {
        console.error(
            "Les éléments de sécurité sont introuvables."
        );

        return;
    }

    const enteredPassword =
        input.value.trim();

    if (!enteredPassword) {
        wwShowPasswordError(
            input,
            message,
            "❌ Entre le code d’accès"
        );

        return;
    }

    if (enteredPassword !== WW_PASSWORD) {
        wwShowPasswordError(
            input,
            message,
            "❌ Code incorrect"
        );

        return;
    }

    wwPasswordValidationInProgress = true;

    message.style.color = "#6dff5d";
    message.textContent = "✅ ACCÈS AUTORISÉ";

    input.disabled = true;

    if (connectButton) {
        connectButton.disabled = true;
    }

    setTimeout(() => {
        securityScreen.classList.remove("active");
        securityScreen.style.display = "none";

        document.body.classList.remove(
            "loading-step",
            "security-step"
        );

        /*
           site-ready est ajouté uniquement ici.
           La navigation ne peut donc pas apparaître avant.
        */

        wwShowSite();
        showPage("home");

        wwPasswordValidationInProgress = false;
    }, 1000);
}

/* ==================================================
   ERREUR DU MOT DE PASSE
================================================== */

function wwShowPasswordError(
    input,
    message,
    text
) {
    message.style.color = "#ff4c86";
    message.textContent = text;

    input.value = "";
    input.focus();

    input.classList.remove(
        "ww-password-error"
    );

    void input.offsetWidth;

    input.classList.add(
        "ww-password-error"
    );

    setTimeout(() => {
        input.classList.remove(
            "ww-password-error"
        );
    }, 500);
}

/* ==================================================
   VALIDATION AVEC ENTRÉE
================================================== */

document.addEventListener("keydown", event => {
    if (event.key !== "Enter") {
        return;
    }

    const input =
        document.getElementById("ww-password");

    if (
        input &&
        document.activeElement === input &&
        !input.disabled
    ) {
        event.preventDefault();
        wwCheckPassword();
    }
});

/* ==================================================
   AFFICHER OU CACHER LE MOT DE PASSE
================================================== */

function wwTogglePassword() {
    const input =
        document.getElementById("ww-password");

    const toggleButton =
        document.querySelector(
            ".ww-password-box button"
        );

    if (!input) {
        return;
    }

    const isVisible =
        input.type === "text";

    input.type =
        isVisible
            ? "password"
            : "text";

    if (toggleButton) {
        toggleButton.setAttribute(
            "aria-label",
            isVisible
                ? "Afficher le mot de passe"
                : "Masquer le mot de passe"
        );
    }

    input.focus();
}

/* ==================================================
   RETOUR DEPUIS LE CACHE DU NAVIGATEUR
================================================== */

window.addEventListener("pageshow", () => {
    if (
        !document.body.classList.contains(
            "site-ready"
        )
    ) {
        wwHideSite();

        document.body.classList.remove(
            "home-bg"
        );
    }
});
