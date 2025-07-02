import React from "react";

const CombinedResults = ({ 
  latitude,
  longitude, 
  temperature,
  humidity,
  windSpeed,
  predictionResult, 
  createdAt 
}) => {
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
              <p className="font-bold">📍 Location:</p>
              <p className="font-semibold font-serif">Lat: {latitude}</p>
              <p className="font-semibold font-serif">Lng: {longitude}</p>
            </div>    
            <div>
              <p className="font-semibold">🌡 Temperature:</p>
              <p>{temperature ? `${temperature}°C` : "-"}</p>
            </div>
            <div>
              <p className="font-semibold">💧 Humidity:</p>
              <p>{humidity ? `${humidity}%` : "-"}</p>
            </div>
            <div>
              <p className="font-semibold">💨 Wind Speed:</p>
              <p>
                {windSpeed || "-"} {windSpeed ? `at ${windSpeed} km/h` : ""}
              </p>
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

         
        </div>
      </div>
    </div>
  );
};

export default CombinedResults;
