from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib  # Replaced pickle with joblib
import pandas as pd
import os
from typing import Dict, Any

app = Flask(__name__)
CORS(app)

# Configuration
MODEL_DIR = os.path.join(os.path.dirname(__file__), "../wildfireModel")
MODEL_FILE = "wildfire_regression.joblib"  # Changed extension
MODEL_PATH = os.path.join(MODEL_DIR, MODEL_FILE)
INPUT_FEATURES = ['Temp.', 'RH', 'Wind Dir.', 'Adj. Wind Speed', 
                 '24hr. Rain', 'FFMC', 'DMC', 'DC', 'ISI']

def load_model():
    """Load the wildfire prediction model with robust error handling"""
    try:
        # Verify model file exists
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
        
        # Verify file is not empty
        if os.path.getsize(MODEL_PATH) == 0:
            raise ValueError("Model file is empty")
        
        # Load with joblib
        model = joblib.load(MODEL_PATH)
        print("✓ Model loaded successfully")
        return model
        
    except Exception as e:
        print(f"✗ Failed to load model: {str(e)}")
        return None

# Initialize model when starting the service
wildfire_model = load_model()

@app.route("/wildfire/predict", methods=["POST"])
def predict_fire_index():
    """Handle prediction requests with complete validation"""
    # Check if model loaded
    if wildfire_model is None:
        return jsonify({
            "error": "Prediction service unavailable",
            "details": "Model failed to load"
        }), 503  # Service Unavailable

    try:
        # Validate request format
        if not request.is_json:
            return jsonify({"error": "Request must be JSON"}), 400
        
        data: Dict[str, Any] = request.json
        
        # Validate all required features exist
        missing_features = [f for f in INPUT_FEATURES if f not in data]
        if missing_features:
            return jsonify({
                "error": "Missing required features",
                "missing": missing_features
            }), 400

        # Create input dataframe
        input_df = pd.DataFrame([data], columns=INPUT_FEATURES)
        
        # Make prediction
        prediction = wildfire_model.predict(input_df)[0]
        
        # Return response
        return jsonify({
            "status": "success",
            "fwi": float(prediction),  # Ensure JSON-serializable
            "units": "Fire Weather Index"
        })

    except Exception as e:
        return jsonify({
            "error": "Prediction failed",
            "details": str(e)
        }), 500

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5001,
        debug=True,
        use_reloader=False  # Avoid double model loading
    )