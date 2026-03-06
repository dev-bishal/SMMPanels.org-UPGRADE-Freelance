const APItoUse = document.querySelector(".content-wrapper").dataset.apiurl;
console.log("APItoUse- ", APItoUse);

let selectedLanguage = localStorage.getItem("lang")
if(selectedLanguage == "en") selectedLanguage = ""
else if(selectedLanguage == "es") selectedLanguage = "/es"
else if(selectedLanguage == "pt") selectedLanguage = "/pt"

console.log(selectedLanguage);


function optimizeImageUrl(url, height = 100, format = 'webp') {
    // Split the URL at the last slash to separate the base URL from the image identifier
    const baseUrl = url.substring(0, url.lastIndexOf('/'));
    const imageId = url.substring(url.lastIndexOf('/') + 1);
    
    // Construct the optimized URL
    const optimizedUrl = `${baseUrl}/transform/height=${height},format=${format}/${imageId}`;
    
    return optimizedUrl;
}
//#region Services Pagination
try {
    let pageSize = Number(
        document
            .querySelector(".paginationHolder")
            .getAttribute("data-pageSize"),
    );
    let allServiceList = document.querySelectorAll(".offerList");
    let pagiNextBtn = document.querySelector(".paginationBtns .nextbtns");
    let pagiPrevBtn = document.querySelector(".paginationBtns .prevbtns");
    let pageNumber = document.querySelector(".paginationBtns .pageNumber");
    var currentPosition,
        lastPosition = allServiceList.length;
    var pageNo = 1;
    allServiceList.forEach((serviceItem) => {
        if (serviceItem.classList.contains("pageCounter")) {
            currentPosition =
                Number(serviceItem.children[0].textContent) - 1;
            return;
        }
    });
    updatePageNumber();

    pagiNextBtn.addEventListener("click", () => {
        paginate("next");
        updatePageNumber();
    });

    pagiPrevBtn.addEventListener("click", () => {
        paginate("prev");
        updatePageNumber();
    });

    function paginate(paginateType) {
        allServiceList.forEach((serviceItem) => {
            serviceItem.classList.add("hidden");
            serviceItem.classList.remove("pageCounter");
        });

        if (paginateType == "next") {
            if (currentPosition + pageSize < lastPosition)
                currentPosition = currentPosition + pageSize;
            else {
                //block Next Button
            }
        } else if (paginateType == "prev") {
            if (currentPosition - pageSize >= 0)
                currentPosition = currentPosition - pageSize;
            else {
                //block prev Button
            }
        }

        pageNo = currentPosition / pageSize + 1;

        allServiceList[currentPosition].classList.add("pageCounter");

        allServiceList.forEach((serviceItem, index) => {
            if (serviceItem.classList.contains("pageCounter")) {
                for (let i = 0; i < pageSize; i++) {
                    if (index + i < allServiceList.length)
                        allServiceList[index + i].classList.remove(
                            "hidden",
                        );
                }
            }
        });
    }
    function updatePageNumber() {
        pageNumber.textContent = `${pageNo} of ${Math.ceil(allServiceList.length / pageSize)}`;
    }
} catch (error) {}
//#endregion

//#region Search results
//Functions
function getPanelsCards(rating, service, websiteURL, imageSrc, panelTitle, slugURL){
    var ratingCollection = [];
    for (let j = 0; j < 5; j++) {
        if(j < rating)
            ratingCollection.push("fa-solid fa-star");
        else
            ratingCollection.push("fa-regular fa-star");
    }
    return `
    <article class="lg:w-[32%] md:w-[48%] w-full rounded-lg bg-[#81818169] shadow-md hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all ease-in-out duration-150">
    
    <a href="${selectedLanguage}${"/panels/" + slugURL}">
        <img src=
        ${
            imageSrc != ""
            ? imageSrc 
            :"/assets/images/no-image-available.jpg"
        } 
        alt="${panelTitle + " thumbnail"}" class="h-52 w-full rounded-tl-lg rounded-tr-lg hover:brightness-75">
    </a>

    <div class="data w-full">
        <div class="articleLink p-3 w-full flex justify-between">
            <span class="flex justify-between items-center w-full">
                <h2 class="font-bold hover:underline"><a href="${selectedLanguage}${"/panels/" + slugURL}">${panelTitle}</a></h2>
                <span class="flex gap-1 items-center text-yellow-400 text-sm mt-2" title="${rating} of 5">
                    ${
                        ratingCollection.map(rating =>{
                            return `<i class="${rating.toString()}"></i>`
                        }).join('')
                    } <span class="">${rating}/5</span>
                </span>
            </span>
            <span>
                ${
                    service.toString() != "0" 
                    ? service.toString() + " " + (service > 1 ? "Services" : "Service")
                    : ""
                }
            </span>
        </div>
                
        <div class="websiteLink p-3 bg-slate-200 rounded-bl-lg rounded-br-lg">
            <a href="${websiteURL}" target="_blank" class="text-sm hover:font-semibold"><i class="fa-solid fa-arrow-up-right-from-square"></i> ${websiteURL.split("/")[0] + "//" + websiteURL.split("/")[2]}</a>
        </div>
    </div>
</article>
`
}

function getServicesCards(title, imageLogoPath) {
    return `
    <article class="bg-[#aaa4a473] hover:bg-[#ece8e873] backdrop-blur-sm cursor-pointer hover:bg-white flex flex-col justify-center lg:items-start items-center lg:text-left text-center gap-2 lg:w-[32%] w-[47%] p-3 border rounded-md shadow-md hover:shadow-2xl">
        <a href="${selectedLanguage}${"/services/"+ title.toLowerCase().replaceAll(" ", "-")}"><img alt="${title}" class="rounded-lg size-20" src="${imageLogoPath}"></a>
        <span>
            <h2 class="font-semibold hover:underline"><a href="${"/services/"+ title.toLowerCase().replaceAll(" ", "-")}">${title}</a></h2>
            
        </span>
    </article>
    `
}

function getServiceCount(searchTerm){
    var count=0;
    const allServicesTitle = document.querySelectorAll(".offer_service");
    
    allServicesTitle.forEach(serviceTitle => {
        if(serviceTitle.textContent.includes(searchTerm))
            count++;
    });
    return count;
}

async function creatingPanelResults(panels) {
    var panelContainer = document.getElementById("panelsWrapper");
    if(panels.length > 0){
        document.querySelector(".searchResultsPanels").classList.remove("hidden");
        for (let i = 0; i < panels.length; i++) {
            /* let APIURL_services= "https://smmpanelsnet.vercel.app/api/panelServices/"+ panels[i].panelSlug;
            console.log(APIURL_services);
                    
            let panelServicesData_OLD = await fetch(APIURL_services).then((Response) =>
                Response.json(),
            );
            console.log(panelServicesData_OLD.combinedArray.length); */
            
            panelContainer.insertAdjacentHTML("afterbegin", getPanelsCards(
                panels[i].rating,
                0,
                panels[i].panelWebsiteURL,
                panels[i].panelFeaturedImage == null ? "" : optimizeImageUrl(panels[i].panelFeaturedImage.url, 250) ,
                panels[i].panelTitle,
                panels[i].panelSlug,
            ))
        }
    }
    else{
        document.querySelector(".searchResultsPanels").remove();
    }
}
//var AllServices;
function creatingServiceResults(services) {
    var serviceContainer = document.getElementById("servicesWrapper");
    if(services.length > 0){
        document.querySelector(".searchResultsServices").classList.remove("hidden");
        for (let i = 0; i < services.length; i++) {
            serviceContainer.insertAdjacentHTML("beforeend", getServicesCards(
                services[i].serviceTitle,
                services[i].serviceLogo == null ? "" : optimizeImageUrl(services[i].serviceLogo.url, 80),
                0
            ))
        }
    }
    else{
        document.querySelector(".searchResultsServices").remove();
    }
}

const searchURL = window.location.href;
var url = new URL(searchURL);
var params = new URLSearchParams(url.search);
var query = params.get("q");
var allWordsInQuery = query.split(" ");

document.title = `Search results for "${query}" - ${document.title}`;

    //#region Search among Panels
    let panelsFound = [];
    fetch(APItoUse + "api/panels").then(response => response.json())
    .then(data => {
        
        for (let i = 0; i < data.length; i++) {
            const allResults = data[i].panelTitle;
            
            for (let j = 0; j < allWordsInQuery.length; j++) {
                if(allResults.toLowerCase().includes(allWordsInQuery[j].toLowerCase())){
                    panelsFound.push(data[i]);
                }
            }
        }
        creatingPanelResults(panelsFound);
    })
    //#endregion

    //#region Search among Listed Services
    let servicesFound = [];
    fetch("https://smmpanels-admin.vercel.app/api/services.json").then(response => response.json())
    .then(data => {
        
        for (let i = 0; i < data.length; i++) {
            const allResults = data[i].serviceTitle;
            
            for (let j = 0; j < allWordsInQuery.length; j++) {
                if(allResults.toLowerCase().includes(allWordsInQuery[j].toLowerCase())){
                    if(!servicesFound.includes(data[i]))
                        servicesFound.push(data[i]);
                }
            }
        }

        //AllServices = servicesFound;
        //console.log(servicesFound);
        creatingServiceResults(servicesFound);
    })
    //#endregion
    
    function isSearchResultsFound() {
        if(servicesFound.length == 0 && panelsFound.length == 0){
            document.querySelector(".searchResTitle").classList.add("text-center");
            document.querySelector(".searchResTitle").textContent = `No results found for "${query}"`;
        }
        else
            document.querySelector(".searchResTitle").textContent = `Search results for "${query}"`;
    }
    setInterval(isSearchResultsFound, 1000);
//#endregion