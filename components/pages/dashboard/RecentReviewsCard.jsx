import React from 'react';
import { Skeleton, Rate } from 'antd';
import DashboardCard from './DashboardCard';

const SeedlingIcon = () => (
  <svg 
    width="14" 
    height="14" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 22C12 22 12 18 12 15C12 12 10 10 7 10C4 10 2 12 2 15C2 18 4 20 7 20C7.5 20 8 19.9 8.5 19.7C8.2 18.8 8 17.9 8 17M12 22C12 22 12 18 12 15C12 12 14 10 17 10C20 10 22 12 22 15C22 18 20 20 17 20C16.5 20 16 19.9 15.5 19.7C15.8 18.8 16 17.9 16 17M12 22V12M12 12C12 12 12 8 12 5C12 2 10 0 7 0C4 0 2 2 2 5C2 8 4 10 7 10M12 12C12 12 12 8 12 5C12 2 14 0 17 0C20 0 22 2 22 5C22 8 20 10 17 10" />
  </svg>
);

const RecentReviewsCard = ({ data, loading }) => {
  const extra = (
    <button className="text-xs font-semibold text-green-700 hover:text-green-800">All Reviews</button>
  );

  return (
    <DashboardCard title="Recent Reviews" extra={extra}>
      {loading ? (
        <Skeleton active avatar paragraph={{ rows: 2 }} />
      ) : (
        <div className="max-h-[420px] overflow-y-auto pr-2 space-y-5 custom-scrollbar">
          {data?.map((r) => (
            <div key={r.id} className="group relative rounded-xl border border-gray-50 bg-gray-50/30 p-4 transition-all hover:bg-white hover:border-gray-100 hover:shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 overflow-hidden rounded-full ring-2 ring-white shadow-sm flex items-center justify-center bg-linear-to-br from-emerald-100 to-green-200 text-sm font-bold text-green-800">
                    {r.customerName?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{r.customerName}</p>
                    <p className="text-[10px] font-medium text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex dashboard-rate">
                  <Rate 
                    character={<SeedlingIcon />} 
                    disabled 
                    value={r.rating} 
                    style={{ color: '#fbbf24', fontSize: 12 }}
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="inline-block mb-2 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider">
                  {r.productName}
                </div>
                <p className="text-xs font-bold text-gray-900 mb-1">{r.title}</p>
                <p className="text-[11px] leading-relaxed text-gray-600 line-clamp-2 italic">"{r.description}"</p>
              </div>

              <div className="flex gap-2 border-t border-gray-100/50 pt-3">
                <button className="flex-1 rounded-lg bg-white px-3 py-1.5 text-[10px] font-bold text-green-700 shadow-sm border border-gray-100 transition-all hover:bg-green-700 hover:text-white">
                  APPROVE
                </button>
                <button className="flex-1 rounded-lg bg-white px-3 py-1.5 text-[10px] font-bold text-gray-500 shadow-sm border border-gray-100 transition-all hover:bg-gray-100">
                  HIDE
                </button>
                <button className="rounded-lg bg-white px-3 py-1.5 text-[10px] font-bold text-red-500 shadow-sm border border-gray-100 transition-all hover:bg-red-50 hover:border-red-100">
                  DELETE
                </button>
              </div>
            </div>
          ))}
          {!data?.length && (
            <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-gray-50 rounded-xl">
              <span className="text-sm text-gray-400 font-medium">No reviews yet</span>
            </div>
          )}
        </div>
      )}
    </DashboardCard>
  );
};

export default RecentReviewsCard;
