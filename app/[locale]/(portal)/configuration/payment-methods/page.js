'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus } from '@/lib/const/icons';
import { usePaymentMethods, useDeletePaymentMethod } from '@/hooks/usePaymentMethods';
import DataTable from '@/components/shared/data-table';
import PaymentMethodFilters from '@/components/pages/configurations/payment-methods/PaymentMethodFilters';
import DeleteModal from '@/components/shared/delete-modal';
import useUiStates from '@/store/useUiStates';
import { usePaymentMethodFilters } from '@/hooks/payment-methods/usePaymentMethodFilters';
import { buildPaymentMethodWhereClause } from '@/lib/filters/paymentMethodFilters';
import { PaymentMethodCols } from '@/lib/columns/payment-method-cols';
import { DEFAULT_CURSOR_PAGE_SIZE, PAGINATION_KEYS } from '@/lib/const/pagination';

export default function PaymentMethodsPage() {
    const router = useRouter();
    const { isDeleteModalOpen, openDeleteModal } = useUiStates();

    // Filter management
    const filters = usePaymentMethodFilters();
    const where = buildPaymentMethodWhereClause({
        searchTerm: filters.searchTerm,
    });

    // Data fetching
    const { data, isLoading, isFetching, pageState } = usePaymentMethods({
        paginationKey: PAGINATION_KEYS.PAYMENT_METHODS,
        pageSize: DEFAULT_CURSOR_PAGE_SIZE,
        where,
    });

    const deleteMethod = useDeletePaymentMethod();
    const pageInfo = data?.pageInfo ?? {};

    return (
        <div className="min-h-screen">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Payment Methods</h1>
                        <p className="mt-1 text-sm text-gray-600">Configure how customers can pay</p>
                    </div>
                    <Link
                        href={'/configuration/payment-methods/add'}
                        className="bg-primary hover:bg-primary/80 flex items-center gap-2 rounded-lg px-4 py-2.5 text-white transition-colors"
                    >
                        <Plus className="h-5 w-5" />
                        Add New Method
                    </Link>
                </div>

                <PaymentMethodFilters
                    searchTerm={filters.searchTerm}
                    onSearchChange={filters.setSearch}
                />

                {/* Table Card */}
                <DataTable
                    loading={isFetching || isLoading}
                    rowKey="id"
                    columns={PaymentMethodCols(router)}
                    data={data?.nodes || []}
                    onRow={(record) => ({
                        onClick: () => router.push(`/configuration/payment-methods/${record.id}`),
                        style: { cursor: 'pointer' },
                    })}
                    pagination={false}
                    cursorPaginationProps={{
                        paginationKey: PAGINATION_KEYS.PAYMENT_METHODS,
                        pageInfo,
                        totalCount: data?.totalCount ?? 0,
                        pageSize: pageState.pageSize,
                        loading: isLoading || isFetching,
                    }}
                    cursorPaginationWrapperClassName="flex items-center justify-end border-t border-gray-100 px-6 py-4"
                />
            </div>

            <DeleteModal
                loading={deleteMethod?.isPending}
                onConfirm={() => {
                    if (isDeleteModalOpen?.data?.id) {
                        deleteMethod.mutate(isDeleteModalOpen.data.id, {
                            onSuccess: () => openDeleteModal(false, null),
                        });
                    }
                }}
            />
        </div>
    );
}
