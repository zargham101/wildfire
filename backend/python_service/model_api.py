import os
import joblib
import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import load_model

def mse(y_true, y_pred):
    return tf.reduce_mean(tf.square(y_true - y_pred))

# Set the base directory and model directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "../wildfireModel")

# Set the paths for the models
classification_model_path = "classification_cnn_model_new1.h5"
cnn_lse_model_path = "cnn_lse_reg.h5"
cnn_sfe_model_path = "cnn_sfe_reg.h5"

# Dynamically load the models
classification_model_file = os.path.join(MODEL_DIR, classification_model_path)
cnn_lse_model_file = os.path.join(MODEL_DIR, cnn_lse_model_path)
cnn_sfe_model_file = os.path.join(MODEL_DIR, cnn_sfe_model_path)



# Load the models
classification_model = load_model(classification_model_file, custom_objects={'mse': mse})
cnn_lse_model = load_model(cnn_lse_model_file, custom_objects={'mse': mse})
cnn_sfe_model = load_model(cnn_sfe_model_file, custom_objects={'mse': mse})

FEATURE_COLUMNS = [
    "tmax", "rh", "ws", "vpd", "fwi", "isi", "bui", "closure",
    "biomass", "slope", "fire_intensity_ratio", "pctgrowth_capped",
    "day_frac", "firearea", "fwi_prev1", "fwi_prev2", "rh_prev1", "rh_prev2","prevGrowth"
]

# Initialize MinMaxScaler for normalization (adjust according to actual requirements)
scaler = MinMaxScaler(feature_range=(0, 1))
scaler.fit(np.zeros((1, len(FEATURE_COLUMNS))))

app = Flask(__name__)

# Function to normalize inputs for the models
def normalize_input(data_dict):
    numerical_data = {feature: data_dict.get(feature, 0) for feature in FEATURE_COLUMNS}
    df = pd.DataFrame([numerical_data])
    return scaler.transform(df)

# Function to denormalize output
def denormalize_output(scaled_data):
    return scaler.inverse_transform(scaled_data)

@app.route("/predict", methods=["POST"])
def predict():
    try:
        input_json = request.get_json(force=True)
        print("Received JSON input:")
        print(input_json)

        data = {
            "tmax": input_json['data'][0]['tmax'],
            "rh": input_json['data'][0]['rh'],
            "ws": input_json['data'][0]['ws'],
            "vpd": input_json['data'][0]['vpd'],
            "fwi": input_json['data'][0]['fwi'],
            "isi": input_json['data'][0]['isi'],
            "bui": input_json['data'][0]['bui'],
            "closure": input_json['data'][0]['closure'],
            "biomass": input_json['data'][0]['biomass'],
            "slope": input_json['data'][0]['slope'],
            "fire_intensity_ratio": input_json['data'][0]['fire_intensity_ratio'],
            "pctgrowth_capped": input_json['data'][0]['pctgrowth_capped'],
            "day_frac": input_json['data'][0]['day_frac'],
            "firearea": input_json['data'][0]['firearea'],
            "fwi_prev1": input_json['data'][0]['fwi_prev1'],
            "fwi_prev2": input_json['data'][0]['fwi_prev2'],
            "rh_prev1": input_json['data'][0]['rh_prev1'],
            "rh_prev2": input_json['data'][0]['rh_prev2'],
            "pervGrowth": input_json['data'][0]['pervGrowth']
        }

        normalized_input = normalize_input(data)

        classification_output = classification_model.predict(normalized_input)

        if classification_output[0][0] > classification_output[0][1]:
            selected_model = cnn_lse_model
        else:
            selected_model = cnn_sfe_model

        # Get predictions from the selected CNN model
        cnn_output = selected_model.predict(normalized_input)

        # Denormalize the CNN output prediction
        denormalized_output = denormalize_output(cnn_output)

        return jsonify({
            "status": "success",
            "prediction": denormalized_output.tolist()  # Send the prediction to the frontend
        })

    except Exception as e:
        print("ERROR at runtime:")
        import traceback
        traceback.print_exc()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

if __name__ == "__main__":
    app.run(port=5002, debug=True)
