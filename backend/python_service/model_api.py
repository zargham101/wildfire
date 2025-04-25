import os
import joblib
import pandas as pd
from flask import Flask, request, jsonify

class DateSplitter:
    def __init__(self):
        pass

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        X = X.copy()
        X["fire_start_date"] = pd.to_datetime(X["fire_start_date"], errors='coerce')

        X["fire_start_year"] = X["fire_start_date"].dt.year
        X["fire_start_month"] = X["fire_start_date"].dt.month
        X["fire_start_day"] = X["fire_start_date"].dt.day

        X.drop(columns=["fire_start_date"], inplace=True)

        return X

BASE_DIR = os.path.dirname(__file__)
MODEL_DIR = os.path.join(BASE_DIR, "../wildfireModel")

PREPROCESSOR_FILE = "preprocessor_all_feature.pkl"
PREDICTION_FILE = "all_features_prediction.pkl"

PREPROCESSOR_PATH = os.path.join(MODEL_DIR, PREPROCESSOR_FILE)
PREDICTION_MODEL_PATH = os.path.join(MODEL_DIR, PREDICTION_FILE)

preprocessor = joblib.load(PREPROCESSOR_PATH)
model = joblib.load(PREDICTION_MODEL_PATH)

app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    try:
        input_json = request.get_json(force=True)
        print("Received JSON input:")
        print(input_json)

        df = pd.DataFrame([input_json])
        print(" Converted to DataFrame:")
        print(df)

        X_processed = preprocessor.transform(df)
        print("After Preprocessing (X_processed):")
        print(X_processed)
        prediction = model.predict(X_processed)
        print(" Prediction:")
        print(prediction)

        return jsonify({
            "status": "success",
            "prediction": prediction.tolist()[0]
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
