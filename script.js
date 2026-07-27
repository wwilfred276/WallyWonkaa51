"use strict";

/* ==================================================
   CONFIGURATION GÉNÉRALE
================================================== */

const WW_PASSWORD = "AJVZYIP";

let wwPasswordValidationInProgress = false;
let wwTimerInterval = null;
let wwLoadingInterval = null;

/*
   Cette variable mémorise la catégorie depuis laquelle
   l’utilisateur a ouvert la fiche d’un produit.
*/

let previousProductPage = "home";

/* ==================================================
   DONNÉES DES PRODUITS
================================================== */

const PRODUCTS = {
    pantalon: {
        name: "Filtrer",
        category: "🇲🇦 Filtrer 3X",
        price: "20,00 €",

        status: "available",
        statusText: "Disponible immédiatement",

        description: `
            <p>

         🍫 FILTRAO De Très Bonne Qualité Reconnu Au Goût a La Fume 💨 

            </p>

            <p class="detail-highlight">
                <strong>Style :</strong> 

Texture: CASSANTS ⛓️‍💥
Conservations : 
CURÉE , Emballer Comme Commander 🧊

 Provenance : MAROC 🇲🇦 
Qualité : ⭐️⭐️⭐️⭐️⭐️
            </p>

            <p>
Vous retrouverez tous nos tarifs pour la Mash ❄️ dans la rubrique « Menu » 📜.
            </p>
        `,

        media: [
            {
                type: "image",
                src: "produit1.jpg",
                alt: "Produit 1"
            }
        ],

        telegram:
            "https://t.me/edm45s?text=Bonjour%2C%20je%20souhaite%20acheter%20le%20pantalon%20%C3%A0%2020%2C00%20%E2%82%AC."
    },

    veste: {
        name: "Veste",
        category: "🧥 Vêtement",
        price: "20,00 €",

        status: "unavailable",
        statusText: "Ce produit est actuellement indisponible",

        description: `
            <p>
                Veste confortable au style moderne, idéale
                pour compléter votre tenue.
            </p>

            <p class="detail-highlight">
                <strong>Disponibilité :</strong>
                retour prochainement.
            </p>

            <p>
                Appuyez sur le bouton ci-dessous pour demander
                à être informé de son retour.
            </p>
        `,

        media: [
            {
                type: "image",
                src: "produit2.PNG",
                alt: "Présentation de la veste"
            }
        ],

        telegram:
            "https://t.me/edm45s?text=Bonjour%2C%20je%20souhaite%20%C3%AAtre%20inform%C3%A9%28e%29%20lorsque%20la%20veste%20sera%20de%20nouveau%20disponible."
    },

    doudoune: {
        name: "Doudoune",
        category: "🧥 Vêtement",
        price: "10,00 €",

        status: "available",
        statusText: "Disponible immédiatement",

        description: `
            <p>
                Doudoune confortable conçue pour apporter
                chaleur et protection tout en conservant
                un style moderne.
            </p>

            <p class="detail-highlight">
                <strong>Style :</strong>
                confortable, moderne et facile à assortir.
            </p>

            <p>
                Pour connaître les tailles et les couleurs
                disponibles, appuyez sur Achat immédiat.
            </p>
        `,

        media: [
            {
                type: "video",
                src: "produit3.MP4",
                alt: "Présentation vidéo de la doudoune"
            }
        ],

        telegram:
            "https://t.me/edm45s?text=Bonjour%2C%20je%20souhaite%20acheter%20la%20doudoune%20%C3%A0%2010%2C00%20%E2%82%AC."
    },

    bonnet: {
        name: "Bonnet",
        category: "🧢 Accessoire",
        price: "20,00 €",

        status: "soon",
        statusText: "Ce produit sera bientôt disponible",

        description: `
            <p>
                Bonnet confortable et élégant, adapté à
                une utilisation quotidienne.
            </p>

            <p class="detail-highlight">
                <strong>Disponibilité :</strong>
                lancement prochainement.
            </p>

            <p>
                Appuyez sur le bouton ci-dessous pour demander
                à être informé dès sa mise en vente.
            </p>
        `,

        media: [
            {
                type: "video",
                src: "produit4.MP4",
                alt: "Présentation vidéo du bonnet"
            }
        ],

        telegram:
            "https://t.me/edm45s?text=Bonjour%2C%20je%20souhaite%20%C3%AAtre%20inform%C3%A9%28e%29%20lorsque%20le%20bonnet%20sera%20disponible."
    }
};

/* ==================================================
   NAVIGATION ENTRE LES PAGES
================================================== */

function showPage(pageId, clickedButton = null) {
    const requestedPage = document.getElementById(pageId);

    if (!requestedPage) {
        console.warn(`La page "${pageId}" est introuvable.`);
        return;
    }

    /*
       Arrête les vidéos de la fiche produit avant
       d’ouvrir une autre page.
    */

    if (pageId !== "product-detail") {
        stopDetailVideos();
    }

    document
        .querySelectorAll(".page, .home-page")
        .forEach(page => {
            page.classList.remove("active");
        });

    requestedPage.classList.add("active");

    /*
       Le fond cinématique est visible uniquement
       sur la page d’accueil.
    */

    document.body.classList.toggle(
        "home-bg",
        pageId === "home"
    );

    updateNavigationState(pageId, clickedButton);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

/* ==================================================
   ÉTAT DE LA NAVIGATION INFÉRIEURE
================================================== */

function updateNavigationState(
    pageId,
    clickedButton = null
) {
    const navigationButtons = document.querySelectorAll(
        ".bottom-nav .nav-btn"
    );

    navigationButtons.forEach(button => {
        button.classList.remove("active");
    });

    /*
       Lorsqu’une fiche produit ou une catégorie est ouverte,
       le bouton Accueil reste actif.
    */

    let navigationPage = pageId;

    if (
        pageId === "cat1" ||
        pageId === "cat2" ||
        pageId === "product-detail"
    ) {
        navigationPage = "home";
    }

    const activeButton =
        clickedButton ||
        document.querySelector(
            `.bottom-nav .nav-btn[data-page="${navigationPage}"]`
        );

    if (activeButton) {
        activeButton.classList.add("active");
    }
}

/* ==================================================
   AFFICHAGE ET MASQUAGE DU SITE
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
   ÉCRAN DE CHARGEMENT
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

        wwDisplaySecurityWithoutLoading();
        return;
    }

    if (wwLoadingInterval) {
        clearInterval(wwLoadingInterval);
        wwLoadingInterval = null;
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

        if (value >= 100) {
            clearInterval(wwLoadingInterval);
            wwLoadingInterval = null;

            wwOpenSecurityScreen(screen);
        }
    }, 170);
}

/* ==================================================
   SÉCURITÉ SANS ÉCRAN DE CHARGEMENT
================================================== */

function wwDisplaySecurityWithoutLoading() {
    document.body.classList.remove(
        "loading-step",
        "site-ready",
        "home-bg"
    );

    document.body.classList.add("security-step");

    wwHideSite();

    const securityScreen =
        document.getElementById("ww-security");

    if (securityScreen) {
        securityScreen.style.display = "";
        securityScreen.classList.add("active");
    }
}

/* ==================================================
   OUVERTURE DE L’ÉCRAN DE SÉCURITÉ
================================================== */

function wwOpenSecurityScreen(loadingScreen) {
    if (!loadingScreen) {
        wwDisplaySecurityWithoutLoading();
        return;
    }

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

        document.body.classList.add("security-step");

        const securityScreen =
            document.getElementById("ww-security");

        if (securityScreen) {
            securityScreen.style.display = "";
            securityScreen.classList.add("active");
        }

        /*
           L’application et la navigation restent cachées
           tant que le mot de passe n’est pas validé.
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
    const fullDuration = (24 * 60 * 60) - 1;
    let totalSeconds = fullDuration;

    if (wwTimerInterval) {
        clearInterval(wwTimerInterval);
        wwTimerInterval = null;
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
           site-ready est ajouté uniquement après
           la validation du bon mot de passe.
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

    input.classList.remove("ww-password-error");

    /*
       Force le navigateur à relancer l’animation.
    */

    void input.offsetWidth;

    input.classList.add("ww-password-error");

    setTimeout(() => {
        input.classList.remove("ww-password-error");
    }, 500);
}

/* ==================================================
   VALIDATION DU CODE AVEC ENTRÉE
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

    const passwordIsVisible =
        input.type === "text";

    input.type =
        passwordIsVisible
            ? "password"
            : "text";

    if (toggleButton) {
        toggleButton.setAttribute(
            "aria-label",
            passwordIsVisible
                ? "Afficher le mot de passe"
                : "Masquer le mot de passe"
        );

        toggleButton.textContent =
            passwordIsVisible
                ? "👁️"
                : "🙈";
    }

    input.focus();
}

/* ==================================================
   OUVERTURE D’UNE FICHE PRODUIT
================================================== */

function openProduct(productId) {
    const product = PRODUCTS[productId];

    if (!product) {
        console.error(
            `Le produit "${productId}" est introuvable.`
        );

        return;
    }

    const activePage = document.querySelector(
        ".page.active, .home-page.active"
    );

    if (
        activePage &&
        activePage.id !== "product-detail"
    ) {
        previousProductPage = activePage.id;
    }

    const productWasRendered =
        renderProductDetail(product);

    if (!productWasRendered) {
        return;
    }

    showPage("product-detail");
}

/* ==================================================
   REMPLISSAGE DE LA FICHE PRODUIT
================================================== */

function renderProductDetail(product) {
    const name =
        document.getElementById("detail-product-name");

    const category =
        document.getElementById(
            "detail-product-category"
        );

    const price =
        document.getElementById("detail-product-price");

    const description =
        document.getElementById(
            "detail-product-description"
        );

    const availability =
        document.getElementById(
            "detail-product-status"
        );

    const buyButton =
        document.getElementById(
            "detail-buy-button"
        );

    const mainMedia =
        document.getElementById(
            "detail-main-media"
        );

    const thumbnails =
        document.getElementById(
            "detail-thumbnails"
        );

    if (
        !name ||
        !category ||
        !price ||
        !description ||
        !availability ||
        !buyButton ||
        !mainMedia ||
        !thumbnails
    ) {
        console.error(
            "La structure HTML de la fiche produit est incomplète."
        );

        return false;
    }

    name.textContent = product.name;
    category.textContent = product.category;
    price.textContent = product.price;

    description.innerHTML =
        product.description;

    availability.className =
        `detail-availability ${product.status}`;

    availability.textContent =
        product.statusText;

    buyButton.href = product.telegram;

    buyButton.removeAttribute("aria-disabled");
    buyButton.classList.remove("disabled");

    /*
       Le texte du bouton reste Achat immédiat,
       comme demandé, pour tous les produits.
    */

    buyButton.innerHTML = `
        <span aria-hidden="true">⚡</span>
        <span>Achat immédiat</span>
    `;

    document.title =
        `${product.name} — Wally Wonkaa`;

    createProductGallery(
        product.media,
        mainMedia,
        thumbnails
    );

    return true;
}

/* ==================================================
   CRÉATION DE LA GALERIE
================================================== */

function createProductGallery(
    mediaItems,
    mainMedia,
    thumbnails
) {
    stopDetailVideos();

    mainMedia.innerHTML = "";
    thumbnails.innerHTML = "";

    if (
        !Array.isArray(mediaItems) ||
        mediaItems.length === 0
    ) {
        mainMedia.innerHTML = `
            <div class="detail-media-error">
                Aucun média disponible
            </div>
        `;

        return;
    }

    mediaItems.forEach((media, index) => {
        const thumbnail =
            document.createElement("button");

        thumbnail.type = "button";
        thumbnail.className =
            "detail-thumbnail";

        thumbnail.setAttribute(
            "aria-label",
            `Afficher le média ${index + 1}`
        );

        if (index === 0) {
            thumbnail.classList.add("active");
        }

        if (media.type === "video") {
            const thumbnailVideo =
                document.createElement("video");

            thumbnailVideo.src = media.src;
            thumbnailVideo.muted = true;
            thumbnailVideo.playsInline = true;
            thumbnailVideo.preload = "metadata";

            thumbnailVideo.setAttribute(
                "aria-hidden",
                "true"
            );

            thumbnail.appendChild(thumbnailVideo);
        } else {
            const thumbnailImage =
                document.createElement("img");

            thumbnailImage.src = media.src;
            thumbnailImage.alt =
                media.alt || "Image du produit";

            thumbnailImage.loading = "lazy";

            thumbnail.appendChild(thumbnailImage);
        }

        thumbnail.addEventListener("click", () => {
            displayMainProductMedia(
                media,
                mainMedia
            );

            thumbnails
                .querySelectorAll(".detail-thumbnail")
                .forEach(button => {
                    button.classList.remove("active");
                });

            thumbnail.classList.add("active");
        });

        thumbnails.appendChild(thumbnail);
    });

    /*
       La zone de miniatures est masquée lorsqu’il
       n’existe qu’un seul média.
    */

    thumbnails.hidden =
        mediaItems.length <= 1;

    displayMainProductMedia(
        mediaItems[0],
        mainMedia
    );
}

/* ==================================================
   AFFICHAGE DU MÉDIA PRINCIPAL
================================================== */

function displayMainProductMedia(
    media,
    container
) {
    if (!media || !container) {
        return;
    }

    stopVideosInside(container);
    container.innerHTML = "";

    if (media.type === "video") {
        const video =
            document.createElement("video");

        video.src = media.src;
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.controls = false;
        video.preload = "metadata";

        video.setAttribute(
            "aria-label",
            media.alt || "Vidéo du produit"
        );

        container.appendChild(video);

        const playbackPromise = video.play();

        if (
            playbackPromise &&
            typeof playbackPromise.catch === "function"
        ) {
            playbackPromise.catch(() => {
                /*
                   La lecture automatique peut être bloquée
                   par certains navigateurs.
                */
            });
        }

        return;
    }

    const image =
        document.createElement("img");

    image.src = media.src;
    image.alt =
        media.alt || "Image du produit";

    container.appendChild(image);
}

/* ==================================================
   ARRÊT DES VIDÉOS
================================================== */

function stopVideosInside(container) {
    if (!container) {
        return;
    }

    container
        .querySelectorAll("video")
        .forEach(video => {
            video.pause();
        });
}

function stopDetailVideos() {
    const detailPage =
        document.getElementById("product-detail");

    stopVideosInside(detailPage);
}

/* ==================================================
   RETOUR À LA CATÉGORIE
================================================== */

function closeProductDetail() {
    const targetPage =
        document.getElementById(previousProductPage)
            ? previousProductPage
            : "home";

    stopDetailVideos();

    document.title = "🎩 Wally Wonkaa";

    showPage(targetPage);
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

/* ==================================================
   NETTOYAGE AVANT DE QUITTER LA PAGE
================================================== */

window.addEventListener("pagehide", () => {
    stopDetailVideos();
});
