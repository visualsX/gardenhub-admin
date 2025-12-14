'use client';

import React, { useState, useMemo } from 'react';
import { Form, Input, InputNumber, Switch, Button, Table, Card, Row, Col, Avatar, Space } from 'antd';
import { useRouter } from 'next/navigation';
import SegmentedTabs from '@/components/ui/segmented-tabs';
import { Box } from '@/components/wrappers/box';
import SingleImageUploader from '@/components/ui/singleUpload';
import MultiImageUploader from '@/components/ui/uploaderM';
import InputSearch from '@/components/ui/input-search';
import { useProducts } from '@/hooks/products/useProduct';
import Badge from '@/components/ui/badge';
import Trash2 from '@/public/shared/trash-red.svg';
import useUiStates from '@/store/useUiStates';

const { TextArea } = Input;

export default function BundleForm({ initialValues, onSubmit, isLoading, mode = 'create' }) {
    const [form] = Form.useForm();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('overview');
    
    // Product Selection State
    const [selectedProducts, setSelectedProducts] = useState(initialValues?.items || []);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch products for selection
    const { data: productsData, isLoading: isProductsLoading } = useProducts({ 
        first: 10, 
        where: searchTerm ? { name: { contains: searchTerm } } : null 
    });

    // Handle Form Submit
    const handleSubmit = async (values) => {
        // Extract Main Image File
        let mainImageFile = null;
        if (values.mainImage && values.mainImage.length > 0) {
            // Check if it's a new upload (has originFileObj) or existing
            const file = values.mainImage[0];
            if (file.originFileObj) {
                mainImageFile = file.originFileObj;
            }
        }

        // Extract Additional Images Files
        let additionalImageFiles = [];
        if (values.additionalImages && values.additionalImages.length > 0) {
            additionalImageFiles = values.additionalImages
                .filter(f => f.originFileObj) // Only new files
                .map(f => f.originFileObj);
        }

        // Existing Image URLs (for Update)
        // We need to pass the list of URLs that should be KEPT.
        // Assuming values.additionalImages contains mixed new and existing.
        // Existing ones usually don't have originFileObj but have 'url'.
        const existingImageUrls = values.additionalImages
            ?.filter(f => !f.originFileObj && f.url)
            .map(f => f.url) || [];

        // Add main image to existing if it wasn't changed?
        // Logic depends on how backend handles "MainBundleImage" vs existing. 
        // If "MainBundleImage" is null, does it keep existing?
        // Usually safer to assume if we don't send it, it might not change, OR we need to handle it.
        // But for "ExistingImageUrls" typically that refers to the additional images collection.

        const payload = {
            ...values,
            mainImage: mainImageFile,
            additionalImages: additionalImageFiles,
            existingImageUrls: existingImageUrls,
            items: selectedProducts.map(p => ({
                productId: p.id || p.productId, 
                quantity: 1, // Start with 1
                productVariantId: p.productVariantId || null
            })),
        };
        await onSubmit(payload);
    };

    // Calculate Summary
    const summary = useMemo(() => {
        const totalValue = selectedProducts.reduce((sum, p) => sum + (p.regularPrice || p.originalUnitPrice || 0), 0);
        // We need to watch discount/price from form to calculate the rest. 
        // For now, let's assume simple calculation based on form values or local state if we want real-time update.
        // But Form values are not easily accessible outside without watching.
        return {
            totalValue,
            count: selectedProducts.length
        };
    }, [selectedProducts]);

    // Tab Options
    const tabOptions = [
        { label: 'Overview', key: 'overview' },
        { label: 'Products', key: 'products' },
        { label: 'Settings', key: 'settings' },
    ];

    // Transform initial values for images
    const transformedInitialValues = useMemo(() => {
        if (!initialValues) return {};
        
        const mainImg = initialValues.images?.find(i => i.isMain);
        const addImgs = initialValues.images?.filter(i => !i.isMain);

        return {
            ...initialValues,
            // Multi uploader expects fileList-like array
            additionalImages: addImgs?.map(img => ({
                uid: img.id || img.imageUrl,
                name: 'image',
                status: 'done',
                url: img.imageUrl
            })),
            // Single uploader handles its own initial state via existingImage prop, 
            // but we can also set it here if it used Form.Item value. 
            // However, SingleUploader uses a custom implementation with existingImage prop.
        };
    }, [initialValues]);

    const mainImageObj = initialValues?.images?.find(i => i.isMain);

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={transformedInitialValues}
            onFinish={handleSubmit}
            className="pb-20"
        >
             {/* Header Title would go above this component or passed in */}
             
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-10">
                {/* Left Sidebar */}
                <div className="space-y-6">
                    {/* Bundle Images */}
                    <Box title="Bundle Images" header>
                        <SingleImageUploader 
                            name="mainImage" 
                            label="Main Image" 
                            existingImage={mainImageObj}
                            editPage={mode === 'edit'}
                        />
                        <MultiImageUploader 
                            name="additionalImages" 
                            label="Additional Images" 
                        />
                    </Box>

                    {/* Bundle Summary */}
                    <Box title="Bundle Summary" header>
                        <div className="space-y-3">
                            <div className="flex justify-between text-gray-600">
                                <span>Products Selected</span>
                                <span>{summary.count}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Total Value</span>
                                <span className="line-through">${summary.totalValue.toFixed(2)}</span>
                            </div>
                             {/* Watch these values for real-time update */}
                             <Form.Item shouldUpdate noStyle>
                                {({ getFieldValue }) => {
                                    const discount = getFieldValue('discountPercentage') || 0;
                                    const bundlePrice = summary.totalValue * (1 - discount / 100);
                                    const saved = summary.totalValue - bundlePrice;
                                    
                                    return (
                                        <>
                                            <div className="flex justify-between text-green-600 font-medium">
                                                <span>Discount</span>
                                                <span>{discount}%</span>
                                            </div>
                                            <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-smoke mt-2">
                                                <span>Bundle Price</span>
                                                <span>${bundlePrice.toFixed(2)}</span>
                                            </div>
                                             <div className="flex justify-between text-green-600">
                                                <span>Customer Saves</span>
                                                <span>${saved.toFixed(2)}</span>
                                            </div>
                                        </>
                                    );
                                }}
                            </Form.Item>
                        </div>
                    </Box>

                    {/* Bundle Status */}
                    <Box title="Bundle Status" header>
                        <Form.Item name="isActive" label="Active" valuePropName="checked" className="mb-2">
                            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                        </Form.Item>
                        <p className="text-xs text-gray-500 mb-4">Bundle will be visible to customers</p>

                        <Form.Item name="isFeatured" label="Featured Bundle" valuePropName="checked" className="mb-2">
                            <Switch />
                        </Form.Item>
                         <p className="text-xs text-gray-500">Show on homepage</p>
                    </Box>
                </div>

                {/* Right Content */}
                <div className="lg:col-span-2 space-y-6">
                    <SegmentedTabs
                        tabs={tabOptions}
                        activeTab={activeTab}
                        onChange={setActiveTab}
                    />

                    {/* OVERVIEW TAB */}
                    <div className={activeTab === 'overview' ? 'block' : 'hidden'}>
                        <Box title="Basic Information" header description="Essential bundle details">
                            <Form.Item name="name" label="Bundle name *" rules={[{ required: true }]}>
                                <Input placeholder="Enter bundle name" />
                            </Form.Item>
                            <Form.Item name="description" label="Short Description">
                                <TextArea rows={2} placeholder="Enter description" />
                            </Form.Item>
                             <Form.Item name="detailedDescription" label="Full Description">
                                <TextArea rows={4} placeholder="Enter detailed description" />
                            </Form.Item>
                             <Row gutter={16}>
                                <Col span={12}>
                                     <Form.Item name="discountPercentage" label="Discount Percentage (%)" initialValue={0}>
                                        <InputNumber min={0} max={100} className="w-full" />
                                    </Form.Item>
                                </Col>
                             </Row>
                        </Box>

                        <Box title="SEO Information" header description="Optimize for search engines" classRest="mt-6">
                             <Form.Item name="metaTitle" label="SEO Title">
                                <Input placeholder="Enter title for SEO" />
                            </Form.Item>
                            <Form.Item name="metaDescription" label="Meta Description">
                                <TextArea rows={2} placeholder="Brief description for search results" />
                            </Form.Item>
                        </Box>
                    </div>

                    {/* PRODUCTS TAB */}
                    <div className={activeTab === 'products' ? 'block' : 'hidden'}>
                        <Box title="Select Products" header description="Choose products to include in this bundle">
                             <div className="mb-4">
                                <InputSearch 
                                    placeholder="Search products..." 
                                    onSearchChange={setSearchTerm} 
                                    defaultValue={searchTerm}
                                />
                             </div>
                             
                            <Table
                                dataSource={productsData?.nodes || []}
                                loading={isProductsLoading}
                                rowKey="id"
                                pagination={false} // Simple list for now
                                rowSelection={{
                                    type: 'checkbox',
                                    selectedRowKeys: selectedProducts.map(p => p.id || p.productId),
                                    onChange: (_, selectedRows) => {
                                        // Merge new selection with existing (handle pagination case later if needed)
                                        // For now replacing selection based on current page view is tricky if paginated.
                                        // Standard AntD rowSelection helps. 
                                        // But here we might want to accumulate. 
                                        // Let's simplified: just use the passed rows for this simplified view.
                                        setSelectedProducts(selectedRows);
                                    },
                                    preserveSelectedRowKeys: true 
                                }}
                                columns={[
                                    {
                                        title: 'Product',
                                        dataIndex: 'name',
                                        render: (text, record) => (
                                            <div className="flex items-center gap-3">
                                                 <Avatar shape="square" src={record.images?.[0]?.imageUrl} />
                                                 <div>
                                                     <p className="font-medium">{text}</p>
                                                     <p className="text-xs text-gray-500">In Stock: {record.stockQuantity}</p>
                                                 </div>
                                            </div>
                                        )
                                    },
                                    {
                                        title: 'Price',
                                        dataIndex: 'regularPrice',
                                        render: (val) => `$${val?.toFixed(2)}`
                                    }
                                ]}
                            />
                        </Box>

                        <Box title="Selected Products" header description="Products included in this bundle" classRest="mt-6">
                            <Table 
                                dataSource={selectedProducts}
                                rowKey={(r) => r.id || r.productId}
                                pagination={false}
                                columns={[
                                    {
                                        title: 'Product',
                                        dataIndex: 'name', // Or productName if coming from existing bundle items
                                        render: (text, record) => record.name || record.productName
                                    },
                                    {
                                        title: 'Price',
                                        dataIndex: 'regularPrice', // Or originalUnitPrice
                                        render: (val, record) => `$${(val || record.originalUnitPrice || 0).toFixed(2)}`
                                    },
                                    {
                                        title: 'Action',
                                        key: 'action',
                                        render: (_, record) => (
                                            <Button 
                                                type="text" 
                                                danger 
                                                icon={<Trash2 className="h-4 w-4" />} 
                                                onClick={() => {
                                                    setSelectedProducts(prev => prev.filter(p => (p.id || p.productId) !== (record.id || record.productId)));
                                                }}
                                            />
                                        )
                                    }
                                ]}
                            />
                        </Box>
                    </div>

                    {/* SETTINGS TAB */}
                    <div className={activeTab === 'settings' ? 'block' : 'hidden'}>
                         <Box title="Bundle Settings" header description="Configure bundle options and restrictions">
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="minQuantity" label="Minimum Quantity" initialValue={1}>
                                        <InputNumber min={1} className="w-full" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                     <Form.Item name="maxQuantity" label="Maximum Quantity" initialValue={5}>
                                        <InputNumber min={1} className="w-full" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            
                             <div className="space-y-4 pt-4 border-t mt-4">
                                <Form.Item name="isLimitedTime" valuePropName="checked" className="mb-0">
                                    <div className="flex justify-between items-center">
                                       <span>Limited Time Offer</span>
                                       <Switch />
                                    </div>
                                </Form.Item>
                                 <Form.Item name="showSavingsBadge" valuePropName="checked" className="mb-0" initialValue={true}>
                                    <div className="flex justify-between items-center">
                                       <span>Show Savings Badge</span>
                                       <Switch />
                                    </div>
                                </Form.Item>
                                 <Form.Item name="emailPromotion" valuePropName="checked" className="mb-0">
                                    <div className="flex justify-between items-center">
                                       <span>Email Promotion</span>
                                       <Switch />
                                    </div>
                                </Form.Item>
                                 <Form.Item name="giftWrapping" valuePropName="checked" className="mb-0" initialValue={true}>
                                    <div className="flex justify-between items-center">
                                       <span>Gift Wrapping Available</span>
                                       <Switch />
                                    </div>
                                </Form.Item>
                            </div>
                         </Box>

                         <Box title="Availability" header description="Set bundle availability rules" classRest="mt-6">
                             {/* Date Pickers would go here - using simple inputs as placeholders or use DatePicker from antd */}
                         </Box>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="fixed bottom-0 right-0 left-0 bg-transparent border-t border-smoke py-4 z-10 flex justify-between items-center backdrop-blur-[2px] px-8">
                 <div className="text-gray-600">
                    Bundle ready: {summary.count} products, ${summary.totalValue.toFixed(2)}
                 </div>
                 <div className="flex gap-4">
                     <Button size="large" onClick={() => router.back()}>Cancel</Button>
                     <Button type="primary" size="large" htmlType="submit" loading={isLoading} className="bg-green-600">
                        {mode === 'create' ? 'Create Bundle' : 'Save Changes'}
                     </Button>
                 </div>
            </div>
        </Form>
    );
}
