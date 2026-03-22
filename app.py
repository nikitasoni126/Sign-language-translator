import base64
import cv2
import numpy as np
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from gesture_model import process_frame

app = Flask(__name__)
CORS(app) # Enable Cross-Origin Resource Sharing

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        if not data or 'image' not in data:
            return jsonify({'error': 'No image provided'}), 400
        
        # Image comes as a base64 string (e.g., "data:image/jpeg;base64,...")
        img_data = data['image']
        if ',' in img_data:
            img_data = img_data.split(',')[1]
            
        # Decode base64 to numpy array
        nparr = np.frombuffer(base64.b64decode(img_data), np.uint8)
        
        # Decode array to OpenCV image format
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if frame is None:
            return jsonify({'error': 'Failed to decode image'}), 400

        # Run hand landmark tracking and heuristic recognition
        result = process_frame(frame)
        return jsonify(result)
        
    except Exception as e:
        print(f"Error processing frame: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Start the Flask app
    print("Starting Sign Language Translator Server...")
    app.run(debug=True, port=5000)
