'use client';

import { Input, Select } from 'antd';
import Search from '@/public/shared/search.svg';
import Plus from '@/public/shared/plus-white.svg';
import StatsCard from '@/components/shared/stats-card';
import DataTable from '@/components/shared/data-table';
import Link from 'next/link';
import { useDeleteProduct, useProducts } from '@/hooks/useProduct';
import { ProductCols } from '@/lib/columns/product-cols';
import DeleteModal from '@/components/shared/delete-modal';
import useUiStates from '@/store/useUiStates';
import { useRouter } from 'next/navigation';
const { Option } = Select;

const ProductManagement = () => {
  const { isDeleteModalOpen } = useUiStates();
  const router = useRouter();

  const { data, isLoading, isFetching } = useProducts({});

  const deleteProduct = useDeleteProduct();

  return (
    <div className="min-h-screen">
      <div className="">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
            <p className="mt-1 text-sm text-gray-600">Manage and organise products</p>
          </div>
          <Link
            href={'/products/add'}
            className="bg-primary hover:bg-primary/80 flex items-center gap-2 rounded-lg px-4 py-2.5 text-white transition-colors"
          >
            <Plus size={20} />
            Add New Product
          </Link>
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
                className="h-10"
                style={{ borderRadius: '8px' }}
              />
            </div>
            <Select defaultValue="all" className="w-full md:w-48" style={{ height: '40px' }}>
              <Option value="all">All Categories</Option>
              <Option value="care">Care Essentials</Option>
              <Option value="tools">Tools</Option>
              <Option value="seeds">Seeds</Option>
            </Select>
            <Select defaultValue="all" className="w-full md:w-48" style={{ height: '40px' }}>
              <Option value="all">All stock status</Option>
              <Option value="in">In Stock</Option>
              <Option value="low">Low Stock</Option>
              <Option value="out">Out of Stock</Option>
            </Select>
          </div>

          {/* Table */}
          <DataTable
            loading={isFetching || isLoading}
            rowKey="sku"
            columns={ProductCols()}
            data={data?.nodes}
            onRow={(record) => ({
              onClick: () => router.push(`/products/${record.id}`), // ✅ navigate on row click
              style: { cursor: 'pointer' }, // optional: show pointer cursor
            })}
          />

          <DeleteModal
            loading={deleteProduct?.isPending}
            onConfirm={() => {
              deleteProduct.mutate(isDeleteModalOpen?.data?.id);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
