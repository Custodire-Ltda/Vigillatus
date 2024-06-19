const URL = "https://teachablemachine.withgoogle.com/models/XMA51V3fb/";
let model, webcam, labelContainer, maxPredictions;

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    /* Variável para mensagem de erro */
    let error_msg = document.getElementById('error-message');

    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        const flip = true;
        webcam = new tmImage.Webcam(600, 600, flip);
        await webcam.setup();
        await webcam.play();
        window.requestAnimationFrame(loop);

        // Exibir webcam e previsões apenas se a inicialização for bem-sucedida
        document.getElementById('webcam-container').classList.remove('hidden');
        document.getElementById('webcam-container').appendChild(webcam.canvas);

        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) {
            labelContainer.appendChild(document.createElement("div"));
        }

        // Ocultar mensagem de erro se for exibida
        error_msg.classList.add("hidden");

        // Add event listener to the close button
        document.getElementById('close-notification').addEventListener('click', function() {
            document.getElementById('notification').classList.add('hidden');
        });

    } catch (error) {
        // Ocultar elementos destinados à câmera e às previsões
        document.getElementById('webcam-container').classList.add('hidden');
        labelContainer.innerHTML = ''; // Limpar elementos de previsão
        // Exibir mensagem de erro
        error_msg.innerText = "Nenhuma câmera foi detectada";
        error_msg.classList.remove("hidden");
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
    const notification = document.getElementById('notification');
    const notificationImage = document.getElementById('notification-image');

    // Set the notification image and display the notification
    notificationImage.src = webcam.canvas.toDataURL('image/png');
    notification.classList.remove('hidden');
}

window.onload = init;