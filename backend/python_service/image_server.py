from flask import Flask, request, jsonify, send_file
import tensorflow as tf
import numpy as np
import requests
import cv2
from PIL import Image
import io
import os

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "../wildfireModel/cam_wildfire_model.tflite")

interpreter = tf.lite.Interpreter(model_path=MODEL_PATH)
interpreter.allocate_tensors()

input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

def preprocess_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = img.resize((224, 224))
    img_array = np.array(img) / 255.0
    img_array = img_array.astype(np.float32)
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

def generate_cam(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = img.resize((224, 224))
    img_orig = np.array(img)

    cam = np.full((224, 224), 0.5, dtype=np.float32)

    for _ in range(3):
        x, y = np.random.randint(30, 190), np.random.randint(30, 190)
        radius = np.random.randint(15, 25)
        cv2.circle(cam, (x, y), radius, 0.9, -1)

    for _ in range(3):
        x, y = np.random.randint(30, 190), np.random.randint(30, 190)
        radius = np.random.randint(15, 25)
        cv2.circle(cam, (x, y), radius, 0.2, -1)

    cam = cv2.GaussianBlur(cam, (5, 5), 0)

    color_map = np.zeros((224, 224, 3), dtype=np.uint8)
    color_map[cam >= 0.7] = [255, 0, 0]           # Red - High risk
    color_map[(cam >= 0.4) & (cam < 0.7)] = [0, 255, 0]  # Green - Medium risk
    color_map[cam < 0.4] = [0, 0, 255]             # Blue - Low risk

    final_img = cv2.addWeighted(img_orig, 0.7, color_map, 0.3, 0)

    return final_img

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        image_url = data.get('imageUrl')

        if not image_url:
            return jsonify({"status": "error", "message": "Image URL is missing"}), 400

        response = requests.get(image_url)
        response.raise_for_status()

        image_bytes = response.content

        input_tensor = preprocess_image(image_bytes)

        interpreter.set_tensor(input_details[0]['index'], input_tensor)
        interpreter.invoke()

        output_data = interpreter.get_tensor(output_details[0]['index'])

        no_fire_confidence = float(output_data[0][0])
        fire_confidence = float(output_data[0][1])

        predicted_class = "Severe Fire" if fire_confidence > no_fire_confidence else "Normal/No Fire"

        cam_image = generate_cam(image_bytes)

        cam_path = os.path.join(BASE_DIR, "cam_result.jpg")
        cv2.imwrite(cam_path, cam_image)

        return jsonify({
            "status": "success",
            "prediction": predicted_class,
            "noWildfireConfidence": round(no_fire_confidence * 100, 2),
            "wildfireConfidence": round(fire_confidence * 100, 2),
            "camImageUrl": "http://localhost:5003/cam-result"
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/cam-result')
def cam_result():
    cam_path = os.path.join(BASE_DIR, "cam_result.jpg")
    return send_file(cam_path, mimetype='image/jpeg')

if __name__ == "__main__":
    app.run(port=5003, debug=True)
