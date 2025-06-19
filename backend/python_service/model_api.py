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


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "../wildfireModel")


classification_model_path = "classification_cnn_model_new1.h5"
cnn_lse_model_path = "cnn_lse_reg.h5"
cnn_sfe_model_path = "cnn_sfe_reg.h5"


classification_model_file = os.path.join(MODEL_DIR, classification_model_path)
cnn_lse_model_file = os.path.join(MODEL_DIR, cnn_lse_model_path)
cnn_sfe_model_file = os.path.join(MODEL_DIR, cnn_sfe_model_path)


classification_model = load_model(classification_model_file, custom_objects={'mse': mse})
cnn_lse_model = load_model(cnn_lse_model_file, custom_objects={'mse': mse})
cnn_sfe_model = load_model(cnn_sfe_model_file, custom_objects={'mse': mse})

FEATURE_COLUMNS = [
    "tmax", "rh", "ws", "vpd", "fwi", "isi", "bui", "closure",
    "biomass", "slope", "fire_intensity_ratio", "pctgrowth_capped",
    "day_frac", "firearea", "fwi_prev1", "fwi_prev2", "rh_prev1", "rh_prev2",
    "prevGrowth" 
]
assert len(FEATURE_COLUMNS) == 19, "FEATURE_COLUMNS list must have 19 features as per model's expected input."

scaler = MinMaxScaler(feature_range=(0, 1))
scaler.fit(np.zeros((1, len(FEATURE_COLUMNS)))) 
app = Flask(__name__)

def normalize_input(data_df):
    
    return scaler.transform(data_df.values)

def denormalize_output(scaled_data):
    
    if scaled_data.ndim == 1:
        scaled_data = scaled_data.reshape(-1, 1) 

    dummy_array_for_inverse = np.zeros((scaled_data.shape[0], len(FEATURE_COLUMNS)))
    
    dummy_array_for_inverse[:, 0] = scaled_data.flatten()
    return scaler.inverse_transform(dummy_array_for_inverse)[:, 0]


@app.route("/predict", methods=["POST"])
def predict():
    try:
        input_json = request.get_json(force=True)
        print("Received JSON input:")
        print(input_json)

        processed_data_points = []
        for entry in input_json['data']:
            single_timestep_data = {
                "tmax": entry['tmax'],
                "rh": entry['rh'],
                "ws": entry['ws'],
                "vpd": entry['vpd'],
                "fwi": entry['fwi'],
                "isi": entry['isi'],
                "bui": entry['bui'],
                "closure": entry['closure'],
                "biomass": entry['biomass'],
                "slope": entry['slope'],
                "fire_intensity_ratio": entry['fire_intensity_ratio'],
                "pctgrowth_capped": entry['pctgrowth_capped'],
                "day_frac": entry['day_frac'],
                "firearea": entry['firearea'],
                "fwi_prev1": entry['fwi_prev1'],
                "fwi_prev2": entry['fwi_prev2'],
                "rh_prev1": entry['rh_prev1'],
                "rh_prev2": entry['rh_prev2'],
                "prevGrowth": entry['prevGrowth']
            }
            processed_data_points.append(single_timestep_data)

        input_df = pd.DataFrame(processed_data_points, columns=FEATURE_COLUMNS)

        required_timesteps = 143
        current_timesteps = len(input_df) 

        if current_timesteps < required_timesteps:
            padding_rows = required_timesteps - current_timesteps
            padding_df = pd.DataFrame(0, index=range(padding_rows), columns=FEATURE_COLUMNS)
            sequence_df = pd.concat([padding_df, input_df], ignore_index=True)
        elif current_timesteps > required_timesteps:
            
            sequence_df = input_df.tail(required_timesteps)
        else:
            sequence_df = input_df
        
        normalized_sequence = normalize_input(sequence_df) 

        normalized_input_reshaped = normalized_sequence.reshape(1, required_timesteps, len(FEATURE_COLUMNS))
        
        print(f"Shape of input to model: {normalized_input_reshaped.shape}")

        classification_output = classification_model.predict(normalized_input_reshaped)

        if classification_output[0][0] > classification_output[0][1]:
            selected_model = cnn_lse_model
        else:
            selected_model = cnn_sfe_model
        cnn_output = selected_model.predict(normalized_input_reshaped)

        denormalized_output = denormalize_output(cnn_output)

        return jsonify({
            "status": "success",
            "prediction": denormalized_output.tolist()  # Convert numpy array to list for JSON
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