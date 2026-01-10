'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Tabs, Button } from 'antd';
import PlusIcon from '@/public/shared/plus-white.svg';
import { useBanners, useDeleteBanner, useFeaturedCategories, useDeleteFeaturedCategory } from '@/hooks/useLandingPage';
import DataTable from '@/components/shared/data-table';
import LandingPageFilters from '@/components/pages/configurations/landing-page/LandingPageFilters';
import DeleteModal from '@/components/shared/delete-modal';
import useUiStates from '@/store/useUiStates';
import { LandingPageCols } from '@/lib/columns/landing-page-cols';
import { FeaturedCategoriesCols } from '@/lib/columns/featured-categories-cols';
import { DEFAULT_CURSOR_PAGE_SIZE, PAGINATION_KEYS } from '@/lib/const/pagination';
import FeaturedCategoryModal from '@/components/pages/configurations/landing-page/FeaturedCategoryModal';
import FeaturedCategoryDetailModal from '@/components/pages/configurations/landing-page/FeaturedCategoryDetailModal';

export default function LandingPageConfigPage() {
    const router = useRouter();
    const {
        isDeleteModalOpen,
        openDeleteModal,
        openModal,
        openDetailModal
    } = useUiStates();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('banners');

    // Banners Data
    const { data: bannerData, isLoading: isBannerLoading, isFetching: isBannerFetching, pageState: bannerPageState } = useBanners({
        paginationKey: PAGINATION_KEYS.LANDING_PAGE,
        pageSize: DEFAULT_CURSOR_PAGE_SIZE,
        where: searchTerm ? {
            or: [
                { heading: { contains: searchTerm } },
                { subheading: { contains: searchTerm } }
            ]
        } : null,
    });

    // Featured Categories Data
    const { data: featuredData, isLoading: isFeaturedLoading } = useFeaturedCategories();

    const deleteBanner = useDeleteBanner();
    const deleteFeaturedCategory = useDeleteFeaturedCategory();

    const bannerPageInfo = bannerData?.pageInfo ?? {};

    const handleDelete = async () => {
        if (!isDeleteModalOpen?.data?.id) return;

        try {
            if (activeTab === 'banners') {
                await deleteBanner.mutateAsync(isDeleteModalOpen.data.id);
            } else {
                await deleteFeaturedCategory.mutateAsync(isDeleteModalOpen.data.id);
            }
            openDeleteModal(false, null);
        } catch (error) {
            // Error handled in hooks
        }
    };

    const items = [
        {
            key: 'banners',
            label: 'Hero Banners',
            children: (
                <div className="space-y-6">
                    <LandingPageFilters
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                    />
                    <DataTable
                        loading={isBannerFetching || isBannerLoading}
                        rowKey="id"
                        columns={LandingPageCols(router)}
                        data={bannerData?.nodes || []}
                        onRow={(record) => ({
                            onClick: () => router.push(`/configuration/landing-page/${record.id}`),
                            style: { cursor: 'pointer' },
                        })}
                        pagination={false}
                        cursorPaginationProps={{
                            paginationKey: PAGINATION_KEYS.LANDING_PAGE,
                            pageInfo: bannerPageInfo,
                            totalCount: bannerData?.totalCount ?? 0,
                            pageSize: bannerPageState.pageSize,
                            loading: isBannerLoading || isBannerFetching,
                        }}
                        cursorPaginationWrapperClassName="flex items-center justify-end border-t border-gray-100 px-6 py-4"
                    />
                </div>
            ),
        },
        {
            key: 'featured-categories',
            label: 'Featured Categories',
            children: (
                <div className="space-y-6">
                    <DataTable
                        loading={isFeaturedLoading}
                        rowKey="id"
                        columns={FeaturedCategoriesCols((data) => openModal(true, data))}
                        data={featuredData || []}
                        onRow={(record) => ({
                            onClick: () => openDetailModal(true, record),
                            style: { cursor: 'pointer' },
                        })}
                        pagination={false}
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="min-h-screen">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Landing Page Configuration</h1>
                        <p className="mt-1 text-sm text-gray-600">Manage banners and featured category sections</p>
                    </div>

                    {activeTab === 'banners' ? (
                        <Link
                            href={'/configuration/landing-page/add'}
                            className="bg-primary hover:bg-primary/80 flex items-center gap-2 rounded-lg px-4 py-2.5 text-white transition-colors"
                        >
                            <PlusIcon />
                            Add New Banner
                        </Link>
                    ) : (
                        <Button
                            type="primary"
                            icon={<PlusIcon />}
                            onClick={() => openModal(true, null)}
                            className="bg-primary hover:bg-primary/80 h-[42px] px-6 rounded-lg flex items-center gap-2"
                        >
                            Add Featured Category
                        </Button>
                    )}
                </div>

                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={items}
                    className="landing-page-tabs"
                />
            </div>

            <FeaturedCategoryModal />
            <FeaturedCategoryDetailModal />

            <DeleteModal
                loading={activeTab === 'banners' ? deleteBanner?.isPending : deleteFeaturedCategory?.isPending}
                onConfirm={handleDelete}
                title={`Delete ${activeTab === 'banners' ? 'Banner' : 'Featured Category'}`}
                message={`Are you sure you want to delete this ${activeTab === 'banners' ? 'banner' : 'featured category'}? This action cannot be undone.`}
            />
        </div>
    );
}
