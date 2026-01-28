import React from 'react';
import { Skeleton } from 'antd';
import ArrowDown from '@/public/shared/down-red.svg';
import ArrowUp from '@/public/shared/up-green.svg';

const StatsGrid = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <Skeleton active paragraph={{ rows: 1 }} />
          </div>
        ))}
      </div>
    );
  }

  const statsItems = [
    { label: 'Total Sales', value: `AED ${stats?.totalSales?.toLocaleString() || '0'}`, change: stats?.salesChangePercent },
    { label: 'Total Orders', value: stats?.totalOrders?.toLocaleString() || '0', change: stats?.ordersChangePercent },
    { label: 'Active Products', value: stats?.activeProducts || '0', change: stats?.productsChangePercent },
    { label: 'Low Stock', value: stats?.lowStockAlerts || '0', isAlert: true },
    { label: 'Pending Orders', value: stats?.pendingOrders || '0', isWarning: true },
  ];

  return (
    <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
      {statsItems.map((stat, i) => (
        <div key={i} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="text-xs font-medium uppercase tracking-wider text-gray-500">{stat.label}</div>
          <div className={`mt-2 text-2xl font-bold ${stat.isAlert && stat.value > 0 ? 'text-red-600' : stat.isWarning && stat.value > 0 ? 'text-amber-600' : 'text-gray-900'}`}>
            {stat.value}
          </div>
          {stat.change !== undefined && (
            <div className={`mt-2 flex items-center text-xs font-medium ${stat.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stat.change >= 0 ? <ArrowUp size={14} className="mr-1" /> : <ArrowDown size={14} className="mr-1" />}
              {Math.abs(stat.change)}% <span className="ml-1 text-gray-400">vs month</span>
            </div>
          )}
          {(stat.isAlert || stat.isWarning) && (
            <div className="mt-2 text-xs text-gray-400 italic">Needs attention</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
