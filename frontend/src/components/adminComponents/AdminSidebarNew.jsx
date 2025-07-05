import React from 'react';
import { Users, Camera, BarChart3, AlertTriangle, Sun, Moon, Plus } from 'lucide-react';

const menuItems = [
  { key: 'users', label: 'Users', icon: Users, color: 'blue' },
  { key: 'image-predictions', label: 'Image Predictions', icon: Camera, color: 'purple' },
  { key: 'feature-predictions', label: 'Processed Predictions', icon: BarChart3, color: 'green' },
  { key: 'resource-requests', label: 'Resource Requests', icon: AlertTriangle, color: 'orange' },
];

export const AdminSidebar = ({
  selectedCategory,
  setSelectedCategory,
  newRequestsCount,
  isDarkTheme,
  setIsDarkTheme,
  onResourceRequestsClick,
  onCreateClick,
}) => {
  const getColorClasses = (color, isSelected) => {
    const colors = {
      blue: isSelected 
        ? 'bg-blue-500 text-white border-blue-500' 
        : 'text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300',
      purple: isSelected 
        ? 'bg-purple-500 text-white border-purple-500' 
        : 'text-purple-600 border-purple-200 hover:bg-purple-50 hover:border-purple-300',
      green: isSelected 
        ? 'bg-green-500 text-white border-green-500' 
        : 'text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300',
      orange: isSelected 
        ? 'bg-orange-500 text-white border-orange-500' 
        : 'text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300',
    };
    return colors[color] || colors.blue;
  };

  return (
    <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 ${
      isDarkTheme ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
    } border-r shadow-lg z-10 transition-all duration-300 lg:relative lg:top-0 lg:h-screen lg:translate-x-0 transform -translate-x-full lg:block overflow-y-auto`}>
      
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`text-xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              Admin Panel
            </h2>
            <p className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
              Management Dashboard
            </p>
          </div>
          <button
            onClick={() => setIsDarkTheme(!isDarkTheme)}
            className={`p-2 rounded-lg transition-colors ${
              isDarkTheme ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            {isDarkTheme ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Create Button */}
        <button
          onClick={onCreateClick}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus size={20} />
          Create New
        </button>
      </div>

      {/* Navigation Tabs */}
      <nav className="p-6">
        <h3 className={`text-xs font-semibold uppercase tracking-wider mb-4 ${
          isDarkTheme ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Navigation
        </h3>
        <div className="space-y-3">
          {menuItems.map(({ key, label, icon: Icon, color }) => {
            const isSelected = selectedCategory === key;
            return (
              <button
                key={key}
                onClick={() => key === 'resource-requests' ? onResourceRequestsClick() : setSelectedCategory(key)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
                  isDarkTheme 
                    ? isSelected 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'text-gray-300 border-gray-700 hover:bg-gray-800 hover:border-gray-600'
                    : getColorClasses(color, isSelected)
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  isSelected 
                    ? 'bg-white/20' 
                    : isDarkTheme 
                      ? 'bg-gray-800' 
                      : `bg-${color}-100`
                }`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium">{label}</div>
                  <div className={`text-xs ${
                    isSelected 
                      ? 'text-white/70' 
                      : isDarkTheme 
                        ? 'text-gray-500' 
                        : 'text-gray-500'
                  }`}>
                    Manage {label.toLowerCase()}
                  </div>
                </div>
                {key === 'resource-requests' && newRequestsCount > 0 && (
                  <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[24px] text-center font-bold animate-pulse">
                    {newRequestsCount}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Quick Stats */}
      <div className={`mx-6 mb-6 p-4 rounded-xl ${
        isDarkTheme ? 'bg-gray-800' : 'bg-gray-50'
      }`}>
        <h4 className={`text-sm font-medium mb-2 ${
          isDarkTheme ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Quick Access
        </h4>
        <div className="space-y-2">
          <div className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
            Current Section: <span className="font-medium capitalize">{selectedCategory.replace('-', ' ')}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};