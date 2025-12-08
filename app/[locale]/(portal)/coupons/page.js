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
import InputSearch from '@/components/ui/input-search';
import { Select } from 'antd';
import { useMemo } from 'react';
import { useRouter as useNextRouter, useSearchParams } from 'next/navigation';

const { Option } = Select;

const CouponManagement = () => {
  const { isDeleteModalOpen } = useUiStates();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextRouter = useNextRouter();

  // Get filter values from URL
  const searchTerm = searchParams.get('search') || '';
  const statusFilter = searchParams.get('status') || '';

  // Update URL params
  const updateParams = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    nextRouter.push(`?${params.toString()}`, { scroll: false });
  };

  // Build where clause
  const where = useMemo(() => {
    const conditions = [];

    if (searchTerm) {
      conditions.push({
        or: [
          { code: { contains: searchTerm } },
          { name: { contains: searchTerm } },
        ],
      });
    }

    if (statusFilter === 'active') {
      conditions.push({ isActive: { eq: true } });
    } else if (statusFilter === 'inactive') {
      conditions.push({ isActive: { eq: false } });
    }

    return conditions.length > 0 ? { and: conditions } : null;
  }, [searchTerm, statusFilter]);

  const { data, isLoading, isFetching, pageState } = useCoupons({
    paginationKey: PAGINATION_KEYS.COUPONS,
    pageSize: DEFAULT_CURSOR_PAGE_SIZE,
    where,
  });

  const deleteCoupon = useDeleteCoupon();
  const pageInfo = data?.pageInfo ?? {};

  return (
    <div className="min-h-screen">
      <div className="">
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

        {/* Table Card */}
        <div className="rounded-lg border border-gray-200 bg-white">
          {/* Search and Filters */}
          <div className="flex flex-col gap-4 p-6 md:flex-row">
            <div className="flex-1">
              <InputSearch
                placeholder="Search by code or name"
                defaultValue={searchTerm}
                onSearchChange={(value) => updateParams('search', value)}
              />
            </div>
            <Select
              placeholder="All Status"
              className="w-full md:w-48"
              style={{ height: '40px' }}
              value={statusFilter || undefined}
              onChange={(value) => updateParams('status', value)}
              allowClear
            >
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </div>

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
              deleteCoupon.mutate(isDeleteModalOpen?.data?.id);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CouponManagement;
