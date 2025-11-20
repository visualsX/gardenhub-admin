'use client';

import { useState } from 'react';
import { Segmented } from 'antd';
import DataTable from '@/components/shared/data-table';
import GoBack from '@/components/ui/go-back.jsx';
import { Box } from '@/components/wrappers/box';
import { OrderColumns } from '@/lib/columns/order-cols';

const stats = [
  { title: 'Total Orders', value: 7 },
  { title: 'Pending', value: 2 },
  { title: 'Shipped', value: 2 },
  { title: 'Total Revenue', value: '$771.97' },
];

const orderData = [
  {
    key: 1,
    id: '#ORD-2024-1234',
    customer: 'Sarah Johnson',
    date: 'Nov 4, 2025',
    items: '3 items',
    total: '$196.63',
    status: 'Completed',
  },
  {
    key: 2,
    id: '#ORD-2024-1235',
    customer: 'Mike Chen',
    date: 'Nov 4, 2025',
    items: '2 items',
    total: '$102.28',
    status: 'Processing',
  },
  {
    key: 3,
    id: '#12454',
    customer: 'Emma Davis',
    date: 'Nov 3, 2025',
    items: '1 item',
    total: '$45.00',
    status: 'Shipped',
  },
  {
    key: 4,
    id: '#12453',
    customer: 'John Smith',
    date: 'Nov 3, 2025',
    items: '5 items',
    total: '$199.99',
    status: 'Completed',
  },
  {
    key: 5,
    id: '#12452',
    customer: 'Lisa Anderson',
    date: 'Nov 2, 2025',
    items: '2 items',
    total: '$67.50',
    status: 'Pending',
  },
  {
    key: 6,
    id: '#12451',
    customer: 'David Brown',
    date: 'Nov 2, 2025',
    items: '4 items',
    total: '$155.00',
    status: 'Shipped',
  },
  {
    key: 7,
    id: '#12450',
    customer: 'Maria Garcia',
    date: 'Nov 1, 2025',
    items: '2 items',
    total: '$89.99',
    status: 'Cancelled',
  },
];

const OrdersPage = () => {
  const [filter, setFilter] = useState('all');

  const filteredData = orderData.filter((order) => {
    if (filter === 'all') return true;
    return order.status.toLowerCase() === filter;
  });

  return (
    <div className="space-y-6">
      <GoBack title="Order Management" desc="View and manage all customer orders" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Box key={stat.title} padding="p-4">
            <p className="text-sm text-gray-500">{stat.title}</p>
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
          </Box>
        ))}
      </div>

      <Box padding="p-0">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4 px-6 pt-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">All Orders</h2>
            <p className="text-sm text-gray-500">Complete list of all orders placed</p>
          </div>
          <Segmented
            options={[
              { label: 'All Orders', value: 'all' },
              { label: 'Pending', value: 'pending' },
              { label: 'Shipped', value: 'shipped' },
              { label: 'Processing', value: 'processing' },
              { label: 'Completed', value: 'completed' },
            ]}
            value={filter}
            onChange={setFilter}
            className="bg-gray-100"
          />
        </div>

        <DataTable
          rowKey="key"
          columns={OrderColumns()}
          data={filteredData}
          pagination={false}
          className="pb-6"
        />
      </Box>
    </div>
  );
};

export default OrdersPage;
