import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import PredictionHistoryTable from "./PredictionHistoryTable";
import MapWithMarkers from "./MapWithMarkers";
import FireResponseReport from "./FireResponseReport";
import ClimaChainSlider from "./ClimaChainSlider";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import CombinedResults from "./CombinedResults";
import { getFireSeverity } from "../condition/resourceCalculator";
import {
  MapPin,
  Target,
  Zap,
  Eye,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Thermometer,
  Wind,
  Droplets,
  Activity
} from "lucide-react";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaGFzc25haW5haG1hZGNoZWVtYSIsImEiOiJjbWF3cTV1ZnUwYWI1MmxzZ3R1eTl0dmhkIn0.jwuQcSkkMNQtAwMJCPRl6w";

const PredictionHomePage = () => {
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [predictionId, setPredictionId] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [temp, setTemp] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [windSpeed, setWindSpeed] = useState(null);
  const [userId, setUserID] = useState(null);
  const [loading, setLoading] = useState(false);
  const [camLoading, setCamLoading] = useState(false);
  const [error, setError] = useState({ message: "", field: "" });
  const [showFireAlert, setShowFireAlert] = useState(false);
  const [fireSeverity, setFireSeverity] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [markerData, setMarkerData] = useState([]);

  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const mapContainer = useRef(null);

  // Animation states for instruction cards
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const instructionTips = [
    {
      icon: MapPin,
      title: "Select Location",
      description: "Click on any red marker on the map to select a prediction location",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Target,
      title: "Analyze Data",
      description: "View real-time weather conditions and environmental factors",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Zap,
      title: "Get Prediction",
      description: "Click 'Predict' to get AI-powered wildfire risk assessment",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Eye,
      title: "Review Results",
      description: "Analyze prediction results and fire severity levels",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Monitor prediction accuracy and historical data trends",
      color: "from-red-500 to-red-600"
    }
  ];

  const quickStats = [
    {
      icon: Thermometer,
      label: "Temperature",
      value: temp ? `${temp}°C` : "--",
      color: "text-red-500"
    },
    {
      icon: Droplets,
      label: "Humidity",
      value: humidity ? `${humidity}%` : "--",
      color: "text-blue-500"
    },
    {
      icon: Wind,
      label: "Wind Speed",
      value: windSpeed ? `${windSpeed} km/h` : "--",
      color: "text-green-500"
    },
    {
      icon: Activity,
      label: "Risk Level",
      value: predictionResult ? getFireSeverity(predictionResult) : "--",
      color: "text-purple-500"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentTipIndex((prev) => (prev + 1) % instructionTips.length);
        setIsVisible(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchMarkerData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/prediction/fire-data"
        );

        const data = response.data.map((item) => {
          const [lat, lon] = item.location.split(",");
          return {
            _id: item._id,
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            data: item.data,
          };
        });
        setMarkerData(data);
      } catch (error) {
        console.error("Failed to fetch marker data", error);
      }
    };

    fetchMarkerData();
  }, []);

  const getSeverityColorClass = (severity) => {
    if (severity === "Very Small")
      return "bg-green-100 border-4 border-green-500";
    if (severity === "Small") return "bg-yellow-100 border-4 border-yellow-500";
    if (severity === "Moderate")
      return "bg-orange-100 border-4 border-orange-500";
    return "bg-red-100 border-4 border-red-600";
  };

  const handleSelectedArea = (points) => {
    console.log("Selected Points:", points);
  };

  const handleMarkerClick = (id) => {
    setSelectedMarkerId(id);
  };

  const handlePredict = async () => {
    if (!selectedMarkerId) {
      setError({
        message: "Please select a marker on the map first.",
        field: "",
      });
      return;
    }

    try {
      setLoading(true);
      setError({ message: "", field: "" });

      const response = await axios.get(
        `http://localhost:5001/api/prediction/fire-data-byId`,
        {
          params: { id: selectedMarkerId },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Prediction Response:", response.data.savedPrediction.userId);
      const location = response.data.savedPrediction.fireData.location;
      const data = response.data.savedPrediction.fireData.data[0];
      const dateFromAPI = response.data.savedPrediction.createdAt;
      setTemp(data.tmax);
      setHumidity(data.rh);
      setWindSpeed(data.ws);
      setCreatedAt(dateFromAPI);
      setPredictionId(response.data.savedPrediction._id);
      setUserID(response.data.savedPrediction.userId);

      const [lat, lon] = location.split(',');
      setLatitude(parseFloat(lat));
      setLongitude(parseFloat(lon));

      const numericalPrediction = response.data.response.prediction[0];
      setPredictionResult(numericalPrediction);

      const selectedMarker = markerData.find(
        (marker) => marker._id === selectedMarkerId
      );

      setFireSeverity(getFireSeverity(numericalPrediction));
      setShowFireAlert(true);
      setTimeout(() => setShowFireAlert(false), 5000);
    } catch (error) {
      setError({
        message: "Prediction failed. Please try again.",
        field: "",
      });
      console.error("Error fetching prediction:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const currentTip = instructionTips[currentTipIndex];
  const IconComponent = currentTip.icon;

  return (
    <div
      className="w-full min-h-screen relative"
      style={{
        backgroundImage: "url('images/texture.jpg')",
        backgroundRepeat: "repeat",
      }}
    >
      {/* Fire Alert - Highest z-index to appear above everything */}
      {showFireAlert && (
        <div
          className={`fixed top-24 left-1/2 transform -translate-x-1/2 flex flex-col items-center justify-center px-6 py-4 rounded-lg shadow-2xl text-center transition-all duration-500 opacity-100 animate-bounce ${getSeverityColorClass(
            fireSeverity
          )}`}
          style={{
            zIndex: 9999, // Highest z-index to appear above everything including map
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
          <p className="text-sm text-gray-700 mt-1">
            Estimated Fire Size: <span className="font-semibold">{predictionResult?.toFixed(2)} hectares</span>
          </p>
        </div>
      )}

      <div className="bg-white min-h-screen flex flex-col items-center justify-start shadow-xl relative" style={{ zIndex: 1 }}>
        {/* Header Slider */}
        <div className="w-full mt-[100px]">
          <ClimaChainSlider />
        </div>

        {/* Title Bar */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 w-full relative flex items-center justify-center py-6 shadow-lg">
          <div className="absolute left-0 w-full h-full bg-gradient-to-r from-red-600 via-red-500 to-red-600 opacity-20 animate-pulse"></div>
          <p className="text-white text-3xl font-bold text-center select-none relative z-10 tracking-wide">
            🔥 Wildfire Prediction System
          </p>

          <div className="absolute left-6 flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-white shadow-lg animate-pulse"></div>
            <div className="w-3 h-3 rounded-full bg-white shadow-lg animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="w-3 h-3 rounded-full bg-white shadow-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="absolute right-6 flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-white shadow-lg animate-pulse"></div>
            <div className="w-3 h-3 rounded-full bg-white shadow-lg animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="w-3 h-3 rounded-full bg-white shadow-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-8 p-6 mt-6">
          {/* Left Side - Map */}
          <div className="lg:w-2/3 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Interactive Prediction Map</h3>
                    <p className="text-sm text-gray-600">Select a location to analyze wildfire risk</p>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="h-96 rounded-xl overflow-hidden shadow-inner border border-gray-200 relative" style={{ zIndex: 10 }}>
                  <MapWithMarkers
                    markerData={markerData}
                    onMarkerClick={handleMarkerClick}
                  />
                </div>
              </div>
            </div>

            {/* Predict Button */}
            <button
              onClick={handlePredict}
              disabled={loading || !selectedMarkerId}
              className={`w-full py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${loading || !selectedMarkerId
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-xl'
                }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <Zap className="w-6 h-6" />
                  {selectedMarkerId ? 'Predict Wildfire Risk' : 'Select a Location First'}
                </div>
              )}
            </button>

            {error.message && !error.field && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span className="text-red-700 font-medium">{error.message}</span>
              </div>
            )}
          </div>

          {/* Right Side - Instructions & Stats */}
          <div className="lg:w-1/3 space-y-6">
            {/* Instructions Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <div className="p-1 bg-blue-500 rounded-lg">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  How to Use
                </h3>
              </div>

              <div className="p-6">
                <div
                  className={`transition-all duration-300 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                >
                  <div className={`bg-gradient-to-r ${currentTip.color} rounded-xl p-4 text-white mb-4`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <h4 className="font-semibold text-lg">{currentTip.title}</h4>
                    </div>
                    <p className="text-white/90 leading-relaxed">{currentTip.description}</p>
                  </div>
                </div>

                {/* Progress Indicators */}
                <div className="flex justify-center gap-2 mt-4">
                  {instructionTips.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentTipIndex ? 'bg-blue-500 w-6' : 'bg-gray-300'
                        }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <div className="p-1 bg-green-500 rounded-lg">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  Live Data
                </h3>
              </div>

              <div className="p-6 space-y-4">
                {quickStats.map((stat, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-white shadow-sm ${stat.color}`}>
                        <stat.icon className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-gray-700">{stat.label}</span>
                    </div>
                    <span className={`font-bold ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <div className="p-1 bg-purple-500 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  System Status
                </h3>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Map Data</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-600 font-medium">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Weather API</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-600 font-medium">Connected</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">AI Model</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-600 font-medium">Ready</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Markers Loaded</span>
                  <span className="text-blue-600 font-medium">{markerData.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {(predictionResult !== null) && (
          <div className="w-full max-w-7xl p-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  Prediction Results
                </h3>
              </div>
              <div className="p-6">
                <CombinedResults
                  latitude={latitude}
                  longitude={longitude}
                  temperature={temp}
                  humidity={humidity}
                  windSpeed={windSpeed}
                  predictionResult={predictionResult}
                  createdAt={createdAt}
                />
              </div>
            </div>
          </div>
        )}

        {/* Fire Response Report */}
        <div className="w-full max-w-7xl p-6">
          <FireResponseReport
            fireSize={predictionResult}
            predictionDate={createdAt}
            predictionId={predictionId}
            latitude={latitude}
            longitude={longitude}
            userId={userId}
          />
        </div>
      </div>
    </div>
  );
};

export default PredictionHomePage;