Telegram.WebApp.ready();
Telegram.WebApp.expand();

function showPage(id) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    document.getElementById(id).classList.add("active");

    document.getElementById("categoryMenu").style.display = "none";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

function toggleCategories() {

    const menu = document.getElementById("categoryMenu");

    if (menu.style.display === "block") {
        menu.style.display = "none";
    } else {
        menu.style.display = "block";
    }

}

window.onclick = function(e){

    if(
        !e.target.matches(".category-btn") &&
        !e.target.matches(".category-btn span")
    ){
        const menu=document.getElementById("categoryMenu");
        if(menu){
            menu.style.display="none";
        }
    }

}
