'use client';

import React, { useState } from 'react';
import { Button, Switch, message } from 'antd';
// import { ArrowLeft, Trash2, Edit, DollarSign, TrendingUp, Star, Package } from 'lucide-react';
import ArrowLeft from '@/public/shared/arrow-left.svg';
import Trash2 from '@/public/shared/trash-red.svg';
import DollarSign from '@/public/shared/dollar.svg';
import Edit from '@/public/shared/edit-white.svg';
import TrendingUp from '@/public/shared/trending-up.svg';
import Star from '@/public/shared/star.svg';
import Package from '@/public/shared/stock.svg';
import LabelAndValue from '@/components/ui/label-value';
import Badge from '@/components/ui/badge';
import { Box } from '@/components/wrappers/box';
import { useParams, useRouter } from 'next/navigation';
import { useProduct } from '@/hooks/products/useProduct';
import ImageGallery from '@/components/shared/image-gallery';
import Link from 'next/link';
import DataTable from '@/components/shared/data-table';
import SegmentedTabs from '@/components/ui/segmented-tabs';

export default function ProductDetailPage() {
  const [activeTab, setActiveTab] = useState('general');
  const { id } = useParams();
  const { data, isLoading } = useProduct(+id);
  const router = useRouter();

  const handleDelete = () => {
    message.success('Product deleted successfully');
  };

  const handleEdit = () => {
    router.push(`/products/edit/${id}`);
  };

  const tabItems = [
    { key: 'general', label: 'General' },
    { key: 'pricing', label: 'Pricing' },
    { key: 'variations', label: 'Variations' },
    { key: 'inventory', label: 'Inventory' },
    { key: 'specifications', label: 'Specifications' },
    { key: 'analytics', label: 'Analytics & Reviews' },
  ];

  return (
    <div className="min-h-screen">
      <div className="">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link href={'/products'} className="flex items-center gap-4">
            <Button
              icon={<ArrowLeft className="h-4 w-4" />}
              type="text"
              className="flex items-center"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-gray-900">{data?.name}</h1>
                <Badge variant="success">In Stock</Badge>
              </div>
              <p className="text-sm text-gray-500">SKU: {data?.sku}</p>
            </div>
          </Link>
          <div className="flex gap-2">
            <Button danger icon={<Trash2 className="h-4 w-4" />} onClick={handleDelete}>
              Delete
            </Button>
            <Button
              type="primary"
              icon={<Edit className="h-4 w-4" />}
              onClick={handleEdit}
              className="bg-green-600 hover:bg-green-700"
            >
              Edit Product
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Image & Stats */}
          <div className="space-y-6">
            {/* Main Image */}
            <Box loading={isLoading}>
              <ImageGallery
                mainImage={data?.images?.find((el) => el?.isMain)?.imageUrl}
                images={data?.images?.filter((el) => !el?.isMain).map((el) => el?.imageUrl)}
              />
            </Box>

            {/* Quick Stats */}
            <Box loading={isLoading}>
              <h3 className="mb-4 font-semibold text-gray-900">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span>Total Revenue</span>
                  </div>
                  <span className="font-semibold text-gray-900">_</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <TrendingUp className="h-4 w-4" />
                    <span>Units Sold</span>
                  </div>
                  <span className="font-semibold text-gray-900">_</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Star className="h-4 w-4" />
                    <span>Rating</span>
                  </div>
                  <span className="font-semibold text-gray-900">_</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Package className="h-4 w-4" />
                    <span>In Stock</span>
                  </div>
                  <span className="font-semibold text-gray-900">{data?.stockQuantity} units</span>
                </div>
              </div>
            </Box>

            {/* Product Status */}
            <Box loading={isLoading}>
              <h3 className="mb-4 font-semibold text-gray-900">Product Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active</span>
                  <Switch disabled checked={data?.isActive} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Featured Product</span>
                  <Switch disabled checked={data?.isFeatured} />
                </div>
              </div>
            </Box>
          </div>

          {/* Right Column - Product Details */}
          <div className="lg:col-span-2">
            <SegmentedTabs tabs={tabItems} activeTab={activeTab} onChange={setActiveTab} />

            {activeTab === 'general' && <GeneralTab data={data} isLoading={isLoading} />}

            {activeTab === 'pricing' && <PricingTab data={data} isLoading={isLoading} />}

            {activeTab === 'variations' && <VariationsTab data={data} isLoading={isLoading} />}

            {activeTab === 'inventory' && <InventoryTab data={data} isLoading={isLoading} />}

            {activeTab === 'specifications' && <SpecsTab data={data} isLoading={isLoading} />}

            {activeTab === 'analytics' && <AnalyticsTab data={data} isLoading={isLoading} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function GeneralTab({ data, isLoading }) {
  return (
    <div className="mt-6 space-y-8">
      {/* Product Information */}
      <div className="space-y-6">
        <Box
          loading={isLoading}
          header
          title={'Product Information'}
          description={'Basic details about the product'}
        >
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <LabelAndValue label="Product Name" value={data?.name} />
            <LabelAndValue label="SKU" value={data?.sku} />
            <LabelAndValue label="Category" value="Indoor Plants" />
            <LabelAndValue label="Subcategory" value="Tropical Plants" />
            <LabelAndValue label="Short Description" value={data?.shortDescription} />
            <LabelAndValue label="Full Description" value={data?.detailedDescription} />
          </div>
        </Box>

        {/* Attributes & Tags */}
        <Box loading={isLoading} header title={'Attributes & Tags'}>
          <div className="mb-6">
            <label className="mb-3 block text-sm font-semibold text-gray-900">Benefits</label>
            <div className="flex flex-wrap gap-2">
              {data?.filterOptions?.map((el, idx) => (
                <Badge variant="transparent" key={idx} className="px-3 py-1 text-sm">
                  {el.value}
                </Badge>
              ))}
            </div>
          </div>
        </Box>

        {/* Product Options */}
        {data?.options && data.options.length > 0 && (
          <Box loading={isLoading} header title={'Product Options'} description={'Variant options configured for this product'}>
            <div className="space-y-6">
              {data.options.map((option, idx) => (
                <div key={idx}>
                  <label className="mb-3 block text-sm font-semibold text-gray-900">
                    {option.name} ({option.type})
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {option.values?.map((value, valueIdx) => (
                      <div
                        key={valueIdx}
                        className="flex items-center gap-2 rounded-lg border border-smoke-light px-3 py-2"
                      >
                        {value.colorHex && (
                          <div
                            className="h-5 w-5 rounded border border-smoke-light"
                            style={{ backgroundColor: value.colorHex }}
                          />
                        )}
                        <span className="text-sm text-gray-900">{value.value || value.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Box>
        )}

        {/* SEO Information */}
        <Box
          loading={isLoading}
          header
          title={'SEO Information'}
          description={'Search engine optimization details'}
        >
          <div className="space-y-6">
            <LabelAndValue label="SEO Title" value={data?.metaTitle} />
            <LabelAndValue label="Meta Description" value={data?.metaDescription} />
            <LabelAndValue label="Keywords" value={data?.keywords} />
          </div>
        </Box>
      </div>
    </div>
  );
}
function PricingTab({ data, isLoading }) {
  return (
    <div className="mt-6 space-y-8">
      <Box
        loading={isLoading}
        header
        title="Pricing Information"
        description="Set product pricing and margins"
      >
        <div className="grid grid-cols-3 gap-x-8 gap-y-6">
          <LabelAndValue label="Retail Price" value={data?.regularPrice} />
          <LabelAndValue label="Cost Price" value={data?.costPrice} />
          <LabelAndValue label="Compare At Price" value={'-'} />
        </div>

        <div className="mt-8 grid grid-cols-3 gap-x-8 gap-y-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-900">
              Profit Per Unit
            </label>
            <p className="text-2xl font-semibold text-green-600">0 AED</p>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-900">Profit Margin</label>
            <p className="text-2xl font-semibold text-green-600">0 AED</p>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-900">Total Profit</label>
            <p className="text-2xl font-semibold text-green-600">0 AED</p>
          </div>
        </div>
      </Box>
    </div>
  );
}
function InventoryTab({ data, isLoading }) {
  return (
    <div className="mt-6 space-y-8">
      <Box
        loading={isLoading}
        header
        title="Stock Management"
        description="Manage inventory levels and alerts"
      >
        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
          <LabelAndValue label="Current Stock" value={data?.stockQuantity} />
          <LabelAndValue label="Low Stock Threshold" value={data?.lowStockThreshold} />
        </div>

        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Stock Value (at cost)</span>
            <span className="font-semibold text-gray-900">0 AED</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Stock Value (at retail)</span>
            <span className="font-semibold text-gray-900">0 AED</span>
          </div>
        </div>
      </Box>

      <Box loading={isLoading} header title="Stock History" description="Recent inventory changes">
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-red-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <TrendingUp className="h-5 w-5 rotate-180 text-red-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Sales</p>
                <p className="text-sm text-gray-500">Nov 1, 2025</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-red-600">-8</p>
              <p className="text-sm text-gray-500">Balance: 45</p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-green-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Restock</p>
                <p className="text-sm text-gray-500">Oct 28, 2025</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-green-600">+50</p>
              <p className="text-sm text-gray-500">Balance: 53</p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-red-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <TrendingUp className="h-5 w-5 rotate-180 text-red-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Sales</p>
                <p className="text-sm text-gray-500">Oct 25, 2025</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-red-600">-12</p>
              <p className="text-sm text-gray-500">Balance: 3</p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-red-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <TrendingUp className="h-5 w-5 rotate-180 text-red-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Sales</p>
                <p className="text-sm text-gray-500">Oct 20, 2025</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-red-600">-5</p>
              <p className="text-sm text-gray-500">Balance: 15</p>
            </div>
          </div>
        </div>
      </Box>

      <Box loading={isLoading} header title="Shipping Information">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-900">Shipping Required</span>
            <Switch disabled checked={data?.isShippingRequired} />
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <LabelAndValue label="Shipping Weight" value="-" />
            <LabelAndValue label="Box Size" value="-" />
            <LabelAndValue label="Shipping Class" value="-" />
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">Fragile Item</span>
              <Switch disabled checked={data?.isFragile} />
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
}
function SpecsTab({ data, isLoading }) {
  return (
    <div className="mt-6 space-y-8">
      {/* <Box loading={isLoading} header title="General Care Specs">
        <div className="space-y-6">
          <LabelAndValue label="Light Requirements" value="Bright Light, Indirect Light" />
          <LabelAndValue label="Pet friendliness" value="No" />
          <LabelAndValue label="Growth rate" value="Moderate, centimetres in a month" />
          <LabelAndValue label="Care Level" value="Hard" />
          <LabelAndValue label="Watering schedule" value="Weekly, when the soil is dry" />
        </div>
      </Box> */}

      <Box
        loading={isLoading}
        header
        title="Product Dimensions"
        description="Physical measurements of the product"
      >
        <div className="grid grid-cols-3 gap-x-8 gap-y-6">
          <LabelAndValue label="Weight" value={data?.weight} />
          <LabelAndValue label="Height" value={data?.height} />
          <LabelAndValue label="Width" value={data?.width} />
          {/* <LabelAndValue label="Depth" value="18 inches" /> */}
        </div>
      </Box>
    </div>
  );
}
function AnalyticsTab({ data, isLoading }) {
  return (
    <div className="mt-6 space-y-8">
      <div className="grid grid-cols-3 gap-6">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">234</p>
          <p className="text-gray-600">Total Units Sold</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">$11,696.66</p>
          <p className="text-gray-600">Total Revenue</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
            <Star className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">4.8/5.0</p>
          <p className="text-gray-600">127 Reviews</p>
        </div>
      </div>

      <Box
        loading={isLoading}
        header
        title="Recent Orders"
        description="Latest orders containing this product"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <p className="font-semibold text-gray-900">#12456</p>
              <p className="text-sm text-gray-500">Sarah Johnson • Nov 4, 2025</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Qty: 1</p>
              <p className="text-sm font-semibold text-gray-900">$49.99</p>
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <p className="font-semibold text-gray-900">#12448</p>
              <p className="text-sm text-gray-500">Mike Chen • Nov 3, 2025</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Qty: 2</p>
              <p className="text-sm font-semibold text-gray-900">$99.98</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">#12440</p>
              <p className="text-sm text-gray-500">Emma Davis • Nov 1, 2025</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Qty: 1</p>
              <p className="text-sm font-semibold text-gray-900">$49.99</p>
            </div>
          </div>
        </div>
      </Box>

      <Box loading={isLoading} header title="Recent Reviews">
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="mb-3 flex items-start justify-between">
              <p className="font-semibold text-gray-900">by John D.</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
            <p className="mb-4 text-gray-700">
              Great quality seeds! My tomatoes are growing beautifully.
            </p>
            <div className="flex gap-3">
              <button className="text-sm font-medium text-green-600 hover:text-green-700">
                Approve
              </button>
              <button className="text-sm font-medium text-gray-600 hover:text-gray-700">
                Hide
              </button>
              <button className="text-sm font-medium text-red-600 hover:text-red-700">
                Delete
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <div className="mb-3 flex items-start justify-between">
              <p className="font-semibold text-gray-900">by John D.</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
            <p className="mb-4 text-gray-700">
              Great quality seeds! My tomatoes are growing beautifully.
            </p>
            <div className="flex gap-3">
              <button className="text-sm font-medium text-green-600 hover:text-green-700">
                Approve
              </button>
              <button className="text-sm font-medium text-gray-600 hover:text-gray-700">
                Hide
              </button>
              <button className="text-sm font-medium text-red-600 hover:text-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
}

function VariationsTab({ data, isLoading }) {
  const columns = [
    {
      title: 'Variant',
      dataIndex: 'variant',
      key: 'variant',
      render: (_, record) => {
        // Combine option values to create variant name
        const variantName = record.optionValues
          ?.map((ov) => ov.value)
          .filter(Boolean)
          .join(', ') || '-';
        return <span className="text-gray-900">{variantName}</span>;
      },
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      render: (sku) => <span className="text-gray-600">{sku || '-'}</span>,
    },
    {
      title: 'Prices (AED)',
      dataIndex: 'price',
      key: 'price',
      render: (price, record) => {
        const displayPrice = record.salePrice || price || 0;
        return <span className="text-gray-900">{displayPrice.toLocaleString()}</span>;
      },
    },
    {
      title: 'Stock',
      dataIndex: 'stockQuantity',
      key: 'stockQuantity',
      render: (stock) => <span className="text-gray-900">{stock || 0}</span>,
    },
    {
      title: '',
      key: 'action',
      width: 60,
      render: () => (
        <button className="flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100">
          <Edit className="h-4 w-4" />
        </button>
      ),
    },
  ];

  const expandedRowRender = (record) => {
    return (
      <Box header title="Variation Details" description="Additional information" className="p-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Pricing Information */}
          <div className='border-with-radius p-4'>
            <h4 className="mb-3 text-base font-semibold text-green-500">Pricing</h4>
            <div className="space-y-2">
              <LabelAndValue label="Regular Price" value={`${record.price || 0} AED`} />
              <LabelAndValue label="Sale Price" value={`${record.salePrice || 0} AED`} />
              <LabelAndValue label="Discount" value={`${record.discount || 0}%`} />
            </div>
          </div>

          {/* Inventory Information */}
          <div className='border-with-radius p-4'>
            <h4 className="mb-3 text-base font-semibold text-green-500">Inventory</h4>
            <div className="space-y-2">
              <div className="space-y-2">
                <span className="text-sm block font-semibold">Track Inventory</span>
                <Switch disabled checked={record.trackInventory} size="small" />
              </div>
              <LabelAndValue label="Stock Quantity" value={record.stockQuantity || 0} />
              <LabelAndValue label="Low Stock Threshold" value={record.lowStockThreshold || 0} />
            </div>
          </div>

          {/* Variant Options */}
          <div className='border-with-radius p-4'>
            <h4 className="mb-3 text-base font-semibold text-green-500">Variant Options</h4>
            <div className="space-y-2">
              {record.optionValues?.map((option, idx) => (
                <div key={idx} className="flex items-center justify-between ">
                  <span className="text-sm font-semibold">{option.name}</span>
                  <div className="flex items-center gap-2">
                    {option.colorHex && (
                      <div
                        className="h-4 w-4 rounded border border-smoke-light"
                        style={{ backgroundColor: option.colorHex }}
                      />
                    )}
                    <span className="text-sm font-medium text-gray-900 ">{option.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Box>
    );
  };

  return (
    <div className="mt-6">
      <Box
        loading={isLoading}
        header
        title="All Variants"
        description="Basic details about the product"
      >
        <DataTable
          loading={isLoading}
          rowKey="id"
          columns={columns}
          data={data?.variants || []}
          pagination={false}
          expandable={{
            expandedRowRender,
            rowExpandable: (record) => true,
          }}
        />
      </Box>
    </div>
  );
}

