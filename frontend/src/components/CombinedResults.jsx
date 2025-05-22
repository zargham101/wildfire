import React from "react";

const CombinedResults = ({ formData, predictionResult, camPredictionResult, createdAt }) => {
  
    return (
    <div className="w-full bg-white p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-bold text-center mb-6 text-red-700">
        Wildfire Prediction Results
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 border-b pb-2">
            Input Parameters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Location:</p>
              <p>Lat: {formData.fire_location_latitude}</p>
              <p>Lng: {formData.fire_location_longitude}</p>
            </div>
            <div>
              <p className="font-medium">Fire Type:</p>
              <p>{formData.fire_type || "-"}</p>
            </div>
            <div>
              <p className="font-medium">Position on Slope:</p>
              <p>{formData.fire_position_on_slope || "-"}</p>
            </div>
            <div>
              <p className="font-medium">Weather:</p>
              <p>{formData.weather_conditions_over_fire || "-"}</p>
            </div>
            <div>
              <p className="font-medium">Temperature:</p>
              <p>{formData.temperature ? `${formData.temperature}°C` : "-"}</p>
            </div>
            <div>
              <p className="font-medium">Humidity:</p>
              <p>{formData.relative_humidity ? `${formData.relative_humidity}%` : "-"}</p>
            </div>
            <div>
              <p className="font-medium">Wind:</p>
              <p>
                {formData.wind_direction || "-"} {formData.wind_speed ? `at ${formData.wind_speed} km/h` : ""}
              </p>
            </div>
            <div>
              <p className="font-medium">Fuel Type:</p>
              <p>{formData.fuel_type || "-"}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {predictionResult && (
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
              <h3 className="text-xl font-semibold mb-3">Traditional Model Prediction</h3>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">Fire Size Prediction:</p>
                  <p className="text-lg font-bold">
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
              <p className="text-sm text-gray-500 mt-2">
                Predicted on: {new Date(createdAt).toLocaleString()}
              </p>
            </div>
          )}

          {camPredictionResult && (
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
              <h3 className="text-xl font-semibold mb-3">Satellite Image Analysis</h3>
              <div className="flex">
                <div className="w-5/6 mb-4 border-2 border-dashed border-gray-500 rounded-lg p-2">
                  <img
                    src={camPredictionResult.camImageUrl}
                    alt="Predicted Heatmap"
                    className="w-full h-full object-cover rounded-lg shadow-md"
                  />
                </div>

                <div className="w-1/6 flex justify-center ml-2">
                  <img 
                    src={camPredictionResult.colorScale.scaleImageUrl} 
                    alt="Color Scale" 
                    className="h-[200px] object-contain"
                  />
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-4">
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
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-red-600 h-2.5 rounded-full" 
                      style={{ width: `${camPredictionResult.wildfireConfidence}%` }}
                    ></div>
                  </div>
                  <p className="text-right text-sm">
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