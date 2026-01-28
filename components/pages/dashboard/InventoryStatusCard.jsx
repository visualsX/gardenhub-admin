import React from 'react';
import { Skeleton } from 'antd';
import CheckCircle from '@/public/shared/status-success.svg';
import DashboardCard from './DashboardCard';

const InventoryStatusCard = ({ data, loading }) => {
  return (
    <DashboardCard title="Inventory Status">
      {loading ? (
        <Skeleton active paragraph={{ rows: 3 }} />
      ) : (
        <div className="space-y-6">
          {data?.slice(0, 4).map((item, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1 mr-4">
                  <div className="text-sm font-semibold text-gray-900 truncate">{item.productName}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-tight">{item.sku}</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${item.currentStock === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                    {item.currentStock} left
                  </div>
                </div>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.currentStock === 0 ? 'bg-red-500' : 'bg-amber-500'}`}
                  style={{ width: `${Math.min(100, (item.currentStock / (item.lowStockThreshold || 10)) * 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
          {!data?.length && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-3 h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-sm font-bold text-gray-900">All Good!</div>
              <div className="text-xs text-gray-500">Your inventory is healthy.</div>
            </div>
          )}
        </div>
      )}
    </DashboardCard>
  );
};

export default InventoryStatusCard;
