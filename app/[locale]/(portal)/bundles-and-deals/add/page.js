'use client';

import React, { useState } from 'react';
import { Button, Switch, Tabs, Badge, Table } from 'antd';
// import { ArrowLeft, Edit, Trash, Stock, Dollar, TrendingUp, Plus } from 'lucide-react';

// import Badge from '@/components/ui/badge';

import { ArrowLeft, Edit, Trash, Dollar, TrendingUp, Plus, Stock } from '@/lib/const/icons';
export default function BundleDetailPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeStatus, setActiveStatus] = useState(true);
  const [featuredBundle, setFeaturedBundle] = useState(false);
  const [limitedTimeOffer, setLimitedTimeOffer] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const bundleImages = [
    'https://images.unsplash.com/photo-1459156212016-c812468e2115?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1616694677520-9d996e40a4c8?w=400&h=400&fit=crop',
  ];

  const includedProducts = [
    {
      id: 1,
      name: 'Fiddle Leaf Fig',
      sku: 'PLT-001',
      price: 49.99,
      stock: 'In Stock',
      image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=100&h=100&fit=crop',
    },
    {
      id: 2,
      name: 'Snake Plant',
      sku: 'PLT-002',
      price: 29.99,
      stock: 'In Stock',
      image: 'https://images.unsplash.com/photo-1593482892540-73c6b7e4c1b4?w=100&h=100&fit=crop',
    },
    {
      id: 3,
      name: 'Garden Tools Set',
      sku: 'PLT-003',
      price: 20.01,
      stock: 'In Stock',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100&h=100&fit=crop',
    },
  ];

  const salesHistory = [
    {
      id: 1,
      orderId: '#ORD-1045',
      customer: 'Sarah Johnson',
      date: 'Nov 3, 2025',
      amount: 79.99,
      status: 'Delivered',
    },
    {
      id: 2,
      orderId: '#ORD-1042',
      customer: 'Mike Chen',
      date: 'Nov 2, 2025',
      amount: 79.99,
      status: 'Shipped',
    },
    {
      id: 3,
      orderId: '#ORD-1038',
      customer: 'Emma Davis',
      date: 'Nov 1, 2025',
      amount: 79.99,
      status: 'Delivered',
    },
  ];

  const productsColumns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <img src={record.image} alt={text} className="h-12 w-12 rounded-lg object-cover" />
          <div>
            <p className="font-medium text-gray-900">{text}</p>
            <p className="text-sm text-gray-500">SKU: {record.sku}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Individual Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock) => <Badge color="green" text={stock} />,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => <Button type="text" danger icon={<Trash className="h-4 w-4" />} />,
    },
  ];

  const salesColumns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `$${amount.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Badge color={status === 'Delivered' ? 'green' : 'blue'} text={status} />,
    },
  ];

  const tabItems = [
    { key: 'overview', label: 'Overview' },
    { key: 'products', label: 'Products' },
    { key: 'performance', label: 'Performance' },
  ];

  return (
    <div className="">
      <div className="">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              type="text"
              icon={<ArrowLeft className="h-5 w-5" />}
              className="flex items-center"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Starter Garden Kit</h1>
              <p className="text-sm text-gray-500">3 products • Created Oct 15, 2025</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button icon={<Edit className="h-4 w-4" />}>Edit Bundle</Button>
            <Button danger icon={<Trash className="h-4 w-4" />}>
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Sidebar */}
          <div className="space-y-6">
            {/* Bundle Image */}
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h3 className="mb-4 font-semibold text-gray-900">Bundle Image</h3>
              <div className="mb-4 overflow-hidden rounded-lg">
                <img
                  src={bundleImages[currentImageIndex]}
                  alt="Bundle"
                  className="h-80 w-full object-cover"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {bundleImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${
                      idx === currentImageIndex ? 'border-green-600' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing Details */}
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h3 className="mb-4 font-semibold text-gray-900">Pricing Details</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Original Price</span>
                  <span className="font-medium text-gray-900">$99.99</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Bundle Price</span>
                  <span className="text-xl font-bold text-gray-900">$79.99</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-medium text-gray-900">% 20% OFF</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">Customer Saves</span>
                    <span className="text-lg font-bold text-green-600">$20.00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h3 className="mb-4 font-semibold text-gray-900">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Stock className="h-4 w-4" />
                    <span>Total Sales</span>
                  </div>
                  <span className="font-semibold text-gray-900">156</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Dollar className="h-4 w-4" />
                    <span>Revenue</span>
                  </div>
                  <span className="font-semibold text-gray-900">$12,474.44</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <TrendingUp className="h-4 w-4" />
                    <span>Conversion</span>
                  </div>
                  <span className="font-semibold text-gray-900">8.3%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-gray-200 bg-white">
              <div className="px-4 pt-4">
                <Tabs
                  activeKey={activeTab}
                  onChange={setActiveTab}
                  items={tabItems}
                  className="px-6"
                />
              </div>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6 p-6">
                  {/* Bundle Information */}
                  <div>
                    <h3 className="mb-1 text-lg font-semibold text-gray-900">Bundle Information</h3>
                    <p className="mb-4 text-sm text-gray-500">Basic details about this bundle</p>

                    <div className="space-y-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-900">
                          Bundle Name
                        </label>
                        <p className="text-gray-700">Starter Garden Kit</p>
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-900">
                          Description
                        </label>
                        <p className="text-gray-700">
                          Perfect bundle for garden beginners. Includes essential plants and tools
                          to get started.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-900">
                            Bundle Price
                          </label>
                          <p className="text-gray-700">$79.99</p>
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-900">
                            Discount Percentage
                          </label>
                          <p className="text-gray-700">20%</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bundle Status */}
                  <div>
                    <h3 className="mb-1 text-lg font-semibold text-gray-900">Bundle Status</h3>
                    <p className="mb-4 text-sm text-gray-500">
                      Control bundle visibility and availability
                    </p>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Active Status</p>
                          <p className="text-sm text-gray-500">Make bundle visible to customers</p>
                        </div>
                        <Switch checked={activeStatus} onChange={setActiveStatus} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Featured Bundle</p>
                          <p className="text-sm text-gray-500">Show on homepage</p>
                        </div>
                        <Switch checked={featuredBundle} onChange={setFeaturedBundle} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Limited Time Offer</p>
                          <p className="text-sm text-gray-500">Set expiration date</p>
                        </div>
                        <Switch checked={limitedTimeOffer} onChange={setLimitedTimeOffer} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Products Tab */}
              {activeTab === 'products' && (
                <div className="space-y-6 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Included Products</h3>
                      <p className="text-sm text-gray-500">3 products in this bundle</p>
                    </div>
                    <Button
                      type="primary"
                      icon={<Plus className="h-4 w-4" />}
                      className="bg-green-600"
                    >
                      Add Product
                    </Button>
                  </div>

                  <Table
                    columns={productsColumns}
                    dataSource={includedProducts}
                    pagination={false}
                    rowKey="id"
                  />

                  {/* Price Breakdown */}
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">Price Breakdown</h3>
                    <p className="mb-4 text-sm text-gray-500">
                      Comparison of individual vs bundle pricing
                    </p>

                    <div className="space-y-3">
                      {includedProducts.map((product) => (
                        <div key={product.id} className="flex items-center justify-between">
                          <span className="text-gray-700">{product.name}</span>
                          <span className="font-medium text-gray-900">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                      ))}
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">Total Individual Price</span>
                          <span className="font-semibold text-gray-900">$99.99</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="font-medium text-green-700">Bundle Discount (20%)</span>
                          <span className="font-semibold text-green-700">-$20.00</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between border-t border-gray-200 pt-3">
                          <span className="text-lg font-bold text-gray-900">Bundle Price</span>
                          <span className="text-xl font-bold text-gray-900">$79.99</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Performance Tab */}
              {activeTab === 'performance' && (
                <div className="space-y-6 p-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                      <p className="mb-2 text-sm text-gray-600">Total Orders</p>
                      <div className="mb-1 flex items-center gap-2">
                        <Stock className="h-5 w-5 text-green-600" />
                        <span className="text-2xl font-bold text-gray-900">156</span>
                      </div>
                      <p className="text-xs text-gray-500">Last 30 days</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                      <p className="mb-2 text-sm text-gray-600">Total Revenue</p>
                      <div className="mb-1 flex items-center gap-2">
                        <Dollar className="h-5 w-5 text-green-600" />
                        <span className="text-2xl font-bold text-gray-900">$12,474.44</span>
                      </div>
                      <p className="text-xs text-green-600">+12% from last month</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                      <p className="mb-2 text-sm text-gray-600">Conversion Rate</p>
                      <div className="mb-1 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <span className="text-2xl font-bold text-gray-900">8.3%</span>
                      </div>
                      <p className="text-xs text-green-600">+2.1% from last month</p>
                    </div>
                  </div>

                  {/* Sales History */}
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">Sales History</h3>
                    <p className="mb-4 text-sm text-gray-500">Recent orders for this bundle</p>

                    <Table
                      columns={salesColumns}
                      dataSource={salesHistory}
                      pagination={false}
                      rowKey="id"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
