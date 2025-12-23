'use client';

import React, { use } from 'react';
import { Spin, Button, Tag } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useAddon } from '@/hooks/useAddons';
import { Box } from '@/components/wrappers/box';
import AddonOptionImageUploader from '@/components/pages/products/addons/AddonOptionImageUploader';
import GoBack from '@/components/ui/go-back';
import LabelAndValue from '@/components/ui/label-value';

export default function AddonDetailPage({ params }) {
    const { id } = use(params);
    const { data: addon, isLoading } = useAddon(parseInt(id));

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    if (!addon) {
        return (
            <div className="p-6">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900">Addon not found</h2>
                    <Link href="/products/addons">
                        <Button type="primary" className="mt-4">
                            Back to Addons
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <GoBack href="/products/addons" title={"Addon Details"} desc={"View addon details and manage option images"} />
            {/* Addon Information */}
            <Box header title="Addon Information" description="View addon details">
                <div className="grid grid-cols-4 gap-6">
                    <LabelAndValue label="Addon Name" value={addon.name} />
                    <LabelAndValue label="Type" value={addon.addonTypeName || 'N/A'} />
                    <LabelAndValue label="Description" value={addon.description || 'No description'} />
                    <div>
                        <label className="block text-sm font-semibold">Status</label>
                        <Tag color={addon.isActive ? 'success' : 'error'}>
                            {addon.isActive ? 'Active' : 'Inactive'}
                        </Tag>
                    </div>
                </div>
            </Box>

            {/* Addon Options */}
            <Box header title="All Addon Options" description="Manage images for each option">
                {addon.options && addon.options.length > 0 ? (
                    <div className="grid xl:grid-cols-2 gap-4">
                        {addon.options.map((option, index) => (
                            <Box header title={"Option " + (index + 1)} key={option.id || index}>
                                <section className='grid grid-cols-[150px_1fr] gap-4'>
                                    <Box classRest='col-span-1'>
                                        <label className="block text-sm font-semibold mb-2">
                                            Option Image
                                        </label>
                                        {option.id ? (
                                            <AddonOptionImageUploader
                                                optionId={option.id}
                                                imageUrl={option.imageUrl}
                                            />
                                        ) : (
                                            <div className="text-gray-400 text-sm border rounded px-3 py-2 bg-white inline-block">
                                                Option must be saved before uploading image
                                            </div>
                                        )}
                                    </Box>
                                    <Box classRest="grid grid-cols-2 2xl:grid-cols-3 gap-4">
                                        <LabelAndValue label='Option Name' value={option.name} />
                                        <LabelAndValue label='Default Price' value={option.defaultPrice} currency />
                                        <LabelAndValue label='Sale Price' value={option.salePrice} currency />
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">
                                                Default Option
                                            </label>
                                            <Tag color={option.isDefault ? 'blue' : 'default'}>
                                                {option.isDefault ? 'Yes' : 'No'}
                                            </Tag>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">
                                                Status
                                            </label>
                                            <Tag color={option.isActive ? 'success' : 'error'}>
                                                {option.isActive ? 'Active' : 'Inactive'}
                                            </Tag>
                                        </div>
                                    </Box>
                                    <Box classRest='col-span-2'>
                                        <LabelAndValue label='Description' value={option.description || 'No description'} />
                                    </Box>
                                </section>
                            </Box>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No options available for this addon
                    </div>
                )}
            </Box>
        </div>
    );
}
