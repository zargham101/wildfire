import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import PredictionHistoryTable from "./PredictionHistoryTable";
import FireResponseReport from "./FireResponseReport";
import ClimaChainSlider from "./ClimaChainSlider";
import InfoOutlineIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import CombinedResults from "./CombinedResults";
import { getFireSeverity } from "../condition/resourceCalculator";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaGFzc25haW5haG1hZGNoZWVtYSIsImEiOiJjbWF3cTV1ZnUwYWI1MmxzZ3R1eTl0dmhkIn0.jwuQcSkkMNQtAwMJCPRl6w";

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
  const [predictionId, setPredictionId] = useState(null);
  const [camPredictionResult, setCamPredictionResult] = useState(null);
  const [userId, setUserID] = useState(null);
  const [loading, setLoading] = useState(false);
  const [camLoading, setCamLoading] = useState(false);
  const [error, setError] = useState({ message: "", field: "" });
  const [showFireAlert, setShowFireAlert] = useState(false);
  const [fireSeverity, setFireSeverity] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const mapContainer = useRef(null);

  useEffect(() => {
    const initializeMap = () => {
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/satellite-v9",
        center: [0, 0],
        zoom: 1,
      });

      newMap.on("load", () => {
        setMap(newMap);
      });

      newMap.on("click", (e) => {
        const location = {
          lng: e.lngLat.lng,
          lat: e.lngLat.lat,
        };
        setSelectedLocation(location);
        updateFormLocation(location);

        // Remove existing marker
        if (marker) marker.remove();

        // Add new marker
        const newMarker = new mapboxgl.Marker()
          .setLngLat([e.lngLat.lng, e.lngLat.lat])
          .addTo(newMap);
        setMarker(newMarker);
      });

      return () => newMap.remove();
    };

    if (!map) initializeMap();
  }, []);

  const updateFormLocation = (location) => {
    setFormData((prev) => ({
      ...prev,
      fire_location_latitude: location.lat,
      fire_location_longitude: location.lng,
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchQuery
        )}.json`,
        {
          params: {
            access_token: mapboxgl.accessToken,
            limit: 1,
          },
        }
      );

      if (response.data.features.length > 0) {
        const [lng, lat] = response.data.features[0].center;
        const location = { lng, lat };
        map.flyTo({ center: [lng, lat], zoom: 12 });
        setSelectedLocation(location);
        updateFormLocation(location);

        if (marker) marker.remove();
        const newMarker = new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(map);
        setMarker(newMarker);
      }
    } catch (err) {
      setError({
        ...error,
        message: "Location search failed. Please try again.",
      });
    }
  };

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
  };

  const handleCamPrediction = async () => {
    if (!selectedLocation) {
      setError({
        ...error,
        message: "Please select a location on the map first.",
      });
      return;
    }

    setCamLoading(true);
    setError({ message: "", field: "" });

    try {
      const staticImageUrl = `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${selectedLocation.lng},${selectedLocation.lat},15/600x600?access_token=${mapboxgl.accessToken}`;

      const imageResponse = await fetch(staticImageUrl);
      const imageBlob = await imageResponse.blob();

      const formData = new FormData();
      const imageFile = new File([imageBlob], "map-image.jpg", {
        type: "image/jpeg",
      });
      formData.append("image", imageFile);

      formData.append("lng", selectedLocation.lng);
      formData.append("lat", selectedLocation.lat);

      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5001/api/prediction/predict/cam/result",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCamPredictionResult(response.data.data);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Image prediction failed. Try again later.";
      setError({
        ...error,
        message,
      });
    } finally {
      setCamLoading(false);
    }
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
      const numericPayload = {
        ...formData,
        fire_location_latitude: parseFloat(formData.fire_location_latitude),
        fire_location_longitude: parseFloat(formData.fire_location_longitude),
        temperature: parseFloat(formData.temperature),
        relative_humidity: parseFloat(formData.relative_humidity),
        wind_speed: parseFloat(formData.wind_speed),
      };

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
      const predictionId = res.data.data._id;
      const userId = res.data.data.userId 

      setPredictionId(predictionId);
      setUserID(userId);
      setPredictionResult(prediction);
      setCreatedAt(res.data.data.createdAt);

      const severity = getFireSeverity(prediction);
      setFireSeverity(severity);

      // Show fire alert for 5 seconds
      setShowFireAlert(true);
      setTimeout(() => setShowFireAlert(false), 5000);
    } catch (err) {
      setError({
        message: "Prediction failed. Please check your input and try again.",
        field: "",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColorClass = (severity) => {
    if (severity === "Very Small")
      return "bg-green-100 border-4 border-green-500";
    if (severity === "Small") return "bg-yellow-100 border-4 border-yellow-500";
    if (severity === "Moderate")
      return "bg-orange-100 border-4 border-orange-500";
    return "bg-red-100 border-4 border-red-600";
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
            className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center justify-center px-6 py-4 rounded-lg shadow-xl text-center transition-opacity duration-500 opacity-100 animate-fadeIn ${getSeverityColorClass(
              fireSeverity
            )}`}
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

        <div className="w-full mt-9 max-w-6xl flex flex-col lg:flex-row gap-8">
          {/* Left Column - Form */}
          <div className="w-full lg:w-1/2">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
            >
              <div className="flex flex-col">
                <label className="font-semibold text-sm text-red-600 mb-1 flex items-center">
                  Fire location Latitude
                  <Tooltip title="Latitude from selected map location" arrow>
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
                  required
                  readOnly
                  className="p-2 border-2 border-black rounded bg-gray-100"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold text-sm text-red-600 mb-1 flex items-center">
                  Fire Location Longitude
                  <Tooltip title="Longitude from selected map location" arrow>
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
                  required
                  readOnly
                  className="p-2 border-2 border-black rounded bg-gray-100"
                />
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
                    title="Temperature at fire location in Celsius"
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
                  required
                  className="p-2 border-2 border-black rounded"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold text-sm text-red-600 mb-1 flex items-center">
                  Relative Humidity (%)
                  <Tooltip title="Relative humidity percentage" arrow>
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
                  required
                  className="p-2 border-2 border-black rounded"
                />
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
                  <Tooltip title="Wind speed in kilometers per hour" arrow>
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
                  min="0"
                  required
                  className="p-2 border-2 border-black rounded"
                />
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

          {/* Right Column - Map */}
          <div className="w-full lg:w-1/2">
            <form onSubmit={handleSearch} className="w-full mb-4">
              <div className="flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a location..."
                  className="flex-grow p-2 border border-gray-300 rounded-l-md"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
                >
                  Search
                </button>
              </div>
            </form>

            <div
              ref={mapContainer}
              className="w-full h-[500px] mb-4 rounded-lg shadow-lg border-2 border-gray-300"
            />

            <button
              onClick={handleCamPrediction}
              disabled={!selectedLocation || camLoading}
              className={`w-full py-3 rounded-md transition duration-200 ${
                selectedLocation
                  ? "bg-green-700 hover:bg-green-800 text-white"
                  : "bg-gray-400 cursor-not-allowed text-gray-700"
              }`}
            >
              {camLoading
                ? "Processing Image..."
                : "Analyze Location with Satellite Image"}
            </button>
          </div>
        </div>

        {error.message && !error.field && (
          <div className="mt-4 text-red-600 font-medium">{error.message}</div>
        )}

        {(predictionResult || camPredictionResult) && (
          <div className="w-full mt-8">
            <CombinedResults
              formData={formData}
              predictionResult={predictionResult}
              camPredictionResult={camPredictionResult}
              createdAt={createdAt}
            />
          </div>
        )}

        <div className="w-full mt-6">
          <FireResponseReport
            fireSize={predictionResult}
            windSpeed={formData.wind_speed}
            humidity={formData.relative_humidity}
            predictionDate={createdAt}
            predictionId={predictionId}
            latitude={formData.fire_location_latitude} 
            longitude={formData.fire_location_longitude}
            userId={userId}
          />
        </div>

        <div className="mt-6 w-full">
          <PredictionHistoryTable />
        </div>
      </div>
    </div>
  );
};

export default PredictionHomePage;
