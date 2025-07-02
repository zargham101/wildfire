import React from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

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
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      iconColor: 'text-green-600',
    },
    {
      label: 'Pending Requests',
      value: pendingCount,
      icon: Clock,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      iconColor: 'text-yellow-600',
    },
    {
      label: 'Total Requests',
      value: totalCount,
      icon: AlertCircle,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      iconColor: 'text-blue-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map(({ label, value, icon: Icon, bgColor, textColor, iconColor }) => (
        <div key={label} className={`${bgColor} p-6 rounded-xl shadow-sm border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${textColor}`}>{label}</p>
              <p className={`text-3xl font-bold ${textColor} mt-2`}>{value}</p>
            </div>
            <Icon className={`${iconColor} w-8 h-8`} />
          </div>
        </div>
      ))}
    </div>
  );
};
