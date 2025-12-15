'use client';

import Plus from '@/public/shared/plus-white.svg';
import StatsCard from '@/components/shared/stats-card';
import DataTable from '@/components/shared/data-table';
import Link from 'next/link';
import { useDeleteCoupon, useCoupons } from '@/hooks/useCoupon';
import { CouponCols } from '@/lib/columns/coupon-cols';
import DeleteModal from '@/components/shared/delete-modal';
import useUiStates from '@/store/useUiStates';
import { useRouter } from 'next/navigation';
import { DEFAULT_CURSOR_PAGE_SIZE, PAGINATION_KEYS } from '@/lib/const/pagination';
import CouponFilters from '@/components/pages/coupons/CouponFilters';
import { useCouponFilters } from '@/hooks/coupons/useCouponFilters';
import { buildCouponWhereClause } from '@/lib/filters/couponFilters';

const CouponManagement = () => {
  const { isDeleteModalOpen, openDeleteModal } = useUiStates(); // Ensure openDeleteModal is destructured if needed for direct calls, though DeleteModal handles confirm
  const router = useRouter();

  // Filter management
  const filters = useCouponFilters();
  const where = buildCouponWhereClause({
    searchTerm: filters.searchTerm,
    selectedStatus: filters.selectedStatus,
  });

  const { data, isLoading, isFetching, pageState } = useCoupons({
    paginationKey: PAGINATION_KEYS.COUPONS,
    pageSize: DEFAULT_CURSOR_PAGE_SIZE,
    where,
  });

  const deleteCoupon = useDeleteCoupon();
  const pageInfo = data?.pageInfo ?? {};

  return (
    <div className="min-h-screen space-y-6">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupon Management</h1>
          <p className="mt-1 text-sm text-gray-600">Manage discount coupons and promotions</p>
        </div>
        <Link
          href={'/coupons/add'}
          className="bg-primary hover:bg-primary/80 flex items-center gap-2 rounded-lg px-4 py-2.5 text-white transition-colors"
        >
          <Plus size={20} />
          Add New Coupon
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatsCard title="Total Coupons" value={data?.totalCount?.toString() || '0'} />
        <StatsCard
          title="Active Coupons"
          value={
            data?.nodes?.filter((c) => c.isActive).length.toString() || '0'
          }
          variant="success"
        />
        <StatsCard
          title="Expired"
          value={
            data?.nodes
              ?.filter((c) => c.expirationDate && new Date(c.expirationDate) < new Date())
              .length.toString() || '0'
          }
          variant="warning"
        />
        <StatsCard
          title="Inactive"
          value={
            data?.nodes?.filter((c) => !c.isActive).length.toString() || '0'
          }
          variant="error"
        />
      </div>

      {/* Search and Filters */}
      <CouponFilters
        searchTerm={filters.searchTerm}
        selectedStatus={filters.selectedStatus}
        onSearchChange={filters.setSearch}
        onStatusChange={filters.setStatus}
      />

      {/* Table */}
      <DataTable
        loading={isFetching || isLoading}
        rowKey="id"
        columns={CouponCols()}
        data={data?.nodes}
        onRow={(record) => ({
          onClick: () => router.push(`/coupons/${record.id}`),
          style: { cursor: 'pointer' },
        })}
        pagination={false}
        cursorPaginationProps={{
          paginationKey: PAGINATION_KEYS.COUPONS,
          pageInfo,
          totalCount: data?.totalCount ?? 0,
          pageSize: pageState.pageSize,
          loading: isLoading || isFetching,
        }}
        cursorPaginationWrapperClassName="flex items-center justify-end border-t border-gray-100 px-6 py-4"
      />

      <DeleteModal
        loading={deleteCoupon?.isPending}
        onConfirm={() => {
          if (isDeleteModalOpen?.data?.id) {
            deleteCoupon.mutate(isDeleteModalOpen.data.id, {
              onSuccess: () => openDeleteModal(false, null)
            });
          }
        }}
      />
    </div>
  );
};

export default CouponManagement;
