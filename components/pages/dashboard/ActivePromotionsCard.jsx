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
            <div
              key={i}
              className="relative overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)] transition-all hover:shadow-md"
            >
              <div className="absolute top-1/2 -left-3 h-6 w-6 -translate-y-1/2 rounded-full border border-gray-100 bg-gray-50"></div>
              <div className="absolute top-1/2 -right-3 h-6 w-6 -translate-y-1/2 rounded-full border border-gray-100 bg-gray-50"></div>

              <div className="mb-3 flex items-start justify-between">
                <div>
                  <div className="inline-block rounded-lg border-2 border-dashed border-green-200 bg-green-50 px-3 py-1 font-mono text-sm font-bold tracking-wider text-green-700">
                    {p.code}
                  </div>
                </div>
                <Badge variant="success" size="sm">
                  Active
                </Badge>
              </div>

              <div className="mb-4 space-y-1">
                <p className="text-xs font-bold text-gray-900">
                  {p.type === 'PERCENTAGE' ? `${p.value}% Off` : `AED ${p.value} Off`}
                </p>
                <p className="line-clamp-1 text-[10px] text-gray-500">{p.description}</p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                  <span className="text-[10px] font-semibold text-gray-600">
                    {p.usageCount} uses
                  </span>
                </div>
                <span className="text-[10px] font-medium text-gray-400">
                  exp. {p.expiresAt ? new Date(p.expiresAt).toLocaleDateString() : 'Never'}
                </span>
              </div>
            </div>
          ))}
          {!data?.length && (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-50 py-12">
              <span className="text-sm font-medium text-gray-400">No active promotions</span>
            </div>
          )}
        </div>
      )}
    </DashboardCard>
  );
};

export default ActivePromotionsCard;
