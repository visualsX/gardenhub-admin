'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus } from '@/lib/const/icons';
import { useShippingZones, useDeleteShippingZone } from '@/hooks/useShipping';
import DataTable from '@/components/shared/data-table';
import ShippingFilters from '@/components/pages/configurations/shipping/ShippingFilters';
import DeleteModal from '@/components/shared/delete-modal';
import useUiStates from '@/store/useUiStates';
import { useShippingFilters } from '@/hooks/shipping/useShippingFilters';
import { buildShippingWhereClause } from '@/lib/filters/shippingFilters';
import { ShippingCols } from '@/lib/columns/shipping-cols';
import { DEFAULT_CURSOR_PAGE_SIZE, PAGINATION_KEYS } from '@/lib/const/pagination';

export default function ShippingZonesPage() {
  const router = useRouter();
  const { isDeleteModalOpen, openDeleteModal } = useUiStates();

  // Filter management
  const filters = useShippingFilters();
  const where = buildShippingWhereClause({
    searchTerm: filters.searchTerm,
    selectedEmirate: filters.selectedEmirate,
  });

  // Data fetching
  const { data, isLoading, isFetching, pageState } = useShippingZones({
    paginationKey: PAGINATION_KEYS.SHIPPING,
    pageSize: DEFAULT_CURSOR_PAGE_SIZE,
    where,
  });

  const deleteZone = useDeleteShippingZone();
  const pageInfo = data?.pageInfo ?? {};

  return (
    <div className="min-h-screen">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shipping Zones</h1>
            <p className="mt-1 text-sm text-gray-600">Manage shipping rates and regions</p>
          </div>
          <Link
            href={'/configuration/shipping/add'}
            className="bg-primary hover:bg-primary/80 flex items-center gap-2 rounded-lg px-4 py-2.5 text-white transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add New Zone
          </Link>
        </div>

        <ShippingFilters
          searchTerm={filters.searchTerm}
          selectedEmirate={filters.selectedEmirate}
          onSearchChange={filters.setSearch}
          onEmirateChange={filters.setEmirate}
        />
        {/* Table Card */}
        <DataTable
          loading={isFetching || isLoading}
          rowKey="id"
          columns={ShippingCols(router)}
          data={data?.nodes || []}
          onRow={(record) => ({
            onClick: () => router.push(`/configuration/shipping/${record.id}`),
            style: { cursor: 'pointer' },
          })}
          pagination={false}
          cursorPaginationProps={{
            paginationKey: PAGINATION_KEYS.SHIPPING,
            pageInfo,
            totalCount: data?.totalCount ?? 0,
            pageSize: pageState.pageSize,
            loading: isLoading || isFetching,
          }}
          cursorPaginationWrapperClassName="flex items-center justify-end border-t border-gray-100 px-6 py-4"
        />
      </div>

      <DeleteModal
        loading={deleteZone?.isPending}
        onConfirm={() => {
          if (isDeleteModalOpen?.data?.id) {
            deleteZone.mutate(isDeleteModalOpen.data.id, {
              onSuccess: () => openDeleteModal(false, null),
            });
          }
        }}
      />
    </div>
  );
}
