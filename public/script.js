function previewImage(event) {
    let reader = new FileReader();
    reader.onload = function () {
        let img = document.getElementById("xray-preview");
        img.src = reader.result;
        img.style.display = "block";
    };
    reader.readAsDataURL(event.target.files[0]);
}

function openCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            let video = document.getElementById("camera-stream");
            video.srcObject = stream;
            video.style.display = "block";
        })
        .catch(function (error) {
            alert("Error accessing camera: " + error);
        });
}

function submitImage() {
    let imgSrc = document.getElementById("xray-preview").src || document.getElementById("camera-preview").src;
    if (!imgSrc) {
        alert("Please upload or capture an X-ray first.");
        return;
    }

    let classificationResult = "Bronchitis detected with 95% confidence";
    let segmentedImage = "segmented_xray.png"; 
    
    showResults(imgSrc, classificationResult, segmentedImage);
}

function showResults(imageSrc, classification, segmentedSrc) {
    document.getElementById("home-section").style.display = "none";
    document.getElementById("results-section").style.display = "block";
    document.getElementById("result-xray").src = imageSrc;
    document.getElementById("classification-result").innerText = classification;

    if (segmentedSrc) {
        document.getElementById("segmented-xray").src = segmentedSrc;
        document.getElementById("segmented-xray").style.display = "block";
    }
}
