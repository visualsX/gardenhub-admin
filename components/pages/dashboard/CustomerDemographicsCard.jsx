import React from 'react';
import { Skeleton } from 'antd';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import DashboardCard from './DashboardCard';

const CustomerDemographicsCard = ({ data, loading }) => {
  const hasCustomerData = data && (data.newCustomersPercent > 0 || data.returningCustomersPercent > 0);
  const customerData = hasCustomerData
    ? [
      {
        name: 'New Customers',
        value: data.newCustomersPercent,
        color: '#ef4444', // Slate-consistent red
      },
      {
        name: 'Returning Customers',
        value: data.returningCustomersPercent,
        color: '#15803d', // Brand green
      },
    ]
    : [];

  return (
    <DashboardCard title="Customer Demographics">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Skeleton.Button active style={{ width: 140, height: 140, borderRadius: '50%' }} />
          <div className="mt-8 w-full"><Skeleton active paragraph={{ rows: 2 }} /></div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customerData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {customerData.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 grid w-full grid-cols-2 gap-4">
            {customerData.map((item) => (
              <div key={item.name} className="flex flex-col items-center rounded-lg bg-gray-50 py-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-[10px] font-bold uppercase text-gray-500">{item.name}</span>
                </div>
                <span className="text-xl font-bold text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardCard>
  );
};

export default CustomerDemographicsCard;
