const WW_PASSWORD = "AJVZYIP";

/* ==========================
   NAVIGATION
========================== */

function showPage(pageId, clickedButton = null) {

    /* Cache toutes les pages */
    document.querySelectorAll(".page, .home-page").forEach(page => {
        page.classList.remove("active");
    });

    /* Affiche la page demandée */
    const page = document.getElementById(pageId);

    if (page) {
        page.classList.add("active");
    }

    /* Change le fond selon la page */
    if (pageId === "home") {
        document.body.classList.add("home-bg");
    } else {
        document.body.classList.remove("home-bg");
    }

    /* Désactive tous les boutons de navigation */
    document.querySelectorAll(".bottom-nav .nav-btn").forEach(button => {
        button.classList.remove("active");
    });

    /* Active le bouton cliqué */
    if (clickedButton) {

        clickedButton.classList.add("active");

    } else {

        const matchingButton = document.querySelector(
            `.bottom-nav .nav-btn[data-page="${pageId}"]`
        );

        if (matchingButton) {
            matchingButton.classList.add("active");
        }
    }

    /* Remonte en haut */
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

/* ==========================
   AFFICHAGE DU SITE
========================== */

function wwHideSite() {

    const app = document.querySelector(".app");
    const navigation = document.querySelector(".bottom-nav");

    if (app) {
        app.style.display = "none";
    }

    if (navigation) {
        navigation.style.display = "none";
    }
}

function wwShowSite() {

    const app = document.querySelector(".app");
    const navigation = document.querySelector(".bottom-nav");

    if (app) {
        app.style.display = "block";
    }

    if (navigation) {
        navigation.style.display = "flex";
    }
}

/* ==========================
   AU CHARGEMENT
========================== */

document.addEventListener("DOMContentLoaded", () => {

    /*
       Supprime site-ready au démarrage pour empêcher
       l'affichage du site avant le bon mot de passe.
    */
    document.body.classList.remove("site-ready");
    document.body.classList.remove("security-step");
    document.body.classList.add("loading-step");

    /* Cache le site et la navigation */
    wwHideSite();

    /* Prépare la page d'accueil sans l'afficher */
    showPage("home");

    /* Lance le chargement */
    wwStartLoading();

    /* Lance le compteur */
    wwStartTimer();
});

/* ==========================
   ÉCRAN DE CHARGEMENT
========================== */

function wwStartLoading() {

    const screen = document.getElementById("ww-loading");
    const progress = document.getElementById("ww-loading-progress");
    const percent = document.getElementById("ww-loading-percent");
    const status = document.getElementById("ww-loading-status");

    if (!screen || !progress || !percent || !status) {
        return;
    }

    screen.style.display = "flex";
    screen.classList.remove("hide");

    let value = 0;

    const messages = [
        "🛡️ Vérification des ressources...",
        "⚡ Chargement des données...",
        "🚚 Synchronisation...",
        "👑 Finalisation..."
    ];

    const timer = setInterval(() => {

        value += 4;

        if (value > 100) {
            value = 100;
        }

        progress.style.width = value + "%";
        percent.textContent = value + "%";

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

            clearInterval(timer);

            setTimeout(() => {
                screen.classList.add("hide");
            }, 600);

            setTimeout(() => {

                screen.style.display = "none";

                document.body.classList.remove("loading-step");
                document.body.classList.add("security-step");

                /*
                   Le site et la barre restent cachés
                   pendant l'écran du mot de passe.
                */
                wwHideSite();

                const passwordInput =
                    document.getElementById("ww-password");

                if (passwordInput) {
                    passwordInput.focus();
                }

            }, 1200);
        }

    }, 170);
}

/* ==========================
   COMPTEUR 24 HEURES
========================== */

function wwStartTimer() {

    let total = 24 * 60 * 60;

    const updateTimer = () => {

        const hours = document.getElementById("ww-hours");
        const minutes = document.getElementById("ww-minutes");
        const seconds = document.getElementById("ww-seconds");

        if (!hours || !minutes || !seconds) {
            return;
        }

        const h = Math.floor(total / 3600);
        const m = Math.floor((total % 3600) / 60);
        const s = total % 60;

        hours.textContent = String(h).padStart(2, "0");
        minutes.textContent = String(m).padStart(2, "0");
        seconds.textContent = String(s).padStart(2, "0");
    };

    updateTimer();

    setInterval(() => {

        total--;

        if (total < 0) {
            total = 24 * 60 * 60;
        }

        updateTimer();

    }, 1000);
}

/* ==========================
   VÉRIFICATION DU MOT DE PASSE
========================== */

function wwCheckPassword() {

    const input = document.getElementById("ww-password");
    const message = document.getElementById("ww-message");
    const security = document.getElementById("ww-security");
    const connectButton = document.querySelector(".ww-connect-btn");

    if (!input || !message || !security) {
        return;
    }

    const enteredPassword = input.value.trim();

    if (enteredPassword === WW_PASSWORD) {

        message.style.color = "#6dff5d";
        message.textContent = "✅ ACCÈS AUTORISÉ";

        input.disabled = true;

        if (connectButton) {
            connectButton.disabled = true;
        }

        setTimeout(() => {

            /* Cache l'écran de sécurité */
            security.style.display = "none";

            /* Active le site */
            document.body.classList.remove(
                "loading-step",
                "security-step"
            );

            document.body.classList.add("site-ready");

            /* Affiche l'application et la navigation */
            wwShowSite();

            /* Ouvre l'accueil */
            showPage("home");

        }, 1000);

    } else {

        message.style.color = "#ff4c86";
        message.textContent = "❌ Code incorrect";

        input.value = "";
        input.focus();

        input.classList.remove("ww-password-error");

        void input.offsetWidth;

        input.classList.add("ww-password-error");

        setTimeout(() => {
            input.classList.remove("ww-password-error");
        }, 500);
    }
}

/* ==========================
   VALIDATION AVEC ENTRÉE
========================== */

document.addEventListener("keydown", event => {

    if (event.key !== "Enter") {
        return;
    }

    const input = document.getElementById("ww-password");

    if (
        input &&
        document.activeElement === input &&
        !input.disabled
    ) {
        wwCheckPassword();
    }
});

/* ==========================
   AFFICHER / MASQUER
   LE MOT DE PASSE
========================== */

function wwTogglePassword() {

    const input = document.getElementById("ww-password");

    if (!input) {
        return;
    }

    input.type =
        input.type === "password"
            ? "text"
            : "password";
}

/* ==========================
   MÉMORISER LA POSITION
   DE LA BANNIÈRE
========================== */

let bannerPosition = 0;

function saveBannerPosition() {

    const banner = document.querySelector(".scroll-track");

    if (!banner) {
        return;
    }

    const matrix = window.getComputedStyle(banner).transform;

    if (matrix === "none") {
        return;
    }

    const values = matrix.match(/matrix.*\((.+)\)/);

    if (!values) {
        return;
    }

    const matrixValues = values[1].split(",");

    bannerPosition = parseFloat(matrixValues[4]) || 0;
}

function restoreBannerPosition() {

    const banner = document.querySelector(".scroll-track");

    if (!banner) {
        return;
    }

    banner.style.animation = "none";
    banner.style.transform =
        `translateX(${bannerPosition}px)`;

    requestAnimationFrame(() => {
        banner.style.animation = "";
    });
}

/* ==========================
   SÉCURITÉ SUPPLÉMENTAIRE
========================== */

/*
   Si le navigateur réaffiche la page depuis son cache,
   le site est de nouveau caché tant que site-ready
   n'est pas présent.
*/

window.addEventListener("pageshow", () => {

    if (!document.body.classList.contains("site-ready")) {
        wwHideSite();
    }
});
