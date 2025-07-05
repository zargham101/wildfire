import React, { useState, useEffect } from "react";
import axios from "axios";
import Avatar from "./Avatar";
import { 
  Pencil, 
  UserCheck, 
  Camera, 
  TrendingUp, 
  Package, 
  MapPin, 
  Calendar,
  Activity,
  BarChart3,
  Flame,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Sun,
  Moon,
  User,
  Mail,
  Save,
  X
} from "lucide-react";
import Swal from "sweetalert2";

const UserProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [newPredictions, setNewPredictions] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [imageFile, setImageFile] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { user, predictions, newPredictions, resources } = res.data;
        setUserData(user);
        setUserId(user._id);
        setPredictions(predictions);
        setNewPredictions(newPredictions);
        setResources(resources);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  const handleEditClick = () => {
    setFormData({
      name: userData?.name || "",
      email: userData?.email || "",
    });
    setImageFile(null);
    setEditMode(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleUpdate = async () => {
    const formPayload = new FormData();
    formPayload.append("name", formData.name);
    formPayload.append("email", formData.email);
    if (imageFile) formPayload.append("image", imageFile);

    try {
      console.log("useId:", userId);
      await axios.patch(
        `http://localhost:5001/api/user/update?userId=${userId}`,
        formPayload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile has been updated successfully.",
        confirmButtonColor: "#ef4444"
      });

      setEditMode(false);
      window.location.reload();
    } catch (err) {
      console.error("Failed to update profile:", err);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err.response?.data?.message || "Something went wrong. Please try again.",
        confirmButtonColor: "#ef4444"
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'accepted':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getRiskLevel = (prediction) => {
    if (prediction < 0.3) return { level: "Low", color: "text-green-600 bg-green-100", icon: "🟢" };
    if (prediction < 0.6) return { level: "Medium", color: "text-yellow-600 bg-yellow-100", icon: "🟡" };
    if (prediction < 0.8) return { level: "High", color: "text-orange-600 bg-orange-100", icon: "🟠" };
    return { level: "Critical", color: "text-red-600 bg-red-100", icon: "🔴" };
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Activity, count: null },
    { id: "image-predictions", label: "Image Predictions", icon: Camera, count: predictions.length },
    { id: "model-predictions", label: "Model Predictions", icon: TrendingUp, count: newPredictions.length },
    { id: "resource-requests", label: "Resource Requests", icon: Package, count: resources.length }
  ];

  const stats = [
    {
      title: "Total Predictions",
      value: predictions.length + newPredictions.length,
      icon: BarChart3,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Image Analysis",
      value: predictions.length,
      icon: Camera,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Model Predictions",
      value: newPredictions.length,
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Resource Requests",
      value: resources.length,
      icon: Package,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50"
    }
  ];

  if (loading) {
    return (
      <div className={`flex justify-center items-center min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-blue-50'} p-4 pt-24`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <div className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-blue-50'} py-8 px-4 pt-24`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2 flex items-center gap-3`}>
              <User className="w-10 h-10 text-red-500" />
              User Profile
            </h1>
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage your account and view your activity
            </p>
          </div>
          
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-3 rounded-xl transition-all duration-200 ${
              isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' : 'bg-white hover:bg-gray-50 text-gray-600'
            } shadow-lg hover:shadow-xl`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* User Profile Card */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-xl border overflow-hidden mb-8`}>
          <div className="bg-gradient-to-r from-red-500 to-red-600 h-32 relative">
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
          
          <div className="relative px-8 pb-8">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-white">
                  <Avatar 
                    user={userData} 
                    className="w-full h-full" 
                    variant="profile"
                  />
                </div>
                {editMode && (
                  <label className="absolute -bottom-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 mt-4">
                {editMode ? (
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Full Name
                      </label>
                      <div className="relative">
                        <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all ${
                            isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <input
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all ${
                            isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                          placeholder="Enter your email address"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                      {userData?.name}
                    </h2>
                    <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4 flex items-center gap-2`}>
                      <Mail className="w-5 h-5" />
                      {userData?.email}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                        Member since {new Date(userData?.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {editMode ? (
                  <>
                    <button
                      onClick={handleUpdate}
                      className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 ${
                        isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                      }`}
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleEditClick}
                      className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit Profile
                    </button>
                    
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stat.value}
                </div>
              </div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {stat.title}
              </p>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl border shadow-lg overflow-hidden mb-8`}>
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-4 font-medium transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-red-500 text-white'
                      : isDarkMode
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  {tab.label}
                  {tab.count !== null && (
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      activeTab === tab.id
                        ? 'bg-white/20 text-white'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl border shadow-lg overflow-hidden`}>
          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div>
                  <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6 flex items-center gap-3`}>
                    <Activity className="w-6 h-6 text-red-500" />
                    Account Overview
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                        Activity Summary
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Total Predictions</span>
                          <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {predictions.length + newPredictions.length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Resource Requests</span>
                          <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {resources.length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Account Status</span>
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                        Recent Activity
                      </h4>
                      <div className="space-y-3">
                        {predictions.length > 0 && (
                          <div className="flex items-center gap-3">
                            <Camera className="w-4 h-4 text-blue-500" />
                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Latest image prediction
                            </span>
                          </div>
                        )}
                        {newPredictions.length > 0 && (
                          <div className="flex items-center gap-3">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Latest model prediction
                            </span>
                          </div>
                        )}
                        {resources.length > 0 && (
                          <div className="flex items-center gap-3">
                            <Package className="w-4 h-4 text-red-500" />
                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Latest resource request
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Image Predictions Tab */}
            {activeTab === "image-predictions" && (
              <div>
                <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6 flex items-center gap-3`}>
                  <Camera className="w-6 h-6 text-red-500" />
                  Image-Based Predictions
                  <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                    {predictions.length}
                  </span>
                </h3>
                
                {predictions.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {predictions.map((p, idx) => (
                      <div key={idx} className={`border rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
                        isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                      }`}>
                        <div className="aspect-video relative overflow-hidden">
                          <img
                            src={p.camImageUrl}
                            alt="Prediction Analysis"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-4 right-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              p.predictionResult === "Wildfire Detected" 
                                ? "bg-red-500 text-white" 
                                : "bg-green-500 text-white"
                            }`}>
                              {p.predictionResult === "Wildfire Detected" ? "🔥 Fire Detected" : "✅ Safe"}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              Analysis Result
                            </h4>
                            <Eye className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          </div>
                          
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Fire Risk Confidence
                              </span>
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-red-500 h-2 rounded-full transition-all duration-1000"
                                    style={{ width: `${p.wildfireConfidence}%` }}
                                  ></div>
                                </div>
                                <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {p.wildfireConfidence?.toFixed(1)}%
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Safe Zone Confidence
                              </span>
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                                    style={{ width: `${p.noWildfireConfidence}%` }}
                                  ></div>
                                </div>
                                <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {p.noWildfireConfidence?.toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Camera className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      No image predictions found
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} mt-2`}>
                      Start analyzing images to see your predictions here
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Model Predictions Tab */}
            {activeTab === "model-predictions" && (
              <div>
                <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6 flex items-center gap-3`}>
                  <TrendingUp className="w-6 h-6 text-red-500" />
                  Model Predictions
                  <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                    {newPredictions.length}
                  </span>
                </h3>
                
                {newPredictions.length > 0 ? (
                  <div className="space-y-4">
                    {newPredictions.map((np, idx) => {
                      const location = np.fireData?.location || "Unknown";
                      const [lat, lon] = location.split(",");
                      const predictionValue = np.prediction?.[0] || 0;
                      const riskInfo = getRiskLevel(predictionValue);

                      return (
                        <div key={idx} className={`border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${
                          isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                        }`}>
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                                <Flame className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  Fire Risk Analysis
                                </h4>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Model-based prediction
                                </p>
                              </div>
                            </div>
                            
                            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${riskInfo.color}`}>
                              {riskInfo.icon} {riskInfo.level} Risk
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-600' : 'bg-gray-50'}`}>
                              <div className="flex items-center gap-2 mb-3">
                                <MapPin className="w-5 h-5 text-blue-500" />
                                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  Location
                                </span>
                              </div>
                              <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                <div>Latitude: {lat?.trim() || "N/A"}</div>
                                <div>Longitude: {lon?.trim() || "N/A"}</div>
                              </div>
                            </div>
                            
                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-600' : 'bg-gray-50'}`}>
                              <div className="flex items-center gap-2 mb-3">
                                <BarChart3 className="w-5 h-5 text-red-500" />
                                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  Risk Score
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex-1 bg-gray-200 rounded-full h-3">
                                  <div
                                    className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-1000"
                                    style={{ width: `${(predictionValue * 100)}%` }}
                                  ></div>
                                </div>
                                <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {(predictionValue * 100).toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <TrendingUp className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      No model predictions found
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} mt-2`}>
                      Use the prediction model to see your results here
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Resource Requests Tab */}
            {activeTab === "resource-requests" && (
              <div>
                <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6 flex items-center gap-3`}>
                  <Package className="w-6 h-6 text-red-500" />
                  Resource Requests
                  <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                    {resources.length}
                  </span>
                </h3>
                
                {resources.length > 0 ? (
                  <div className="space-y-4">
                    {resources.map((res, idx) => {
                      const { latitude, longitude } = res.location || {};
                      const locationStr =
                        latitude && longitude
                          ? `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
                          : "Unknown Location";

                      return (
                        <div key={idx} className={`border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${
                          isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                        }`}>
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl">
                                <Package className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  Emergency Resource Request
                                </h4>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center gap-2`}>
                                  <MapPin className="w-4 h-4" />
                                  {locationStr}
                                </p>
                              </div>
                            </div>
                            
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(res.status)}`}>
                              {getStatusIcon(res.status)}
                              {res.status || 'Unknown'}
                            </div>
                          </div>
                          
                          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-600' : 'bg-gray-50'}`}>
                            <h5 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              Required Resources:
                            </h5>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {Object.entries(res.requiredResources).map(([key, val], i) => (
                                <div key={i} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                                  <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                  </div>
                                  <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {Array.isArray(val) ? val.join(", ") : val}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      No resource requests found
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} mt-2`}>
                      Your emergency resource requests will appear here
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;