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
            data: item.data, // Store the associated data
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

  useEffect(() => {
}, [createdAt]);
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

      const location = response.data.savedPrediction.fireData.location;
      const data = response.data.savedPrediction.fireData.data[0];
      const date = response.data.savedPrediction.createdAt;
      setTemp(data.tmax);
      setHumidity(data.rh);
      setWindSpeed(data.ws);
      setCreatedAt(date);
      const [lat, lon] = location.split(',');
      setLatitude(parseFloat(lat));
      setLongitude(parseFloat(lon));
      const numericalPrediction = response.data.response.prediction[0];
      setPredictionResult(numericalPrediction);
      const selectedMarker = markerData.find(
        (marker) => marker._id === selectedMarkerId
      );

      if (selectedMarker && selectedMarker.originalData) {
        const originalFireData = selectedMarker.originalData;
        const lastDataEntry =
          originalFireData.data[originalFireData.data.length - 1]; // Last data entry

        setPredictionId(originalFireData._id);
        setCreatedAt(originalFireData.createdAt);
        setUserID(originalFireData.userId || null);


        const severity = getFireSeverity(numericalPrediction); // Use the utility function for the alert banner
        setFireSeverity(severity);
      } else {
        console.warn(
          "Could not find original data for selected marker ID:",
          selectedMarkerId
        );
        setPredictionId(null);
        setCreatedAt("");
        setUserID(null);
        setFireSeverity("");
      }

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

        <div className="bg-red-600 w-full relative flex items-center justify-center py-4 shadow-lg">
          <p className="text-white text-2xl font-bold text-center select-none">
            Predict Wildfire
          </p>

          <div className="absolute left-4 w-4 h-4 rounded-full bg-white shadow-lg border-2 border-red-700 transition-transform hover:scale-125"></div>

          <div className="absolute right-4 w-4 h-4 rounded-full bg-white shadow-lg border-2 border-red-700 transition-transform hover:scale-125"></div>
        </div>

        <div className="w-full mt-9 max-w-6xl flex flex-col gap-8 z-0">
          <MapWithMarkers
            markerData={markerData}
            onMarkerClick={handleMarkerClick}
          // onAreaSelected={handleSelectedArea}
          />
          <button
            onClick={handlePredict}
            className="mt-4 w-full py-2 px-6 bg-red-500 text-white border-b-4 border-transparent hover:bg-white hover:text-black hover:border-red-500 transition-colors duration-300"
          >
            Predict
          </button>
        </div>

        {error.message && !error.field && (
          <div className="mt-4 text-red-600 font-medium">{error.message}</div>
        )}


        {(predictionResult !== null) && ( 
          <div className="w-full p-10 mt-8">
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
        )}
        <div className="w-full  mt-6">
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