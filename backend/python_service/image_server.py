from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import requests
from PIL import Image
from io import BytesIO
import os

app = Flask(__name__)

# 🔥 Correct loading of the model if it's in a different folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "../wildfireImageModel/cam_wildfire_model.h5") 

# Load the TensorFlow image model
model = tf.keras.models.load_model(MODEL_PATH)

def preprocess_image(image_bytes):
    img = Image.open(BytesIO(image_bytes)).convert('RGB')
    img = img.resize((224, 224))  # Assuming your model expects 224x224 input
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0) 
    return img_array

@app.route('/predict/cam/result', methods=['POST'])  # 📍 Different endpoint than /predict
def predict_image():
    try:
        data = request.get_json(force=True)
        image_url = data.get('imageUrl')

        if not image_url:
            return jsonify({"error": "Image URL missing"}), 400

        # Download the image from the URL
        response = requests.get(image_url)
        response.raise_for_status()

        image_bytes = response.content
        processed_image = preprocess_image(image_bytes)

        prediction = model.predict(processed_image)
        
        # Example logic: If the first output neuron is >0.5, it's fire
        predicted_class = "Severe Fire" if prediction[0][0] > 0.5 else "Normal/No Fire"

        return jsonify({
            "status": "success",
            "prediction": predicted_class
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5003, debug=True)
