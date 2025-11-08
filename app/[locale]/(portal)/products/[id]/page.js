'use client';

import React, { useState } from 'react';
import { Button, Input, Switch, Tag, Rate, Tabs, Image, message } from 'antd';
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
import Title from '@/components/ui/title';
import { Box } from '@/components/wrappers/box';

const { TextArea } = Input;

export default function ProductDetailPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [selectedColor, setSelectedColor] = useState('Red');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const productImages = [
    'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1614594895304-fe7116ac3b58?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1616694677520-9d996e40a4c8?w=400&h=400&fit=crop',
  ];

  const colors = [
    { name: 'Red', hex: '#EF4444' },
    { name: 'Orange', hex: '#F97316' },
    { name: 'Yellow', hex: '#EAB308' },
    { name: 'Green', hex: '#22C55E' },
    { name: 'Teal', hex: '#14B8A6' },
    { name: 'Blue', hex: '#3B82F6' },
  ];

  const benefits = ['High O2', 'Statement Plant', 'Air Purifying', 'Pet Friendly'];
  const plantTypes = ['Succulents', 'Irregular'];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
  };

  const handleDelete = () => {
    message.success('Product deleted successfully');
  };

  const handleEdit = () => {
    message.info('Edit mode activated');
  };

  const tabItems = [
    { key: 'general', label: 'General' },
    { key: 'pricing', label: 'Pricing' },
    { key: 'inventory', label: 'Inventory' },
    { key: 'specifications', label: 'Specifications' },
    { key: 'analytics', label: 'Analytics & Reviews' },
  ];

  return (
    <div className="min-h-screen">
      <div className="">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              icon={<ArrowLeft className="h-4 w-4" />}
              type="text"
              className="flex items-center"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-gray-900">Fiddle Leaf Fig</h1>
                <Badge variant="success">In Stock</Badge>
              </div>
              <p className="text-sm text-gray-500">SKU: PLT-FLF-001</p>
            </div>
          </div>
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
            <Box>
              <div
                className="relative mb-4 overflow-hidden rounded-lg bg-gray-100"
                style={{ height: '400px' }}
              >
                <Image
                  src={productImages[currentImageIndex]}
                  alt="Fiddle Leaf Fig"
                  className="h-full w-full object-cover"
                  preview={false}
                />
                <button
                  onClick={handlePrevImage}
                  className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg hover:bg-gray-100"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg hover:bg-gray-100"
                >
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </button>
              </div>

              {/* Thumbnail Strip */}
              <div className="flex gap-2 overflow-x-auto">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
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
            </Box>

            {/* Quick Stats */}
            <Box>
              <h3 className="mb-4 font-semibold text-gray-900">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span>Total Revenue</span>
                  </div>
                  <span className="font-semibold text-gray-900">$11,696.66</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <TrendingUp className="h-4 w-4" />
                    <span>Units Sold</span>
                  </div>
                  <span className="font-semibold text-gray-900">234</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Star className="h-4 w-4" />
                    <span>Rating</span>
                  </div>
                  <span className="font-semibold text-gray-900">4.8 (127 reviews)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Package className="h-4 w-4" />
                    <span>In Stock</span>
                  </div>
                  <span className="font-semibold text-gray-900">45 units</span>
                </div>
              </div>
            </Box>

            {/* Product Status */}
            <Box>
              <h3 className="mb-4 font-semibold text-gray-900">Product Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active</span>
                  <Switch checked={isActive} onChange={setIsActive} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Featured Product</span>
                  <Switch checked={isFeatured} onChange={setIsFeatured} />
                </div>
              </div>
            </Box>
          </div>

          {/* Right Column - Product Details */}
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white">
              <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

              {activeTab === 'general' && (
                <div className="mt-6 space-y-8">
                  {/* Product Information */}
                  <div className="space-y-6">
                    <Box
                      header
                      title={'Product Information'}
                      description={'Basic details about the product'}
                    >
                      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        <LabelAndValue label="Product Name" value="Fiddle Leaf Fig" />
                        <LabelAndValue label="SKU" value="PLT-FLF-001" />
                        <LabelAndValue label="Category" value="Indoor Plants" />
                        <LabelAndValue label="Subcategory" value="Tropical Plants" />
                        <LabelAndValue
                          label="Short Description"
                          value="The Fiddle Leaf Fig is a popular indoor plant known for its large,
                        violin-shaped leaves. Native to western Africa"
                        />
                        <LabelAndValue
                          label="Full Description"
                          value="Perfect for brightening up living rooms, offices, or any indoor space, the
                        Fiddle Leaf Fig has become a favorite"
                        />
                      </div>
                    </Box>

                    {/* Attributes & Tags */}
                    <Box header title={'Attributes & Tags'}>
                      <div className="mb-6">
                        <label className="mb-3 block text-sm font-semibold text-gray-900">
                          Benefits
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {benefits.map((benefit) => (
                            <Badge
                              variant="transparent"
                              key={benefit}
                              className="px-3 py-1 text-sm"
                            >
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="mb-3 block text-sm font-semibold text-gray-900">
                          Type of Plant
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {plantTypes.map((type) => (
                            <Badge variant="transparent" key={type} className="px-3 py-1 text-sm">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </Box>

                    {/* Color Selection */}
                    <Box header title={'Color'}>
                      <h3 className="mb-6 text-lg font-semibold text-gray-900"></h3>
                      <div className="flex gap-3">
                        {colors.map((color) => (
                          <button
                            key={color.name}
                            onClick={() => setSelectedColor(color.name)}
                            className={`flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all ${
                              selectedColor === color.name
                                ? 'border-gray-800 bg-gray-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div
                              className="h-10 w-10 rounded-full"
                              style={{ backgroundColor: color.hex }}
                            />
                            <span className="text-xs font-medium text-gray-700">{color.name}</span>
                          </button>
                        ))}
                        <button className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-3 transition-all hover:border-gray-400">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-2xl text-gray-400">
                            +
                          </div>
                          <span className="text-xs font-medium text-gray-600">Add</span>
                        </button>
                      </div>
                    </Box>

                    {/* SEO Information */}
                    <Box
                      header
                      title={'SEO Information'}
                      description={'Search engine optimization details'}
                    >
                      <div className="space-y-6">
                        <LabelAndValue
                          label="SEO Title"
                          value="Fiddle Leaf Fig - Premium Indoor Plant | GardenHub"
                        />
                        <LabelAndValue
                          label="Meta Description"
                          value="Buy beautiful Fiddle Leaf Fig plants online. Large violin-shaped leaves
                          perfect for modern interiors. Free shipping"
                        />
                        <LabelAndValue
                          label="Keywords"
                          value="fiddle leaf fig, indoor plant, ficus lyrata, house plant"
                        />
                        <LabelAndValue label="" value="" />
                        <LabelAndValue label="" value="" />
                      </div>
                    </Box>
                  </div>
                </div>
              )}

              {activeTab === 'pricing' && (
                <div className="mt-6 space-y-8">
                  <Box
                    header
                    title="Pricing Information"
                    description="Set product pricing and margins"
                  >
                    <div className="grid grid-cols-3 gap-x-8 gap-y-6">
                      <LabelAndValue label="Retail Price" value="49.99" />
                      <LabelAndValue label="Cost Price" value="25" />
                      <LabelAndValue label="Compare At Price" value="59.99" />
                    </div>

                    <div className="mt-8 grid grid-cols-3 gap-x-8 gap-y-6">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-900">
                          Profit Per Unit
                        </label>
                        <p className="text-2xl font-semibold text-green-600">$24.99</p>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-900">
                          Profit Margin
                        </label>
                        <p className="text-2xl font-semibold text-green-600">50.0%</p>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-900">
                          Total Profit
                        </label>
                        <p className="text-2xl font-semibold text-green-600">$5847.66</p>
                      </div>
                    </div>
                  </Box>
                </div>
              )}

              {activeTab === 'inventory' && (
                <div className="mt-6 space-y-8">
                  <Box
                    header
                    title="Stock Management"
                    description="Manage inventory levels and alerts"
                  >
                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                      <LabelAndValue label="Current Stock" value="45" />
                      <LabelAndValue label="Low Stock Threshold" value="10" />
                    </div>

                    <div className="mt-8 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Stock Value (at cost)</span>
                        <span className="font-semibold text-gray-900">$1125.00</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Stock Value (at retail)</span>
                        <span className="font-semibold text-gray-900">$2249.55</span>
                      </div>
                    </div>
                  </Box>

                  <Box header title="Stock History" description="Recent inventory changes">
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

                  <Box header title="Shipping Information">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">Shipping Required</span>
                        <Switch defaultChecked />
                      </div>

                      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        <LabelAndValue label="Shipping Weight" value="18 lbs" />
                        <LabelAndValue label="Box Size" value="Large" />
                        <LabelAndValue label="Shipping Class" value="Oversized" />
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900">Fragile Item</span>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                  </Box>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="mt-6 space-y-8">
                  <Box header title="General Care Specs">
                    <div className="space-y-6">
                      <LabelAndValue
                        label="Light Requirements"
                        value="Bright Light, Indirect Light"
                      />
                      <LabelAndValue label="Pet friendliness" value="No" />
                      <LabelAndValue label="Growth rate" value="Moderate, centimetres in a month" />
                      <LabelAndValue label="Care Level" value="Hard" />
                      <LabelAndValue
                        label="Watering schedule"
                        value="Weekly, when the soil is dry"
                      />
                    </div>
                  </Box>

                  <Box
                    header
                    title="Product Dimensions"
                    description="Physical measurements of the product"
                  >
                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                      <LabelAndValue label="Weight" value="15 lbs" />
                      <LabelAndValue label="Height" value="36 inches" />
                      <LabelAndValue label="Width" value="18 inches" />
                      <LabelAndValue label="Depth" value="18 inches" />
                    </div>
                  </Box>
                </div>
              )}

              {activeTab === 'analytics' && (
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

                  <Box header title="Recent Reviews">
                    <div className="space-y-6">
                      <div className="rounded-lg border border-gray-200 p-4">
                        <div className="mb-3 flex items-start justify-between">
                          <p className="font-semibold text-gray-900">by John D.</p>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className="h-4 w-4 fill-yellow-400 text-yellow-400"
                              />
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
                              <Star
                                key={star}
                                className="h-4 w-4 fill-yellow-400 text-yellow-400"
                              />
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
