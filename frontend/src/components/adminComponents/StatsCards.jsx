import React from 'react';
import { CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react';

export const StatsCards = ({
  completedCount,
  pendingCount,
  totalCount,
}) => {
  const stats = [
    {
      label: 'Completed Requests',
      value: completedCount,
      icon: CheckCircle,
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
      textColor: 'text-green-700',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200',
      change: '+12%',
      changeType: 'positive'
    },
    {
      label: 'Pending Requests',
      value: pendingCount,
      icon: Clock,
      bgColor: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
      textColor: 'text-yellow-700',
      iconColor: 'text-yellow-600',
      borderColor: 'border-yellow-200',
      change: '+5%',
      changeType: 'neutral'
    },
    {
      label: 'Total Requests',
      value: totalCount,
      icon: AlertCircle,
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      textColor: 'text-blue-700',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      change: '+8%',
      changeType: 'positive'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map(({ label, value, icon: Icon, bgColor, textColor, iconColor, borderColor, change, changeType }) => (
        <div key={label} className={`${bgColor} p-6 rounded-xl shadow-sm border-2 ${borderColor} hover:shadow-md transition-all duration-200 group`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className={`text-sm font-medium ${textColor} mb-1`}>{label}</p>
              <div className="flex items-baseline gap-2">
                <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  changeType === 'positive' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {change}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp size={12} className={changeType === 'positive' ? 'text-green-600' : 'text-gray-500'} />
                <span className="text-xs text-gray-600">vs last month</span>
              </div>
            </div>
            <div className={`p-3 rounded-xl ${iconColor} bg-white/50 group-hover:scale-110 transition-transform duration-200`}>
              <Icon className="w-8 h-8" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};