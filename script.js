const imagesWrapper = document.querySelector(".images");
const loadmorebtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input")
const lightBox = document.querySelector(".lightbox")
const closeBtn = document.querySelector(".uil-times")
const downloadImgBtn = document.querySelector(".uil-import")

const apiKey = "pgHzEQDHI8rNqCtLUjwBDmDVpdrmay1e6x07bxPgRZQsrrwWFiJcA0RE";

const perpage = 15;
let currentpage = 1;
let searchTerm = null;

const downloadImg = (imgURL) => {
    // converting received img to blob, creating its download link, & downloading it 
    fetch(imgURL).then(res => res.blob()).then(blob => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = new Date().getTime();
        a.click();
    }).catch(() => alert("Failed to download image!"));
}

const showLightbox = (name, img) => {
    lightBox.querySelector("img").src = img;
    lightBox.querySelector("span").innerText = name;
    downloadImgBtn.setAttribute("data-img",img); //storing the image url as a btn attribute, so we can download it later
    lightBox.classList.add("show");
    document.body.style.overflow = "hidden";
}

const hideLightbox = () => {
    lightBox.classList.remove("show");
    document.body.style.overflow = "auto";
}
const generateHTML = (images) => {
    // making li of all fetched images and adding them to the existing image wrapper
    imagesWrapper.innerHTML += images.map(img =>
        `<li class="card">
        <img onclick="showLightbox('${img.photographer}', '${img.src.large2x}')" src="${img.src.large2x}" alt="img">
        <div class="details">
            <div class="photographer">
                <i class="uil uil-camera"></i>
                <span>${img.photographer}</span>
            </div>
            <button onclick="downloadImg('${img.src.large2x}');"> 
                <i class="uil uil-import"></i>
            </button>
        </div>
    </li>`
    ).join(""); // stopPropogation() prevents propogation of the same event from being called
}
const getImages = (apiURL) => {
    // Fetching images by api call with authorization header
    searchInput.blur();
    loadmorebtn.innerText = "Loading...";
    loadmorebtn.classList.add("disabled");
    fetch(apiURL, {
        headers: { Authorization: apiKey }
    }).then(res => res.json()).then(data => {
        generateHTML(data.photos);
        loadmorebtn.innerText = "Load More";
        loadmorebtn.classList.remove("disabled");
    }).catch(() => alert("Failed to load images!"));
}
const loadmoreimages = () => {
    currentpage++;
    // if searchTerm has some value then call api with search term else call deafult api
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentpage}&per_page=${perpage}`
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentpage}&per_page=${perpage}` : apiURL;
    getImages(apiURL);
}

const loadSearchImages = (e) => {
    // if search input is empty , set the search term to null and return from here
    if (e.target.value === "") return searchTerm = null;
    //  for search images
    if (e.key === "Enter") {
        currentpage = 1;
        searchTerm = e.target.value;
        imagesWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentpage}&per_page=${perpage}`)
    }
}

getImages(`https://api.pexels.com/v1/curated?page=${currentpage}&per_page=${perpage}`);
loadmorebtn.addEventListener("click", loadmoreimages);
searchInput.addEventListener("keyup", loadSearchImages);
closeBtn.addEventListener("click", hideLightbox);
downloadImgBtn.addEventListener("click", (e) => downloadImg(e.target.dataset.img)); // passing btn img attribute value as argument to the downloading function

