import React, { useState } from "react";
import axios from "axios";
import PredictionHistoryTable from "./PredictionHistoryTable";
import FireResponseReport from "./FireResponseReport";
import ClimaChainSlider from "./ClimaChainSlider";
import InfoOutlineIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";
import { inputValidationRules } from "../condition/resourceCalculator";

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
    createdAt: "",
  });

  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ message: "", field: "" });
  const [showFireAlert, setShowFireAlert] = useState(false);
  const [fireSeverity, setFireSeverity] = useState("");
  const [createdAt, setCreatedAt] = useState("");

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
    "Clear",
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
  
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  
    if (inputValidationRules[name]) {
      const { min, max } = inputValidationRules[name];
  
      const parsed = parseFloat(value);
  
      if (value !== "" && (isNaN(parsed) || parsed < min || parsed > max)) {
        setError({
          field: name,
          message: `Value must be between ${min} and ${max}`,
        });
      } else {
        setError({ field: "", message: "" });
      }
    }
  };
  
  
  

  function getFireSeverity(fireSize, temp, wind, humidity) {
    if (temp > 42 && wind > 70 && humidity < 15) {
      return "Very Large";
    } else if (fireSize < 1) {
      return "Small";
    } else if (fireSize < 2) {
      return "Moderate";
    } else if (fireSize < 5) {
      return "Large";
    } else {
      return "Very Large";
    }
  }
  const numericPayload = {
    ...formData,
    fire_location_latitude: parseFloat(formData.fire_location_latitude),
    fire_location_longitude: parseFloat(formData.fire_location_longitude),
    temperature: parseFloat(formData.temperature),
    relative_humidity: parseFloat(formData.relative_humidity),
    wind_speed: parseFloat(formData.wind_speed),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.wind_speed < 0) {
      setError({
        message: "Wind speed cannot be negative",
        field: "wind_speed",
      });
      return;
    }

    setLoading(true);
    setError({ message: "", field: "" });

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5001/api/prediction/predict-fire",
        numericPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const prediction = res.data.data.prediction;
      setPredictionResult(prediction);
      setCreatedAt(res.data.data.createdAt);

      const severity = getFireSeverity(
        prediction,
        formData.temperature,
        formData.wind_speed,
        formData.relative_humidity
      );

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
      setError({
        message: "Prediction failed. Please check your input and try again.",
        field: "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full"
      style={{
        backgroundImage: "url('images/texture.jpg')",
        backgroundRepeat: "repeat",
      }}
    >
      <div className="bg-white min-h-screen flex flex-col items-center justify-start p-4 mt-[100px] shadow-xl">
        {showFireAlert && (
          <div
            className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center justify-center px-6 py-4 rounded-lg shadow-xl text-center transition-opacity duration-500 opacity-100 animate-fadeIn
      ${
        fireSeverity === "Very Small"
          ? "bg-green-100 border-4 border-green-500"
          : fireSeverity === "Small"
          ? "bg-yellow-100 border-4 border-yellow-500"
          : fireSeverity === "Moderate"
          ? "bg-orange-100 border-4 border-orange-500"
          : "bg-red-100 border-4 border-red-600"
      }
    `}
            style={{
              width:
                fireSeverity === "Very Small"
                  ? "220px"
                  : fireSeverity === "Small"
                  ? "260px"
                  : fireSeverity === "Moderate"
                  ? "300px"
                  : "340px",
            }}
          >
            <img
              src="/images/fireAlert.gif"
              alt="Fire Alert Animation"
              className="rounded-md mb-3"
              style={{
                width:
                  fireSeverity === "Very Small"
                    ? "80px"
                    : fireSeverity === "Small"
                    ? "120px"
                    : fireSeverity === "Moderate"
                    ? "160px"
                    : "200px",
                height: "auto",
              }}
            />
            <p className="text-xl font-bold text-gray-800">
              Fire Alert: {fireSeverity} Fire Detected!
            </p>
          </div>
        )}

        <div className="w-full">
          <ClimaChainSlider />
        </div>

        <div className="bg-red-700 w-[1200px] mr-[60px] ml-[70px] mt-[50px] p-3 relative">
          <p className="text-white text-4xl font-bold text-center">
            Predict Wildfire
          </p>
          <div className="absolute left-0 top-1/2 p-1 transform -translate-y-1/2 rounded-full w-[10px] h-[10px] ml-1 shadow-lg border-2 border-white"></div>
          <div className="absolute right-0 top-1/2 p-1 transform -translate-y-1/2 rounded-full w-[10px] h-[10px] mr-1 shadow-lg border-2 border-white"></div>
        </div>

        <div className="w-full mt-9 max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="flex justify-center items-center col-span-full"></div>

          <div className="col-span-full lg:col-span-1">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
            >
              <div className="flex flex-col">
                <label className="font-semibold text-sm text-red-600 mb-1 flex items-center">
                  Fire location Latitude
                  <Tooltip
                    title={inputValidationRules.fire_location_latitude.tooltip}
                    arrow
                  >
                    <span className="ml-1 cursor-pointer">
                      <InfoOutlineIcon fontSize="small" />
                    </span>
                  </Tooltip>
                </label>
                <input
                  type="number"
                  step="any"
                  name="fire_location_latitude"
                  value={formData.fire_location_latitude}
                  onChange={handleChange}
                  min={inputValidationRules.fire_location_latitude.min}
                  max={inputValidationRules.fire_location_latitude.max}
                  required
                  className="p-2 border-2 border-black rounded"
                />
                {error.field === "fire_location_latitude" && (
                  <p className="text-red-500 text-xs mt-1">{error.message}</p>
                )}
              </div>

              <div className="flex flex-col">
                <label className="font-semibold text-sm text-red-600 mb-1 flex items-center">
                  Fire Location Longitude
                  <Tooltip
                    title={inputValidationRules.fire_location_longitude.tooltip}
                    arrow
                  >
                    <span className="ml-1 cursor-pointer">
                      <InfoOutlineIcon fontSize="small" />
                    </span>
                  </Tooltip>
                </label>
                <input
                  type="number"
                  step="any"
                  name="fire_location_longitude"
                  value={formData.fire_location_longitude}
                  onChange={handleChange}
                  min={inputValidationRules.fire_location_longitude.min}
                  max={inputValidationRules.fire_location_longitude.max}
                  required
                  className="p-2 border-2 border-black rounded"
                />
                {error.field === "fire_location_longitude" && (
                  <p className="text-red-500 text-xs mt-1">{error.message}</p>
                )}
              </div>

              <div className="flex flex-col">
                <label className="font-semibold text-sm text-red-600 mb-1 flex items-center">
                  Fire Start Date
                  <Tooltip title="Select the date when the fire started." arrow>
                    <span className="ml-1 cursor-pointer">
                      <InfoOutlineIcon fontSize="small" />
                    </span>
                  </Tooltip>
                </label>
                <input
                  type="date"
                  name="fire_start_date"
                  value={formData.fire_start_date}
                  onChange={handleChange}
                  required
                  className="p-2 border-2 border-black rounded"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold text-sm text-red-600 mb-1 flex items-center">
                  Fire Type
                  <Tooltip
                    title="Specify the type of fire: ground, surface, or crown."
                    arrow
                  >
                    <span className="ml-1 cursor-pointer">
                      <InfoOutlineIcon fontSize="small" />
                    </span>
                  </Tooltip>
                </label>
                <select
                  name="fire_type"
                  value={formData.fire_type}
                  onChange={handleChange}
                  required
                  className="p-2 border-2 border-black"
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
                <label className="font-semibold text-sm text-red-600 mb-1 flex items-center">
                  Fire Position on Slope
                  <Tooltip
                    title="Choose the fire's position relative to the slope."
                    arrow
                  >
                    <span className="ml-1 cursor-pointer">
                      <InfoOutlineIcon fontSize="small" />
                    </span>
                  </Tooltip>
                </label>
                <select
                  name="fire_position_on_slope"
                  value={formData.fire_position_on_slope}
                  onChange={handleChange}
                  required
                  className="p-2 border-2 border-black rounded"
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
                <label className="font-semibold text-sm text-red-600 mb-1 flex items-center">
                  Weather Conditions Over Fire
                  <Tooltip
                    title="Describe the weather conditions over the fire area."
                    arrow
                  >
                    <span className="ml-1 cursor-pointer">
                      <InfoOutlineIcon fontSize="small" />
                    </span>
                  </Tooltip>
                </label>
                <select
                  name="weather_conditions_over_fire"
                  value={formData.weather_conditions_over_fire}
                  onChange={handleChange}
                  required
                  className="p-2 border-2 border-black rounded"
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
                <label className="font-semibold text-sm text-red-600 mb-1 flex items-center">
                  Temperature (°C)
                  <Tooltip
                    title={inputValidationRules.temperature.tooltip}
                    arrow
                  >
                    <span className="ml-1 cursor-pointer">
                      <InfoOutlineIcon fontSize="small" />
                    </span>
                  </Tooltip>
                </label>
                <input
                  type="number"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  min={inputValidationRules.temperature.min}
                  max={inputValidationRules.temperature.max}
                  required
                  className="p-2 border-2 border-black rounded"
                />
                {error.field === "temperature" && (
                  <p className="text-red-500 text-xs mt-1">{error.message}</p>
                )}
              </div>

              <div className="flex flex-col">
                <label className="font-semibold text-sm text-red-600 mb-1 flex items-center">
                  Relative Humidity (%)
                  <Tooltip
                    title={inputValidationRules.relative_humidity.tooltip}
                    arrow
                  >
                    <span className="ml-1 cursor-pointer">
                      <InfoOutlineIcon fontSize="small" />
                    </span>
                  </Tooltip>
                </label>
                <input
                  type="number"
                  name="relative_humidity"
                  value={formData.relative_humidity}
                  onChange={handleChange}
                  min={inputValidationRules.relative_humidity.min}
                  max={inputValidationRules.relative_humidity.max}
                  required
                  className="p-2 border-2 border-black rounded"
                />
                {error.field === "relative_humidity" && (
                  <p className="text-red-500 text-xs mt-1">{error.message}</p>
                )}
              </div>

              <div className="flex flex-col">
                <label className="font-semibold text-sm text-red-600 mb-1 flex items-center">
                  Wind Direction
                  <Tooltip
                    title="Specify the wind direction at the fire location (e.g., NE, SW)"
                    arrow
                  >
                    <span className="ml-1 cursor-pointer">
                      <InfoOutlineIcon fontSize="small" />
                    </span>
                  </Tooltip>
                </label>
                <select
                  name="wind_direction"
                  value={formData.wind_direction}
                  onChange={handleChange}
                  required
                  className="p-2 border-2 border-black rounded"
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
                <label className="font-semibold text-sm text-red-600 mb-1 flex items-center">
                  Wind Speed (km/h)
                  <Tooltip
                    title={inputValidationRules.wind_speed.tooltip}
                    arrow
                  >
                    <span className="ml-1 cursor-pointer">
                      <InfoOutlineIcon fontSize="small" />
                    </span>
                  </Tooltip>
                </label>
                <input
                  type="number"
                  name="wind_speed"
                  value={formData.wind_speed}
                  onChange={handleChange}
                  min={inputValidationRules.wind_speed.min}
                  max={inputValidationRules.wind_speed.max}
                  required
                  className="p-2 border-2 border-black rounded"
                />
                {error.field === "wind_speed" && (
                  <p className="text-red-500 text-xs mt-1">{error.message}</p>
                )}
              </div>

              <div className="flex flex-col col-span-full">
                <label className="font-semibold text-sm text-red-600 mb-1 flex items-center">
                  Fuel Type
                  <Tooltip
                    title="Select the vegetation or material type fueling the fire."
                    arrow
                  >
                    <span className="ml-1 cursor-pointer">
                      <InfoOutlineIcon fontSize="small" />
                    </span>
                  </Tooltip>
                </label>
                <select
                  name="fuel_type"
                  value={formData.fuel_type}
                  onChange={handleChange}
                  required
                  className="p-2 border-2 border-black rounded"
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
                  className="w-[150px] bg-red-700 text-white py-2 hover:bg-white hover:border-4 hover:border-red-700 hover:text-black"
                >
                  {loading ? "Predicting..." : "Predict Fire"}
                </button>
              </div>
            </form>
          </div>

          <div className="flex flex-col items-center justify-center w-full mt-8 lg:mt-0 lg:ml-8">
            {loading ? (
              <div className="w-44 h-44 flex items-center justify-center rounded-full bg-gray-300 animate-drawCircle"></div>
            ) : predictionResult === null ? (
              <img
                src="/images/fire5.jpg"
                alt="Fire prediction illustration"
                className="max-w-full h-auto rounded-lg"
              />
            ) : (
              <div className="text-lg font-semibold font-serif mb-2 text-gray-700">
                WildFire Size
              </div>
            )}
            {predictionResult !== null && !loading && (
              <div
                className={`w-44 h-44 flex items-center justify-center rounded-full text-2xl font-bold
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
            )}
          </div>
        </div>

        {error.message && !error.field && (
          <div className="mt-4 text-red-600 font-medium">{error.message}</div>
        )}

        {predictionResult !== null && (
          <div className="w-full">
            <FireResponseReport
              fireSize={predictionResult}
              windSpeed={formData.wind_speed}
              humidity={formData.relative_humidity}
              predictionDate={createdAt}
            />
          </div>
        )}

        <div className="mt-6 w-full">
          <PredictionHistoryTable />
        </div>
      </div>
    </div>
  );
};

export default PredictionHomePage;
