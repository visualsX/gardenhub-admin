'use client';

import React, { useState } from 'react';
import { Button, Switch, Table, Avatar, Tag } from 'antd';
import ArrowLeft from '@/public/shared/arrow-left.svg';
import Trash2 from '@/public/shared/trash-red.svg';
import Edit from '@/public/shared/edit-white.svg';
import TrendingUp from '@/public/shared/trending-up.svg';
import DollarSign from '@/public/shared/dollar.svg';
import Star from '@/public/shared/star.svg';
import Package from '@/public/shared/stock.svg';
import Badge from '@/components/ui/badge';
import { Box } from '@/components/wrappers/box';
import { useParams, useRouter } from 'next/navigation';
import { useBundle, useDeleteBundle } from '@/hooks/useBundle';
import ImageGallery from '@/components/shared/image-gallery';
import Link from 'next/link';
import SegmentedTabs from '@/components/ui/segmented-tabs';
import LabelAndValue from '@/components/ui/label-value';
import DeleteModal from '@/components/shared/delete-modal';
import useUiStates from '@/store/useUiStates';

export default function BundleDetailPage() {
    const [activeTab, setActiveTab] = useState('overview');
    const { id } = useParams();
    const router = useRouter();
    const { data, isLoading } = useBundle(+id);
    const deleteBundle = useDeleteBundle();
    const { openDeleteModal, isDeleteModalOpen } = useUiStates();

    const handleDelete = () => {
        openDeleteModal(true, data);
    };

    const handleEdit = () => {
        router.push(`/bundles-and-deals/edit/${id}`);
    };

    const tabOptions = [
        { label: 'Overview', key: 'overview' },
        { label: 'Products', key: 'products' },
        { label: 'Performance', key: 'performance' },
        { label: 'Settings', key: 'settings' },
    ];

    // if (isLoading) {
    //     return <div className="p-8 text-center">Loading...</div>; // Simple loader for now
    // }

    // if (!data && !isLoading) {
    //     return <div className="p-8 text-center">Bundle not found</div>;
    // }

    return (
        <div className="min-h-screen">
            <div className="">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={'/bundles-and-deals'}>
                            <Button
                                icon={<ArrowLeft className="h-4 w-4" />}
                                type="text"
                                className="flex items-center"
                            />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-semibold text-gray-900">{data?.name}</h1>
                            </div>
                            <p className="text-sm text-gray-500">{data?.items?.length || 0} products • Created Oct 15, 2025</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            icon={<Edit className="h-4 w-4" />}
                            onClick={handleEdit}
                        >
                            Edit Bundle
                        </Button>
                        <Button danger icon={<Trash2 className="h-4 w-4" />} onClick={handleDelete}>
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left Column - Image & Stats (Persistent across tabs usually, or just on overview? 
             Design shows Sidebar on left in Screenshot 1, 2, 3. So it's persistent.) */}
                    <div className="space-y-6">
                        {/* Main Image */}
                        <Box loading={isLoading} title="Bundle Image" header>
                            <ImageGallery
                                mainImage={data?.images?.find((el) => el?.isMain)?.imageUrl || (data?.items?.[0]?.imageUrl)} // Fallback to first product image if no bundle image
                                images={data?.images?.filter((el) => !el?.isMain).map((el) => el?.imageUrl) || []}
                            />
                        </Box>

                        {/* Pricing Details */}
                        <Box loading={isLoading} header title="Pricing Details">
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Original Price</span>
                                    <span className="text-gray-500 line-through">${data?.originalPrice?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Bundle Price</span>
                                    <span className="text-xl font-semibold text-gray-900">${data?.bundlePrice?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Discount</span>
                                    <Badge variant="transparent">{data?.discountPercentage}% OFF</Badge>
                                </div>
                                <div className="pt-4 border-t flex justify-between items-center">
                                    <span className="text-gray-600">Customer Saves</span>
                                    <span className="text-green-600 font-semibold">${data?.customerSaves?.toFixed(2)}</span>
                                </div>
                            </div>
                        </Box>

                        {/* Quick Stats */}
                        <Box loading={isLoading} header title="Quick Stats">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Package className="h-4 w-4" />
                                        <span>Total Sales</span>
                                    </div>
                                    <span className="font-semibold text-gray-900">156</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <DollarSign className="h-4 w-4" />
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
                        </Box>
                    </div>

                    {/* Right Column - Main Content */}
                    <div className="lg:col-span-2">
                        <div className="mb-6">
                            <SegmentedTabs
                                tabs={tabOptions}
                                activeTab={activeTab}
                                onChange={setActiveTab}
                            />
                        </div>

                        {activeTab === 'overview' && <OverviewTab data={data} isLoading={isLoading} />}
                        {activeTab === 'products' && <ProductsTab data={data} isLoading={isLoading} />}
                        {activeTab === 'performance' && <PerformanceTab data={data} isLoading={isLoading} />}
                        {activeTab === 'settings' && <SettingsTab data={data} isLoading={isLoading} />}
                    </div>
                </div>
            </div>
            <DeleteModal
                loading={deleteBundle?.isPending}
                entityName="bundle"
                onConfirm={() => {
                    deleteBundle.mutate(isDeleteModalOpen?.data?.id);
                }}
            />
        </div>
    );
}

function OverviewTab({ data, isLoading }) {
    return (
        <div className="space-y-6">
            <Box loading={isLoading} header title="Bundle Information" description="Basic details about this bundle">
                <div className="space-y-6">
                    <LabelAndValue label="Bundle Name" value={data?.name} />
                    <LabelAndValue label="Description" value={data?.description} />
                    <div className="grid grid-cols-2 gap-6">
                        <LabelAndValue label="Bundle Price" value={`$${data?.bundlePrice}`} />
                        <LabelAndValue label="Discount Percentage" value={`${data?.discountPercentage}%`} />
                    </div>
                </div>
            </Box>

            <Box loading={isLoading} header title="Bundle Status" description="Control bundle visibility and availability">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-gray-900">Active Status</p>
                            <p className="text-sm text-gray-500">Make bundle visible to customers</p>
                        </div>
                        <Switch checked={data?.isActive} disabled />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-gray-900">Featured Bundle</p>
                            <p className="text-sm text-gray-500">Show on homepage</p>
                        </div>
                        <Switch checked={data?.isFeatured} disabled />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-gray-900">Limited Time Offer</p>
                            <p className="text-sm text-gray-500">Set expiration date</p>
                        </div>
                        <Switch checked={data?.expiryDate} disabled />
                    </div>
                </div>
            </Box>
        </div>
    );
}

function ProductsTab({ data, isLoading }) {
    const columns = [
        {
            title: 'Product',
            dataIndex: 'productName',
            key: 'productName',
            render: (text, record) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gray-100 overflow-hidden">
                        {record.imageUrl && <img src={record.imageUrl} alt={text} className="h-full w-full object-cover" />}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{text}</p>
                        <p className="text-sm text-gray-500">SKU: {record.productId}</p> {/* ID as SKU for now if SKU not in items */}
                    </div>
                </div>
            )
        },
        {
            title: 'Individual Price',
            dataIndex: 'originalUnitPrice',
            key: 'originalUnitPrice',
            render: (price) => `$${price?.toFixed(2)}`
        },
        {
            title: 'Stock',
            key: 'stock',
            render: () => <Badge variant="success">In Stock</Badge> // Placeholder as item stock not in query result yet
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'right',
            render: () => (
                <Button type="text" danger icon={<Trash2 className="h-4 w-4" />} />
            )
        }
    ];

    const dataSource = data?.items || [];
    const totalIndividualPrice = dataSource.reduce((acc, item) => acc + (item.originalUnitPrice || 0), 0);

    return (
        <div className="space-y-6">
            <Box loading={isLoading} header title="Included Products" description={`${dataSource.length} products in this bundle`}
                extra={<Button icon={<span className="text-lg leading-none">+</span>}>Add Product</Button>}
            >
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                    rowKey="productId"
                />
            </Box>

            <Box loading={isLoading} header title="Price Breakdown" description="Comparison of individual vs bundle pricing">
                <div className="space-y-3">
                    {dataSource.map(item => (
                        <div key={item.productId} className="flex justify-between text-gray-600">
                            <span>{item.productName}</span>
                            <span>${item.originalUnitPrice?.toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="border-t pt-3 flex justify-between font-semibold text-gray-900">
                        <span>Total Individual Price</span>
                        <span>${totalIndividualPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-green-600 font-medium">
                        <span>Bundle Discount ({data?.discountPercentage}%)</span>
                        <span>-${(totalIndividualPrice - (data?.bundlePrice || 0)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-900 pt-2">
                        <span>Bundle Price</span>
                        <span>${data?.bundlePrice?.toFixed(2)}</span>
                    </div>
                </div>
            </Box>
        </div>
    );
}

function PerformanceTab({ data, isLoading }) {
    const salesHistory = [
        { id: '#ORD-1045', customer: 'Sarah Johnson', date: 'Nov 3, 2025', amount: 79.99, status: 'Delivered' },
        { id: '#ORD-1042', customer: 'Mike Chen', date: 'Nov 2, 2025', amount: 79.99, status: 'Shipped' },
        { id: '#ORD-1038', customer: 'Emma Davis', date: 'Nov 1, 2025', amount: 79.99, status: 'Delivered' },
    ];

    const columns = [
        { title: 'Order ID', dataIndex: 'id', key: 'id' },
        { title: 'Customer', dataIndex: 'customer', key: 'customer' },
        { title: 'Date', dataIndex: 'date', key: 'date' },
        { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (v) => `$${v}` },
        { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => <Badge variant={s === 'Delivered' ? 'success' : 'primary'}>{s}</Badge> },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
                <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm mb-1">Total Orders</p>
                    <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-green-600" />
                        <span className="text-2xl font-bold text-gray-900">156</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Last 30 days</p>
                </div>
                <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm mb-1">Total Revenue</p>
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <span className="text-2xl font-bold text-gray-900">$12,474.44</span>
                    </div>
                    <p className="text-xs text-green-600 mt-2">+12% from last month</p>
                </div>
                <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm mb-1">Conversion Rate</p>
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <span className="text-2xl font-bold text-gray-900">8.3%</span>
                    </div>
                    <p className="text-xs text-green-600 mt-2">+2.1% from last month</p>
                </div>
            </div>

            <Box loading={isLoading} header title="Sales History" description="Recent orders for this bundle">
                <Table dataSource={salesHistory} columns={columns} pagination={false} rowKey="id" />
            </Box>
        </div>
    );
}

function SettingsTab({ data, isLoading }) {
    return (
        <div className="space-y-6">
            <Box loading={isLoading} header title="Bundle Settings" description="Configure bundle options and restrictions">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Quantity</label>
                        <div className="p-3 bg-gray-50 rounded border border-gray-200 text-gray-700">1</div>
                        <p className="text-xs text-gray-500 mt-1">Minimum number of bundles per order</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Quantity</label>
                        <div className="p-3 bg-gray-50 rounded border border-gray-200 text-gray-700">5</div>
                        <p className="text-xs text-gray-500 mt-1">Maximum number of bundles per order</p>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900">Limited Time Offer</p>
                                <p className="text-sm text-gray-500">Show countdown timer</p>
                            </div>
                            <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900">Show Savings Badge</p>
                                <p className="text-sm text-gray-500">Display "Save X%" on bundle</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900">Email Promotion</p>
                                <p className="text-sm text-gray-500">Include in promotional emails</p>
                            </div>
                            <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900">Gift Wrapping Available</p>
                                <p className="text-sm text-gray-500">Offer gift wrapping option</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </div>
                </div>
            </Box>

            <Box loading={isLoading} header title="Availability" description="Set bundle availability rules">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <div className="p-3 bg-gray-50 rounded border border-gray-200 text-gray-400">DD-MM-YYYY</div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <div className="p-3 bg-gray-50 rounded border border-gray-200 text-gray-400">DD-MM-YYYY</div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock Limit</label>
                        <div className="p-3 bg-gray-50 rounded border border-gray-200 text-gray-700">Unlimited</div>
                    </div>
                </div>
            </Box>
        </div>
    );
}
