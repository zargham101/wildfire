import React from 'react';
import { Eye, Edit, Trash2, Send } from 'lucide-react';

export const DataTable = ({
  data,
  category,
  onView,
  onEdit,
  onDelete,
  onSendRequest,
  isDarkTheme,
}) => {
  const getVisibleKeys = () => {
    if (!Array.isArray(data) || data.length === 0) return [];

    const keyMap = {
      'image-predictions': ['imageUrl', 'camImageUrl', 'predictionResult'],
      'feature-predictions': ['userName', 'input', 'prediction'],
      'resource-requests': ['userName', 'requiredResources', 'location', 'status'],
    };

    return keyMap[category] || Object.keys(data[0]).filter(key => !['_id', '__v', 'password'].includes(key));
  };

  const formatLabel = (label) =>
    label.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, str => str.toUpperCase());

  const renderCell = (key, value, item) => {
    if (key === 'userName') {
      if (item.userName) {
        return item.userName;
      }
      if (category === 'feature-predictions' && item.userId?.name) {
        return item.userId.name;
      }
      return value || 'Unknown';
    }

    if (key === 'input' && typeof value === 'object') {
      return (
        <div className="space-y-1 text-sm">
          {Object.entries(value).map(([k, v]) => (
            <div key={k}>
              <span className="font-medium">{k.replace(/_/g, ' ')}:</span> {String(v)}
            </div>
          ))}
        </div>
      );
    }

    if ((key === 'imageUrl' || key === 'camImageUrl') && value) {
      return <img src={value} alt="Prediction" className="w-16 h-16 object-cover rounded-lg" />;
    }

    if (key === 'requiredResources' && value) {
      return (
        <div className="space-y-1 text-sm">
          <div><span className="font-medium">Firefighters:</span> {value.firefighters}</div>
          <div><span className="font-medium">Firetrucks:</span> {value.firetrucks}</div>
          <div><span className="font-medium">Helicopters:</span> {value.helicopters}</div>
          <div><span className="font-medium">Commanders:</span> {value.commanders}</div>
          <div><span className="font-medium">Heavy Equipment:</span> {value.heavyEquipment?.join(', ')}</div>
        </div>
      );
    }

    if (key === 'location' && value) {
      return (
        <div className="space-y-1 text-sm">
          <div><span className="font-medium">Lat:</span> {value.latitude}</div>
          <div><span className="font-medium">Lng:</span> {value.longitude}</div>
        </div>
      );
    }

    if (key === 'status') {
      const statusColors = {
        completed: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        default: 'bg-gray-100 text-gray-800',
      };
      const colorClass = statusColors[value] || statusColors.default;
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
          {String(value)}
        </span>
      );
    }

    return String(value);
  };

  const visibleKeys = getVisibleKeys();

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border">
      <table className="w-full">
        <thead className={`${isDarkTheme ? 'bg-gray-800' : 'bg-gray-50'} border-b`}>
          <tr>
            {visibleKeys.map(key => (
              <th key={key} className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                {formatLabel(key)}
              </th>
            ))}
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map(item => (
            <tr key={item._id} className="hover:bg-gray-50 transition-colors">
              {visibleKeys.map(key => (
                <td key={key} className="px-6 py-4 text-sm text-gray-900">
                  {renderCell(key, item[key], item)}
                </td>
              ))}
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onView(item)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View"
                  >
                    <Eye size={16} />
                  </button>
                  {category === 'users' && (
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(item)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                  {category === 'resource-requests' && onSendRequest && (
                    <button
                      onClick={() => onSendRequest(item._id)}
                      disabled={item.sent}
                      className={`p-2 rounded-lg transition-colors ${
                        item.sent
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                      title={item.sent ? 'Request Sent' : 'Send Request'}
                    >
                      <Send size={16} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
