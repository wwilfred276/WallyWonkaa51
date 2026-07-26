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

    /* Retire la classe active de tous les boutons */
    document.querySelectorAll(".bottom-nav .nav-btn").forEach(button => {
        button.classList.remove("active");
    });

    /* Active le bouton cliqué */
    if (clickedButton) {

        clickedButton.classList.add("active");

    } else {

        /* Recherche automatiquement le bouton correspondant */
        const matchingButton = document.querySelector(
            `.bottom-nav .nav-btn[data-page="${pageId}"]`
        );

        if (matchingButton) {
            matchingButton.classList.add("active");
        }
    }

    /* Remonte doucement en haut de la page */
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

/* ==========================
   AU CHARGEMENT
========================== */

document.addEventListener("DOMContentLoaded", () => {

    document.body.classList.add("loading-step");
    document.body.classList.remove("security-step");
    document.body.classList.remove("site-ready");

    /* Affiche la page Accueil */
    showPage("home");

    /* Démarre l'écran de chargement */
    wwStartLoading();

    /* Démarre le compteur */
    wwStartTimer();

});

/* ==========================
   LOADING
========================== */

function wwStartLoading() {

    const screen = document.getElementById("ww-loading");
    const progress = document.getElementById("ww-loading-progress");
    const percent = document.getElementById("ww-loading-percent");
    const status = document.getElementById("ww-loading-status");

    /*
       Évite une erreur si un élément
       de chargement n'existe pas dans le HTML
    */
    if (!screen || !progress || !percent || !status) {
        return;
    }

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

            }, 1200);
        }

    }, 170);
}

/* ==========================
   TIMER 24H
========================== */

function wwStartTimer() {

    let total = 24 * 60 * 60;

    setInterval(() => {

        total--;

        if (total < 0) {
            total = 24 * 60 * 60;
        }

        const h = Math.floor(total / 3600);
        const m = Math.floor((total % 3600) / 60);
        const s = total % 60;

        const hours = document.getElementById("ww-hours");
        const minutes = document.getElementById("ww-minutes");
        const seconds = document.getElementById("ww-seconds");

        /*
           Évite une erreur si le compteur
           n'est pas présent dans le HTML
        */
        if (!hours || !minutes || !seconds) {
            return;
        }

        hours.textContent = String(h).padStart(2, "0");
        minutes.textContent = String(m).padStart(2, "0");
        seconds.textContent = String(s).padStart(2, "0");

    }, 1000);
}

/* ==========================
   MOT DE PASSE
========================== */

function wwCheckPassword() {

    const input = document.getElementById("ww-password");
    const message = document.getElementById("ww-message");
    const security = document.getElementById("ww-security");

    if (!input || !message || !security) {
        return;
    }

    if (input.value.trim() === WW_PASSWORD) {

        message.style.color = "#6dff5d";
        message.textContent = "✅ ACCÈS AUTORISÉ";

        setTimeout(() => {

            security.style.display = "none";

            document.body.classList.remove("security-step");
            document.body.classList.add("site-ready");

            showPage("home");

        }, 1000);

    } else {

        message.style.color = "#ff4c86";
        message.textContent = "❌ Code incorrect";

        input.value = "";
        input.focus();
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

    if (input && document.activeElement === input) {
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

    if (input.type === "password") {

        input.type = "text";

    } else {

        input.type = "password";
    }
}

/* ==========================
   MÉMORISE LA POSITION
   DE LA BANNIÈRE
========================== */

let bannerPosition = 0;

function saveBannerPosition() {

    const banner = document.querySelector(".scroll-track");

    if (!banner) {
        return;
    }

    const matrix = window.getComputedStyle(banner).transform;

    if (matrix !== "none") {

        const values = matrix.match(/matrix.*\((.+)\)/);

        if (values) {

            const matrixValues = values[1].split(",");

            bannerPosition = parseFloat(matrixValues[4]) || 0;
        }
    }
}

function restoreBannerPosition() {

    const banner = document.querySelector(".scroll-track");

    if (!banner) {
        return;
    }

    banner.style.animation = "none";
    banner.style.transform = `translateX(${bannerPosition}px)`;

    requestAnimationFrame(() => {

        banner.style.animation = "";
    });
}
