import React from "react";

const WildfirePredictionResult = ({ predictionData }) => {
  if (!predictionData) return null;

  const {
    predictionResult,
    noWildfireConfidence,
    wildfireConfidence,
    camImageUrl,
  } = predictionData;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-12 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-6 font-serif">
        Wildfire Prediction Result
      </h2>

      {/* Prediction Summary */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
        <div className="flex-1 text-center">
          <h3 className="text-xl font-semibold text-gray-700">Prediction</h3>
          <p className={`text-2xl font-bold mt-2 ${predictionResult === "Severe Fire" ? "text-red-600" : "text-green-600"}`}>
            {predictionResult}
          </p>
        </div>

        <div className="flex-1">
          <div className="mb-4">
            <p className="text-gray-600 font-medium">No Wildfire Confidence:</p>
            <div className="w-full bg-gray-200 rounded-full h-4 mt-1">
              <div
                className="bg-blue-500 h-4 rounded-full"
                style={{ width: `${noWildfireConfidence}%` }}
              ></div>
            </div>
            <p className="text-sm text-right mt-1">{noWildfireConfidence}%</p>
          </div>

          <div>
            <p className="text-gray-600 font-medium">Wildfire Confidence:</p>
            <div className="w-full bg-gray-200 rounded-full h-4 mt-1">
              <div
                className="bg-red-500 h-4 rounded-full"
                style={{ width: `${wildfireConfidence}%` }}
              ></div>
            </div>
            <p className="text-sm text-right mt-1">{wildfireConfidence}%</p>
          </div>
        </div>
      </div>

      {/* CAM Image */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 text-center mb-4">Fire Risk Heatmap</h3>
        <div className="flex justify-center">
          <img
            src={camImageUrl}
            alt="Heatmap indicating fire risk areas"
            className="rounded-xl shadow-md w-full max-w-md object-contain"
          />
        </div>

        {/* Color scale guide */}
        <div className="flex justify-center mt-6 space-x-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
            <span>Low Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 rounded-full"></div>
            <span>Medium Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-500 rounded-full"></div>
            <span>High Risk</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WildfirePredictionResult;
