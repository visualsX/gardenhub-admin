'use client';

import React, { useState } from 'react';
import { Table, Input, Select } from 'antd';
import Plus from '@/public/shared/plus-white.svg';
import Settings from '@/public/shared/setting-sm.svg';
import SearchIcon from '@/public/shared/search.svg';
import DataTable from '@/components/shared/data-table';
import Pagination from '@/components/shared/pagination';
const { Option } = Select;

export default function CategoriesManagement() {
  const [expandedRowKeys, setExpandedRowKeys] = useState(['outdoor-plants']);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const categoriesData = [
    {
      key: 'indoor-plants',
      name: 'Indoor Plants',
      subCategories: 12,
      productsLinked: 147,
      status: 'Active',
      subCategoryList: [
        { key: 'fruitful', name: 'Fruitful', productsLinked: 147, status: 'Active' },
        { key: 'privacy', name: 'Privacy', productsLinked: 145, status: 'Active' },
      ],
    },
    {
      key: 'outdoor-plants',
      name: 'Outdoor Plants',
      subCategories: 2,
      productsLinked: 145,
      status: 'Active',
      subCategoryList: [
        { key: 'fruitful', name: 'Fruitful', productsLinked: 147, status: 'Active' },
        { key: 'privacy', name: 'Privacy', productsLinked: 145, status: 'Active' },
      ],
    },
    {
      key: 'garden-tools',
      name: 'Garden toold',
      subCategories: 21,
      productsLinked: 148,
      status: 'Active',
      subCategoryList: [
        { key: 'fruitful', name: 'Fruitful', productsLinked: 147, status: 'Active' },
        { key: 'privacy', name: 'Privacy', productsLinked: 145, status: 'Active' },
      ],
    },
    {
      key: 'care-essentials',
      name: 'Care Essentials',
      subCategories: 23,
      productsLinked: 149,
      status: 'Active',
      subCategoryList: [
        { key: 'fruitful', name: 'Fruitful', productsLinked: 147, status: 'Active' },
        { key: 'privacy', name: 'Privacy', productsLinked: 145, status: 'Active' },
      ],
    },
    {
      key: 'seeds',
      name: 'Seeds',
      subCategories: 42,
      productsLinked: 143,
      status: 'Active',
      subCategoryList: [
        { key: 'fruitful', name: 'Fruitful', productsLinked: 147, status: 'Active' },
        { key: 'privacy', name: 'Privacy', productsLinked: 145, status: 'Active' },
      ],
    },
  ];

  // Main table columns
  const columns = [
    {
      title: 'Category Name',
      dataIndex: 'name',
      key: 'name',
      width: '35%',
      render: (text) => <span className="font-medium text-gray-900">{text}</span>,
    },
    {
      title: 'Sub Categories',
      dataIndex: 'subCategories',
      key: 'subCategories',
      width: '15%',
      render: (text) => <span className="text-gray-900">{text}</span>,
    },
    {
      title: 'Products Linked',
      dataIndex: 'productsLinked',
      key: 'productsLinked',
      width: '25%',
      render: (text) => <span className="text-gray-900">{text}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      render: (status) => (
        <span className="inline-flex items-center rounded-md bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
          {status}
        </span>
      ),
    },
    {
      title: '',
      key: 'action',
      width: '10%',
      align: 'right',
      render: () => (
        <button className="text-gray-500 hover:text-gray-700">
          <Settings size={20} />
        </button>
      ),
    },
  ];

  // Sub-category columns (nested table)
  const subCategoryColumns = [
    {
      title: 'Sab Category Name',
      dataIndex: 'name',
      key: 'name',
      width: '50%',
      render: (text) => <span className="text-gray-900">{text}</span>,
    },
    {
      title: 'Products Linked',
      dataIndex: 'productsLinked',
      key: 'productsLinked',
      width: '30%',
      render: (text) => <span className="text-gray-900">{text}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      render: (status) => (
        <span className="inline-flex items-center rounded-md bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
          {status}
        </span>
      ),
    },
    {
      title: '',
      key: 'action',
      width: '5%',
      align: 'right',
      render: () => (
        <button className="text-gray-500 hover:text-gray-700">
          <Settings size={20} />
        </button>
      ),
    },
  ];

  // Expandable row render
  const expandedRowRender = (record) => {
    if (!record.subCategoryList || record.subCategoryList.length === 0) {
      return null;
    }

    return (
      <div className="nested-table-wrapper">
        <Table
          columns={subCategoryColumns}
          dataSource={record.subCategoryList}
          pagination={false}
          showHeader={true}
          className="nested-category-table"
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categories & Sub-Categories</h1>
            <p className="mt-1 text-sm text-gray-600">Manage and organise products</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 transition-colors hover:bg-gray-50">
              <Plus size={20} />
              Add New Sub Category
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-white transition-colors hover:bg-green-800">
              <Plus size={20} />
              Add New Category
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="rounded-lg border border-gray-200 bg-white">
          {/* Search and Filter */}
          <div className="flex items-center justify-between gap-4 p-6">
            <div className="max-w-md flex-1">
              <Input
                placeholder="Search Products"
                prefix={<SearchIcon size={18} className="text-gray-400" />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="h-10"
                style={{ borderRadius: '8px' }}
              />
            </div>
            <Select defaultValue="all" className="w-48" style={{ height: '40px' }}>
              <Option value="all">All Categories</Option>
              <Option value="indoor">Indoor Plants</Option>
              <Option value="outdoor">Outdoor Plants</Option>
              <Option value="tools">Garden Tools</Option>
            </Select>
          </div>

          {/* Categories Table with Expand */}
          {/* <Table
            columns={columns}
            dataSource={categoriesData}
            expandable={{
              expandedRowRender,
              expandedRowKeys: expandedRowKeys,
              onExpandedRowsChange: (keys) => setExpandedRowKeys(keys),
              rowExpandable: (record) =>
                record.subCategoryList && record.subCategoryList.length > 0,
              expandRowByClick: false,
            }}
            pagination={false}
            className="categories-table"
          /> */}

          {/* Table */}
          <DataTable
            columns={columns}
            dataSource={categoriesData}
            expandable={{
              expandedRowRender,
              expandedRowKeys: expandedRowKeys,
              onExpandedRowsChange: (keys) => setExpandedRowKeys(keys),
              rowExpandable: (record) =>
                record.subCategoryList && record.subCategoryList.length > 0,
              expandRowByClick: false,
            }}
            pagination={false}
          />

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
}
