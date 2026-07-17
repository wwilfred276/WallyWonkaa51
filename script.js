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
    "INITIALISATION...",
    "VÉRIFICATION DES RESSOURCES...",
    "CHARGEMENT DE L’INTERFACE...",
    "ACTIVATION DE LA SÉCURITÉ...",
    "FINALISATION..."
  ]
};


/* =========================================================
   VARIABLES
========================================================= */

let introScreen;
let loadingScreen;
let securityScreen;
let app;
let navigation;

let loadingProgress;
let loadingPercent;
let loadingStatus;

let passwordInput;
let passwordError;
let passwordButton;
let passwordToggle;

let loadingTimer = null;
let loadingRunning = false;


/* =========================================================
   INITIALISATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  introScreen = document.getElementById("ww-intro");
  loadingScreen = document.getElementById("ww-loading");
  securityScreen = document.getElementById("ww-security");

  app = document.querySelector(".app");

  navigation =
    document.querySelector(".bottom-nav") ||
    document.querySelector("nav");

  loadingProgress =
    document.querySelector(".ww-loading-progress");

  loadingPercent =
    document.querySelector(".ww-loading-percent");

  loadingStatus =
    document.querySelector(".ww-loading-status");

  passwordInput =
    document.getElementById("ww-password");

  passwordError =
    document.getElementById("ww-password-error");

  passwordButton =
    document.getElementById("ww-password-button") ||
    document.querySelector(".ww-security-button");

  passwordToggle =
    document.getElementById("ww-toggle-password") ||
    document.querySelector("[data-action='toggle-password']");

  initializeWebsite();
});


function initializeWebsite() {
  initializeNavigation();
  initializePassword();
  initializeBackButtons();
  initializeBanner();
  initializeKeyboardControls();

  showIntroScreen();
}


/* =========================================================
   OUTILS D’AFFICHAGE
========================================================= */

function showElement(element, displayType = "") {
  if (!element) return;

  element.style.display = displayType;
  element.classList.remove("is-hidden");
  element.setAttribute("aria-hidden", "false");
}


function hideElement(element) {
  if (!element) return;

  element.style.display = "none";
  element.classList.add("is-hidden");
  element.setAttribute("aria-hidden", "true");
}


function resetBodyState() {
  document.body.classList.remove(
    "intro-step",
    "loading-step",
    "security-step",
    "site-ready"
  );
}


/* =========================================================
   PAGE DE BIENVENUE
========================================================= */

function showIntroScreen() {
  stopLoading();

  resetBodyState();
  document.body.classList.add("intro-step");

  showElement(introScreen, "flex");

  hideElement(loadingScreen);
  hideElement(securityScreen);
  hideElement(app);
  hideElement(navigation);

  window.scrollTo(0, 0);
}


/*
  Cette fonction correspond directement à :

  onclick="wwEnterExperience()"
*/
function wwEnterExperience() {
  startLoading();
}


/* =========================================================
   ÉCRAN DE CHARGEMENT
========================================================= */

function startLoading() {
  if (loadingRunning) return;

  loadingRunning = true;

  resetBodyState();
  document.body.classList.add("loading-step");

  hideElement(introScreen);
  hideElement(securityScreen);
  hideElement(app);
  hideElement(navigation);

  showElement(loadingScreen, "flex");

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
    loadingStatus.textContent =
      WW_CONFIG.loadingMessages[0];
  }
}


function runLoadingAnimation() {
  stopLoadingTimerOnly();

  const totalSteps = Math.max(
    1,
    Math.floor(
      WW_CONFIG.loadingDuration /
      WW_CONFIG.loadingInterval
    )
  );

  let currentStep = 0;

  loadingTimer = window.setInterval(() => {
    currentStep += 1;

    const percentage = Math.min(
      100,
      Math.round(
        (currentStep / totalSteps) * 100
      )
    );

    updateLoadingInterface(percentage);

    if (percentage >= 100) {
      stopLoadingTimerOnly();

      window.setTimeout(() => {
        loadingRunning = false;
        showSecurityScreen();
      }, 400);
    }
  }, WW_CONFIG.loadingInterval);
}


function updateLoadingInterface(percentage) {
  if (loadingProgress) {
    loadingProgress.style.width =
      `${percentage}%`;
  }

  if (loadingPercent) {
    loadingPercent.textContent =
      `${percentage}%`;
  }

  if (!loadingStatus) return;

  const numberOfMessages =
    WW_CONFIG.loadingMessages.length;

  const messageIndex = Math.min(
    numberOfMessages - 1,
    Math.floor(
      (percentage / 100) *
      numberOfMessages
    )
  );

  loadingStatus.textContent =
    WW_CONFIG.loadingMessages[messageIndex];
}


function stopLoadingTimerOnly() {
  if (!loadingTimer) return;

  window.clearInterval(loadingTimer);
  loadingTimer = null;
}


function stopLoading() {
  stopLoadingTimerOnly();
  loadingRunning = false;
}


/* =========================================================
   ÉCRAN DE SÉCURITÉ
========================================================= */

function showSecurityScreen() {
  stopLoading();

  resetBodyState();
  document.body.classList.add("security-step");

  hideElement(introScreen);
  hideElement(loadingScreen);
  hideElement(app);
  hideElement(navigation);

  showElement(securityScreen, "flex");

  clearPasswordError();

  if (passwordInput) {
    passwordInput.value = "";

    window.setTimeout(() => {
      passwordInput.focus();
    }, 250);
  }
}


/* =========================================================
   MOT DE PASSE
========================================================= */

function initializePassword() {
  if (passwordButton) {
    passwordButton.addEventListener(
      "click",
      wwCheckPassword
    );
  }

  if (passwordToggle) {
    passwordToggle.addEventListener(
      "click",
      wwTogglePassword
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
          wwCheckPassword();
        }
      }
    );
  }
}


function wwCheckPassword() {
  if (!passwordInput) {
    openWebsite();
    return;
  }

  const enteredPassword =
    passwordInput.value.trim();

  if (enteredPassword === "") {
    showPasswordError(
      "Veuillez entrer le mot de passe."
    );

    shakeSecurityCard();
    passwordInput.focus();
    return;
  }

  if (enteredPassword === WW_CONFIG.password) {
    clearPasswordError();

    if (passwordButton) {
      passwordButton.disabled = true;
      passwordButton.classList.add(
        "is-validating"
      );
    }

    const securityCard =
      document.querySelector(
        ".ww-security-card"
      );

    if (securityCard) {
      securityCard.classList.add(
        "is-unlocked"
      );
    }

    window.setTimeout(() => {
      if (passwordButton) {
        passwordButton.disabled = false;
        passwordButton.classList.remove(
          "is-validating"
        );
      }

      if (securityCard) {
        securityCard.classList.remove(
          "is-unlocked"
        );
      }

      openWebsite();
    }, 550);

    return;
  }

  showPasswordError(
    "Mot de passe incorrect."
  );

  passwordInput.value = "";
  passwordInput.focus();

  shakeSecurityCard();
}


function wwTogglePassword() {
  if (!passwordInput) return;

  const isVisible =
    passwordInput.type === "text";

  passwordInput.type =
    isVisible ? "password" : "text";

  if (passwordToggle) {
    passwordToggle.classList.toggle(
      "is-visible",
      !isVisible
    );

    passwordToggle.setAttribute(
      "aria-label",
      isVisible
        ? "Afficher le mot de passe"
        : "Masquer le mot de passe"
    );
  }

  passwordInput.focus();
}


function showPasswordError(message) {
  if (!passwordError) return;

  passwordError.textContent = message;
  passwordError.classList.add(
    "is-visible"
  );
}


function clearPasswordError() {
  if (!passwordError) return;

  passwordError.textContent = "";
  passwordError.classList.remove(
    "is-visible"
  );
}


function shakeSecurityCard() {
  const securityCard =
    document.querySelector(
      ".ww-security-card"
    ) ||
    document.querySelector(
      ".security-card"
    );

  if (!securityCard) return;

  securityCard.classList.remove(
    "ww-shake"
  );

  void securityCard.offsetWidth;

  securityCard.classList.add(
    "ww-shake"
  );

  window.setTimeout(() => {
    securityCard.classList.remove(
      "ww-shake"
    );
  }, 500);
}


/* =========================================================
   OUVERTURE DU SITE
========================================================= */

function openWebsite() {
  stopLoading();

  resetBodyState();
  document.body.classList.add("site-ready");

  hideElement(introScreen);
  hideElement(loadingScreen);
  hideElement(securityScreen);

  showElement(app);

  if (navigation) {
    showElement(navigation);
  }

  const defaultPage =
    document.getElementById(
      WW_CONFIG.defaultPage
    )
      ? WW_CONFIG.defaultPage
      : document.querySelector(".page")?.id;

  if (defaultPage) {
    showPage(defaultPage, false);
  }

  window.scrollTo(0, 0);
}


/* =========================================================
   NAVIGATION ENTRE LES PAGES
========================================================= */

function initializeNavigation() {
  const buttons =
    document.querySelectorAll(
      "[data-page], [data-target-page]"
    );

  buttons.forEach(button => {
    button.addEventListener(
      "click",
      event => {
        const pageId =
          button.dataset.page ||
          button.dataset.targetPage;

        if (!pageId) return;

        event.preventDefault();
        showPage(pageId);
      }
    );
  });
}


function showPage(
  pageId,
  smoothScroll = true
) {
  const pages =
    document.querySelectorAll(".page");

  const targetPage =
    document.getElementById(pageId);

  if (!targetPage) {
    console.warn(
      `Page introuvable : #${pageId}`
    );

    return;
  }

  pages.forEach(page => {
    const isActive =
      page === targetPage;

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
  const buttons =
    document.querySelectorAll(
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
  const buttons =
    document.querySelectorAll(
      "[data-back-page], .back-button"
    );

  buttons.forEach(button => {
    button.addEventListener(
      "click",
      event => {
        event.preventDefault();

        const targetPage =
          button.dataset.backPage ||
          WW_CONFIG.defaultPage;

        showPage(targetPage);
      }
    );
  });
}


/* =========================================================
   BANNIÈRE DÉFILANTE
========================================================= */

function initializeBanner() {
  const tracks =
    document.querySelectorAll(
      ".banner-track, .scrolling-banner-track, .ww-banner-track"
    );

  tracks.forEach(track => {
    if (
      track.dataset.initialized ===
      "true"
    ) {
      return;
    }

    const content =
      track.innerHTML.trim();

    if (!content) return;

    track.insertAdjacentHTML(
      "beforeend",
      content
    );

    track.dataset.initialized =
      "true";
  });
}


/* =========================================================
   CLAVIER
========================================================= */

function initializeKeyboardControls() {
  document.addEventListener(
    "keydown",
    event => {
      if (event.key !== "Escape") {
        return;
      }

      if (
        document.body.classList.contains(
          "site-ready"
        )
      ) {
        showPage(
          WW_CONFIG.defaultPage
        );
      }
    }
  );
}


/* =========================================================
   REDÉMARRAGE ET DÉCONNEXION
========================================================= */

function restartWebsite() {
  showIntroScreen();
}


function logoutWebsite() {
  showSecurityScreen();
}


/* =========================================================
   FONCTIONS ACCESSIBLES DEPUIS LE HTML
========================================================= */

window.wwEnterExperience =
  wwEnterExperience;

window.wwStartLoading =
  startLoading;

window.wwCheckPassword =
  wwCheckPassword;

window.wwTogglePassword =
  wwTogglePassword;

window.showPage =
  showPage;

window.openWebsite =
  openWebsite;

window.restartWebsite =
  restartWebsite;

window.logoutWebsite =
  logoutWebsite;
