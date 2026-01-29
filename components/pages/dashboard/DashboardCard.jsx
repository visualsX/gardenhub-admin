import React from 'react';

const DashboardCard = ({ title, extra, children, className = '' }) => {
  return (
    <div
      className={`flex flex-col rounded-xl border border-gray-100 bg-white p-6 shadow-sm ${className}`}
    >
      {(title || extra) && (
        <div className="mb-8 flex items-center justify-between">
          {title && <h2 className="text-lg font-bold text-gray-900">{title}</h2>}
          {extra}
        </div>
      )}
      {children}
    </div>
  );
};

export default DashboardCard;
