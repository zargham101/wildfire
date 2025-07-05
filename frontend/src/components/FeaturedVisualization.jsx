import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  CartesianGrid,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Thermometer,
  Wind,
  Droplets,
  Eye,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  Map,
  Settings,
  Bell,
  Sun,
  Moon,
  Zap,
  Target,
  Globe,
  Shield,
  TrendingUpIcon,
  MapPin,
  Flame
} from "lucide-react";

const COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", 
  "#8b5cf6", "#ec4899", "#10b981", "#f59e0b", "#6366f1"
];

const WildfireDashboard = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d");
  const [selectedMainMetric, setSelectedMainMetric] = useState("prediction");
  const [mainChartType, setMainChartType] = useState("line");
  const [selectedCategorical, setSelectedCategorical] = useState("fire_type");
  const [categoricalChartType, setCategoricalChartType] = useState("bar");
  const [selectedNumeric, setSelectedNumeric] = useState("temperature");
  const [showFilters, setShowFilters] = useState(false);
  const [multiMetricView, setMultiMetricView] = useState("composed");
  const [realTimeData, setRealTimeData] = useState({
    activeAlerts: 3,
    systemStatus: "operational",
    lastUpdate: new Date().toLocaleTimeString()
  });

  useEffect(() => {
    fetchPredictions();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        lastUpdate: new Date().toLocaleTimeString()
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchPredictions = async () => {
    try {
      // Simulate API call with mock data for demonstration
      const mockData = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        prediction: Math.random() * 0.9 + 0.1,
        temperature: Math.random() * 40 + 10,
        windSpeed: Math.random() * 25 + 5,
        humidity: Math.random() * 80 + 20,
        createdAt: new Date(Date.now() - (49 - i) * 24 * 60 * 60 * 1000).toISOString(),
        location: `Location ${i + 1}`,
        elevation: Math.random() * 2000 + 100,
        vegetation: Math.random() * 100
      }));

      const extractedPredictions = mockData.map((item) => ({
        ...item,
        riskLevel: getRiskLevel(item.prediction),
        date: new Date(item.createdAt).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
      }));

      setPredictions(extractedPredictions);
    } catch (error) {
      console.error("Failed to fetch predictions", error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevel = (prediction) => {
    if (prediction < 0.3) return "Low";
    if (prediction < 0.6) return "Medium";
    if (prediction < 0.8) return "High";
    return "Critical";
  };

  const getRiskColor = (level) => {
    const colors = {
      "Low": "text-green-600 bg-green-100",
      "Medium": "text-yellow-600 bg-yellow-100", 
      "High": "text-orange-600 bg-orange-100",
      "Critical": "text-red-600 bg-red-100"
    };
    return colors[level] || colors["Low"];
  };

  const getAvg = (key) => {
    if (!predictions.length) return 0;
    const sum = predictions.reduce((acc, p) => acc + (p[key] || 0), 0);
    return (sum / predictions.length).toFixed(2);
  };

  const getChange = (key) => {
    const changes = { prediction: 12.5, temperature: -3.2, windSpeed: 8.1, humidity: -1.4 };
    return changes[key] || 0;
  };

  const prepareTimeSeriesData = () => {
    return predictions.map((p) => ({
      date: p.date,
      prediction: (p.prediction * 100).toFixed(1),
      temperature: p.temperature.toFixed(1),
      windSpeed: p.windSpeed.toFixed(1),
      humidity: p.humidity.toFixed(1),
      riskScore: p.prediction * 100,
      elevation: p.elevation,
      vegetation: p.vegetation
    })).slice(-30);
  };

  const prepareMultiMetricData = () => {
    return predictions.slice(-20).map((p) => ({
      date: p.date,
      fireRisk: (p.prediction * 100).toFixed(1),
      temperature: p.temperature.toFixed(1),
      windSpeed: p.windSpeed.toFixed(1),
      humidity: p.humidity.toFixed(1),
      riskLevel: p.riskLevel,
      normalizedTemp: (p.temperature / 50) * 100, // Normalize for comparison
      normalizedWind: (p.windSpeed / 30) * 100,
      normalizedHumidity: p.humidity
    }));
  };

  const prepareRiskDistribution = () => {
    const distribution = predictions.reduce((acc, p) => {
      acc[p.riskLevel] = (acc[p.riskLevel] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(distribution).map(([level, count]) => ({
      name: level,
      value: count,
      percentage: ((count / predictions.length) * 100).toFixed(1)
    }));
  };

  const prepareCorrelationData = () => {
    return predictions.map(p => ({
      temperature: p.temperature,
      windSpeed: p.windSpeed,
      humidity: p.humidity,
      prediction: p.prediction * 100,
      riskScore: p.prediction * 100,
      elevation: p.elevation,
      vegetation: p.vegetation
    }));
  };

  const prepareRadarData = () => {
    const avgData = {
      Temperature: getAvg('temperature'),
      'Wind Speed': getAvg('windSpeed'),
      Humidity: getAvg('humidity'),
      'Fire Risk': getAvg('prediction') * 100,
      'Alert Level': predictions.filter(p => p.riskLevel === 'High' || p.riskLevel === 'Critical').length
    };

    return Object.entries(avgData).map(([key, value]) => ({
      subject: key,
      value: parseFloat(value),
      fullMark: key === 'Humidity' ? 100 : key === 'Temperature' ? 50 : key === 'Wind Speed' ? 30 : 100
    }));
  };

  const prepareLocationRiskData = () => {
    const locationData = predictions.slice(-15).map((p, index) => ({
      location: p.location,
      x: (index % 5) * 100 + Math.random() * 50,
      y: Math.floor(index / 5) * 100 + Math.random() * 50,
      riskLevel: p.prediction * 100,
      temperature: p.temperature,
      windSpeed: p.windSpeed,
      humidity: p.humidity,
      size: p.prediction * 100 + 20
    }));

    return locationData;
  };

  const heroStats = [
    {
      title: "Total Predictions",
      value: predictions.length,
      change: "+12.5%",
      trend: "up",
      icon: BarChart3,
      color: "blue"
    },
    {
      title: "Avg Fire Risk",
      value: `${(getAvg("prediction") * 100).toFixed(1)}%`,
      change: "+8.2%",
      trend: "up",
      icon: AlertTriangle,
      color: "red"
    },
    {
      title: "Avg Temperature",
      value: `${getAvg("temperature")}°C`,
      change: "-3.1%",
      trend: "down",
      icon: Thermometer,
      color: "orange"
    },
    {
      title: "High Risk Areas",
      value: predictions.filter(p => p.riskLevel === 'High' || p.riskLevel === 'Critical').length,
      change: "+15.3%",
      trend: "up",
      icon: Shield,
      color: "purple"
    }
  ];

  const StatCard = ({ stat }) => (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
          <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
          stat.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {stat.change}
        </div>
      </div>
      <div>
        <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
          {stat.value}
        </p>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {stat.title}
        </p>
      </div>
    </div>
  );

  const ChartCard = ({ title, children, actions }) => (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl border shadow-lg overflow-hidden`}>
      <div className={`${isDarkMode ? 'bg-gray-750' : 'bg-gray-50'} px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h3>
        <div className="flex items-center gap-2">
          {actions}
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-4 rounded-lg border shadow-lg`}>
          <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
              {entry.name === 'Fire Risk' && '%'}
              {entry.name === 'Temperature' && '°C'}
              {entry.name === 'Wind Speed' && ' km/h'}
              {entry.name === 'Humidity' && '%'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const LocationRiskVisualization = () => {
    const locationData = prepareLocationRiskData();
    
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Location Risk Scatter */}
        <div>
          <h4 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Geographic Risk Distribution
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={locationData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
              <XAxis 
                dataKey="x" 
                type="number" 
                domain={[0, 'dataMax + 50']}
                stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
                tick={false}
              />
              <YAxis 
                dataKey="y" 
                type="number" 
                domain={[0, 'dataMax + 50']}
                stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
                tick={false}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-3 rounded-lg border shadow-lg`}>
                        <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {data.location}
                        </p>
                        <p className="text-red-500">Risk: {data.riskLevel.toFixed(1)}%</p>
                        <p className="text-orange-500">Temp: {data.temperature.toFixed(1)}°C</p>
                        <p className="text-blue-500">Wind: {data.windSpeed.toFixed(1)} km/h</p>
                        <p className="text-green-500">Humidity: {data.humidity.toFixed(1)}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter 
                dataKey="riskLevel" 
                fill={(entry) => {
                  const risk = entry.riskLevel;
                  if (risk < 30) return "#22c55e";
                  if (risk < 60) return "#eab308";
                  if (risk < 80) return "#f97316";
                  return "#ef4444";
                }}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Level Summary */}
        <div>
          <h4 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Risk Assessment Summary
          </h4>
          <div className="space-y-4">
            {locationData.slice(0, 8).map((location, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    location.riskLevel < 30 ? 'bg-green-500' :
                    location.riskLevel < 60 ? 'bg-yellow-500' :
                    location.riskLevel < 80 ? 'bg-orange-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {location.location}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {location.temperature.toFixed(1)}°C • {location.windSpeed.toFixed(1)} km/h
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    location.riskLevel < 30 ? 'text-green-600' :
                    location.riskLevel < 60 ? 'text-yellow-600' :
                    location.riskLevel < 80 ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {location.riskLevel.toFixed(1)}%
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Risk Level
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen transition-all duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-blue-50'
      }`}
    >
      {/* Main Content Container with proper top spacing */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-4xl font-serif font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
              Wildfire Analytics 
            </h1>
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Real-time monitoring and predictive analysis
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Real-time Status */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Live • {realTimeData.lastUpdate}
              </span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-3 rounded-xl transition-all duration-200 ${
                isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' : 'bg-white hover:bg-gray-50 text-gray-600'
              } shadow-lg hover:shadow-xl`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 ${
                isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
              } text-white shadow-lg hover:shadow-xl`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            {/* Refresh Button */}
            <button
              onClick={fetchPredictions}
              className={`p-3 rounded-xl transition-all duration-200 ${
                isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
              } shadow-lg hover:shadow-xl`}
            >
              <RefreshCw className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl border shadow-lg p-6 mb-8`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Time Range
                </label>
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Risk Level
                </label>
                <select className={`w-full px-3 py-2 rounded-lg border ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500`}>
                  <option value="all">All Levels</option>
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                  <option value="critical">Critical Risk</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Location
                </label>
                <select className={`w-full px-3 py-2 rounded-lg border ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500`}>
                  <option value="all">All Locations</option>
                  <option value="region1">Region 1</option>
                  <option value="region2">Region 2</option>
                </select>
              </div>

              <div className="flex items-end">
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {heroStats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>

        {/* Alert Banner */}
        {realTimeData.activeAlerts > 0 && (
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">
                  {realTimeData.activeAlerts} Active High-Risk Alerts
                </h3>
                <p className="text-white/90">
                  Immediate attention required for critical fire risk areas
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Time Series Analysis */}
          <ChartCard 
            title="Fire Risk Trends Over Time"
            actions={
              <>
                <select
                  value={selectedMainMetric}
                  onChange={(e) => setSelectedMainMetric(e.target.value)}
                  className={`px-3 py-1 rounded-lg border text-sm ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="prediction">Fire Risk</option>
                  <option value="temperature">Temperature</option>
                  <option value="windSpeed">Wind Speed</option>
                  <option value="humidity">Humidity</option>
                </select>
                <button
                  onClick={() => setMainChartType(mainChartType === "line" ? "area" : "line")}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                  } text-white`}
                >
                  {mainChartType === "line" ? "Area" : "Line"}
                </button>
              </>
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              {mainChartType === "line" ? (
                <LineChart data={prepareTimeSeriesData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="date" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                  <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey={selectedMainMetric} 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              ) : (
                <AreaChart data={prepareTimeSeriesData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="date" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                  <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey={selectedMainMetric} 
                    stroke="#ef4444" 
                    fill="url(#colorGradient)"
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              )}
            </ResponsiveContainer>
          </ChartCard>

          {/* Risk Distribution */}
          <ChartCard 
            title="Risk Level Distribution"
            actions={
              <button
                onClick={() => setCategoricalChartType(categoricalChartType === "bar" ? "pie" : "bar")}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
                } text-white`}
              >
                {categoricalChartType === "bar" ? "Pie" : "Bar"}
              </button>
            }
          >
            {categoricalChartType === "bar" ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={prepareRiskDistribution()}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="name" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                  <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center">
                <div className="w-1/2">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={prepareRiskDistribution()}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                      >
                        {prepareRiskDistribution().map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-1/2 pl-6">
                  <div className="space-y-3">
                    {prepareRiskDistribution().map((entry, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: COLORS[i % COLORS.length] }}
                          />
                          <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {entry.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {entry.value}
                          </div>
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {entry.percentage}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </ChartCard>
        </div>

        {/* Advanced Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weather Correlation */}
          <ChartCard title="Weather vs Fire Risk Correlation">
            <ResponsiveContainer width="100%" height={250}>
              <ScatterChart data={prepareCorrelationData()}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                <XAxis 
                  dataKey={selectedNumeric} 
                  name={selectedNumeric} 
                  stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
                />
                <YAxis 
                  dataKey="prediction" 
                  name="Fire Risk" 
                  stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  content={<CustomTooltip />}
                />
                <Scatter dataKey="prediction" fill="#8b5cf6" />
              </ScatterChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Performance Radar */}
          <ChartCard title="System Performance Overview">
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={prepareRadarData()}>
                <PolarGrid stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]}
                  tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: 10 }}
                />
                <Radar
                  name="Performance"
                  dataKey="value"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Multi-Metric Comparative Analysis */}
        <div className="mb-8">
          <ChartCard 
            title="Multi-Metric Comparative Analysis"
            actions={
              <select
                value={multiMetricView}
                onChange={(e) => setMultiMetricView(e.target.value)}
                className={`px-3 py-1 rounded-lg border text-sm ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="composed">Composed View</option>
                <option value="multiline">Multi-Line View</option>
              </select>
            }
          >
            <ResponsiveContainer width="100%" height={400}>
              {multiMetricView === "composed" ? (
                <ComposedChart data={prepareMultiMetricData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="date" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                  <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="normalizedHumidity" fill="#3b82f6" name="Humidity" />
                  <Area 
                    type="monotone" 
                    dataKey="normalizedTemp" 
                    fill="#f97316" 
                    stroke="#f97316"
                    name="Temperature"
                    fillOpacity={0.3}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="fireRisk" 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    name="Fire Risk"
                    dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="normalizedWind" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    name="Wind Speed"
                    strokeDasharray="5 5"
                  />
                </ComposedChart>
              ) : (
                <LineChart data={prepareMultiMetricData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="date" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                  <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="fireRisk" 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    name="Fire Risk"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="normalizedTemp" 
                    stroke="#f97316" 
                    strokeWidth={2}
                    name="Temperature"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="normalizedWind" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    name="Wind Speed"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="normalizedHumidity" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Humidity"
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Location Risk Visualization */}
        <ChartCard title="Location-Based Risk Analysis">
          <LocationRiskVisualization />
        </ChartCard>
      </div>
    </div>
  );
};

export default WildfireDashboard;