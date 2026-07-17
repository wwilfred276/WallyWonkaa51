"use strict";

/* =========================================================
   CONFIGURATION
========================================================= */

const WW_CONFIG = {
  password: "WALLY51",
  loadingDuration: 4200,
  loadingInterval: 40,
  defaultPage: "home",

  loadingMessages: [
    "Initialisation...",
    "Chargement de l’univers...",
    "Préparation de l’interface...",
    "Activation des effets...",
    "Finalisation..."
  ]
};


/* =========================================================
   ÉLÉMENTS DU SITE
========================================================= */

let loadingScreen;
let securityScreen;
let landingScreen;
let app;
let navigation;

let loadingProgress;
let loadingPercent;
let loadingStatus;

let passwordInput;
let passwordError;
let passwordButton;

let loadingTimer = null;
let loadingRunning = false;


/* =========================================================
   INITIALISATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  loadingScreen = document.getElementById("ww-loading");
  securityScreen = document.getElementById("ww-security");
  landingScreen = document.getElementById("ww-landing");

  app = document.querySelector(".app");
  navigation = document.querySelector("nav");

  loadingProgress = document.querySelector(".ww-loading-progress");
  loadingPercent = document.querySelector(".ww-loading-percent");
  loadingStatus = document.querySelector(".ww-loading-status");

  passwordInput = document.getElementById("ww-password");
  passwordError = document.getElementById("ww-password-error");
  passwordButton = document.getElementById("ww-password-button");

  initializeWebsite();
});


function initializeWebsite() {
  resetBodyState();
  initializeNavigation();
  initializePassword();
  initializeLandingButton();
  initializeBackButtons();
  initializeKeyboardControls();
  initializeBanner();
  initializeVisibilityEvents();

  showLandingScreen();
}


/* =========================================================
   ÉTATS GÉNÉRAUX
========================================================= */

function resetBodyState() {
  document.body.classList.remove(
    "landing-step",
    "loading-step",
    "security-step",
    "site-ready"
  );
}


function hideElement(element) {
  if (!element) return;

  element.classList.add("is-hidden");
  element.setAttribute("aria-hidden", "true");
}


function showElement(element) {
  if (!element) return;

  element.classList.remove("is-hidden");
  element.setAttribute("aria-hidden", "false");
}


/* =========================================================
   ÉCRAN D’INTRODUCTION
========================================================= */

function showLandingScreen() {
  resetBodyState();
  document.body.classList.add("landing-step");

  showElement(landingScreen);
  hideElement(loadingScreen);
  hideElement(securityScreen);
  hideElement(app);
  hideElement(navigation);
}


function initializeLandingButton() {
  const enterButtons = document.querySelectorAll(
    "#ww-enter-button, [data-action='enter-site'], .ww-enter-button"
  );

  enterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      wwStartLoading();
    });
  });
}


/* =========================================================
   ÉCRAN DE CHARGEMENT
========================================================= */

function wwStartLoading() {
  if (loadingRunning) return;

  loadingRunning = true;

  resetBodyState();
  document.body.classList.add("loading-step");

  hideElement(landingScreen);
  hideElement(securityScreen);
  hideElement(app);
  hideElement(navigation);
  showElement(loadingScreen);

  resetLoadingInterface();
  runLoadingAnimation();
}


function resetLoadingInterface() {
  if (loadingProgress) {
    loadingProgress.style.width = "0%";
  }

  if (loadingPercent) {
    loadingPercent.textContent = "0%";
  }

  if (loadingStatus) {
    loadingStatus.textContent = WW_CONFIG.loadingMessages[0];
  }
}


function runLoadingAnimation() {
  clearInterval(loadingTimer);

  const totalSteps = Math.max(
    1,
    Math.floor(WW_CONFIG.loadingDuration / WW_CONFIG.loadingInterval)
  );

  let currentStep = 0;

  loadingTimer = window.setInterval(() => {
    currentStep += 1;

    const percentage = Math.min(
      100,
      Math.round((currentStep / totalSteps) * 100)
    );

    updateLoadingInterface(percentage);

    if (percentage >= 100) {
      clearInterval(loadingTimer);
      loadingTimer = null;

      window.setTimeout(() => {
        loadingRunning = false;
        showSecurityScreen();
      }, 350);
    }
  }, WW_CONFIG.loadingInterval);
}


function updateLoadingInterface(percentage) {
  if (loadingProgress) {
    loadingProgress.style.width = `${percentage}%`;
  }

  if (loadingPercent) {
    loadingPercent.textContent = `${percentage}%`;
  }

  if (loadingStatus) {
    const messageCount = WW_CONFIG.loadingMessages.length;

    const messageIndex = Math.min(
      messageCount - 1,
      Math.floor((percentage / 100) * messageCount)
    );

    loadingStatus.textContent =
      WW_CONFIG.loadingMessages[messageIndex];
  }
}


/* =========================================================
   ÉCRAN DE SÉCURITÉ
========================================================= */

function showSecurityScreen() {
  resetBodyState();
  document.body.classList.add("security-step");

  hideElement(landingScreen);
  hideElement(loadingScreen);
  hideElement(app);
  hideElement(navigation);
  showElement(securityScreen);

  clearPasswordError();

  if (passwordInput) {
    passwordInput.value = "";

    window.setTimeout(() => {
      passwordInput.focus();
    }, 250);
  }
}


function initializePassword() {
  if (passwordButton) {
    passwordButton.addEventListener("click", wwCheckPassword);
  }

  const toggleButtons = document.querySelectorAll(
    "#ww-toggle-password, [data-action='toggle-password']"
  );

  toggleButtons.forEach((button) => {
    button.addEventListener("click", wwTogglePassword);
  });

  if (passwordInput) {
    passwordInput.addEventListener("input", clearPasswordError);

    passwordInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        wwCheckPassword();
      }
    });
  }
}


function wwCheckPassword() {
  if (!passwordInput) {
    openWebsite();
    return;
  }

  const enteredPassword = passwordInput.value.trim();

  if (!enteredPassword) {
    showPasswordError("Entre le mot de passe.");
    shakeSecurityCard();
    passwordInput.focus();
    return;
  }

  if (enteredPassword === WW_CONFIG.password) {
    clearPasswordError();

    if (passwordButton) {
      passwordButton.disabled = true;
      passwordButton.classList.add("is-validating");
    }

    document
      .querySelector(".ww-security-card")
      ?.classList.add("is-unlocked");

    window.setTimeout(() => {
      if (passwordButton) {
        passwordButton.disabled = false;
        passwordButton.classList.remove("is-validating");
      }

      openWebsite();
    }, 550);
  } else {
    showPasswordError("Mot de passe incorrect.");
    shakeSecurityCard();

    passwordInput.value = "";
    passwordInput.focus();
  }
}


function wwTogglePassword() {
  if (!passwordInput) return;

  const isPasswordVisible = passwordInput.type === "text";

  passwordInput.type = isPasswordVisible ? "password" : "text";

  const toggleButton =
    document.getElementById("ww-toggle-password") ||
    document.querySelector("[data-action='toggle-password']");

  if (toggleButton) {
    toggleButton.classList.toggle("is-visible", !isPasswordVisible);
    toggleButton.setAttribute(
      "aria-label",
      isPasswordVisible
        ? "Afficher le mot de passe"
        : "Masquer le mot de passe"
    );
  }

  passwordInput.focus();
}


function showPasswordError(message) {
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
  const securityCard = document.querySelector(".ww-security-card");

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
  resetBodyState();
  document.body.classList.add("site-ready");

  hideElement(landingScreen);
  hideElement(loadingScreen);
  hideElement(securityScreen);

  showElement(app);
  showElement(navigation);

  showPage(WW_CONFIG.defaultPage, false);

  window.scrollTo({
    top: 0,
    behavior: "instant"
  });
}


/* =========================================================
   NAVIGATION ENTRE LES PAGES
========================================================= */

function initializeNavigation() {
  const navigationButtons = document.querySelectorAll(
    "[data-page], [data-target-page]"
  );

  navigationButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
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
  const pages = document.querySelectorAll(".page");
  const targetPage = document.getElementById(pageId);

  if (!targetPage) {
    console.warn(`Page introuvable : #${pageId}`);
    return;
  }

  pages.forEach((page) => {
    const isActive = page === targetPage;

    page.classList.toggle("active", isActive);
    page.classList.toggle("is-active", isActive);
    page.setAttribute("aria-hidden", String(!isActive));
  });

  updateNavigationState(pageId);

  if (smoothScroll) {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  document.dispatchEvent(
    new CustomEvent("ww:pagechange", {
      detail: {
        pageId
      }
    })
  );
}


function updateNavigationState(pageId) {
  const navigationButtons = document.querySelectorAll(
    "[data-page], [data-target-page]"
  );

  navigationButtons.forEach((button) => {
    const target =
      button.dataset.page ||
      button.dataset.targetPage;

    const isActive = target === pageId;

    button.classList.toggle("active", isActive);
    button.classList.toggle("is-active", isActive);

    if (isActive) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
  });
}


/* =========================================================
   BOUTONS DE RETOUR
========================================================= */

function initializeBackButtons() {
  const backButtons = document.querySelectorAll(
    "[data-back-page], .back-button"
  );

  backButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();

      const targetPage =
        button.dataset.backPage ||
        WW_CONFIG.defaultPage;

      showPage(targetPage);
    });
  });
}


/* =========================================================
   BANNIÈRE DÉFILANTE
========================================================= */

function initializeBanner() {
  const bannerTracks = document.querySelectorAll(
    ".banner-track, .scrolling-banner-track, .ww-banner-track"
  );

  bannerTracks.forEach((track) => {
    if (track.dataset.initialized === "true") return;

    track.dataset.initialized = "true";

    const content = track.innerHTML.trim();

    if (!content) return;

    /*
      La copie du contenu permet d’obtenir un défilement continu
      sans coupure lorsque l’animation CSS recommence.
    */
    track.insertAdjacentHTML("beforeend", content);
  });
}


/* =========================================================
   RACCOURCIS CLAVIER
========================================================= */

function initializeKeyboardControls() {
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    if (document.body.classList.contains("site-ready")) {
      showPage(WW_CONFIG.defaultPage);
    }
  });
}


/* =========================================================
   VISIBILITÉ DE LA PAGE
========================================================= */

function initializeVisibilityEvents() {
  document.addEventListener("visibilitychange", () => {
    /*
      Les animations CSS continuent automatiquement.
      Cette classe permet aussi de gérer une éventuelle
      animation JavaScript personnalisée.
    */
    document.body.classList.toggle(
      "page-is-hidden",
      document.hidden
    );
  });
}


/* =========================================================
   OUTILS OPTIONNELS
========================================================= */

function restartWebsite() {
  clearInterval(loadingTimer);

  loadingTimer = null;
  loadingRunning = false;

  showLandingScreen();
}


function logoutWebsite() {
  clearInterval(loadingTimer);

  loadingTimer = null;
  loadingRunning = false;

  showSecurityScreen();
}


/* =========================================================
   FONCTIONS ACCESSIBLES DEPUIS LE HTML
========================================================= */

window.showPage = showPage;
window.wwStartLoading = wwStartLoading;
window.wwCheckPassword = wwCheckPassword;
window.wwTogglePassword = wwTogglePassword;
window.restartWebsite = restartWebsite;
window.logoutWebsite = logoutWebsite;
