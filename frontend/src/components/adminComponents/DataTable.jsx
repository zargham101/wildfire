import React, { useState, useMemo } from 'react';
import { Eye, Edit, Trash2, Send, BarChart3, ArrowRight, Search, Filter, SortAsc, SortDesc, Calendar, User, Mail, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export const DataTable = ({
  data,
  category,
  onView,
  onEdit,
  onDelete,
  onSendRequest,
  isDarkTheme,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [hoveredCard, setHoveredCard] = useState(null);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(item => {
      const searchString = searchTerm.toLowerCase();
      return Object.values(item).some(value => 
        String(value).toLowerCase().includes(searchString)
      );
    });

    return filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [data, searchTerm, sortBy, sortOrder]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatLabel = (label) =>
    label.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, str => str.toUpperCase());

  // Helper function to format location data for feature predictions
  const formatLocationData = (item) => {
    // Check if there's a location field in the item
    if (item.location && typeof item.location === 'string') {
      // Split the location string (assuming format like "lat,lon")
      const locationParts = item.location.split(',');
      if (locationParts.length >= 2) {
        return [
          { key: 'Latitude', value: locationParts[0].trim() },
          { key: 'Longitude', value: locationParts[1].trim() }
        ];
      }
    }
    
    // Check if there's location data in fireData
    if (item.fireData && item.fireData.location && typeof item.fireData.location === 'string') {
      const locationParts = item.fireData.location.split(',');
      if (locationParts.length >= 2) {
        return [
          { key: 'Latitude', value: locationParts[0].trim() },
          { key: 'Longitude', value: locationParts[1].trim() }
        ];
      }
    }
    
    // Check if input contains location data
    if (item.input) {
      let inputData = item.input;
      
      // If input is an array, take the first object
      if (Array.isArray(inputData) && inputData.length > 0) {
        inputData = inputData[0];
      }
      
      // If inputData has location field
      if (inputData && typeof inputData === 'object' && inputData.location) {
        if (typeof inputData.location === 'string') {
          const locationParts = inputData.location.split(',');
          if (locationParts.length >= 2) {
            return [
              { key: 'Latitude', value: locationParts[0].trim() },
              { key: 'Longitude', value: locationParts[1].trim() }
            ];
          }
        }
      }
      
      // Check for direct lat/lon fields in input
      if (inputData && typeof inputData === 'object') {
        const lat = inputData.latitude || inputData.lat;
        const lon = inputData.longitude || inputData.lon || inputData.lng;
        
        if (lat && lon) {
          return [
            { key: 'Latitude', value: String(lat) },
            { key: 'Longitude', value: String(lon) }
          ];
        }
      }
    }
    
    // Fallback: return "No location data"
    return [{ key: 'Location', value: 'No location data available' }];
  };

  // Helper function to format input data for feature predictions
  const formatInputData = (input) => {
    if (!input) return 'No input data';
    
    // If it's an array, take the first object
    if (Array.isArray(input)) {
      if (input.length === 0) return 'No input data';
      const firstInput = input[0];
      if (typeof firstInput === 'object' && firstInput !== null) {
        return Object.entries(firstInput).slice(0, 4).map(([key, value]) => ({
          key: formatLabel(key),
          value: String(value)
        }));
      }
      return String(firstInput);
    }
    
    // If it's an object
    if (typeof input === 'object' && input !== null) {
      return Object.entries(input).slice(0, 4).map(([key, value]) => ({
        key: formatLabel(key),
        value: String(value)
      }));
    }
    
    // If it's a string or other primitive
    return String(input);
  };

  // Loading animation component
  const LoadingCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className={`${isDarkTheme ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border p-6`}>
          <div className="animate-pulse">
            <div className={`h-4 ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-200'} rounded w-3/4 mb-4`}></div>
            <div className={`h-3 ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-200'} rounded w-1/2 mb-2`}></div>
            <div className={`h-3 ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-200'} rounded w-2/3 mb-4`}></div>
            <div className="flex gap-2">
              <div className={`h-8 ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-200'} rounded w-16`}></div>
              <div className={`h-8 ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-200'} rounded w-16`}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (!data || data.length === 0) {
    return (
      <div className={`${isDarkTheme ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border p-12 text-center`}>
        <div className={`text-gray-400 mb-4`}>
          <BarChart3 size={48} className="mx-auto" />
        </div>
        <h3 className={`text-lg font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-900'} mb-2`}>
          No Data Available
        </h3>
        <p className={`${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
          There are no {category.replace('-', ' ')} to display at the moment.
        </p>
      </div>
    );
  }

  // Special grid layout for image predictions
  if (category === 'image-predictions') {
    return (
      <div className="space-y-8">
        {/* Search and Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search size={20} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder="Search predictions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                isDarkTheme 
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
              } focus:ring-2 focus:ring-blue-500/20`}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                isDarkTheme 
                  ? 'border-gray-600 hover:bg-gray-700 text-white' 
                  : 'border-gray-200 hover:bg-gray-50 text-gray-700'
              } hover:shadow-md transform hover:scale-105`}
            >
              {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
              <span className="text-sm font-medium">Sort</span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {filteredAndSortedData.map((item, index) => (
            <div 
              key={item._id} 
              className={`${isDarkTheme ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* User Info Header */}
              <div className="flex items-center gap-2 mb-4">
                <User size={16} className="text-blue-500" />
                <span className={`text-sm font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                  Prediction by: {item.userName || 'Unknown User'}
                </span>
                <span className={`text-xs ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>
                  • {formatDate(item.createdAt)}
                </span>
              </div>

              {/* Images Section */}
              <div className="flex items-center justify-center gap-8 mb-6">
                {/* Provided Image */}
                <div className="text-center">
                  <h4 className={`text-sm font-medium mb-3 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                    Provided Image
                  </h4>
                  <div className="relative group">
                    <img 
                      src={item.imageUrl} 
                      alt="Provided Image" 
                      className="w-32 h-32 object-cover rounded-xl shadow-lg transition-transform group-hover:scale-110 duration-300" 
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-colors duration-300" />
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex flex-col items-center">
                  <div className={`p-3 rounded-full ${isDarkTheme ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'} mb-2 animate-pulse`}>
                    <ArrowRight size={24} />
                  </div>
                  <span className={`text-xs font-medium ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                    Analysis Result
                  </span>
                </div>

                {/* Predicted Area */}
                <div className="text-center">
                  <h4 className={`text-sm font-medium mb-3 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                    Predicted Area
                  </h4>
                  <div className="relative group">
                    <img 
                      src={item.camImageUrl} 
                      alt="Predicted Area" 
                      className="w-32 h-32 object-cover rounded-xl shadow-lg transition-transform group-hover:scale-110 duration-300" 
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-colors duration-300" />
                  </div>
                </div>
              </div>

              {/* Prediction Result */}
              <div className={`${isDarkTheme ? 'bg-gray-900 border-gray-600' : 'bg-gray-50 border-gray-200'} rounded-xl p-4 mb-4 border`}>
                <h4 className={`text-sm font-semibold mb-2 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                  Prediction Result
                </h4>
                <p className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                  {item.predictionResult || 'No prediction result available'}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => onView(item)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isDarkTheme 
                      ? 'bg-blue-900 text-blue-300 hover:bg-blue-800' 
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  } hover:shadow-md transform hover:scale-105`}
                  title="View Details"
                >
                  <Eye size={16} />
                  <span className="text-sm font-medium">View Details</span>
                </button>
                <button
                  onClick={() => onDelete(item)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isDarkTheme 
                      ? 'bg-red-900 text-red-300 hover:bg-red-800' 
                      : 'bg-red-50 text-red-600 hover:bg-red-100'
                  } hover:shadow-md transform hover:scale-105`}
                  title="Delete"
                >
                  <Trash2 size={16} />
                  <span className="text-sm font-medium">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Card layout for other categories
  return (
    <div className="space-y-6">
      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={20} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`} />
          <input
            type="text"
            placeholder={`Search ${category.replace('-', ' ')}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 ${
              isDarkTheme 
                ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
            } focus:ring-2 focus:ring-blue-500/20`}
          />
        </div>
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
              isDarkTheme 
                ? 'bg-gray-800 border-gray-600 text-white' 
                : 'bg-white border-gray-200 text-gray-900'
            } focus:ring-2 focus:ring-blue-500/20`}
          >
            <option value="createdAt">Date</option>
            {category === 'users' && <option value="name">Name</option>}
            {category === 'users' && <option value="email">Email</option>}
            {category === 'resource-requests' && <option value="status">Status</option>}
            {category === 'feature-predictions' && <option value="userName">User</option>}
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
              isDarkTheme 
                ? 'border-gray-600 hover:bg-gray-700 text-white' 
                : 'border-gray-200 hover:bg-gray-50 text-gray-700'
            } hover:shadow-md transform hover:scale-105`}
          >
            {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedData.map((item, index) => (
          <div
            key={item._id}
            onMouseEnter={() => setHoveredCard(item._id)}
            onMouseLeave={() => setHoveredCard(null)}
            className={`${isDarkTheme ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Users Card */}
            {category === 'users' && (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <User size={16} className="text-blue-500" />
                      <h3 className={`font-semibold text-lg ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                        {item.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Mail size={14} className={`${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`} />
                      <p className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                        {item.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className={`${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`} />
                      <p className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                        Joined {formatDate(item.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Quick Overview on Hover */}
                {hoveredCard === item._id && (
                  <div className={`${isDarkTheme ? 'bg-gray-900 border-gray-600' : 'bg-gray-50 border-gray-200'} rounded-lg p-3 mb-4 border animate-fadeIn`}>
                    <p className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                      User ID: {item._id?.slice(-8)}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => onView(item)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all duration-200 ${
                      isDarkTheme 
                        ? 'bg-blue-900 text-blue-300 hover:bg-blue-800' 
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    } hover:shadow-md transform hover:scale-105`}
                  >
                    <Eye size={14} />
                    <span className="text-sm font-medium">View</span>
                  </button>
                  <button
                    onClick={() => onEdit(item)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all duration-200 ${
                      isDarkTheme 
                        ? 'bg-orange-900 text-orange-300 hover:bg-orange-800' 
                        : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                    } hover:shadow-md transform hover:scale-105`}
                  >
                    <Edit size={14} />
                    <span className="text-sm font-medium">Edit</span>
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className={`flex items-center justify-center p-2 rounded-lg transition-all duration-200 ${
                      isDarkTheme 
                        ? 'bg-red-900 text-red-300 hover:bg-red-800' 
                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                    } hover:shadow-md transform hover:scale-105`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </>
            )}

            {/* Feature Predictions Card */}
            {category === 'feature-predictions' && (
              <>
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 size={16} className="text-purple-500" />
                    <h3 className={`font-semibold text-lg ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                      {item.userName || 'Unknown User'}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar size={14} className={`${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`} />
                    <p className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                  
                  <div className={`${isDarkTheme ? 'bg-gray-900 border-gray-600' : 'bg-gray-50 border-gray-200'} rounded-lg p-3 border mb-3`}>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={14} className="text-blue-500" />
                      <h4 className={`text-xs font-medium ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                        Location
                      </h4>
                    </div>
                    {(() => {
                      const locationData = formatLocationData(item);
                      return (
                        <div className="space-y-1">
                          {locationData.map((param, idx) => (
                            <div key={idx} className="flex justify-between text-xs">
                              <span className={`${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                                {param.key}:
                              </span>
                              <span className={`${isDarkTheme ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
                                {param.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                  
                  <div className={`${isDarkTheme ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'} rounded-lg p-3 border`}>
                    <h4 className={`text-xs font-medium mb-1 ${isDarkTheme ? 'text-green-400' : 'text-green-700'}`}>
                      Prediction Result
                    </h4>
                    <p className={`text-sm font-semibold ${isDarkTheme ? 'text-green-300' : 'text-green-800'}`}>
                      {Array.isArray(item.prediction) ? item.prediction.join(', ') : item.prediction}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onView(item)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all duration-200 ${
                      isDarkTheme 
                        ? 'bg-blue-900 text-blue-300 hover:bg-blue-800' 
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    } hover:shadow-md transform hover:scale-105`}
                  >
                    <Eye size={14} />
                    <span className="text-sm font-medium">View</span>
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className={`flex items-center justify-center p-2 rounded-lg transition-all duration-200 ${
                      isDarkTheme 
                        ? 'bg-red-900 text-red-300 hover:bg-red-800' 
                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                    } hover:shadow-md transform hover:scale-105`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </>
            )}

            {/* Resource Requests Card */}
            {category === 'resource-requests' && (
              <>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={16} className="text-orange-500" />
                      <h3 className={`font-semibold text-lg ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                        {item.userName || 'Unknown User'}
                      </h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      item.status === 'completed' 
                        ? 'bg-green-100 text-green-800 border-green-200' 
                        : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  {item.location && (
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin size={14} className={`${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`} />
                      <p className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                        {item.location.latitude}, {item.location.longitude}
                      </p>
                    </div>
                  )}

                  {item.requiredResources && (
                    <div className={`${isDarkTheme ? 'bg-gray-900 border-gray-600' : 'bg-gray-50 border-gray-200'} rounded-lg p-3 border mb-3`}>
                      <h4 className={`text-xs font-medium mb-2 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                        Required Resources
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className={`${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                            {item.requiredResources.firefighters} Firefighters
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className={`${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                            {item.requiredResources.firetrucks} Firetrucks
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className={`${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                            {item.requiredResources.helicopters} Helicopters
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className={`${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                            {item.requiredResources.commanders} Commanders
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {/* <button
                    onClick={() => onView(item)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all duration-200 ${
                      isDarkTheme 
                        ? 'bg-blue-900 text-blue-300 hover:bg-blue-800' 
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    } hover:shadow-md transform hover:scale-105`}
                  >
                    <Eye size={14} />
                    <span className="text-sm font-medium">View</span>
                  </button> */}
                  {onSendRequest && (
                    <button
                      onClick={() => onSendRequest(item._id)}
                      disabled={item.sent}
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all duration-200 ${
                        item.sent
                          ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                          : isDarkTheme 
                            ? 'bg-green-900 text-green-300 hover:bg-green-800' 
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                      } hover:shadow-md transform hover:scale-105`}
                    >
                      <Send size={14} />
                      <span className="text-sm font-medium">
                        {item.sent ? 'Sent' : 'Send'}
                      </span>
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(item)}
                    className={`flex items-center justify-center p-2 rounded-lg transition-all duration-200 ${
                      isDarkTheme 
                        ? 'bg-red-900 text-red-red-300 hover:bg-red-800' 
                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                    } hover:shadow-md transform hover:scale-105`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {filteredAndSortedData.length === 0 && searchTerm && (
        <div className={`${isDarkTheme ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border p-12 text-center`}>
          <div className={`text-gray-400 mb-4`}>
            <Search size={48} className="mx-auto" />
          </div>
          <h3 className={`text-lg font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-900'} mb-2`}>
            No Results Found
          </h3>
          <p className={`${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
            Try adjusting your search terms or filters.
          </p>
        </div>
      )}
    </div>
  );
};