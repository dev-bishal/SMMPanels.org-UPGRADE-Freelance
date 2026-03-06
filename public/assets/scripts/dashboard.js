var mainContainer = document.getElementById("app-root");
var mainTitle = document.getElementById("pageTitle");

/* Hide and Show SideMenu bar Starts */
var menuToggleBtn = document.getElementById("menuToggleBtn");
var menuCloseToggleBtn = document.getElementById("menuCloseToggleBtn");

menuCloseToggleBtn.addEventListener("click", () => { toggleSidebar() })
menuToggleBtn.addEventListener("click", () => { toggleSidebar() })
/* Hide and Show SideMenu bar Ends*/

function toggleSidebar() {
    let sidebarComponent = document.querySelector(".side-menubar-container");
    let dashboardComponent = document.querySelector(".dashboard-component-container");
    sidebarComponent.classList.toggle("sidebarHide");
    dashboardComponent.classList.toggle("dashboardStretch");
}

// show Menu starts
function triggerMenu(menuBtn) {
    menuBtn.nextElementSibling.classList.toggle("hide");
}
function menuOptionsToggle() {
    console.log("Test");
    var showOptionMenuTriggers = document.querySelectorAll(".optionTrigger");
    showOptionMenuTriggers.forEach(optionTriggerEle => {
        optionTriggerEle.addEventListener("click", () => {
            console.log("Click");
            optionTriggerEle.nextElementSibling.classList.toggle("hide");
        })
    });
}
// show Menu ends

var SidebarMenuOptions = document.querySelectorAll(".menuList li");
SidebarMenuOptions.forEach(SidebarMenu => {
    SidebarMenu.addEventListener("click", () => {
        if (SidebarMenu.nextElementSibling.nodeName == "UL") {
            SidebarMenu.querySelector('a').children[1].classList.toggle("rotate-180");

            SidebarMenu.nextElementSibling.classList.toggle("invisible");
            SidebarMenu.nextElementSibling.classList.toggle("h-0");
        }
    })
});
// show Menu ends

//#region Confirm Box Modal
const confirmBoxContainer = document.querySelector(".Overlay.confirmBox");
const confirmMsg = confirmBoxContainer.querySelector(".ConfirmMessage .msg");
var confirmBoxResponse;

function setConfirmBoxMessage(message) {
    confirmMsg.textContent = message;
    triggerConfirmBox();
    confirmBoxResponse = null;
}
function triggerConfirmBox() {
    confirmBoxContainer.classList.toggle("hidden");
}
function setConfirmationBoxResponse(btnClickAction){
    triggerConfirmBox();
    confirmBoxResponse = btnClickAction
}

async function getConfirmationBoxResponse() {
    return confirmBoxResponse;
}
//#endregion