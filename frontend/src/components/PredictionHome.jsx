import React, { useEffect, useState } from "react";

const PredictionHomePage = () => {
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setPrediction("The wildfire risk is high in your area for the next 24 hours.");
    }, 2000);
  }, []);

  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-6xl text-white mb-4">Prediction Dashboard</h1>
      {prediction ? (
        <p className="text-xl text-white">
          {prediction}
        </p>
      ) : (
        <p className="text-xl text-gray-500">Loading prediction data...</p>
      )}
    </div>
  );
};

export default PredictionHomePage;
