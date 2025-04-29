import React, { useState } from "react";
import axios from "axios";
import PredictionHistoryTable from "./PredictionHistoryTable";
import FireResponseReport from "./FireResponseReport";
import ClimaChainSlider from "./ClimaChainSlider";

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

  const [showFireAlert, setShowFireAlert] = useState(false);
  const [fireSeverity, setFireSeverity] = useState("");

  const fireTypeOptions = ["Ground", "Surface", "Crown"];
  const firePositionOptions = [
    "Bottom",
    "Flat",
    "Lower 1/3",
    "Middle 1/3",
    "Upper 1/3",
  ];
  const weatherOptions = [
    "CB dry",
    "CB wet",
    "Clear 30",
    "Cloudy",
    "Rain showers",
  ];
  const fuelTypeOptions = [
    "C-1 Spruce-Lichen Woodland",
    "C-2 Boreal Spruce",
    "C-3 Mature Jack or Lodgepole Pine",
    "C-4 Immature Jack or Lodgepole Pine",
    "S-1 Jack or Lodgepole Pine slash",
    "S-2 White Spruce-Balsam slash",
    "M-1 Boreal Mixedwood-Leafless",
    "M-2 Boreal Mixedwood-Green",
    "D-1 Leafless Aspen",
    "O-1a Matted Grass",
    "O-1b Standing Grass",
  ];
  const windDirectionOptions = [
    "SW",
    "S",
    "W",
    "E",
    "NW",
    "CLM",
    "N",
    "SE",
    "NE",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      [
        "fire_location_latitude",
        "fire_location_longitude",
        "temperature",
        "relative_humidity",
        "wind_speed",
      ].includes(name)
    ) {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  function getFireSeverity(fireSize) {
    if (fireSize <= 1) return "Very Small";
    if (fireSize <= 10) return "Small";
    if (fireSize <= 100) return "Moderate";
    if (fireSize <= 500) return "Large";
    return "Very Large";
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
      const prediction = res.data.data.prediction;
      setPredictionResult(prediction);

      const severity = getFireSeverity(prediction);
      setFireSeverity(severity);
      setShowFireAlert(true);

      setTimeout(() => setShowFireAlert(false), 5000);

      setFormData({
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
    } catch (err) {
      setError("Prediction failed. Please check your input and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full"
      style={{
        backgroundImage: `url('images/texture.jpg')`,
        backgroundRepeat: "repeat",
      }}
    >
      <div className="bg-white min-h-screen flex flex-col items-center justify-start  mt-20 shadow-xl">
        {showFireAlert && (
          <div
            className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-md font-semibold text-lg shadow-xl
      ${
        fireSeverity === "Very Small"
          ? "bg-green-100 text-green-700"
          : fireSeverity === "Small"
          ? "bg-yellow-100 text-yellow-700"
          : fireSeverity === "Moderate"
          ? "bg-orange-100 text-orange-700"
          : "bg-red-100 text-red-700"
      }
    `}
          >
            Fire Alert: {fireSeverity} Fire Detected!
          </div>
        )}
        <div className="w-full">
          <ClimaChainSlider />
        </div>

        <div className="bg-red-700 w-[1200px] mr-[60px] ml-[70px] mt-[50px] p-3 relative">
          <div className="absolute left-0 top-1/2 p-1 transform -translate-y-1/2 rounded-full w-[10px] h-[10px] ml-1 shadow-lg border-2 border-white"></div>
          <div className="absolute right-0 top-1/2 p-1 transform -translate-y-1/2 rounded-full w-[10px] h-[10px] mr-1 shadow-lg border-2 border-white"></div>
        </div>

        <div className="w-full mt-9 max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="flex justify-center items-center col-span-full">
            <p className="text-black text-4xl font-serif font-bold text-center">
              Predict & Protect
            </p>
          </div>

          <div className="col-span-full lg:col-span-1">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
            >
              <div className="flex flex-col">
                <label className="font-semibold text-sm text-gray-700 mb-1">
                  Fire Location Latitude
                </label>
                <input
                  type="number"
                  name="fire_location_latitude"
                  value={formData.fire_location_latitude}
                  onChange={handleChange}
                  required
                  className="p-2 border border-gray-300 rounded"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold text-sm text-gray-700 mb-1">
                  Fire Location Longitude
                </label>
                <input
                  type="number"
                  name="fire_location_longitude"
                  value={formData.fire_location_longitude}
                  onChange={handleChange}
                  required
                  className="p-2 border border-gray-300 rounded"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold text-sm text-gray-700 mb-1">
                  Fire Start Date
                </label>
                <input
                  type="date"
                  name="fire_start_date"
                  value={formData.fire_start_date}
                  onChange={handleChange}
                  required
                  className="p-2 border border-gray-300 rounded"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold text-sm text-gray-700 mb-1">
                  Fire Type
                </label>
                <select
                  name="fire_type"
                  value={formData.fire_type}
                  onChange={handleChange}
                  required
                  className="p-2 border border-gray-300 rounded"
                >
                  <option value="">Select Fire Type</option>
                  {fireTypeOptions.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="font-semibold text-sm text-gray-700 mb-1">
                  Fire Position on Slope
                </label>
                <select
                  name="fire_position_on_slope"
                  value={formData.fire_position_on_slope}
                  onChange={handleChange}
                  required
                  className="p-2 border border-gray-300 rounded"
                >
                  <option value="">Select Position</option>
                  {firePositionOptions.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="font-semibold text-sm text-gray-700 mb-1">
                  Weather Conditions Over Fire
                </label>
                <select
                  name="weather_conditions_over_fire"
                  value={formData.weather_conditions_over_fire}
                  onChange={handleChange}
                  required
                  className="p-2 border border-gray-300 rounded"
                >
                  <option value="">Select Weather</option>
                  {weatherOptions.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="font-semibold text-sm text-gray-700 mb-1">
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  required
                  className="p-2 border border-gray-300 rounded"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold text-sm text-gray-700 mb-1">
                  Relative Humidity (%)
                </label>
                <input
                  type="number"
                  name="relative_humidity"
                  value={formData.relative_humidity}
                  onChange={handleChange}
                  required
                  className="p-2 border border-gray-300 rounded"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold text-sm text-gray-700 mb-1">
                  Wind Direction
                </label>
                <select
                  name="wind_direction"
                  value={formData.wind_direction}
                  onChange={handleChange}
                  required
                  className="p-2 border border-gray-300 rounded"
                >
                  <option value="">Select Wind Direction</option>
                  {windDirectionOptions.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="font-semibold text-sm text-gray-700 mb-1">
                  Wind Speed (km/h)
                </label>
                <input
                  type="number"
                  name="wind_speed"
                  value={formData.wind_speed}
                  onChange={handleChange}
                  required
                  className="p-2 border border-gray-300 rounded"
                />
              </div>

              <div className="flex flex-col col-span-full">
                <label className="font-semibold text-sm text-gray-700 mb-1">
                  Fuel Type
                </label>
                <select
                  name="fuel_type"
                  value={formData.fuel_type}
                  onChange={handleChange}
                  required
                  className="p-2 border border-gray-300 rounded"
                >
                  <option value="">Select Fuel Type</option>
                  {fuelTypeOptions.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

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
                  WildFire Size
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
                  {typeof predictionResult === "number"
                    ? predictionResult.toFixed(4)
                    : ""}
                </div>
              </>
            )}
          </div>
        </div>

        {error && <div className="mt-4 text-red-600 font-medium">{error}</div>}

        <div className="mt-6 w-full">
          <PredictionHistoryTable />
        </div>

        {predictionResult !== null && (
          <FireResponseReport
            fireSize={predictionResult}
            windSpeed={formData.wind_speed}
            humidity={formData.relative_humidity}
          />
        )}
      </div>
    </div>
  );
};

export default PredictionHomePage;
