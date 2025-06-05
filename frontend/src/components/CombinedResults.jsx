import React from "react";

const CombinedResults = ({ formData, predictionResult, camPredictionResult, createdAt }) => {
  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-lg mb-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-red-700 tracking-wide">
        🔥 Wildfire Prediction Summary
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Parameters */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-sm border">
          <h3 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-800">
            📝 Input Parameters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <p className="font-semibold">📍 Location:</p>
              <p>Lat: {formData.fire_location_latitude}</p>
              <p>Lng: {formData.fire_location_longitude}</p>
            </div>
            <div>
              <p className="font-semibold">🔥 Fire Type:</p>
              <p>{formData.fire_type || "-"}</p>
            </div>
            <div>
              <p className="font-semibold">📈 Position on Slope:</p>
              <p>{formData.fire_position_on_slope || "-"}</p>
            </div>
            <div>
              <p className="font-semibold">☁️ Weather:</p>
              <p>{formData.weather_conditions_over_fire || "-"}</p>
            </div>
            <div>
              <p className="font-semibold">🌡 Temperature:</p>
              <p>{formData.temperature ? `${formData.temperature}°C` : "-"}</p>
            </div>
            <div>
              <p className="font-semibold">💧 Humidity:</p>
              <p>{formData.relative_humidity ? `${formData.relative_humidity}%` : "-"}</p>
            </div>
            <div>
              <p className="font-semibold">💨 Wind:</p>
              <p>
                {formData.wind_direction || "-"} {formData.wind_speed ? `at ${formData.wind_speed} km/h` : ""}
              </p>
            </div>
            <div>
              <p className="font-semibold">🌿 Fuel Type:</p>
              <p>{formData.fuel_type || "-"}</p>
            </div>
          </div>
        </div>

        {/* Prediction Results */}
        <div className="space-y-8">
          {/* Traditional Model Prediction */}
          {predictionResult && (
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                📊 Traditional Model Prediction
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-gray-600">Fire Size Prediction:</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {typeof predictionResult === 'number' ? predictionResult.toFixed(4) : predictionResult}
                  </p>
                </div>
                <div
                  className={`w-24 h-24 flex items-center justify-center rounded-full text-xl font-bold
                    ${
                      predictionResult < 5
                        ? "border-4 border-green-500 text-green-700 bg-green-100"
                        : predictionResult <= 15
                        ? "border-4 border-yellow-500 text-yellow-700 bg-yellow-100"
                        : "border-4 border-red-500 text-red-700 bg-red-100"
                    }`}
                >
                  {typeof predictionResult === 'number' ? predictionResult.toFixed(2) : predictionResult}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Predicted on: {new Date(createdAt).toLocaleString()}
              </p>
            </div>
          )}

          {/* Satellite Image Prediction */}
          {camPredictionResult && (
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                🛰️ Satellite Image Analysis
              </h3>

              <div className="flex flex-col lg:flex-row">
                <div className="w-full lg:w-5/6 mb-4 lg:mb-0 border-2 border-dashed border-gray-400 rounded-lg p-2 bg-gray-100">
                  <img
                    src={camPredictionResult.camImageUrl}
                    alt="Predicted Heatmap"
                    className="w-full h-full object-cover rounded-md shadow-md"
                  />
                </div>

                <div className="w-full lg:w-1/6 flex justify-center lg:ml-4">
                  <img 
                    src={camPredictionResult.colorScale.scaleImageUrl} 
                    alt="Color Scale" 
                    className="h-[200px] object-contain"
                  />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <p className="font-medium">Prediction:</p>
                  <p className={`text-lg font-bold ${
                    camPredictionResult.predictionResult === "Wildfire Detected" 
                      ? "text-red-600" 
                      : "text-green-600"
                  }`}>
                    {camPredictionResult.predictionResult}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Confidence:</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 overflow-hidden">
                    <div 
                      className="bg-red-600 h-2.5 rounded-full transition-all duration-500" 
                      style={{ width: `${camPredictionResult.wildfireConfidence}%` }}
                    ></div>
                  </div>
                  <p className="text-right text-xs mt-1">
                    {camPredictionResult.wildfireConfidence}% Wildfire
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CombinedResults;
