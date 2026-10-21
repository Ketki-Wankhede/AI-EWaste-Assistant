const API_URL = "http://127.0.0.1:8000/predict";


const imageInput = document.getElementById("imageInput");
const uploadArea = document.getElementById("uploadArea");
const chooseButton = document.getElementById("chooseButton");
const changeButton = document.getElementById("changeButton");

const previewContainer = document.getElementById("previewContainer");
const imagePreview = document.getElementById("imagePreview");
const fileName = document.getElementById("fileName");

const analyzeButton = document.getElementById("analyzeButton");

const loading = document.getElementById("loading");

const errorMessage = document.getElementById("errorMessage");
const errorText = document.getElementById("errorText");

const resultSection = document.getElementById("resultSection");
const resultImage = document.getElementById("resultImage");

const categoryName = document.getElementById("categoryName");
const confidenceValue = document.getElementById("confidenceValue");
const confidenceFill = document.getElementById("confidenceFill");

const actionText = document.getElementById("actionText");
const warningText = document.getElementById("warningText");
const handlingText = document.getElementById("handlingText");

const scanAgainButton = document.getElementById("scanAgainButton");


let selectedFile = null;


/* =========================
   OPEN FILE SELECTOR
========================= */

chooseButton.addEventListener("click", function () {
    imageInput.click();
});


uploadArea.addEventListener("click", function (event) {

    if (
        event.target !== chooseButton &&
        event.target !== imageInput
    ) {
        imageInput.click();
    }

});


/* =========================
   FILE SELECTED
========================= */

imageInput.addEventListener("change", function () {

    const file = imageInput.files[0];

    if (file) {
        handleFile(file);
    }

});


/* =========================
   HANDLE FILE
========================= */

function handleFile(file) {

    hideError();

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg"
    ];

    if (!allowedTypes.includes(file.type)) {

        showError(
            "Please select a JPG, JPEG or PNG image."
        );

        return;
    }


    selectedFile = file;


    const reader = new FileReader();

    reader.onload = function (event) {

        imagePreview.src = event.target.result;

        resultImage.src = event.target.result;

        fileName.textContent = file.name;

        uploadArea.style.display = "none";

        previewContainer.style.display = "block";

        analyzeButton.disabled = false;

    };

    reader.readAsDataURL(file);
}


/* =========================
   CHANGE IMAGE
========================= */

changeButton.addEventListener("click", function () {

    imageInput.value = "";

    selectedFile = null;

    previewContainer.style.display = "none";

    uploadArea.style.display = "flex";

    analyzeButton.disabled = true;

});


/* =========================
   DRAG AND DROP
========================= */

uploadArea.addEventListener("dragover", function (event) {

    event.preventDefault();

    uploadArea.classList.add("dragover");

});


uploadArea.addEventListener("dragleave", function () {

    uploadArea.classList.remove("dragover");

});


uploadArea.addEventListener("drop", function (event) {

    event.preventDefault();

    uploadArea.classList.remove("dragover");

    const file = event.dataTransfer.files[0];

    if (file) {
        handleFile(file);
    }

});


/* =========================
   ANALYZE IMAGE
========================= */

analyzeButton.addEventListener("click", async function () {

    if (!selectedFile) {
        return;
    }


    hideError();

    loading.style.display = "block";

    analyzeButton.disabled = true;


    const formData = new FormData();

    formData.append("file", selectedFile);


    try {

        const response = await fetch(
            API_URL,
            {
                method: "POST",
                body: formData
            }
        );


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.detail ||
                "The backend could not process the image."
            );

        }


        displayResult(data);


    } catch (error) {

        showError(
            error.message ||
            "Unable to connect to the backend."
        );

    } finally {

        loading.style.display = "none";

        analyzeButton.disabled = false;

    }

});


/* =========================
   DISPLAY RESULT
========================= */

function displayResult(data) {

    resultSection.style.display = "block";


    categoryName.textContent =
        formatCategory(data.predicted_category);


    confidenceValue.textContent =
        data.confidence + "%";


    setTimeout(function () {

        confidenceFill.style.width =
            data.confidence + "%";

    }, 100);


    if (data.disposal_guidance) {

        actionText.textContent =
            data.disposal_guidance.action || "-";


        warningText.textContent =
            data.disposal_guidance.safety_warning || "-";


        handlingText.textContent =
            data.disposal_guidance.handling || "-";

    }


    resultSection.scrollIntoView({
        behavior: "smooth"
    });

}


/* =========================
   FORMAT CATEGORY NAME
========================= */

function formatCategory(category) {

    if (!category) {
        return "Unknown";
    }


    return category
        .replaceAll("_", " ")
        .replace(/\b\w/g, function (letter) {
            return letter.toUpperCase();
        });

}


/* =========================
   SHOW ERROR
========================= */

function showError(message) {

    errorText.textContent = message;

    errorMessage.style.display = "block";

}


/* =========================
   HIDE ERROR
========================= */

function hideError() {

    errorMessage.style.display = "none";

    errorText.textContent = "";

}


/* =========================
   SCAN AGAIN
========================= */

scanAgainButton.addEventListener("click", function () {

    selectedFile = null;

    imageInput.value = "";

    resultSection.style.display = "none";

    previewContainer.style.display = "none";

    uploadArea.style.display = "flex";

    analyzeButton.disabled = true;

    confidenceFill.style.width = "0%";

    window.location.hash = "scanner";

    document.getElementById("scanner").scrollIntoView({
        behavior: "smooth"
    });

});