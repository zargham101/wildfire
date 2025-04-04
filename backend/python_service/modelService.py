from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os
from typing import Dict, Any

app = Flask(__name__)
CORS(app)

MODEL_DIR = os.path.join(os.path.dirname(__file__), "../wildfireModel")
MODEL_FILE = "wildfire_regression.joblib"
MODEL_PATH = os.path.join(MODEL_DIR, MODEL_FILE)

INPUT_FEATURES = ['Temp.', 'RH', 'Wind Dir.', 'Adj. Wind Speed',
                  '24hr. Rain', 'FFMC', 'DMC', 'DC', 'ISI']

KEY_MAP = {
    "Temp": "Temp.",
    "RH": "RH",
    "WindDir": "Wind Dir.",
    "AdjWindSpeed": "Adj. Wind Speed",
    "Rain": "24hr. Rain",
    "FFMC": "FFMC",
    "DMC": "DMC",
    "DC": "DC",
    "ISI": "ISI"
}

def load_model():
    try:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
        if os.path.getsize(MODEL_PATH) == 0:
            raise ValueError("Model file is empty")
        model = joblib.load(MODEL_PATH)
        print("Model loaded successfully")
        return model
    except Exception as e:
        print(f"Failed to load model: {str(e)}")
        return None

wildfire_model = load_model()

@app.route("/wildfire/predict", methods=["POST"])
def predict_fire_index():
    if wildfire_model is None:
        return jsonify({"error": "Model failed to load"}), 503

    try:
        data = request.get_json()
        print("Received data from backend:", data)
        if not data:
            return jsonify({"error": "Invalid JSON"}), 400

        mapped_data = {KEY_MAP[k]: v for k, v in data.items() if k in KEY_MAP}

        missing = [k for k in INPUT_FEATURES if k not in mapped_data]
        if missing:
            return jsonify({
                "error": "Missing required features",
                "missing": missing
            }), 400

        input_df = pd.DataFrame([mapped_data], columns=INPUT_FEATURES)
        prediction = wildfire_model.predict(input_df)[0]

        return jsonify({
            "status": "success",
            "fwi": float(prediction),
            "units": "Fire Weather Index"
        })

    except Exception as e:
        return jsonify({"error": "Prediction failed", "details": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True, use_reloader=False)
