'use client';

import React, { useState } from 'react';
import { Tabs } from 'antd';
import DataTable from '@/components/shared/data-table';
import { useReviews, useApproveReview, useRejectReview, useDeleteReview } from '@/hooks/useReviews';
import { ReviewTableCols } from '@/lib/columns/review-cols';
import DeleteModal from '@/components/shared/delete-modal';
import useUiStates from '@/store/useUiStates';
import { DEFAULT_CURSOR_PAGE_SIZE, PAGINATION_KEYS } from '@/lib/const/pagination';
import InputSearch from '@/components/ui/input-search';

const ReviewManagementClient = () => {
  const { isDeleteModalOpen, openDeleteModal } = useUiStates();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');

  const { data, isLoading, isFetching, pageState } = useReviews({
    status: activeTab,
    paginationKey: PAGINATION_KEYS.REVIEWS,
    pageSize: DEFAULT_CURSOR_PAGE_SIZE,
    where: searchTerm
      ? {
          or: [{ customerName: { contains: searchTerm } }, { title: { contains: searchTerm } }],
        }
      : null,
  });

  const approveReview = useApproveReview();
  const rejectReview = useRejectReview();
  const deleteReview = useDeleteReview();

  const handleApprove = async (id) => {
    await approveReview.mutateAsync(id);
  };

  const handleReject = async (id) => {
    await rejectReview.mutateAsync(id);
  };

  const handleDelete = async () => {
    if (!isDeleteModalOpen?.data?.id) return;
    try {
      await deleteReview.mutateAsync(isDeleteModalOpen.data.id);
      openDeleteModal(false, null);
    } catch (error) {
      // Error handled in hooks
    }
  };

  const columns = ReviewTableCols({
    onApprove: handleApprove,
    approveLoading: approveReview.isPending,
    onReject: handleReject,
    rejectLoading: rejectReview.isPending,
  });

  const items = [
    {
      key: 'ALL',
      label: 'All Reviews',
      children: (
        <DataTable
          loading={isFetching || isLoading}
          rowKey="id"
          columns={columns}
          data={data?.nodes || []}
          pagination={false}
          cursorPaginationProps={{
            paginationKey: PAGINATION_KEYS.REVIEWS,
            pageInfo: data?.pageInfo || {},
            totalCount: data?.totalCount ?? 0,
            pageSize: pageState.pageSize,
            loading: isLoading || isFetching,
          }}
          cursorPaginationWrapperClassName="flex items-center justify-end border-t border-gray-100 px-6 py-4"
        />
      ),
    },
    {
      key: 'PENDING',
      label: 'Pending',
      children: (
        <DataTable
          loading={isFetching || isLoading}
          rowKey="id"
          columns={columns}
          data={data?.nodes || []}
          pagination={false}
          cursorPaginationProps={{
            paginationKey: PAGINATION_KEYS.REVIEWS,
            pageInfo: data?.pageInfo || {},
            totalCount: data?.totalCount ?? 0,
            pageSize: pageState.pageSize,
            loading: isLoading || isFetching,
          }}
          cursorPaginationWrapperClassName="flex items-center justify-end border-t border-gray-100 px-6 py-4"
        />
      ),
    },
    {
      key: 'APPROVED',
      label: 'Approved',
      children: (
        <DataTable
          loading={isFetching || isLoading}
          rowKey="id"
          columns={columns}
          data={data?.nodes || []}
          pagination={false}
          cursorPaginationProps={{
            paginationKey: PAGINATION_KEYS.REVIEWS,
            pageInfo: data?.pageInfo || {},
            totalCount: data?.totalCount ?? 0,
            pageSize: pageState.pageSize,
            loading: isLoading || isFetching,
          }}
          cursorPaginationWrapperClassName="flex items-center justify-end border-t border-gray-100 px-6 py-4"
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Review Management</h1>
            <p className="mt-1 text-sm text-gray-600">Review and moderate product feedback</p>
          </div>
        </div>

        {/* Filters */}
        <div className="border-with-radius flex flex-col gap-4 p-6 md:flex-row">
          <div className="flex-1">
            <InputSearch
              placeholder="Search by customer or title"
              defaultValue={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={items}
          className="landing-page-tabs"
        />

        <DeleteModal
          loading={deleteReview.isPending}
          onConfirm={handleDelete}
          title="Delete Review"
          message="Are you sure you want to delete this review? This action cannot be undone."
        />
      </div>
    </div>
  );
};

export default ReviewManagementClient;
