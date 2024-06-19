const URL = "https://teachablemachine.withgoogle.com/models/XMA51V3fb/";
let model, webcam, labelContainer, maxPredictions;

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    /* Variável para menssagem de erro */
    let error_msg = document.getElementById('error-message');

    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        webCamContainer = document.getElementById('webcam-container'); 
        webCamContainer.classList.toggle('hidden');

        const flip = true;
        webcam = new tmImage.Webcam(600, 600, flip);
        await webcam.setup();
        await webcam.play();
        window.requestAnimationFrame(loop);

        webCamContainer.appendChild(webcam.canvas);
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) {
            labelContainer.appendChild(document.createElement("div"));
        }
    } catch (error) {
        error_msg.innerText = "Nenhuma câmera foi detectada";
        error_msg.classList.toggle("hidden");
    }
}

async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;

        // Check if the probability of class 2 is >= 0.80 (80%)
        if (prediction[i].className == 2 && prediction[i].probability >= 0.80) {
            captureImage(prediction[i].probability.toFixed(2)); // Pass probability to captureImage function
        }
    }
}

function captureImage(probability) {
    // Capture the current frame from the webcam
    const capturedImageContainer = document.getElementById('captured-image-container');
    const capturedImage = document.getElementById('captured-image');
    const notification = document.getElementById('notification');
    const notificationImage = document.getElementById('notification-image');

    capturedImage.src = webcam.canvas.toDataURL('image/png');
    capturedImageContainer.classList.remove('hidden');

    // Hide the captured image container if notification is shown
    if (notification.classList.contains('hidden')) {
        notificationImage.src = webcam.canvas.toDataURL('image/png');
        notification.querySelector('p').innerText = `Classe 2 atingiu ${probability}%`;
        notification.classList.remove('hidden');
    } else {
        capturedImageContainer.classList.add('hidden');
    }
}

window.onload = init;