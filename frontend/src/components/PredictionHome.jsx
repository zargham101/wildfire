import React, { useState } from "react";
import axios from "axios";

const PredictionHomePage = () => {
  const [formData, setFormData] = useState({
    "Temp.": "",
    RH: "",
    "Wind Dir.": "",
    "Adj. Wind Speed": "",
    "24hr. Rain": "",
    FFMC: "",
    DMC: "",
    DC: "",
    ISI: "",
  });

  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPredictionResult(null);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5001/api/prediction/predict-fwi",
        formData
      );
      setPredictionResult(res.data.fwi);
    } catch (err) {
      setError("Prediction failed. Please check your input and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border-2 border-black min-h-screen flex flex-col items-center justify-start p-4 mt-[100px] shadow-xl">
      <div className="relative w-full max-w-4xl mb-8">
        <img
          src="/images/predictHome.jpg"
          alt="hero"
          className="w-full h-64 object-cover opacity-50 rounded"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 rounded"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl font-bold font-serif p-5 text-center animate-typewriter">
          Welcome to Wildfire Watch... Make your life easier and safe, and
          predict the harmful incidents and take necessary measures to avoid
          them with all precautions.
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-4xl"
      >
        {Object.keys(formData).map((key) => (
          <div key={key} className="flex flex-col">
            <label className="font-semibold text-sm text-gray-700 mb-1">
              {key}
            </label>
            <input
              type="number"
              step="any"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded"
            />
          </div>
        ))}
        <div className="col-span-full text-center mt-4">
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition duration-300"
          >
            {loading ? "Predicting..." : "Predict FWI"}
          </button>
        </div>
      </form>

      {predictionResult !== null && (
        <div className="mt-8 flex flex-col items-center">
          <div className="text-lg font-semibold font-serif mb-2 text-gray-700">
            Predicted Fire Weather Index (FWI)
          </div>
          <div
            className={`
            w-32 h-32 flex items-center justify-center rounded-full text-2xl font-bold 
            transition duration-300 
            ${
              predictionResult < 5
                ? "border-4 border-green-500 text-green-700 bg-green-100"
                : predictionResult <= 15
                ? "border-4 border-yellow-500 text-yellow-700 bg-yellow-100"
                : "border-4 border-red-500 text-red-700 bg-red-100"
            }
          `}
          >
            {predictionResult.toFixed(4)}
          </div>
        </div>
      )}

      {error && <div className="mt-4 text-red-600 font-medium">{error}</div>}
    </div>
  );
};

export default PredictionHomePage;
