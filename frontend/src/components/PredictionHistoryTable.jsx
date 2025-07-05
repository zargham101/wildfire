import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Calendar,
  Download,
  Filter,
  MapPin,
  Thermometer,
  Wind,
  Droplets,
  Eye,
  EyeOff,
  RefreshCw,
  Search,
  ChevronDown,
  ChevronUp,
  Flame,
  Clock,
  TrendingUp,
  AlertTriangle,
  FileText,
  BarChart3,
  Sun,
  Moon
} from "lucide-react";

const PredictionHistoryTable = () => {
  const [predictions, setPredictions] = useState([]);
  const [filteredPredictions, setFilteredPredictions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const fetchPredictions = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);

    if (!token) {
      setError("User is not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        "http://localhost:5001/api/prediction/my/fire/prediction",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPredictions(res.data.data);
      setFilteredPredictions(res.data.data);
      setError("");
    } catch (err) {
      console.error("Failed to fetch predictions:", err);
      setError("Failed to load prediction history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [filter, predictions, searchTerm, sortBy, sortOrder]);

  const applyFiltersAndSort = () => {
    let filtered = [...predictions];

    // Apply time filter
    if (filter !== "all") {
      const now = new Date();
      let daysAgo = 0;

      switch (filter) {
        case "5days": daysAgo = 5; break;
        case "10days": daysAgo = 10; break;
        case "1month": daysAgo = 30; break;
        case "3months": daysAgo = 90; break;
        case "6months": daysAgo = 180; break;
        case "1year": daysAgo = 365; break;
        default: daysAgo = 0;
      }

      const cutoffDate = new Date();
      cutoffDate.setDate(now.getDate() - daysAgo);

      filtered = filtered.filter((pred) => {
        const predictionDate = new Date(pred.createdAt);
        return predictionDate >= cutoffDate;
      });
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((pred) => {
        const location = pred.fireData?.location?.toLowerCase() || "";
        const date = new Date(pred.createdAt).toLocaleDateString().toLowerCase();
        return location.includes(searchTerm.toLowerCase()) || 
               date.includes(searchTerm.toLowerCase());
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "date":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case "risk":
          aValue = a.prediction[0] || 0;
          bValue = b.prediction[0] || 0;
          break;
        case "temperature":
          aValue = a.fireData?.data[0]?.tmax || 0;
          bValue = b.fireData?.data[0]?.tmax || 0;
          break;
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
      }

      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });

    setFilteredPredictions(filtered);
  };

  const parseLocation = (locationString) => {
    if (!locationString) return { lat: "N/A", lon: "N/A" };
    
    // Try to extract coordinates from various formats
    const coordRegex = /(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/;
    const match = locationString.match(coordRegex);
    
    if (match) {
      return {
        lat: parseFloat(match[1]).toFixed(4),
        lon: parseFloat(match[2]).toFixed(4)
      };
    }
    
    return { lat: "N/A", lon: "N/A" };
  };

  const getRiskLevel = (prediction) => {
    if (prediction < 0.3) return { level: "Low", color: "text-green-600 bg-green-100", icon: "🟢" };
    if (prediction < 0.6) return { level: "Medium", color: "text-yellow-600 bg-yellow-100", icon: "🟡" };
    if (prediction < 0.8) return { level: "High", color: "text-orange-600 bg-orange-100", icon: "🟠" };
    return { level: "Critical", color: "text-red-600 bg-red-100", icon: "🔴" };
  };

  const downloadPDF = () => {
    const pdf = new jsPDF();
    
    // Add title
    pdf.setFontSize(20);
    pdf.setTextColor(220, 38, 38);
    pdf.text("Wildfire Prediction History Report", 20, 20);
    
    // Add generation date
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);

    const tableData = filteredPredictions.map((pred) => {
      const { lat, lon } = parseLocation(pred.fireData?.location || "");
      const firstDataPoint = pred.fireData?.data[0];
      
      return [
        `Lat: ${lat}, Lon: ${lon}`,
        `${firstDataPoint?.tmax || "N/A"}°C`,
        `${firstDataPoint?.rh || "N/A"}%`,
        `${firstDataPoint?.ws || "N/A"} km/h`,
        `${firstDataPoint?.vpd || "N/A"}`,
        (pred.prediction[0] || 0).toFixed(4),
        getRiskLevel(pred.prediction[0] || 0).level,
        new Date(pred.createdAt).toLocaleDateString(),
      ];
    });

    autoTable(pdf, {
      head: [["Location", "Temp", "Humidity", "Wind", "VPD", "Fire Risk", "Risk Level", "Date"]],
      body: tableData,
      styles: { cellPadding: 2, fontSize: 8 },
      headStyles: { fillColor: [220, 38, 38], textColor: 255 },
      margin: { top: 40 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 15 },
        2: { cellWidth: 15 },
        3: { cellWidth: 15 },
        4: { cellWidth: 15 },
        5: { cellWidth: 20 },
        6: { cellWidth: 20 },
        7: { cellWidth: 25 }
      }
    });

    pdf.save(`wildfire-predictions-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-4 border shadow-sm hover:shadow-md transition-all duration-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-blue-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Loading predictions...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Predictions",
      value: filteredPredictions.length,
      icon: BarChart3,
      color: "bg-blue-500"
    },
    {
      title: "High Risk",
      value: filteredPredictions.filter(p => (p.prediction[0] || 0) >= 0.6).length,
      icon: AlertTriangle,
      color: "bg-red-500"
    },
    {
      title: "Avg Temperature",
      value: `${(filteredPredictions.reduce((acc, p) => acc + (p.fireData?.data[0]?.tmax || 0), 0) / filteredPredictions.length || 0).toFixed(1)}°C`,
      icon: Thermometer,
      color: "bg-orange-500"
    },
    {
      title: "Latest Prediction",
      value: filteredPredictions.length > 0 ? new Date(filteredPredictions[0]?.createdAt).toLocaleDateString() : "N/A",
      icon: Clock,
      color: "bg-green-500"
    }
  ];

  return (
    <div className={`min-h-screen transition-all duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-blue-50'}`}>
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2 flex items-center gap-3`}>
              <Flame className="w-10 h-10 text-red-500" />
              Prediction History
            </h1>
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Comprehensive wildfire prediction analytics and historical data
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-3 rounded-xl transition-all duration-200 ${
                isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' : 'bg-white hover:bg-gray-50 text-gray-600'
              } shadow-lg hover:shadow-xl`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <button
              onClick={fetchPredictions}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 ${
                isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
              } text-white shadow-lg hover:shadow-xl`}
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Controls */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl border shadow-lg p-6 mb-8`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search by location or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>

            {/* Time Filter */}
            <div className="relative">
              <Filter className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                <option value="all">All Time</option>
                <option value="5days">Last 5 Days</option>
                <option value="10days">Last 10 Days</option>
                <option value="1month">Last Month</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last Year</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                <option value="date">Sort by Date</option>
                <option value="risk">Sort by Risk Level</option>
                <option value="temperature">Sort by Temperature</option>
              </select>
            </div>

            {/* Sort Order & Download */}
            <div className="flex gap-2">
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
                } transition-colors`}
              >
                {sortOrder === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {sortOrder === "asc" ? "Asc" : "Desc"}
              </button>
              
              <button
                onClick={downloadPDF}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Predictions Grid */}
        <div className="space-y-4">
          {filteredPredictions.length > 0 ? (
            (showAll ? filteredPredictions : filteredPredictions.slice(0, 10)).map((pred, index) => {
              const { lat, lon } = parseLocation(pred.fireData?.location || "");
              const firstDataPoint = pred.fireData?.data[0];
              const riskInfo = getRiskLevel(pred.prediction[0] || 0);
              const isExpanded = selectedPrediction === pred._id;

              return (
                <div
                  key={pred._id}
                  className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden prediction-card`}
                  style={{ 
                    animationDelay: `${index * 0.05}s`
                  }}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${riskInfo.color}`}>
                          {riskInfo.icon} {riskInfo.level} Risk
                        </div>
                        <div className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <Calendar className="w-4 h-4" />
                          {new Date(pred.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setSelectedPrediction(isExpanded ? null : pred._id)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-colors ${
                          isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {isExpanded ? "Less" : "More"}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Location */}
                      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-blue-500" />
                          <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Location</span>
                        </div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <div>Lat: {lat}</div>
                          <div>Lon: {lon}</div>
                        </div>
                      </div>

                      {/* Temperature */}
                      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Thermometer className="w-4 h-4 text-red-500" />
                          <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Temperature</span>
                        </div>
                        <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {firstDataPoint?.tmax || "N/A"}°C
                        </div>
                      </div>

                      {/* Wind Speed */}
                      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Wind className="w-4 h-4 text-green-500" />
                          <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Wind Speed</span>
                        </div>
                        <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {firstDataPoint?.ws || "N/A"} km/h
                        </div>
                      </div>

                      {/* Fire Risk */}
                      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Flame className="w-4 h-4 text-orange-500" />
                          <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Fire Risk</span>
                        </div>
                        <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {((pred.prediction[0] || 0) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              Additional Metrics
                            </h4>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Droplets className="w-4 h-4 text-blue-500" />
                                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Humidity</span>
                                </div>
                                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {firstDataPoint?.rh || "N/A"}%
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <TrendingUp className="w-4 h-4 text-purple-500" />
                                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Vapor Pressure</span>
                                </div>
                                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {firstDataPoint?.vpd || "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              Prediction Details
                            </h4>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Raw Score</span>
                                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {(pred.prediction[0] || 0).toFixed(6)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Prediction ID</span>
                                <span className={`font-mono text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {pred._id.slice(-8)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-12 text-center`}>
              <FileText className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                No predictions found for the selected criteria
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} mt-2`}>
                Try adjusting your filters or search terms
              </p>
            </div>
          )}
        </div>

        {/* Show More/Less Button */}
        {filteredPredictions.length > 10 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {showAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {showAll ? "Show Less" : `Show All ${filteredPredictions.length} Predictions`}
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .prediction-card {
          opacity: 0;
          animation: fadeInUp 0.5s ease forwards;
        }
        
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default PredictionHistoryTable;