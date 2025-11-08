'use client';

import React, { useState } from 'react';
import { Table, Rate, Tag } from 'antd';

import ArrowDown from '@/public/shared/down-red.svg';
import ArrowUp from '@/public/shared/up-green.svg';
import Plus from '@/public/shared/plus-white.svg';
import Image from 'next/image';
import Badge from '@/components/ui/badge';

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Last Year');

  // Sales data for chart
  const salesData = [
    { month: 'Jan', value: 15000 },
    { month: 'Feb', value: 16000 },
    { month: 'Mar', value: 15500 },
    { month: 'Apr', value: 17000 },
    { month: 'May', value: 16500 },
    { month: 'Jun', value: 18000 },
    { month: 'Jul', value: 17500 },
    { month: 'Aug', value: 19000 },
    { month: 'Sep', value: 20000 },
    { month: 'Oct', value: 21000 },
    { month: 'Nov', value: 22000 },
    { month: 'Dec', value: 24000 },
  ];

  // Customer data for pie chart
  const customerData = [
    { name: 'New Customers', value: 28, color: '#ef4444' },
    { name: 'Returning', value: 24, color: '#16a34a' },
  ];

  // Top selling products
  const topProducts = [
    {
      id: 1,
      name: 'Organic Tomato Seeds',
      units: 234,
      revenue: 2340,
      stock: 'In Stock',
      status: 'in',
    },
    {
      id: 2,
      name: 'Ceramic Plant Pots',
      units: 189,
      revenue: 1890,
      stock: 'Low Stock',
      status: 'low',
    },
    {
      id: 3,
      name: 'Organic Fertilizer',
      units: 156,
      revenue: 1560,
      stock: 'In Stock',
      status: 'in',
    },
    {
      id: 4,
      name: 'Garden Tool Set',
      units: 98,
      revenue: 1470,
      stock: 'In Stock',
      status: 'in',
    },
  ];

  // Recent orders table columns
  const orderColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Products',
      dataIndex: 'products',
      key: 'products',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color="green">{status}</Tag>,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Total AED',
      dataIndex: 'total',
      key: 'total',
    },
  ];

  const orderData = [
    {
      key: '1',
      id: '123Id',
      products: 'New Zealand',
      status: 'Delivered',
      date: '2024-01-15',
      total: '12881',
    },
    {
      key: '2',
      id: '871238',
      products: "Cote d'Ivoire",
      status: 'Delivered',
      date: '2024-02-29',
      total: '12881',
    },
    {
      key: '3',
      id: '212819',
      products: 'United Kingdom',
      status: 'Delivered',
      date: '2023-11-01',
      total: '12881',
    },
    {
      key: '4',
      id: '2189',
      products: 'United States',
      status: 'Delivered',
      date: '2023-04-22',
      total: '12881',
    },
  ];

  // Inventory alerts
  const inventoryAlerts = [
    { name: 'Rose Bush Seeds', count: 0, status: 'Out of stock', color: 'text-red-600' },
    { name: 'Watering Can', count: 3, status: 'Low stock', color: 'text-orange-600' },
    { name: 'Garden Gloves', count: 5, status: 'Low stock', color: 'text-orange-600' },
  ];

  // Active promotions
  const promotions = [
    {
      code: 'SPRING20',
      description: '20% off all seeds',
      used: 47,
      expires: 'Nov 30',
      status: 'Active',
    },
    {
      code: 'NEWBIE10',
      description: '$10 off first order',
      used: 23,
      expires: 'Dec 15',
      status: 'Active',
    },
  ];

  // Reviews
  const reviews = [
    {
      author: 'John D.',
      rating: 5,
      text: 'Great quality seeds! My tomatoes are growing beautifully.',
      product: 'Organic Tomato Seeds',
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              Welcome back! Here's what's happening with your garden store.
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-white hover:bg-green-800">
            <Plus size={20} />
            Add New Product
          </button>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-5">
          <div className="border-smoke rounded-lg border bg-white p-5">
            <div className="mb-2 text-sm text-gray-600">Total Sales (AED)</div>
            <div className="mb-2 text-3xl font-bold">23,999</div>
            <div className="flex items-center text-sm text-green-600">
              <ArrowUp size={16} className="mr-1" />
              40% vs last month
            </div>
          </div>

          <div className="border-smoke rounded-lg border bg-white p-5">
            <div className="mb-2 text-sm text-gray-600">Total Orders</div>
            <div className="mb-2 text-3xl font-bold">142</div>
            <div className="flex items-center text-sm text-red-600">
              <ArrowDown size={16} className="mr-1" />
              10% vs last month
            </div>
          </div>

          <div className="border-smoke rounded-lg border bg-white p-5">
            <div className="mb-2 text-sm text-gray-600">Active Products</div>
            <div className="mb-2 text-3xl font-bold">45</div>
            <div className="flex items-center text-sm text-green-600">
              <ArrowUp size={16} className="mr-1" />
              20% vs last month
            </div>
          </div>

          <div className="border-smoke rounded-lg border bg-white p-5">
            <div className="mb-2 text-sm text-gray-600">Low Stock Alerts</div>
            <div className="mb-2 text-3xl font-bold text-red-600">05</div>
            <div className="text-sm text-gray-600">Requires Attention</div>
          </div>

          <div className="border-smoke rounded-lg border bg-white p-5">
            <div className="mb-2 text-sm text-gray-600">Pending Orders</div>
            <div className="mb-2 text-3xl font-bold text-orange-600">23</div>
            <div className="text-sm text-gray-600">Needs processing</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="mb-6 grid grid-cols-2 gap-6">
          {/* Sales Analytics */}
          <div className="border-smoke rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Sales Analytics</h2>
            <div className="mb-6 flex gap-4">
              {['Last Year', 'Last Month', 'Last Week', 'Last Day'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`rounded px-4 py-1 text-sm ${
                    selectedPeriod === period
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
            {/* <ResponsiveContainer width="100%" height={250}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#16a34a"
                  strokeWidth={2}
                  fill="#dcfce7"
                />
              </LineChart>
            </ResponsiveContainer> */}
          </div>

          {/* Top Selling Products */}
          <div className="border-smoke rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Top-Selling Products</h2>
            <div className="space-y-4">
              {topProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 rounded bg-gray-200">
                    <Image src={'/shared/plant-sm.svg'} width={48} height={48} alt={product.name} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-500">{product.units} units sold</div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-sm font-semibold">${product.revenue.toLocaleString()}</div>
                    <Badge variant={product.status == 'in' ? 'success' : 'warning'}>
                      {product.stock}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Orders and Customer Charts */}
        <div className="mb-6 grid grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="border-smoke rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Recent Orders</h2>
            <Table columns={orderColumns} dataSource={orderData} pagination={false} size="small" />
          </div>

          {/* Customer Pie Chart */}
          <div className="border-smoke rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">New VS Returning Customers</h2>
            {/* <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={customerData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {customerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer> */}
            <div className="mt-4 space-y-2">
              {customerData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-3 w-3 rounded-full`}
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Inventory Alerts */}
          <div className="border-smoke rounded-lg border bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Inventory Alerts</h2>
              <button className="text-sm text-green-700 hover:underline">Update Inventory</button>
            </div>
            <div className="space-y-4">
              {inventoryAlerts.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{item.name}</div>
                    <div className={`text-xs ${item.color}`}>{item.status}</div>
                  </div>
                  <div className={`text-2xl font-bold ${item.color}`}>{item.count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Promotions */}
          <div className="border-smoke rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Active Promotions</h2>
            <div className="space-y-4">
              {promotions.map((promo, index) => (
                <div key={index} className="rounded-lg border border-gray-200 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold">{promo.code}</span>
                    <Tag color="green">{promo.status}</Tag>
                  </div>
                  <div className="mb-2 text-sm text-gray-700">{promo.description}</div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Used: {promo.used} times</span>
                    <span>Expires: {promo.expires}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="border-smoke rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Recent Reviews</h2>
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">by {review.author}</span>
                    <Rate disabled defaultValue={review.rating} style={{ fontSize: 14 }} />
                  </div>
                  <p className="mb-2 text-sm text-gray-700">{review.text}</p>
                  <div className="mb-2 text-xs text-gray-500">{review.product}</div>
                  <div className="flex gap-2">
                    <button className="text-xs text-green-700 hover:underline">Approve</button>
                    <button className="text-xs text-gray-700 hover:underline">Hide</button>
                    <button className="text-xs text-red-700 hover:underline">Delete</button>
                  </div>
                </div>
              ))}
              {/* Duplicate review for display */}
              {reviews.map((review, index) => (
                <div key={`dup-${index}`} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">by {review.author}</span>
                    <Rate disabled defaultValue={review.rating} style={{ fontSize: 14 }} />
                  </div>
                  <p className="mb-2 text-sm text-gray-700">{review.text}</p>
                  <div className="mb-2 text-xs text-gray-500">{review.product}</div>
                  <div className="flex gap-2">
                    <button className="text-xs text-green-700 hover:underline">Approve</button>
                    <button className="text-xs text-gray-700 hover:underline">Hide</button>
                    <button className="text-xs text-red-700 hover:underline">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
