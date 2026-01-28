import React from 'react';
import { Skeleton } from 'antd';
import Badge from '@/components/ui/badge';
import DashboardCard from './DashboardCard';

const ActivePromotionsCard = ({ data, loading }) => {
  const extra = (
    <button className="text-xs font-semibold text-green-700 hover:text-green-800">New Code</button>
  );

  return (
    <DashboardCard title="Active Promotions" extra={extra}>
      {loading ? (
        <Skeleton active paragraph={{ rows: 3 }} />
      ) : (
        <div className="space-y-4">
          {data?.map((p, i) => (
            <div key={i} className="relative overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)] transition-all hover:shadow-md">
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-gray-50 border border-gray-100"></div>
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-gray-50 border border-gray-100"></div>

              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="inline-block rounded-lg border-2 border-dashed border-green-200 bg-green-50 px-3 py-1 text-sm font-bold text-green-700 font-mono tracking-wider">
                    {p.code}
                  </div>
                </div>
                <Badge variant="success" size="sm">Active</Badge>
              </div>

              <div className="space-y-1 mb-4">
                <p className="text-xs font-bold text-gray-900">{p.type === 'PERCENTAGE' ? `${p.value}% Off` : `AED ${p.value} Off`}</p>
                <p className="text-[10px] text-gray-500 line-clamp-1">{p.description}</p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                  <span className="text-[10px] font-semibold text-gray-600">{p.usageCount} uses</span>
                </div>
                <span className="text-[10px] text-gray-400 font-medium">exp. {p.expiresAt ? new Date(p.expiresAt).toLocaleDateString() : 'Never'}</span>
              </div>
            </div>
          ))}
          {!data?.length && (
            <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-gray-50 rounded-xl">
              <span className="text-sm text-gray-400 font-medium">No active promotions</span>
            </div>
          )}
        </div>
      )}
    </DashboardCard>
  );
};

export default ActivePromotionsCard;
