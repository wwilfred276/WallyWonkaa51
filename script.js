function showPage(pageId){
    document.querySelectorAll(".home-page, .page").forEach(page=>{
        page.classList.remove("active");
    });

    const page = document.getElementById(pageId);

    if(page){
        page.classList.add("active");
    }

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });
}

function enterSite(){
    const intro = document.getElementById("intro-screen");

    if(intro){
        intro.classList.add("hide");

        setTimeout(()=>{
            intro.style.display = "none";
        }, 1000);
    }

    showPage("home");
}

document.addEventListener("DOMContentLoaded", ()=>{
    showPage("home");
});
