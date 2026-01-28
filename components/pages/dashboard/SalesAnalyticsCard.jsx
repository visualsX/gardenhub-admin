import React from 'react';
import { Skeleton } from 'antd';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import DashboardCard from './DashboardCard';

const SalesAnalyticsCard = ({ data, loading, selectedPeriod, onPeriodChange }) => {
  const periods = ['Year', 'Month', 'Week'];

  const extra = (
    <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
      {periods.map((p) => (
        <button
          key={p}
          onClick={() => onPeriodChange(p)}
          className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${selectedPeriod === p.toLowerCase()
            ? 'bg-white text-green-700 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          {p}
        </button>
      ))}
    </div>
  );

  return (
    <DashboardCard title="Sales Analytics" extra={extra}>
      {loading ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : (
        <div className="flex-1">
          <div className="mb-8 flex gap-10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Revenue</span>
              <div className="text-2xl font-bold text-gray-900">AED {data?.totalRevenue?.toLocaleString()}</div>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Orders</span>
              <div className="text-2xl font-bold text-gray-900">{data?.totalOrders}</div>
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.dataPoints}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#15803d" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#15803d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(v) => [`AED ${v.toLocaleString()}`, 'Revenue']}
                  labelStyle={{ color: '#64748b', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#15803d"
                  strokeWidth={2}
                  fill="url(#colorSales)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </DashboardCard>
  );
};

export default SalesAnalyticsCard;
