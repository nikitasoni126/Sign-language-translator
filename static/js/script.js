document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('videoElement');
    const canvas = document.getElementById('canvasElement');
    const toggleCamBtn = document.getElementById('toggleCamBtn');
    const imageUpload = document.getElementById('imageUpload');
    const uploadedImage = document.getElementById('uploadedImage');
    const speakBtn = document.getElementById('speakBtn');
    const predictedText = document.getElementById('predictedText');
    const statusOverlay = document.getElementById('statusOverlay');
    
    let isCameraRunning = false;
    let stream = null;
    let captureInterval = null;

    // Set up text-to-speech
    const synth = window.speechSynthesis;

    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (isCameraRunning) {
            stopCamera();
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
            const base64data = event.target.result;
            
            // Show uploaded image, hide video feed
            video.style.display = 'none';
            uploadedImage.style.display = 'block';
            uploadedImage.src = base64data;
            statusOverlay.classList.remove('active');

            // Show analyzing state
            predictedText.innerText = "Analyzing...";
            predictedText.style.color = "#adb5bd";
            predictedText.style.textShadow = "none";
            speakBtn.disabled = true;

            try {
                const response = await fetch('http://127.0.0.1:5000/predict', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: base64data })
                });
                
                if (response.ok) {
                    const result = await response.json();
                    updateUI(result.gesture);
                }
            } catch (err) {
                console.error("Error communicating with API: ", err);
                updateUI("Unknown");
            }
        };
        reader.readAsDataURL(file);
    });

    toggleCamBtn.addEventListener('click', async () => {
        if (!isCameraRunning) {
            await startCamera();
        } else {
            stopCamera();
        }
    });

    speakBtn.addEventListener('click', () => {
        const text = predictedText.innerText;
        if (text && text !== "Analyzing..." && text !== "No Hand Detected" && text !== "Waiting for gesture...") {
            const utterance = new SpeechSynthesisUtterance(text);
            synth.speak(utterance);
        }
    });

    async function startCamera() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: 640, height: 480, facingMode: "user" } 
            });
            video.srcObject = stream;
            video.style.display = 'block';
            uploadedImage.style.display = 'none';
            
            video.onloadedmetadata = () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                isCameraRunning = true;
                toggleCamBtn.innerText = "Stop Camera";
                toggleCamBtn.classList.replace('primary-btn', 'secondary-btn');
                statusOverlay.classList.add('active');
                
                // Start sending frames to backend
                startPredictionLoop();
            };
        } catch (err) {
            console.error("Error accessing webcam: ", err);
            alert("Could not access webcam. Please ensure permissions are granted.");
        }
    }

    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        video.srcObject = null;
        isCameraRunning = false;
        toggleCamBtn.innerText = "Start Camera";
        toggleCamBtn.classList.replace('secondary-btn', 'primary-btn');
        statusOverlay.classList.remove('active');
        predictedText.innerText = "Waiting for gesture...";
        speakBtn.disabled = true;
        
        if (captureInterval) {
            clearInterval(captureInterval);
        }
    }

    function startPredictionLoop() {
        const ctx = canvas.getContext('2d');
        
        // Capture a frame every 500ms (2 FPS) to avoid overloading the API
        captureInterval = setInterval(async () => {
            if (!isCameraRunning) return;

            // Draw video frame to canvas
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Extract base64
            const imageData = canvas.toDataURL('image/jpeg', 0.8);
            
            try {
                const response = await fetch('http://127.0.0.1:5000/predict', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: imageData })
                });
                
                if (response.ok) {
                    const result = await response.json();
                    updateUI(result.gesture);
                }
            } catch (err) {
                console.error("Error communicating with API: ", err);
            }
        }, 500); 
    }

    function updateUI(gesture) {
        if (!gesture) return;
        
        predictedText.innerText = gesture;
        
        if (gesture === "No Hand Detected" || gesture === "Analyzing..." || gesture === "Unknown") {
            speakBtn.disabled = true;
            predictedText.style.color = "#adb5bd";
            predictedText.style.textShadow = "none";
        } else {
            speakBtn.disabled = false;
            predictedText.style.color = "#fff";
            predictedText.style.textShadow = "0 0 10px rgba(123, 44, 191, 0.8)";
        }
    }
});
