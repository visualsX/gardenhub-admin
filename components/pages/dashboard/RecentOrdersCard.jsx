import React from 'react';
import { Table, Skeleton } from 'antd';
import DashboardCard from './DashboardCard';

const orderColumns = [
  {
    title: 'Order ID',
    dataIndex: 'id',
    key: 'id',
    render: (id) => <span className="font-medium text-gray-900">#{id}</span>,
  },
  {
    title: 'Customer',
    dataIndex: 'customerName',
    key: 'customerName',
    render: (name) => <span className="text-gray-700">{name}</span>,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
      const statusConfig = {
        Pending: 'bg-amber-50 text-amber-700 border-amber-100',
        Processing: 'bg-blue-50 text-blue-700 border-blue-100',
        Completed: 'bg-green-50 text-green-700 border-green-100',
        Cancelled: 'bg-red-50 text-red-700 border-red-100',
      };
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig[status] || 'bg-gray-50 text-gray-600 border-gray-100'}`}>
          {status}
        </span>
      );
    },
  },
  {
    title: 'Date',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (date) => (
      <span className="text-gray-500">
        {new Date(date).toLocaleDateString()}
      </span>
    ),
  },
  {
    title: 'Amount',
    dataIndex: 'grandTotal',
    key: 'grandTotal',
    align: 'right',
    render: (total) => (
      <span className="font-semibold text-gray-900">
        AED {total?.toLocaleString()}
      </span>
    ),
  },
];

const RecentOrdersCard = ({ data, loading }) => {
  const extra = (
    <button className="text-xs font-semibold text-green-700 hover:text-green-800">Manage Orders</button>
  );

  return (
    <DashboardCard title="Recent Orders" extra={extra}>
      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (
        <div className="max-h-[400px] overflow-y-auto rounded-lg border border-gray-100 custom-scrollbar">
          <Table
            columns={orderColumns}
            dataSource={data?.map((o) => ({ ...o, key: o.id }))}
            pagination={false}
            size="small"
            className="dashboard-table"
          />
        </div>
      )}
    </DashboardCard>
  );
};

export default RecentOrdersCard;
