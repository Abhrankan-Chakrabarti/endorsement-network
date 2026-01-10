import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className={`bg-white rounded-lg p-4 shadow-md border-l-4 border-${color}-500`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-600">{title}</div>
          <div className={`text-2xl font-bold text-${color}-600`}>{value}</div>
        </div>
        <Icon className={`text-${color}-300`} size={32} />
      </div>
    </div>
  );
};

export default StatsCard;
