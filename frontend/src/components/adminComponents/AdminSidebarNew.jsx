import React from 'react';
import { Users, Camera, BarChart3, AlertTriangle, Sun, Moon, Plus } from 'lucide-react';

const menuItems = [
  { key: 'users', label: 'Users', icon: Users },
  { key: 'image-predictions', label: 'Image Predictions', icon: Camera },
  { key: 'feature-predictions', label: 'Processed Predictions', icon: BarChart3 },
  { key: 'resource-requests', label: 'Resource Requests', icon: AlertTriangle },
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
  return (
    <aside className={`fixed left-0 top-16 h-full w-64 ${isDarkTheme ? 'bg-gray-900' : 'bg-gray-800'} text-white p-6 z-10 transition-all duration-300 lg:relative lg:translate-x-0 transform -translate-x-full lg:block`}>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <button
          onClick={() => setIsDarkTheme(!isDarkTheme)}
          className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          {isDarkTheme ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Create Button */}
      <button
        onClick={onCreateClick}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors mb-6 font-medium"
      >
        <Plus size={20} />
        Create New
      </button>

      <nav className="space-y-2">
        {menuItems.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => key === 'resource-requests' ? onResourceRequestsClick() : setSelectedCategory(key)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              selectedCategory === key
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-700 text-gray-300 hover:text-white'
            }`}
          >
            <Icon size={20} />
            <span className="flex-1 text-left">{label}</span>
            {key === 'resource-requests' && newRequestsCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                {newRequestsCount}
              </span>
            )}
          </button>
        ))}
      </nav>
    </aside>
  );
};
