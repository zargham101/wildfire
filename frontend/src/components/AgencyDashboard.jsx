import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Users,
  Truck,
  Plane,
  Shield,
  Settings,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Bell,
  Activity,
  TrendingUp,
  Calendar,
  MapPin,
  Flame,
  Sun,
  Moon,
  Filter,
  Search,
  Download,
  Eye,
  BarChart3,
  Lock
} from "lucide-react";

export default function AgencyDashboard() {
  const [agencyResources, setAgencyResources] = useState(null);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [agencyHeavyEquipment, setAgencyHeavyEquipment] = useState(null);
  const [token] = useState(localStorage.getItem("agency_token"));
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);

  const baseUrl = "http://localhost:5001/api/agency";

  useEffect(() => {
    if (!token) return;
    fetchData();
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchAgencyResources(), fetchIncomingRequests()]);
    setLoading(false);
  };

  console.log("Render - Agency Heavy Equipment state:", agencyHeavyEquipment);
  const fetchAgencyResources = async () => {
    try {
      const res = await axios.get(`${baseUrl}/agencies/me/resources`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("fetchAgencyResources - API Response heavyEquipment:", res.data.heavyEquipment);
      setAgencyResources(res.data);
      setAgencyHeavyEquipment(res.data.heavyEquipment);
      console.log("fetchAgencyResources - AFTER setAgencyHeavyEquipment (will reflect in next render):", res.data.heavyEquipment);
    } catch (err) {
      console.error("Error fetching agency resources:", err);
    }
  };

  const fetchIncomingRequests = async () => {
    try {
      const res = await axios.get(`${baseUrl}/resource-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      data.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setIncomingRequests(data);
    } catch (err) {
      console.error("Error fetching resource requests:", err);
    }
  };



  const checkResourceAvailability = (requiredResources, agencyResources, agencyHeavyEquipment) => {
    console.log("checkResourceAvailability - Called with:", { requiredResources, agencyResources, agencyHeavyEquipment });
    if (!agencyHeavyEquipment) {
      console.log("checkResourceAvailability - agencyHeavyEquipment is falsy!");
    }
    if (!agencyResources || !requiredResources || !agencyHeavyEquipment) return false;

    const currentResources = agencyResources.currentResources || {};
    if (requiredResources.firefighters > (currentResources.firefighters || 0)) return false;
    if (requiredResources.firetrucks > (currentResources.firetrucks || 0)) return false;
    if (requiredResources.helicopters > (currentResources.helicopters || 0)) return false;
    if (requiredResources.commanders > (currentResources.commanders || 0)) return false;

    if (requiredResources.heavyEquipment && requiredResources.heavyEquipment.length > 0) {
      const availableHeavyEquipment = agencyHeavyEquipment;


      const hasAllEquipment = requiredResources.heavyEquipment.every(equipment =>
        availableHeavyEquipment.includes(equipment)
      );

      if (!hasAllEquipment) {
        console.log("Missing heavy equipment");
        return false;
      }
    }

    return true;
  };

  const handleRespond = async (requestId, status) => {
    const request = incomingRequests.find((req) => req._id === requestId);
    const requiredResources = request.requiredResources;

    console.log("handleRespond - Calling checkResourceAvailability with current state values:");
    console.log("  agencyResources:", agencyResources);
    console.log("  agencyHeavyEquipment:", agencyHeavyEquipment);
    const canAccept = checkResourceAvailability(requiredResources, agencyResources, agencyHeavyEquipment);
    console.log("Can accept request:", canAccept);

    // Rest of the function remains the same...
    if (status === "accepted" && !canAccept) {
      Swal.fire({
        title: "Insufficient Resources",
        text: "You don't have enough resources to accept this request.",
        icon: "error",
        confirmButtonColor: "#ef4444"
      });
      return;
    }

    const result = await Swal.fire({
      title: `${status === "accepted" ? "Accept" : "Reject"} Request`,
      text: `Are you sure you want to ${status} this request?`,
      input: "textarea",
      inputLabel: "Optional message",
      inputPlaceholder: "Add a message for the requester...",
      showCancelButton: true,
      confirmButtonText: `Yes, ${status}`,
      confirmButtonColor: status === "accepted" ? "#22c55e" : "#ef4444",
      cancelButtonColor: "#6b7280"
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axios.post(
        `${baseUrl}/resource-requests/${requestId}/respond`,
        {
          requestId,
          status,
          message: result.value,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire({
        title: "Success!",
        text: `Request ${status} successfully!`,
        icon: "success",
        confirmButtonColor: "#22c55e"
      });

      fetchData(); // Refresh both resources and requests
    } catch (err) {
      console.error("Error responding to request:", err);
      const message =
        err.response?.data?.message ||
        "Failed to respond to the request. Please try again.";

      Swal.fire({
        title: "Error",
        text: message,
        icon: "error",
        confirmButtonColor: "#ef4444"
      });
    }
  };



  const getResourceIcon = (type) => {
    const icons = {
      firefighters: Users,
      firetrucks: Truck,
      helicopters: Plane,
      commanders: Shield
    };
    return icons[type] || Activity;
  };

  const getStatusColor = (status, canAccept = true) => {
    if (status === "completed") return "bg-green-100 text-green-800 border-green-200";
    if (status === "rejected") return "bg-red-100 text-red-800 border-red-200";
    if (status === "pending" && !canAccept) return "bg-orange-100 text-orange-800 border-orange-200";
    return "bg-blue-100 text-blue-800 border-blue-200";
  };

  const getStatusIcon = (status, canAccept = true) => {
    if (status === "completed") return <CheckCircle className="w-4 h-4" />;
    if (status === "rejected") return <XCircle className="w-4 h-4" />;
    if (status === "pending" && !canAccept) return <AlertTriangle className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };

  const filteredRequests = incomingRequests.filter(req => {
    const matchesStatus = filterStatus === "all" || req.status === filterStatus;
    const matchesSearch = req.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req._id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: incomingRequests.length,
    pending: incomingRequests.filter(r => r.status === "pending").length,
    accepted: incomingRequests.filter(r => r.status === "completed").length,
    rejected: incomingRequests.filter(r => r.status === "rejected").length
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2 flex items-center gap-3`}>
              <Shield className="w-10 h-10 text-blue-500" />
              Agency Dashboard
            </h1>
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage emergency response resources and requests
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-3 rounded-xl transition-all duration-200 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' : 'bg-white hover:bg-gray-50 text-gray-600'
                } shadow-lg hover:shadow-xl`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={fetchData}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                } text-white shadow-lg hover:shadow-xl`}
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Total Requests", value: stats.total, icon: BarChart3, color: "blue" },
            { title: "Pending", value: stats.pending, icon: Clock, color: "yellow" },
            { title: "Accepted", value: stats.accepted, icon: CheckCircle, color: "green" },
            { title: "Rejected", value: stats.rejected, icon: XCircle, color: "red" }
          ].map((stat, index) => (
            <div key={index} className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
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
          ))}
        </div>

        {/* Resources Overview */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl border shadow-lg p-6 mb-8`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-3`}>
              <Activity className="w-6 h-6 text-blue-500" />
              Your Resources
            </h2>
            {agencyResources?.locked && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700">
                <Lock className="w-4 h-4" />
                <span className="text-sm font-medium">Agency Locked</span>
              </div>
            )}
          </div>

          {agencyResources ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { key: "firefighters", label: "Firefighters", icon: Users, color: "blue" },
                { key: "firetrucks", label: "Fire Trucks", icon: Truck, color: "red" },
                { key: "helicopters", label: "Helicopters", icon: Plane, color: "green" },
                { key: "commanders", label: "Commanders", icon: Shield, color: "purple" }
              ].map((resource) => {
                const IconComponent = resource.icon;
                return (
                  <div key={resource.key} className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} hover:shadow-md transition-all duration-200`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg bg-${resource.color}-100`}>
                        <IconComponent className={`w-5 h-5 text-${resource.color}-600`} />
                      </div>
                      <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {resource.label}
                      </span>
                    </div>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {agencyResources.currentResources?.[resource.key] || 0}
                    </p>
                  </div>
                );
              })}

              {/* Heavy Equipment - Fixed to show from currentResources */}
              <div className={`md:col-span-2 lg:col-span-4 p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-orange-100">
                    <Settings className="w-5 h-5 text-orange-600" />
                  </div>
                  <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Heavy Equipment
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {agencyResources.heavyEquipment?.length > 0 ? (
                    agencyResources.heavyEquipment.map((equipment, index) => (
                      <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                        {equipment}
                      </span>
                    ))
                  ) : (
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      No heavy equipment available
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className={`ml-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading resources...</span>
            </div>
          )}
        </div>

        {/* Requests Section */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl border shadow-lg overflow-hidden`}>
          <div className={`${isDarkMode ? 'bg-gray-750' : 'bg-gray-50'} px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-3`}>
                <Bell className="w-6 h-6 text-blue-500" />
                Incoming Requests
              </h2>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  placeholder="Search by user name or request ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>

              <div className="relative">
                <Filter className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className={`pl-10 pr-8 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-6">
            {filteredRequests.length > 0 ? (
              <div className="space-y-4">
                {filteredRequests.map((req) => {
                  const canAccept = agencyResources && agencyHeavyEquipment !== null ? 
                    checkResourceAvailability(req.requiredResources, agencyResources, agencyHeavyEquipment) :
                    false;

                  // Check if request is locked (already processed)
                  const isLocked = req.status !== "pending";

                  return (
                    <div
                      key={req._id}
                      className={`border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                        } ${isLocked ? 'opacity-75' : ''}`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-500" />
                            <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {req.userId?.name || "Unknown User"}
                            </span>
                          </div>
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(req.status, canAccept)}`}>
                            {getStatusIcon(req.status, canAccept)}
                            {req.status === "completed" ? "✅ Accepted" :
                              req.status === "rejected" ? "❌ Rejected" :
                                req.status === "pending" && !canAccept ? "⚠️ Insufficient Resources" :
                                  "⏳ Pending"}
                          </div>
                          {isLocked && (
                            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs">
                              <Lock className="w-3 h-3" />
                              Locked
                            </div>
                          )}
                        </div>

                        <div className="text-right">
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {new Date(req.createdAt).toLocaleDateString()}
                          </p>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            ID: {req._id.slice(-8)}
                          </p>
                        </div>
                      </div>

                      {/* Required Resources */}
                      <div className="mb-4">
                        <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Required Resources:
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {[
                            { key: "firefighters", label: "Firefighters", icon: Users },
                            { key: "firetrucks", label: "Fire Trucks", icon: Truck },
                            { key: "helicopters", label: "Helicopters", icon: Plane },
                            { key: "commanders", label: "Commanders", icon: Shield }
                          ].map((resource) => {
                            const required = req.requiredResources[resource.key];
                            const available = agencyResources?.currentResources?.[resource.key] || 0;
                            const isInsufficient = required > available;
                            const IconComponent = resource.icon;

                            return (
                              <div key={resource.key} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-gray-50'} ${isInsufficient ? 'ring-2 ring-red-300' : ''}`}>
                                <div className="flex items-center gap-2 mb-1">
                                  <IconComponent className={`w-4 h-4 ${isInsufficient ? 'text-red-500' : 'text-blue-500'}`} />
                                  <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {resource.label}
                                  </span>
                                </div>
                                <p className={`text-sm font-bold ${isInsufficient ? 'text-red-600' : isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {required} {isInsufficient && `(${available} available)`}
                                </p>
                              </div>
                            );
                          })}
                        </div>

                        {/* Heavy Equipment */}
                        {req.requiredResources.heavyEquipment?.length > 0 && (
                          <div className="mt-3">
                            <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Heavy Equipment:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {req.requiredResources.heavyEquipment.map((equipment, index) => {
                                const isAvailable = agencyResources?.heavyEquipment?.includes(equipment);
                                return (
                                  <span key={index} className={`px-3 py-1 rounded-full text-sm font-medium ${isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                    {equipment} {isAvailable ? "✅" : "❌"}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                        {req.status === "pending" ? (
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleRespond(req._id, "accepted")}
                              disabled={!canAccept}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${canAccept
                                ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                              <CheckCircle className="w-4 h-4" />
                              Accept
                            </button>
                            <button
                              onClick={() => handleRespond(req._id, "rejected")}
                              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Lock className="w-4 h-4 text-gray-400" />
                            <span className={`text-sm italic ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Request has been {req.status === "completed" ? "accepted" : "rejected"} - No further actions available
                            </span>
                          </div>
                        )}

                        <button
                          onClick={() => setSelectedRequest(selectedRequest === req._id ? null : req._id)}
                          className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-colors ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                        >
                          <Eye className="w-4 h-4" />
                          {selectedRequest === req._id ? "Less" : "Details"}
                        </button>
                      </div>

                      {/* Expanded Details */}
                      {selectedRequest === req._id && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className={`font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Request Details
                              </h5>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Request ID:</span>
                                  <span className={`font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{req._id}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Created:</span>
                                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>{new Date(req.createdAt).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Status:</span>
                                  <span className={`font-medium ${req.status === 'completed' ? 'text-green-600' :
                                    req.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                                    }`}>
                                    {req.status === 'completed' ? 'Accepted' :
                                      req.status === 'rejected' ? 'Rejected' : 'Pending'}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Priority:</span>
                                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">Emergency</span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h5 className={`font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Resource Availability Check
                              </h5>
                              <div className="space-y-2 text-sm">
                                {Object.entries(req.requiredResources).map(([key, value]) => {
                                  if (key === 'heavyEquipment') return null;
                                  const available = agencyResources?.currentResources?.[key] || 0;
                                  const isEnough = value <= available;
                                  return (
                                    <div key={key} className="flex justify-between">
                                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                        {key.charAt(0).toUpperCase() + key.slice(1)}:
                                      </span>
                                      <span className={`font-medium ${isEnough ? 'text-green-600' : 'text-red-600'}`}>
                                        {value}/{available} {isEnough ? '✅' : '❌'}
                                      </span>
                                    </div>
                                  );
                                })}
                                {req.requiredResources.heavyEquipment?.length > 0 && (
                                  <div className="mt-2">
                                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Heavy Equipment:</span>
                                    <div className="mt-1">
                                      {req.requiredResources.heavyEquipment.map((equipment, index) => {
                                        const isAvailable = agencyResources?.heavyEquipment?.includes(equipment);
                                        return (
                                          <div key={index} className="flex justify-between">
                                            <span className="text-xs">{equipment}:</span>
                                            <span className={`text-xs font-medium ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                                              {isAvailable ? '✅ Available' : '❌ Not Available'}
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Bell className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  No requests found
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} mt-2`}>
                  {searchTerm || filterStatus !== "all"
                    ? "Try adjusting your filters"
                    : "No incoming requests at the moment"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}