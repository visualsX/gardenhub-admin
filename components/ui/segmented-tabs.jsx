import React from 'react';

const SegmentedTabs = ({ tabs, activeTab, onChange, className = '' }) => {
  return (
    <div className={`mb-4 flex rounded-full bg-gray-100 p-1 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`flex-1 rounded-full px-6 py-2 text-sm font-semibold text-nowrap transition ${
            activeTab === tab.key
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default SegmentedTabs;
