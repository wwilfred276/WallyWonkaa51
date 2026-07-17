"use strict";

/* =========================================================
   CONFIGURATION
========================================================= */

const WW_PASSWORD = "WALLY51";
const WW_LOADING_DURATION = 4000;


/* =========================================================
   ÉLÉMENTS
========================================================= */

const loadingScreen = document.getElementById("ww-loading");
const securityScreen = document.getElementById("ww-security");

const loadingProgress = document.querySelector(".ww-loading-progress");
const loadingPercent = document.querySelector(".ww-loading-percent");
const loadingStatus = document.querySelector(".ww-loading-status");

const passwordInput = document.getElementById("ww-password");
const passwordError = document.getElementById("ww-password-error");

const passwordButton =
  document.getElementById("ww-password-button") ||
  document.querySelector(".ww-security-button");

const passwordToggle =
  document.getElementById("ww-toggle-password") ||
  document.querySelector("[data-action='toggle-password']");

const app =
  document.querySelector(".app") ||
  document.querySelector("main");

const navigation =
  document.querySelector(".bottom-nav") ||
  document.querySelector("nav");


/* =========================================================
   DÉMARRAGE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initializeWebsite();
});


function initializeWebsite() {
  hideWebsite();
  initializeNavigation();
  initializePassword();
  initializeBackButtons();
  initializeBanner();

  startLoading();
}


/* =========================================================
   AFFICHAGE
========================================================= */

function showElement(element) {
  if (!element) return;

  element.style.display = "";
  element.classList.remove("is-hidden");
  element.setAttribute("aria-hidden", "false");
}


function hideElement(element) {
  if (!element) return;

  element.style.display = "none";
  element.classList.add("is-hidden");
  element.setAttribute("aria-hidden", "true");
}


function hideWebsite() {
  hideElement(app);
  hideElement(navigation);
  hideElement(securityScreen);
  showElement(loadingScreen);

  document.body.classList.remove(
    "security-step",
    "site-ready"
  );

  document.body.classList.add("loading-step");
}


/* =========================================================
   CHARGEMENT
========================================================= */

function startLoading() {
  showElement(loadingScreen);
  hideElement(securityScreen);
  hideElement(app);
  hideElement(navigation);

  document.body.classList.remove(
    "security-step",
    "site-ready"
  );

  document.body.classList.add("loading-step");

  let percentage = 0;

  if (loadingProgress) {
    loadingProgress.style.width = "0%";
  }

  if (loadingPercent) {
    loadingPercent.textContent = "0%";
  }

  if (loadingStatus) {
    loadingStatus.textContent = "VÉRIFICATION DES RESSOURCES...";
  }

  const intervalDuration = 40;
  const totalSteps = WW_LOADING_DURATION / intervalDuration;
  const increment = 100 / totalSteps;

  const loadingInterval = window.setInterval(() => {
    percentage += increment;

    const displayedPercentage = Math.min(
      100,
      Math.round(percentage)
    );

    if (loadingProgress) {
      loadingProgress.style.width =
        `${displayedPercentage}%`;
    }

    if (loadingPercent) {
      loadingPercent.textContent =
        `${displayedPercentage}%`;
    }

    updateLoadingMessage(displayedPercentage);

    if (displayedPercentage >= 100) {
      window.clearInterval(loadingInterval);

      window.setTimeout(() => {
        showSecurity();
      }, 350);
    }
  }, intervalDuration);
}


function updateLoadingMessage(percentage) {
  if (!loadingStatus) return;

  if (percentage < 25) {
    loadingStatus.textContent =
      "VÉRIFICATION DES RESSOURCES...";
  } else if (percentage < 50) {
    loadingStatus.textContent =
      "CHARGEMENT DE L’INTERFACE...";
  } else if (percentage < 75) {
    loadingStatus.textContent =
      "ACTIVATION DE LA SÉCURITÉ...";
  } else if (percentage < 100) {
    loadingStatus.textContent =
      "FINALISATION...";
  } else {
    loadingStatus.textContent =
      "CHARGEMENT TERMINÉ";
  }
}


/* =========================================================
   ÉCRAN DE SÉCURITÉ
========================================================= */

function showSecurity() {
  hideElement(loadingScreen);
  hideElement(app);
  hideElement(navigation);
  showElement(securityScreen);

  document.body.classList.remove(
    "loading-step",
    "site-ready"
  );

  document.body.classList.add("security-step");

  clearPasswordError();

  if (passwordInput) {
    passwordInput.value = "";

    window.setTimeout(() => {
      passwordInput.focus();
    }, 200);
  }
}


/* =========================================================
   MOT DE PASSE
========================================================= */

function initializePassword() {
  if (passwordButton) {
    passwordButton.addEventListener(
      "click",
      checkPassword
    );
  }

  if (passwordInput) {
    passwordInput.addEventListener(
      "input",
      clearPasswordError
    );

    passwordInput.addEventListener(
      "keydown",
      event => {
        if (event.key === "Enter") {
          event.preventDefault();
          checkPassword();
        }
      }
    );
  }

  if (passwordToggle) {
    passwordToggle.addEventListener(
      "click",
      togglePassword
    );
  }
}


function checkPassword() {
  if (!passwordInput) {
    openWebsite();
    return;
  }

  const enteredPassword =
    passwordInput.value.trim();

  if (enteredPassword === "") {
    displayPasswordError(
      "Veuillez entrer votre mot de passe."
    );

    shakeSecurityCard();
    return;
  }

  if (enteredPassword === WW_PASSWORD) {
    clearPasswordError();

    if (passwordButton) {
      passwordButton.disabled = true;
      passwordButton.classList.add("is-loading");
    }

    window.setTimeout(() => {
      if (passwordButton) {
        passwordButton.disabled = false;
        passwordButton.classList.remove("is-loading");
      }

      openWebsite();
    }, 500);
  } else {
    displayPasswordError(
      "Mot de passe incorrect."
    );

    passwordInput.value = "";
    passwordInput.focus();

    shakeSecurityCard();
  }
}


function togglePassword() {
  if (!passwordInput) return;

  const passwordIsVisible =
    passwordInput.type === "text";

  passwordInput.type =
    passwordIsVisible ? "password" : "text";

  if (passwordToggle) {
    passwordToggle.classList.toggle(
      "is-visible",
      !passwordIsVisible
    );

    passwordToggle.setAttribute(
      "aria-label",
      passwordIsVisible
        ? "Afficher le mot de passe"
        : "Masquer le mot de passe"
    );
  }

  passwordInput.focus();
}


function displayPasswordError(message) {
  if (!passwordError) return;

  passwordError.textContent = message;
  passwordError.classList.add("is-visible");
}


function clearPasswordError() {
  if (!passwordError) return;

  passwordError.textContent = "";
  passwordError.classList.remove("is-visible");
}


function shakeSecurityCard() {
  const securityCard =
    document.querySelector(".ww-security-card") ||
    document.querySelector(".security-card");

  if (!securityCard) return;

  securityCard.classList.remove("ww-shake");

  void securityCard.offsetWidth;

  securityCard.classList.add("ww-shake");

  window.setTimeout(() => {
    securityCard.classList.remove("ww-shake");
  }, 500);
}


/* =========================================================
   OUVERTURE DU SITE
========================================================= */

function openWebsite() {
  hideElement(loadingScreen);
  hideElement(securityScreen);

  showElement(app);
  showElement(navigation);

  document.body.classList.remove(
    "loading-step",
    "security-step"
  );

  document.body.classList.add("site-ready");

  showPage("home", false);

  window.scrollTo(0, 0);
}


/* =========================================================
   NAVIGATION
========================================================= */

function initializeNavigation() {
  const buttons = document.querySelectorAll(
    "[data-page], [data-target-page]"
  );

  buttons.forEach(button => {
    button.addEventListener("click", event => {
      const pageId =
        button.dataset.page ||
        button.dataset.targetPage;

      if (!pageId) return;

      event.preventDefault();
      showPage(pageId);
    });
  });
}


function showPage(pageId, smoothScroll = true) {
  const pages =
    document.querySelectorAll(".page");

  const targetPage =
    document.getElementById(pageId);

  if (!targetPage) {
    console.warn(
      `La page #${pageId} est introuvable.`
    );

    return;
  }

  pages.forEach(page => {
    const isActive =
      page.id === pageId;

    page.classList.toggle(
      "active",
      isActive
    );

    page.classList.toggle(
      "is-active",
      isActive
    );

    page.style.display =
      isActive ? "" : "none";

    page.setAttribute(
      "aria-hidden",
      String(!isActive)
    );
  });

  updateNavigation(pageId);

  if (smoothScroll) {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
}


function updateNavigation(pageId) {
  const buttons = document.querySelectorAll(
    "[data-page], [data-target-page]"
  );

  buttons.forEach(button => {
    const target =
      button.dataset.page ||
      button.dataset.targetPage;

    const isActive =
      target === pageId;

    button.classList.toggle(
      "active",
      isActive
    );

    button.classList.toggle(
      "is-active",
      isActive
    );

    if (isActive) {
      button.setAttribute(
        "aria-current",
        "page"
      );
    } else {
      button.removeAttribute(
        "aria-current"
      );
    }
  });
}


/* =========================================================
   BOUTONS RETOUR
========================================================= */

function initializeBackButtons() {
  const backButtons =
    document.querySelectorAll(
      "[data-back-page], .back-button"
    );

  backButtons.forEach(button => {
    button.addEventListener(
      "click",
      event => {
        event.preventDefault();

        const page =
          button.dataset.backPage ||
          "home";

        showPage(page);
      }
    );
  });
}


/* =========================================================
   BANNIÈRE
========================================================= */

function initializeBanner() {
  const tracks = document.querySelectorAll(
    ".banner-track, .scrolling-banner-track, .ww-banner-track"
  );

  tracks.forEach(track => {
    if (
      track.dataset.initialized === "true"
    ) {
      return;
    }

    const originalContent =
      track.innerHTML.trim();

    if (!originalContent) return;

    track.insertAdjacentHTML(
      "beforeend",
      originalContent
    );

    track.dataset.initialized = "true";
  });
}


/* =========================================================
   FONCTIONS HTML
========================================================= */

window.showPage = showPage;
window.wwStartLoading = startLoading;
window.wwCheckPassword = checkPassword;
window.wwTogglePassword = togglePassword;
window.openWebsite = openWebsite;
