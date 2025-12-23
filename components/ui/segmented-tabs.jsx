import React from 'react';

const SegmentedTabs = ({ tabs, activeTab, onChange, className = '' }) => {
  return (
    <div className={`mb-4 ${className}`}>
      <div className="overflow-x-auto">
        <div className="inline-flex min-w-full rounded-full bg-gray-100 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition md:px-6 md:text-sm ${
                activeTab === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SegmentedTabs;
