const ACCESS_PASSWORD = "WONKAA2025";

function showPage(pageId){
    const pages = document.querySelectorAll(".home-page, .page");

    pages.forEach(page => {
        page.classList.remove("active");
    });

    const selectedPage = document.getElementById(pageId);

    if(selectedPage){
        selectedPage.classList.add("active");
    }

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });
}

function openSecurityScreen(){
    const security = document.getElementById("security-screen");

    if(security){
        security.classList.add("active");
    }
}

function checkPassword(){
    const input = document.getElementById("password-input");
    const message = document.getElementById("password-message");
    const security = document.getElementById("security-screen");

    if(input.value === ACCESS_PASSWORD){
        message.textContent = "✅ Accès autorisé";
        message.style.color = "#9dff2e";

        setTimeout(()=>{
            security.classList.remove("active");
            security.style.display = "none";
            showPage("home");
        },1200);

    }else{
        message.textContent = "❌ Code incorrect, réessayez.";
        message.style.color = "#ff3b8d";
        input.value = "";
    }
}

function togglePassword(){
    const input = document.getElementById("password-input");
    input.type = input.type === "password" ? "text" : "password";
}

function startSecurityTimer(){
    let totalSeconds = 24 * 60 * 60;

    setInterval(()=>{
        totalSeconds--;

        if(totalSeconds < 0){
            totalSeconds = 24 * 60 * 60;
        }

        document.getElementById("hours").textContent =
            String(Math.floor(totalSeconds / 3600)).padStart(2,"0");

        document.getElementById("minutes").textContent =
            String(Math.floor((totalSeconds % 3600) / 60)).padStart(2,"0");

        document.getElementById("seconds").textContent =
            String(totalSeconds % 60).padStart(2,"0");

    },1000);
}

function startLoading(){
    const loadingScreen = document.getElementById("loading-screen");
    const progressBar = document.getElementById("loading-progress");
    const percentText = document.getElementById("loading-percent");
    const statusText = document.getElementById("loading-status");

    if(!loadingScreen || !progressBar || !percentText || !statusText){
        openSecurityScreen();
        return;
    }

    let progress = 0;

    const messages = [
        "Initialisation...",
        "Vérification des ressources...",
        "Chargement de l'expérience...",
        "Sécurisation de l'accès...",
        "Finalisation..."
    ];

    const interval = setInterval(()=>{
        progress += Math.floor(Math.random() * 7) + 3;

        if(progress > 100){
            progress = 100;
        }

        progressBar.style.width = progress + "%";
        percentText.textContent = progress + "%";

        if(progress < 25){
            statusText.textContent = messages[0];
        }else if(progress < 50){
            statusText.textContent = messages[1];
        }else if(progress < 75){
            statusText.textContent = messages[2];
        }else if(progress < 95){
            statusText.textContent = messages[3];
        }else{
            statusText.textContent = messages[4];
        }

        if(progress === 100){
            clearInterval(interval);

            setTimeout(()=>{
                loadingScreen.classList.add("hide");
            },700);

            setTimeout(()=>{
                loadingScreen.style.display = "none";
                openSecurityScreen();
            },1600);
        }
    },230);
}

document.addEventListener("DOMContentLoaded", ()=>{
    showPage("home");
    startSecurityTimer();
    startLoading();
});
