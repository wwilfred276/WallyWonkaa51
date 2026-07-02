function showPage(pageId){
    const home = document.getElementById("home");
    const pages = document.querySelectorAll(".page");

    home.classList.remove("active");

    pages.forEach(page => {
        page.classList.remove("active");
    });

    if(pageId === "home"){
        home.classList.add("active");
    }else{
        const selectedPage = document.getElementById(pageId);
        if(selectedPage){
            selectedPage.classList.add("active");
        }
    }

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });
}

document.addEventListener("DOMContent-Loaded", function(){
    showPage("home");
});
