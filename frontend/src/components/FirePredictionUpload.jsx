import React, { useState,useEffect, useRef } from "react";
import axios from "axios";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiaGFzc25haW5haG1hZGNoZWVtYSIsImEiOiJjbWF3cTV1ZnUwYWI1MmxzZ3R1eTl0dmhkIn0.jwuQcSkkMNQtAwMJCPRl6w'

const WildfireCamPrediction = () => {
   const [searchQuery, setSearchQuery] = useState("");
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const mapContainer = useRef(null);

  // Initialize map
  useEffect(() => {
    const initializeMap = () => {
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-v9',
        center: [0, 0],
        zoom: 1
      });

      newMap.on('load', () => {
        setMap(newMap);
      });

      newMap.on('click', (e) => {
        setSelectedLocation({
          lng: e.lngLat.lng,
          lat: e.lngLat.lat
        });
        
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

  // Handle location search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json`,
        {
          params: {
            access_token: mapboxgl.accessToken,
            limit: 1
          }
        }
      );

      if (response.data.features.length > 0) {
        const [lng, lat] = response.data.features[0].center;
        map.flyTo({ center: [lng, lat], zoom: 12 });
        setSelectedLocation({ lng, lat });
        
        // Update marker
        if (marker) marker.remove();
        const newMarker = new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(map);
        setMarker(newMarker);
      }
    } catch (err) {
      setError("Location search failed. Please try again.");
    }
  };

  // Handle prediction submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLocation) {
      alert("Please select a location on the map.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const staticImageUrl = `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${selectedLocation.lng},${selectedLocation.lat},15/600x600?access_token=${mapboxgl.accessToken}`;
      
      const imageResponse = await fetch(staticImageUrl);
      const imageBlob = await imageResponse.blob();
      
      const formData = new FormData();
      const imageFile = new File([imageBlob], 'map-image.jpg', { type: 'image/jpeg' });
      formData.append('image', imageFile);
      
      formData.append('lng', selectedLocation.lng);
      formData.append('lat', selectedLocation.lat);

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

      setResult(response.data.data);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Prediction failed. Try again later.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div
      style={{
        backgroundImage: `url('/images/bgCam.jpg')`,
        backgroundRepeat: "repeat",
      }}
      className="w-full min-h-screen bg-gray-100 flex flex-col items-center p-6"
    >
      {/* Main Content */}
      <div className="w-full max-w-screen-xl flex flex-col lg:flex-row p-6 rounded-lg shadow-lg mt-[150px]">
        {/* Left Side: Map and Search */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:border-r-2 border-gray-300">
          <h2 className="text-2xl font-bold mb-4">
            Search Location to Predict Wildfire Risk
          </h2>
          
          {/* Location Search */}
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
          
          {/* Map Container */}
          <div 
            ref={mapContainer} 
            className="w-full h-96 mb-4 rounded-lg shadow-lg border-2 border-gray-300"
          />
          
          {/* Selected Location Info */}
          {selectedLocation && (
            <div className="w-full mb-4 p-3 bg-white rounded-lg shadow">
              <p className="font-semibold">Selected Location:</p>
              <p>Latitude: {selectedLocation.lat.toFixed(6)}</p>
              <p>Longitude: {selectedLocation.lng.toFixed(6)}</p>
            </div>
          )}
          
          <button
            onClick={handleSubmit}
            disabled={!selectedLocation || loading}
            className={`w-full py-3 rounded-md transition duration-200 ${
              selectedLocation 
                ? "bg-red-700 hover:bg-red-800 text-white" 
                : "bg-gray-400 cursor-not-allowed text-gray-700"
            }`}
          >
            {loading ? "Analyzing..." : "Analyze Wildfire Risk"}
          </button>
        </div>

        {/* Right Side: Result - Updated with color scale */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6">
          {error && (
            <div className="text-red-600 font-semibold mb-4">{error}</div>
          )}
          {result ? (
            <div className="w-full flex">
              {/* Result Image (80% width) */}
              <div className="w-5/6 mb-8 border-2 border-dashed border-gray-500 rounded-lg p-4">
                <img
                  src={result.camImageUrl}
                  alt="Predicted Heatmap"
                  className="w-full h-full object-cover rounded-lg shadow-md"
                />
              </div>

              {/* Color Scale (20% width) */}
              <div className="w-1/6 flex justify-center ml-4">
                <img 
                  src={result.colorScale.scaleImageUrl} 
                  alt="Color Scale" 
                  className="h-[400px] object-contain"
                />
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center">
              <div className="w-full mb-8 border-2 border-dashed border-gray-500 rounded-lg p-4 flex items-center justify-center">
                <span className="text-center font-bold font-serif text-black">
                  Output Result
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Prediction Details Card (unchanged) */}
      {result && (
        <div className="w-full max-w-screen-xl p-6 shadow-lg rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Prediction Details</h3>
          <div className="mb-4">
            <p className="font-semibold text-lg">Prediction:</p>
            <p
              className={`text-2xl font-bold mt-2 ${
                result.predictionResult === "Wildfire Detected"
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {result.predictionResult}
            </p>
          </div>

          <div className="mb-4">
            <p className="font-semibold text-lg">No Wildfire Confidence:</p>
            <div className="w-full bg-gray-200 rounded-full h-4 mt-1">
              <div
                className="bg-blue-500 h-4 rounded-full"
                style={{ width: `${result.noWildfireConfidence}%` }}
              ></div>
            </div>
            <p className="text-lg font-bold text-right mt-1">
              {result.noWildfireConfidence}%
            </p>
          </div>

          <div className="mb-4">
            <p className="font-semibold text-lg">Wildfire Confidence:</p>
            <div className="w-full bg-gray-200 rounded-full h-4 mt-1">
              <div
                className="bg-red-500 h-4 rounded-full"
                style={{ width: `${result.wildfireConfidence}%` }}
              ></div>
            </div>
            <p className="text-lg font-bold text-right mt-1">
              {result.wildfireConfidence}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WildfireCamPrediction;