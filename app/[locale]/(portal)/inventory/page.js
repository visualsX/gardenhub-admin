'use client';

import { useMemo } from 'react';
import { Button, Input, Select } from 'antd';
import { useRouter } from 'next/navigation';
import Search from '@/public/shared/search.svg';
import UpIcon from '@/public/shared/up-sm.svg';
import WarnIcon from '@/public/shared/warn-sm.svg';
import CheckIcon from '@/public/shared/check-sm.svg';
import CrossIcon from '@/public/shared/cross-sm.svg';
import LowIcon from '@/public/shared/low-sm.svg';
import DataTable from '@/components/shared/data-table';
import { useProducts } from '@/hooks/useProduct';
import { InventoryCols } from '@/lib/columns/inventory-cols';
import { DEFAULT_CURSOR_PAGE_SIZE, PAGINATION_KEYS } from '@/lib/const/pagination';
import { Box } from '@/components/wrappers/box';

const { Option } = Select;

const StatCard = ({ title, value, helper, icon, trend }) => (
  <Box>
    <p className="text-sm font-medium text-gray-500">{title}</p>
    <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
      <span>{icon}</span>
      {/* {trend && (
        <span className={`font-medium ${trend.positive ? 'text-emerald-600' : 'text-red-600'}`}>
          {trend.value}
        </span>
      )} */}
      <span>{helper}</span>
    </div>
  </Box>
);

const InventoryPage = () => {
  const router = useRouter();
  const { data, isLoading, isFetching, pageState } = useProducts({
    paginationKey: PAGINATION_KEYS.INVENTORY,
    pageSize: DEFAULT_CURSOR_PAGE_SIZE,
  });

  const inventoryItems = data?.nodes ?? [];
  const totalCount = data?.totalCount ?? 0;

  const { lowStockCount, outOfStockCount, totalValue } = useMemo(() => {
    return inventoryItems.reduce(
      (acc, item) => {
        const stock = item.availableStockQuantity ?? 0;
        const threshold = item.lowStockThreshold ?? 5;
        if (stock > 0 && stock <= threshold) acc.lowStockCount += 1;
        if (stock <= 0) acc.outOfStockCount += 1;
        const price = item.salePrice ?? item.regularPrice ?? 0;
        acc.totalValue += stock * price;
        return acc;
      },
      { lowStockCount: 0, outOfStockCount: 0, totalValue: 0 }
    );
  }, [inventoryItems]);

  return (
    <div className="min-h-screen space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="mt-1 text-sm text-gray-500">Track and manage product stock levels</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button className="rounded-lg border-gray-200 px-5 py-2 text-gray-700">Export</Button>
          <Button type="primary" className="rounded-lg bg-green-600 px-5 py-2 text-white">
            Update Stock
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Products"
          value={totalCount}
          helper="+12.5% vs last month"
          icon={<UpIcon />}
          trend={{ positive: true, value: '+12.5%' }}
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockCount}
          helper="Requires attention"
          icon={<WarnIcon />}
          trend={{ positive: false, value: `${lowStockCount || 0}` }}
        />
        <StatCard
          title="Out of Stock"
          value={outOfStockCount}
          helper={`${((outOfStockCount / Math.max(totalCount, 1)) * 100).toFixed(1)}% of inventory`}
          icon={<LowIcon />}
          trend={{ positive: false, value: `${outOfStockCount || 0}` }}
        />
        <StatCard
          title="Inventory Value"
          value={`$${totalValue.toFixed(2)}`}
          helper="+8.2% vs last month"
          icon={<UpIcon />}
          trend={{ positive: true, value: '+8.2%' }}
        />
      </div>

      <Box>
        <div className="flex flex-col gap-4 md:flex-row">
          <Input
            placeholder="Search inventory"
            prefix={<Search className="text-gray-400" />}
            className="h-11"
            style={{ borderRadius: 12 }}
          />
          <Select defaultValue="all" className="h-11! w-full md:w-48" style={{ borderRadius: 12 }}>
            <Option value="all">All categories</Option>
            <Option value="indoor">Indoor Plants</Option>
            <Option value="tools">Tools</Option>
            <Option value="seeds">Seeds</Option>
          </Select>
          <Select defaultValue="all" className="h-11! w-full md:w-48" style={{ borderRadius: 12 }}>
            <Option value="all">All statuses</Option>
            <Option value="in-stock">In Stock</Option>
            <Option value="low-stock">Low Stock</Option>
            <Option value="out-of-stock">Out of Stock</Option>
          </Select>
        </div>
      </Box>
      <Box padding="p-0">
        <div className="mt-6">
          <div className="mb-4 flex items-center justify-between px-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Inventory Items</h2>
              <p className="text-sm text-gray-500">
                Showing {inventoryItems.length} of {totalCount} products
              </p>
            </div>
          </div>

          <DataTable
            loading={isLoading || isFetching}
            rowKey="id"
            columns={InventoryCols()}
            data={inventoryItems}
            onRow={(record) => ({
              onClick: () => router.push(`/inventory/${record.id}`),
              style: { cursor: 'pointer' },
            })}
            pagination={false}
            cursorPaginationProps={{
              paginationKey: PAGINATION_KEYS.INVENTORY,
              pageInfo: data?.pageInfo ?? {},
              totalCount,
              pageSize: pageState.pageSize,
              loading: isLoading || isFetching,
            }}
            cursorPaginationWrapperClassName="flex items-center justify-end border-t border-gray-100 px-6 py-4"
            minHeight={500}
          />
        </div>
      </Box>
    </div>
  );
};

export default InventoryPage;
