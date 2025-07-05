import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  MapPin,
  Search,
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
  Activity,
  Satellite,
  Shield,
  BarChart3,
  Navigation,
  Crosshair,
  Loader,
  ChevronDown,
  Play,
  Info,
  Globe
} from "lucide-react";

mapboxgl.accessToken = 'pk.eyJ1IjoiaGFzc25haW5haG1hZGNoZWVtYSIsImEiOiJjbWF3cTV1ZnUwYWI1MmxzZ3R1eTl0dmhkIn0.jwuQcSkkMNQtAwMJCPRl6w'

const WildfireCamPrediction = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showHero, setShowHero] = useState(true);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [weatherData, setWeatherData] = useState(null);
  const [recentLocations, setRecentLocations] = useState([]);
  const mapContainer = useRef(null);
  const heroRef = useRef(null);

  // Hero statistics
  const heroStats = [
    { label: "Predictions Made", value: "10,000+", icon: BarChart3 },
    { label: "Accuracy Rate", value: "94.5%", icon: Target },
    { label: "Areas Monitored", value: "500+", icon: Globe },
    { label: "Response Time", value: "<30s", icon: Clock }
  ];

  const instructionTips = [
    {
      icon: Search,
      title: "Search Location",
      description: "Use the search bar to find any location worldwide or click directly on the map",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Satellite,
      title: "Satellite Analysis",
      description: "Our AI analyzes high-resolution satellite imagery for wildfire risk assessment",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Zap,
      title: "Instant Prediction",
      description: "Get real-time wildfire risk analysis powered by advanced machine learning",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Shield,
      title: "Risk Assessment",
      description: "View detailed confidence levels and risk factors for informed decision making",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: TrendingUp,
      title: "Visual Results",
      description: "Analyze heat maps and color-coded risk zones with professional visualization",
      color: "from-red-500 to-red-600"
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

  // Initialize map
  useEffect(() => {
    const initializeMap = () => {
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-v9',
        center: [0, 0],
        zoom: 2
      });

      newMap.on('load', () => {
        setMap(newMap);
      });

      newMap.on('click', (e) => {
        const location = {
          lng: e.lngLat.lng,
          lat: e.lngLat.lat
        };

        setSelectedLocation(location);

        // Remove existing marker
        if (marker) marker.remove();

        // Add new marker with custom styling
        const newMarker = new mapboxgl.Marker({
          color: '#ef4444',
          scale: 1.2
        })
          .setLngLat([e.lngLat.lng, e.lngLat.lat])
          .addTo(newMap);
        setMarker(newMarker);

        // Add to recent locations
        const newLocation = {
          ...location,
          timestamp: Date.now(),
          name: `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
        };
        setRecentLocations(prev => [newLocation, ...prev.slice(0, 4)]);
      });

      return () => newMap.remove();
    };

    if (!map && mapContainer.current) initializeMap();
  }, [mapContainer.current]);

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
        const placeName = response.data.features[0].place_name;

        map.flyTo({ center: [lng, lat], zoom: 12 });
        setSelectedLocation({ lng, lat });

        // Update marker
        if (marker) marker.remove();
        const newMarker = new mapboxgl.Marker({
          color: '#ef4444',
          scale: 1.2
        })
          .setLngLat([lng, lat])
          .addTo(map);
        setMarker(newMarker);

        // Add to recent locations
        const newLocation = {
          lng, lat,
          timestamp: Date.now(),
          name: placeName.split(',')[0]
        };
        setRecentLocations(prev => [newLocation, ...prev.slice(0, 4)]);
      }
    } catch (err) {
      setError("Location search failed. Please try again.");
    }
  };

  // Handle prediction submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLocation) {
      setError("Please select a location on the map.");
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

  // Scroll to main content
  const scrollToMain = () => {
    setShowHero(false);
    setTimeout(() => {
      document.getElementById('main-content').scrollIntoView({
        behavior: 'smooth'
      });
    }, 300);
  };

  // Quick location selection
  const selectRecentLocation = (location) => {
    setSelectedLocation(location);
    map.flyTo({ center: [location.lng, location.lat], zoom: 12 });

    if (marker) marker.remove();
    const newMarker = new mapboxgl.Marker({
      color: '#ef4444',
      scale: 1.2
    })
      .setLngLat([location.lng, location.lat])
      .addTo(map);
    setMarker(newMarker);
  };

  const currentTip = instructionTips[currentTipIndex];
  const IconComponent = currentTip.icon;

  return (
    <div className="w-full min-h-screen bg-gray-50 margin-top-8">

      {showHero && (
        <div
          ref={heroRef}
          className="relative h-[90vh] flex items-center justify-center overflow-hidden"
          style={{
            backgroundImage: "url('/images/fire poster.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>

          {/* Content */}
          <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4">
            <div className="mb-6">
              <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                WildFireWatch
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-2 leading-relaxed">
                AI-Powered Wildfire Detection & Risk Assessment
              </p>
              <p className="text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Predict and assess wildfire risks using satellite data and machine learning.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {heroStats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="flex flex-col items-center">
                    <div className="p-3 bg-gradient-to-r from-red-500 to-red-700 rounded-xl mb-2">
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-300 text-center">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              onClick={scrollToMain}
              className="group bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-semibold text-base hover:from-red-700 hover:to-red-800 transition-transform duration-300 hover:scale-105 shadow-xl"
            >
              <div className="flex items-center gap-2">
                <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                Start Prediction Analysis
                <ChevronDown className="w-4 h-4 animate-bounce" />
              </div>
            </button>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2">
            <div className="w-5 h-8 border-2 border-white/40 rounded-full flex justify-center">
              <div className="w-1 h-2 bg-white rounded-full mt-1 animate-bounce"></div>
            </div>
          </div>
        </div>
      )}


      {/* Main Content */}
      <div id="main-content" className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Satellite-Based Wildfire Analysis
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select any location worldwide to analyze wildfire risk using advanced AI and real-time satellite imagery
            </p>
          </div>

          {/* Main Interface */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Side - Map Section (60%) */}
            <div className="lg:w-3/5 space-y-6">
              {/* Search Section */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <Search className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Location Search</h3>
                      <p className="text-sm text-gray-600">Find any location or click directly on the map</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <form onSubmit={handleSearch} className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for any location worldwide..."
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      />
                      <button
                        type="submit"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Search
                      </button>
                    </div>
                  </form>

                  {/* Recent Locations */}
                  {recentLocations.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Locations</h4>
                      <div className="flex flex-wrap gap-2">
                        {recentLocations.map((location, index) => (
                          <button
                            key={index}
                            onClick={() => selectRecentLocation(location)}
                            className="px-3 py-1 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-lg text-sm transition-colors"
                          >
                            {location.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Map Section */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500 rounded-lg">
                        <Satellite className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Interactive Satellite Map</h3>
                        <p className="text-sm text-gray-600">Click anywhere to select analysis location</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Live Satellite Data
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div
                    ref={mapContainer}
                    className="w-full h-96 rounded-xl shadow-inner border border-gray-200 relative overflow-hidden"
                    style={{ zIndex: 10 }}
                  />
                </div>
              </div>

              {/* Selected Location Info */}
              {selectedLocation && (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500 rounded-lg">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Selected Location</h3>
                        <p className="text-sm text-gray-600">Ready for wildfire risk analysis</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Navigation className="w-4 h-4 text-blue-500" />
                          <span className="font-medium text-gray-700">Latitude</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">{selectedLocation.lat.toFixed(6)}</span>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Crosshair className="w-4 h-4 text-green-500" />
                          <span className="font-medium text-gray-700">Longitude</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">{selectedLocation.lng.toFixed(6)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Analyze Button */}
              <button
                onClick={handleSubmit}
                disabled={!selectedLocation || loading}
                className={`w-full py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl ${selectedLocation && !loading
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-red-500/25'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <Loader className="w-6 h-6 animate-spin" />
                    Analyzing Satellite Data...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <Zap className="w-6 h-6" />
                    {selectedLocation ? 'Analyze Wildfire Risk' : 'Select Location First'}
                  </div>
                )}
              </button>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span className="text-red-700 font-medium">{error}</span>
                </div>
              )}
            </div>

            {/* Right Side - Instructions & Info (40%) */}
            <div className="lg:w-2/5 space-y-6">
              {/* Instructions Card */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <div className="p-1 bg-orange-500 rounded-lg">
                      <Info className="w-4 h-4 text-white" />
                    </div>
                    How It Works
                  </h3>
                </div>

                <div className="p-6">
                  <div
                    className={`transition-all duration-300 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                      }`}
                  >
                    <div className={`bg-gradient-to-r ${currentTip.color} rounded-xl p-4 text-white mb-4`}>
                      <div className="flex items-center gap-3 mb-3">
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
                        className={`h-2 rounded-full transition-all duration-300 ${index === currentTipIndex ? 'bg-orange-500 w-8' : 'bg-gray-300 w-2'
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* System Status */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <div className="p-1 bg-green-500 rounded-lg">
                      <Activity className="w-4 h-4 text-white" />
                    </div>
                    System Status
                  </h3>
                </div>

                <div className="p-6 space-y-4">
                  {[
                    { label: "Satellite Connection", status: "Active", color: "green" },
                    { label: "AI Model", status: "Ready", color: "green" },
                    { label: "Image Processing", status: "Online", color: "green" },
                    { label: "Weather API", status: "Connected", color: "green" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="font-medium text-gray-700">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 bg-${item.color}-500 rounded-full animate-pulse`}></div>
                        <span className={`text-${item.color}-600 font-medium text-sm`}>{item.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features List */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <div className="p-1 bg-blue-500 rounded-lg">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    Key Features
                  </h3>
                </div>

                <div className="p-6 space-y-3">
                  {[
                    "Real-time satellite imagery analysis",
                    "AI-powered risk assessment",
                    "High-resolution heat mapping",
                    "Confidence level indicators",
                    "Global location support",
                    "Instant results delivery"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          {result && (
            <div className="mt-12">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-red-500 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    Analysis Results
                  </h3>
                </div>

                <div className="p-8">
                  {/* Main Content - Side by Side Layout (60-40) */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                    <div className="lg:col-span-3 space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Wildfire Risk Heatmap</h4>
                      <div className="flex gap-6">
                        {/* Main Image */}
                        <div className="flex-1 bg-gray-50 rounded-2xl p-4 border-2 border-dashed border-gray-300">
                          <img
                            src={result.camImageUrl}
                            alt="Wildfire Risk Heatmap"
                            className="w-full h-[600px] object-cover rounded-xl shadow-lg"
                          />
                        </div>

                        {/* Color Scale */}
                        <div className="w-[100px] flex items-center">
                          <div className="bg-white w-24 text-center">
                            <p className="text-sm font-medium text-gray-700 mb-2">Risk Scale</p>
                            <img
                              src={result.colorScale.scaleImageUrl}
                              alt="Risk Scale"
                              className="h-48 object-contain mx-auto"
                            />
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Right Side - Prediction Details (40%) */}
                    <div className="lg:col-span-2 space-y-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Prediction Details</h4>

                      {/* Main Prediction Result */}
                      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border border-red-200 transform hover:scale-105 transition-all duration-300 animate-pulse-slow">
                        <div className="flex items-center gap-3 mb-4">
                          <AlertTriangle className="w-6 h-6 text-red-600" />
                          <h4 className="font-semibold text-lg text-red-900">Prediction Result</h4>
                        </div>
                        <p className={`text-2xl font-bold ${result.predictionResult === "Wildfire Detected" ? "text-red-600" : "text-green-600"
                          }`}>
                          {result.predictionResult}
                        </p>
                        <div className="mt-3 text-sm text-red-700">
                          {result.predictionResult === "Wildfire Detected"
                            ? "⚠️ Immediate attention required"
                            : "✅ Area appears safe"}
                        </div>
                      </div>

                      {/* Confidence Metrics */}
                      <div className="space-y-4">
                        {/* No Fire Confidence */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200 transform hover:scale-105 transition-all duration-300 animate-fade-blue">
                          <div className="flex items-center gap-2 mb-3">
                            <Shield className="w-5 h-5 text-blue-600" />
                            <h4 className="font-semibold text-base text-blue-900">No Fire Confidence</h4>
                          </div>
                          <div className="space-y-2">
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-1000 ease-out animate-fill-blue"
                                style={{ width: `${result.noWildfireConfidence}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between items-center">
                              <p className="text-xl font-bold text-blue-600">{result.noWildfireConfidence}%</p>
                              <span className="text-xs text-blue-700 font-medium">Safe Zone</span>
                            </div>
                          </div>
                        </div>

                        {/* Fire Risk Confidence */}
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 border border-green-200 transform hover:scale-105 transition-all duration-300 animate-fade-green">
                          <div className="flex items-center gap-2 mb-3">
                            <Zap className="w-5 h-5 text-green-600" />
                            <h4 className="font-semibold text-base text-green-900">Fire Risk Confidence</h4>
                          </div>
                          <div className="space-y-2">
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-1000 ease-out animate-fill-green"
                                style={{ width: `${result.wildfireConfidence}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between items-center">
                              <p className="text-xl font-bold text-green-600">{result.wildfireConfidence}%</p>
                              <span className="text-xs text-green-700 font-medium">Risk Level</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-gray-600" />
                          <h5 className="font-medium text-gray-900 text-sm">Analysis Timestamp</h5>
                        </div>
                        <p className="text-gray-700 text-sm">{new Date().toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        @keyframes fade-blue {
          0%, 100% { 
            background: linear-gradient(to bottom right, rgb(239 246 255), rgb(219 234 254));
            border-color: rgb(147 197 253);
          }
          50% { 
            background: linear-gradient(to bottom right, rgb(219 234 254), rgb(191 219 254));
            border-color: rgb(59 130 246);
          }
        }
        
        @keyframes fade-green {
          0%, 100% { 
            background: linear-gradient(to bottom right, rgb(240 253 244), rgb(220 252 231));
            border-color: rgb(134 239 172);
          }
          50% { 
            background: linear-gradient(to bottom right, rgb(220 252 231), rgb(187 247 208));
            border-color: rgb(34 197 94);
          }
        }
        
        @keyframes fill-blue {
          0% { width: 0%; }
          100% { width: ${result?.noWildfireConfidence || 0}%; }
        }
        
        @keyframes fill-green {
          0% { width: 0%; }
          100% { width: ${result?.wildfireConfidence || 0}%; }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-fade-blue {
          animation: fade-blue 4s ease-in-out infinite;
        }
        
        .animate-fade-green {
          animation: fade-green 4s ease-in-out infinite 1s;
        }
        
        .animate-fill-blue {
          animation: fill-blue 2s ease-out;
        }
        
        .animate-fill-green {
          animation: fill-green 2s ease-out 0.5s both;
        }
      `}</style>
    </div>
  );
};

export default WildfireCamPrediction;