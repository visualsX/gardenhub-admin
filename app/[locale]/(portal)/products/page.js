'use client';

import React, { useState } from 'react';
import { Table, Input, Select, Tag, message } from 'antd';
// import { Search, Plus, ChevronLeft, ChevronRight, Trash2, Edit2 } from 'lucide-react';
import Search from '@/public/shared/search.svg';
// import Plus from '@/public/shared/select-down.svg';
import Arrow from '@/public/shared/arrow-left.svg';
import Trash2 from '@/public/shared/trash.svg';
import Edit2 from '@/public/shared/edit.svg';
import Plus from '@/public/shared/plus-white.svg';
import Badge from '@/components/ui/badge';
import StatsCard from '@/components/shared/stats-card';
import Pagination from '@/components/shared/pagination';
import DataTable from '@/components/shared/data-table';
const { Option } = Select;

const ProductManagement = () => {
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Product data
  const productsData = [
    {
      key: '1',
      id: '09EF46',
      name: 'Chartreuse Thistle',
      image: '🌿',
      category: 'Care Essentials',
      subcategory: 'Fertilisers',
      stockStatus: 'In Stock',
      stock: 514,
      price: 1214,
      sold: 147,
    },
    {
      key: '2',
      id: '84R535',
      name: 'Copper Caladium',
      image: '🌱',
      category: 'Care Essentials',
      subcategory: 'Fertilisers',
      stockStatus: 'In Stock',
      stock: 715,
      price: 1214,
      sold: 145,
    },
    {
      key: '3',
      id: '15CD91',
      name: 'Emerald Cactus',
      image: '🌵',
      category: 'Care Essentials',
      subcategory: 'Fertilisers',
      stockStatus: 'In Stock',
      stock: 309,
      price: 3456,
      sold: 148,
    },
    {
      key: '4',
      id: '41AB63',
      name: 'Cerulean Daisy',
      image: '🌼',
      category: 'Care Essentials',
      subcategory: 'Fertilisers',
      stockStatus: 'In Stock',
      stock: 908,
      price: 5678,
      sold: 149,
    },
    {
      key: '5',
      id: '57YZ10',
      name: 'Winter Bloom',
      image: '🌸',
      category: 'Care Essentials',
      subcategory: 'Fertilisers',
      stockStatus: 'In Stock',
      stock: 827,
      price: 7890,
      sold: 143,
    },
    {
      key: '6',
      id: '73PQ29',
      name: 'Amber Marigold',
      image: '🌺',
      category: 'Care Essentials',
      subcategory: 'Fertilisers',
      stockStatus: 'Low Stock',
      stock: 106,
      price: 9012,
      sold: 146,
    },
    {
      key: '7',
      id: '26WX58',
      name: 'Onyx Orchid',
      image: '🌷',
      category: 'Care Essentials',
      subcategory: 'Fertilisers',
      stockStatus: 'Out of Stock',
      stock: 412,
      price: 2345,
      sold: 150,
    },
    {
      key: '8',
      id: '98KL54',
      name: 'Scarlet Fern',
      image: '🍀',
      category: 'Care Essentials',
      subcategory: 'Fertilisers',
      stockStatus: 'Out of Stock',
      stock: 234,
      price: 4567,
      sold: 151,
    },
    {
      key: '9',
      id: '62GH27',
      name: 'Platinum Agave',
      image: '🌿',
      category: 'Care Essentials',
      subcategory: 'Fertilisers',
      stockStatus: 'In Stock',
      stock: 657,
      price: 6789,
      sold: 152,
    },
    {
      key: '10',
      id: '39VF82',
      name: 'Lily of the Valley',
      image: '🌱',
      category: 'Care Essentials',
      subcategory: 'Fertilisers',
      stockStatus: 'Low Stock',
      stock: 842,
      price: 8901,
      sold: 144,
    },
  ];

  const columns = [
    {
      title: 'Name & Picture',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-2xl">
            {record.image}
          </div>
          <div>
            <div className="font-medium text-gray-900">{text}</div>
            <div className="text-sm text-gray-500">{record.id}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Category/subcategory',
      dataIndex: 'category',
      key: 'category',
      render: (text, record) => (
        <div>
          <div className="text-gray-900">{text}</div>
          <div className="text-sm text-gray-500">{record.subcategory}</div>
        </div>
      ),
    },
    {
      title: 'Stock Status',
      dataIndex: 'stockStatus',
      key: 'stockStatus',
      render: (status) => {
        let color = 'success';
        if (status === 'Low Stock') color = 'warning';
        if (status === 'Out of Stock') color = 'error';
        return <Badge variant={color}>{status}</Badge>;
      },
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      align: 'left',
      render: (text) => <span className="text-gray-900">{text}</span>,
    },
    {
      title: 'Prices (AED)',
      dataIndex: 'price',
      key: 'price',
      align: 'left',
      render: (text) => <span className="text-gray-900">{text.toLocaleString()}</span>,
    },
    {
      title: 'Sold',
      dataIndex: 'sold',
      key: 'sold',
      align: 'left',
      render: (text) => <span className="text-gray-900">{text}</span>,
    },
    {
      title: '',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <button className="text-gray-500 transition-colors hover:text-red-600">
            <Trash2 size={18} />
          </button>
          <button className="text-gray-500 transition-colors hover:text-blue-600">
            <Edit2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
            <p className="mt-1 text-sm text-gray-600">Manage and organise products</p>
          </div>
          <button
            onClick={() => message.success('teatestrets')}
            className="flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-white transition-colors hover:bg-green-800"
          >
            <Plus size={20} />
            Add New Product
          </button>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <StatsCard title="Total Products" value="23,999" />
          <StatsCard title="In Stock" value="142" />
          <StatsCard title="Out of Stock" value="05" variant="danger" />
          <StatsCard title="Low Stock" value="23" variant="warning" />
        </div>

        {/* Table Card */}
        <div className="rounded-lg border border-gray-200 bg-white">
          {/* Search and Filters */}
          <div className="flex flex-col gap-4 p-6 md:flex-row">
            <div className="flex-1">
              <Input
                placeholder="Search Products"
                prefix={<Search size={18} className="text-gray-400" />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="h-10"
                style={{ borderRadius: '8px' }}
              />
            </div>
            <Select
              defaultValue="all"
              onChange={setCategoryFilter}
              className="w-full md:w-48"
              style={{ height: '40px' }}
            >
              <Option value="all">All Categories</Option>
              <Option value="care">Care Essentials</Option>
              <Option value="tools">Tools</Option>
              <Option value="seeds">Seeds</Option>
            </Select>
            <Select
              defaultValue="all"
              onChange={setStockFilter}
              className="w-full md:w-48"
              style={{ height: '40px' }}
            >
              <Option value="all">All stock status</Option>
              <Option value="in">In Stock</Option>
              <Option value="low">Low Stock</Option>
              <Option value="out">Out of Stock</Option>
            </Select>
          </div>

          {/* Table */}
          <DataTable columns={columns} data={productsData} />

          <div className="p-6">
            <Pagination
              currentPage={currentPage}
              totalPages={100}
              onPageChange={setCurrentPage}
              onPrevious={() => setCurrentPage(Math.max(1, currentPage - 1))}
              onNext={() => setCurrentPage(Math.min(10, currentPage + 1))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
