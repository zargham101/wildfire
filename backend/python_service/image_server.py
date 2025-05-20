from flask import Flask, request, jsonify, send_file
import tensorflow as tf
import numpy as np
import requests
import cv2
from PIL import Image
import io
import os
import uuid

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "../wildfireModel")
CAM_MODEL_FILE = "wildfirewatch_cam_model.h5"
SATELLITE_MODEL_FILE = "satellite_classifier.h5"
PORT = 5003
COLORMAP = cv2.COLORMAP_PLASMA

CAM_MODEL_PATH = os.path.join(MODEL_DIR, CAM_MODEL_FILE)
SATELLITE_MODEL_PATH = os.path.join(MODEL_DIR, SATELLITE_MODEL_FILE)

if not os.path.exists(CAM_MODEL_PATH):
    raise FileNotFoundError(f"CAM model not found at {CAM_MODEL_PATH}")
if not os.path.exists(SATELLITE_MODEL_PATH):
    raise FileNotFoundError(f"Satellite model not found at {SATELLITE_MODEL_PATH}")

cam_model = tf.keras.models.load_model(CAM_MODEL_PATH)
satellite_model = tf.keras.models.load_model(SATELLITE_MODEL_PATH)

def preprocess_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = img.resize((224, 224))
    img_array = np.array(img) / 255.0
    return np.expand_dims(img_array, axis=0), np.array(img)

def generate_color_scale():
    height = 400
    width = 120
    scale = np.zeros((height, width, 3), dtype=np.uint8)

    for i in range(height):
        color_value = 255 - int(i / height * 255)
        color = cv2.applyColorMap(np.uint8([color_value]), COLORMAP)[0][0]
        scale[i, :80] = color

    font = cv2.FONT_HERSHEY_SIMPLEX
    font_scale = 0.5
    font_thickness = 1
    text_color = (255, 255, 255)

    segments = [
        {"range": "1.0 - 0.8", "position": 0.1},
        {"range": "0.8 - 0.6", "position": 0.3},
        {"range": "0.6 - 0.4", "position": 0.5},
        {"range": "0.4 - 0.2", "position": 0.7},
        {"range": "0.2 - 0.0", "position": 0.9}
    ]

    for segment in segments:
        y_pos = int(segment["position"] * height)
        cv2.line(scale, (75, y_pos), (85, y_pos), (255, 255, 255), 1)
        cv2.putText(scale, segment["range"], (90, y_pos + 5), font, font_scale, text_color, font_thickness, cv2.LINE_AA)

    scale_path = os.path.join(BASE_DIR, "color_scale.png")
    cv2.imwrite(scale_path, scale)
    return scale_path

def generate_cam(original_img, conv_output, pred_class):
    weights = np.mean(conv_output[0], axis=-1)
    weights = np.maximum(weights, 0)
    weights /= np.max(weights)

    heatmap = cv2.applyColorMap(np.uint8(255 * weights), COLORMAP)
    original_img_bgr = cv2.cvtColor(original_img, cv2.COLOR_RGB2BGR)
    heatmap = cv2.resize(heatmap, (original_img_bgr.shape[1], original_img_bgr.shape[0]))
    cam_img = cv2.addWeighted(original_img_bgr, 0.7, heatmap, 0.3, 0)

    if pred_class == 1:
        fire_mask = (weights > 0.5).astype(np.uint8)
        fire_mask = cv2.resize(fire_mask, (original_img_bgr.shape[1], original_img_bgr.shape[0]))

        enhanced_heatmap = cv2.addWeighted(original_img_bgr, 0.6, heatmap, 0.4, 0)
        cam_img[fire_mask == 1] = enhanced_heatmap[fire_mask == 1]

    return cam_img

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        image_url = data.get('imageUrl')

        if not image_url:
            return jsonify({"status": "error", "message": "Image URL required"}), 400

        response = requests.get(image_url)
        response.raise_for_status()
        image_bytes = response.content

        input_tensor, original_img = preprocess_image(image_bytes)

        
        quality_score = float(satellite_model.predict(input_tensor)[0][0])
        if quality_score < 0.8:
            return jsonify({
                "status": "error",
                "message": "Uploaded image is not suitable for wildfire detection. Please upload a clearer image.",
                "imageQualityScore": round(quality_score, 2)
            }), 400

        
        conv_output, predictions = cam_model.predict(input_tensor)
        no_fire_conf = float(predictions[0][0]) * 100
        fire_conf = float(predictions[0][1]) * 100
        pred_class = 1 if fire_conf > no_fire_conf else 0

        cam_img = generate_cam(original_img, conv_output, pred_class)
        cam_filename = f"cam_{uuid.uuid4().hex}.jpg"
        cam_path = os.path.join(BASE_DIR, cam_filename)
        cv2.imwrite(cam_path, cam_img)

        scale_path = generate_color_scale()

        return jsonify({
            "status": "success",
            "prediction": "Wildfire Detected" if pred_class == 1 else "No Wildfire",
            "noWildfireConfidence": round(no_fire_conf, 2),
            "wildfireConfidence": round(fire_conf, 2),
            "camImageUrl": f"http://localhost:{PORT}/cam/{cam_filename}",
            "colorScale": {
                "blue": "Low probability (0-30%)",
                "green": "Medium probability (30-60%)",
                "red": "High probability (60-100%)",
                "scaleImageUrl": f"http://localhost:{PORT}/scale/color_scale.png"
            }
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/cam/<filename>')
def serve_cam(filename):
    cam_path = os.path.join(BASE_DIR, filename)
    if os.path.exists(cam_path):
        return send_file(cam_path, mimetype='image/jpeg')
    return jsonify({"status": "error", "message": "Image not found"}), 404

@app.route('/scale/color_scale.png')
def serve_color_scale():
    scale_path = os.path.join(BASE_DIR, "color_scale.png")
    if os.path.exists(scale_path):
        return send_file(scale_path, mimetype='image/png')
    return jsonify({"status": "error", "message": "Color scale not found"}), 404

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=PORT, debug=True)
