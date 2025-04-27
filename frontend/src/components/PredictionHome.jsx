import React, { useState } from "react";
import axios from "axios";
import PredictionHistoryTable from "./PredictionHistoryTable";

const PredictionHomePage = () => {
  const [formData, setFormData] = useState({
    fire_location_latitude: "",
    fire_location_longitude: "",
    fire_start_date: "",
    fire_type: "",
    fire_position_on_slope: "",
    weather_conditions_over_fire: "",
    temperature: "",
    relative_humidity: "",
    wind_direction: "",
    wind_speed: "",
    fuel_type: "",
  });

  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    // For number fields, we parse, for text/date fields, we keep string
    if (["fire_location_latitude", "fire_location_longitude", "temperature", "relative_humidity", "wind_speed"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPredictionResult(null);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5001/api/prediction/predict-fire",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setPredictionResult(res.data.data.prediction);
    } catch (err) {
      setError("Prediction failed. Please check your input and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-start p-4 mt-[100px] shadow-xl">
      {/* Banner */}
      <div
        className="relative w-full h-[80vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: 'url("/images/predictHome.jpg")' }}
      >
        <div className="text-center max-w-3xl px-6 md:px-12 py-10 bg-white bg-opacity-60 shadow-lg rounded-lg z-10">
          <div className="text-4xl md:text-5xl font-bold font-serif text-black mb-6">
            Welcome to Wildfire Watch...
          </div>
          <p className="text-xl md:text-2xl text-gray-700 mb-6">
            Make your life easier and safe, and predict the harmful incidents
            and take necessary measures to avoid them with all precautions.
          </p>
          <div className="mt-6 border-b-4 border-black w-20 mx-auto"></div>
        </div>
      </div>

      {/* Section Separator */}
      <div className="bg-red-700 w-[1200px] mr-[60px] ml-[70px] mt-[50px] p-3 relative">
        <div className="absolute left-0 top-1/2 p-1 transform -translate-y-1/2 rounded-full w-[10px] h-[10px] ml-1 shadow-lg border-2 border-white"></div>
        <div className="absolute right-0 top-1/2 p-1 transform -translate-y-1/2 rounded-full w-[10px] h-[10px] mr-1 shadow-lg border-2 border-white"></div>
      </div>

      {/* Form and Prediction Output */}
      <div className="w-full mt-9 max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="flex justify-center items-center col-span-full">
          <p className="text-black text-4xl font-serif font-bold text-center">
            Predict & Protect
          </p>
        </div>

        {/* Form Section */}
        <div className="col-span-full lg:col-span-1">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
          >
            {/* All fields */}
            {[
              { label: "Fire Location Latitude", name: "fire_location_latitude", type: "number" },
              { label: "Fire Location Longitude", name: "fire_location_longitude", type: "number" },
              { label: "Fire Start Date", name: "fire_start_date", type: "date" },
              { label: "Fire Type", name: "fire_type", type: "text" },
              { label: "Fire Position on Slope", name: "fire_position_on_slope", type: "text" },
              { label: "Weather Conditions Over Fire", name: "weather_conditions_over_fire", type: "text" },
              { label: "Temperature (°C)", name: "temperature", type: "number" },
              { label: "Relative Humidity (%)", name: "relative_humidity", type: "number" },
              { label: "Wind Direction", name: "wind_direction", type: "text" },
              { label: "Wind Speed (km/h)", name: "wind_speed", type: "number" },
              { label: "Fuel Type", name: "fuel_type", type: "text" },
            ].map(({ label, name, type }) => (
              <div key={name} className="flex flex-col">
                <label className="font-semibold text-sm text-gray-700 mb-1">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  required
                  className="p-2 border border-gray-300 rounded"
                />
              </div>
            ))}

            {/* Submit Button */}
            <div className="col-span-full text-center mt-4">
              <button
                type="submit"
                className="w-[150px] bg-red-700 text-white py-2 hover:bg-white hover:border-b-4 hover:border-red-700 hover:text-black"
              >
                {loading ? "Predicting..." : "Predict Fire"}
              </button>
            </div>
          </form>
        </div>

        {/* Result Section */}
        <div className="flex flex-col items-center justify-center w-full mt-8 lg:mt-0 lg:ml-8">
          {predictionResult === null ? (
            <img
              src="/images/fire5.jpg"
              alt="Fire prediction illustration"
              className="max-w-full h-auto rounded-lg"
            />
          ) : (
            <>
              <div className="text-lg font-semibold font-serif mb-2 text-gray-700">
                Predicted Fire Weather Index (FWI)
              </div>
              <div
                className={`w-32 h-32 flex items-center justify-center rounded-full text-2xl font-bold 
            transition duration-300 
            ${
              predictionResult < 5
                ? "border-4 border-green-500 text-green-700 bg-green-100"
                : predictionResult <= 15
                ? "border-4 border-yellow-500 text-yellow-700 bg-yellow-100"
                : "border-4 border-red-500 text-red-700 bg-red-100"
            }`}
              >
                  {typeof predictionResult === "number" ? predictionResult.toFixed(4) : ""}
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 text-red-600 font-medium">{error}</div>
      )}

      {/* Bottom Divider */}
      <div className="bg-red-700 w-[1200px] mr-[60px] ml-[70px] mt-[50px] p-3 relative">
        <div className="absolute left-0 top-1/2 p-1 transform -translate-y-1/2 rounded-full w-[10px] h-[10px] ml-1 shadow-lg border-2 border-white"></div>
        <div className="absolute right-0 top-1/2 p-1 transform -translate-y-1/2 rounded-full w-[10px] h-[10px] mr-1 shadow-lg border-2 border-white"></div>
      </div>

      {/* Prediction History Table */}
      <div className="mt-6 w-full">
        <PredictionHistoryTable />
      </div>
    </div>
  );
};

export default PredictionHomePage;
