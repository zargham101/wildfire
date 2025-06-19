import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import PredictionHistoryTable from "./PredictionHistoryTable";
import MapWithMarkers from "./MapWithMarkers";
import FireResponseReport from "./FireResponseReport";
import ClimaChainSlider from "./ClimaChainSlider";
// import InfoOutlineIcon from "@mui/icons-material/InfoOutlined";
// import Tooltip from "@mui/material/Tooltip";
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

  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
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
  const [markerData, setMarkerData] = useState([]);

  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const mapContainer = useRef(null);

  // useEffect(() => {
  //   const initializeMap = () => {
  //     const newMap = new mapboxgl.Map({
  //       container: mapContainer.current,
  //       style: "mapbox://styles/mapbox/satellite-v9",
  //       center: [0, 0],
  //       zoom: 1,
  //     });

  //     newMap.on("load", () => {
  //       setMap(newMap);
  //     });

  //     newMap.on("click", (e) => {
  //       const location = {
  //         lng: e.lngLat.lng,
  //         lat: e.lngLat.lat,
  //       };
  //       setSelectedLocation(location);
  //       updateFormLocation(location);

  //       // Remove existing marker
  //       if (marker) marker.remove();

  //       // Add new marker
  //       const newMarker = new mapboxgl.Marker()
  //         .setLngLat([e.lngLat.lng, e.lngLat.lat])
  //         .addTo(newMap);
  //       setMarker(newMarker);
  //     });

  //     return () => newMap.remove();
  //   };

  //   if (!map) initializeMap();
  // }, []);

  const updateFormLocation = (location) => {
    setFormData((prev) => ({
      ...prev,
      fire_location_latitude: location.lat,
      fire_location_longitude: location.lng,
    }));
  };

  // const handleSearch = async (e) => {
  //   e.preventDefault();
  //   if (!searchQuery.trim()) return;

  //   try {
  //     const response = await axios.get(
  //       `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
  //         searchQuery
  //       )}.json`,
  //       {
  //         params: {
  //           access_token: mapboxgl.accessToken,
  //           limit: 1,
  //         },
  //       }
  //     );

  //     if (response.data.features.length > 0) {
  //       const [lng, lat] = response.data.features[0].center;
  //       const location = { lng, lat };
  //       map.flyTo({ center: [lng, lat], zoom: 12 });
  //       setSelectedLocation(location);
  //       updateFormLocation(location);

  //       if (marker) marker.remove();
  //       const newMarker = new mapboxgl.Marker()
  //         .setLngLat([lng, lat])
  //         .addTo(map);
  //       setMarker(newMarker);
  //     }
  //   } catch (err) {
  //     setError({
  //       ...error,
  //       message: "Location search failed. Please try again.",
  //     });
  //   }
  // };

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
        console.log("what is in data::", data);
        setMarkerData(data);
      } catch (error) {
        console.error("Failed to fetch marker data", error);
      }
    };

    fetchMarkerData();
  }, []);

  // const fireTypeOptions = ["Ground", "Surface", "Crown"];
  // const firePositionOptions = [
  //   "Bottom",
  //   "Flat",
  //   "Lower 1/3",
  //   "Middle 1/3",
  //   "Upper 1/3",
  // ];
  // const weatherOptions = [
  //   "CB dry",
  //   "CB wet",
  //   "Clear",
  //   "Cloudy",
  //   "Rain showers",
  // ];
  // const fuelTypeOptions = [
  //   "C-1 Spruce-Lichen Woodland",
  //   "C-2 Boreal Spruce",
  //   "C-3 Mature Jack or Lodgepole Pine",
  //   "C-4 Immature Jack or Lodgepole Pine",
  //   "S-1 Jack or Lodgepole Pine slash",
  //   "S-2 White Spruce-Balsam slash",
  //   "M-1 Boreal Mixedwood-Leafless",
  //   "M-2 Boreal Mixedwood-Green",
  //   "D-1 Leafless Aspen",
  //   "O-1a Matted Grass",
  //   "O-1b Standing Grass",
  // ];
  // const windDirectionOptions = [
  //   "SW",
  //   "S",
  //   "W",
  //   "E",
  //   "NW",
  //   "CLM",
  //   "N",
  //   "SE",
  //   "NE",
  // ];

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  // const handleCamPrediction = async () => {
  //   if (!selectedLocation) {
  //     setError({
  //       ...error,
  //       message: "Please select a location on the map first.",
  //     });
  //     return;
  //   }

  //   setCamLoading(true);
  //   setError({ message: "", field: "" });

  //   try {
  //     const staticImageUrl = `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${selectedLocation.lng},${selectedLocation.lat},15/600x600?access_token=${mapboxgl.accessToken}`;

  //     const imageResponse = await fetch(staticImageUrl);
  //     const imageBlob = await imageResponse.blob();

  //     const formData = new FormData();
  //     const imageFile = new File([imageBlob], "map-image.jpg", {
  //       type: "image/jpeg",
  //     });
  //     formData.append("image", imageFile);

  //     formData.append("lng", selectedLocation.lng);
  //     formData.append("lat", selectedLocation.lat);

  //     const token = localStorage.getItem("token");
  //     const response = await axios.post(
  //       "http://localhost:5001/api/prediction/predict/cam/result",
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     setCamPredictionResult(response.data.data);
  //   } catch (error) {
  //     const message =
  //       error.response?.data?.message ||
  //       error.message ||
  //       "Image prediction failed. Try again later.";
  //     setError({
  //       ...error,
  //       message,
  //     });
  //   } finally {
  //     setCamLoading(false);
  //   }
  // };

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
      const userId = res.data.data.userId;

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

  const handleSelectedArea = (points) => {
    console.log("Selected Points:", points);
  };

  const handleMarkerClick = (id) => {
    setSelectedMarkerId(id);
    console.log("Selected Marker ID:", id); // Debugging log to verify
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
        }
      );

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
        setFormData((prev) => ({
          ...prev,
          fire_location_latitude: parseFloat(selectedMarker.lat),
          fire_location_longitude: parseFloat(selectedMarker.lon),
          wind_speed: lastDataEntry?.ws || "", // Still store this if CombinedResults uses it
          relative_humidity: lastDataEntry?.rh || "", // Still store this if CombinedResults uses it
        }));

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
        setFormData((prev) => ({
          ...prev,
          fire_location_latitude: "",
          fire_location_longitude: "",
          wind_speed: "",
          relative_humidity: "",
        }));
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

        {(predictionResult !== null || camPredictionResult) && ( // Ensure it's not null, as 0 is a valid prediction
          <div className="w-full p-10 mt-8">
            <CombinedResults
              formData={formData} // This now has lat/lon/wind/humidity from the selected marker
              predictionResult={predictionResult}
              camPredictionResult={camPredictionResult}
              createdAt={createdAt}
            />
          </div>
        )}

        <div className="w-full  mt-6">
          <FireResponseReport
            fireSize={predictionResult} // Pass the numerical prediction
            predictionDate={createdAt} // Pass the timestamp from DB
            predictionId={predictionId} // Pass the DB _id
            latitude={formData.fire_location_latitude} // Pass the latitude from formData
            longitude={formData.fire_location_longitude} // Pass the longitude from formData
            userId={userId} // Pass the userId if available
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
