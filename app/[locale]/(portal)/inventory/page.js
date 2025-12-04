'use client';

import { useState } from 'react';
import { Button, Input, Select, Skeleton, Dropdown } from 'antd';
import { useRouter } from 'next/navigation';
import Search from '@/public/shared/search.svg';
import UpIcon from '@/public/shared/up-sm.svg';
import WarnIcon from '@/public/shared/warn-sm.svg';
import LowIcon from '@/public/shared/low-sm.svg';
import { useInventory, useInventoryStats } from '@/hooks/useInventory';
import { DEFAULT_CURSOR_PAGE_SIZE, PAGINATION_KEYS } from '@/lib/const/pagination';
import { Box } from '@/components/wrappers/box';
import CursorPagination from '@/components/shared/cursor-pagination';
import SegmentedTabs from '@/components/ui/segmented-tabs';
import Image from 'next/image';

const { Option } = Select;

const StatCard = ({ title, value, helper, icon, loading }) => (
  <Box>
    <p className="text-sm font-medium text-gray-500">{title}</p>
    <div className="mt-2">
      <Skeleton size="small" paragraph={{ rows: 1 }} loading={loading}>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
          <span>{icon}</span>
          <span>{helper}</span>
        </div>
      </Skeleton>
    </div>
  </Box>
);

const StockBadge = ({ stock, trackInventory }) => {
  if (!trackInventory) {
    return <span className="text-sm text-gray-400">Not tracked</span>;
  }

  if (stock === 0) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-red-600">{stock} units</span>
      </div>
    );
  }

  if (stock < 10) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-orange-600">{stock} units</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-green-600">{stock} units</span>
    </div>
  );
};

const StatusBadge = ({ stock, trackInventory }) => {
  if (!trackInventory) {
    return null;
  }

  if (stock === 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
        <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
        Out of Stock
      </span>
    );
  }

  if (stock < 10) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700">
        <span className="h-1.5 w-1.5 rounded-full bg-orange-600"></span>
        Low Stock
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
      <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
      In Stock
    </span>
  );
};

const VariantRow = ({ variant, isLast }) => {
  const router = useRouter();
  const totalValue = (variant.price || 0) * (variant.currentStock || 0);

  return (
    <tr 
      className={`cursor-pointer hover:bg-gray-50 ${!isLast ? 'border-b border-gray-100' : ''}`}
      onClick={() => router.push(`/inventory/${variant.id}`)}
    >
      <td className="px-4 py-4 text-sm text-gray-900">{variant.name}</td>
      <td className="px-4 py-4 text-sm text-gray-600">{variant.sku}</td>
      <td className="px-4 py-4 text-sm text-gray-600">{variant.categoryName || 'Indoor Plants'}</td>
      <td className="px-4 py-4">
        <StockBadge stock={variant.currentStock} trackInventory={variant.trackInventory} />
      </td>
      <td className="px-4 py-4">
        <StatusBadge stock={variant.currentStock} trackInventory={variant.trackInventory} />
      </td>
      <td className="px-4 py-4 text-sm font-medium text-gray-900">${variant.price?.toFixed(2) || '0.00'}</td>
      <td className="px-4 py-4 text-sm font-semibold text-gray-900">${totalValue.toFixed(2)}</td>
      <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
        <Dropdown
          menu={{
            items: [
              { key: 'edit', label: 'Edit' },
              { key: 'adjust', label: 'Adjust Stock' },
              { key: 'delete', label: 'Delete', danger: true },
            ],
          }}
          trigger={['click']}
        >
          <button className="text-gray-400 hover:text-gray-600">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="8" cy="3" r="1.5" />
              <circle cx="8" cy="8" r="1.5" />
              <circle cx="8" cy="13" r="1.5" />
            </svg>
          </button>
        </Dropdown>
      </td>
    </tr>
  );
};

const ProductRow = ({ product, isExpanded, onToggle }) => {
  const router = useRouter();
  const hasVariants = product.variants && product.variants.length > 0;

  const handleClick = () => {
    if (hasVariants) {
      onToggle();
    } else {
      router.push(`/inventory/${product.id}`);
    }
  };

  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-sm">
      <div
        className="flex cursor-pointer items-center gap-4 px-6 py-4 transition-colors hover:bg-gray-50"
        onClick={handleClick}
      >
        {hasVariants && (
          <button 
            className="text-gray-400 transition-transform duration-200 flex-shrink-0" 
            style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        )}
        {!hasVariants && <div className="w-5" />}
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-green-50">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
            <path d="M20 7h-9M14 17H5M17 12H3" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900">{product.name}</h3>
          <p className="text-sm text-gray-500 truncate">Large indoor plant with vibrant leaves</p>
        </div>
      </div>

      {isExpanded && hasVariants && (
        <div className="bg-white px-6 pb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-y border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variant Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Value</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {product.variants.map((variant, index) => (
                  <VariantRow key={variant.id} variant={variant} isLast={index === product.variants.length - 1} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const InventoryPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('variants');
  const [expandedProducts, setExpandedProducts] = useState(new Set());

  // Define where clause based on active tab
  const where = activeTab === 'variants' 
    ? { hasVariants: { eq: true } }
    : { hasVariants: { eq: false } };

  const { data, isLoading, isFetching, pageState } = useInventory({
    paginationKey: `${PAGINATION_KEYS.INVENTORY}_${activeTab}`,
    pageSize: DEFAULT_CURSOR_PAGE_SIZE,
    where,
  });
  const { data: statsData, isLoading: statsLoading } = useInventoryStats();

  const inventoryItems = data?.nodes ?? [];
  const totalCount = data?.totalCount ?? 0;
  const stats = statsData ?? {
    totalProducts: totalCount,
    lowStockItems: 0,
    outOfStockItems: 0,
    inventoryValue: 0,
  };

  // Use inventoryItems directly as they are now filtered by the API
  const filteredProducts = inventoryItems;

  const toggleProduct = (productId) => {
    setExpandedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const tabItems = [
    {
      key: 'single',
      label: 'Single Products',
    },
    {
      key: 'variants',
      label: 'Products with Variants',
    },
  ];

  return (
    <div className="min-h-screen space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="mt-1 text-sm text-gray-500">Track and manage product stock levels</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button className="rounded-lg border-gray-200 px-5 py-2 text-gray-700">Export</Button>
          <Button
            type="primary"
            className="rounded-lg bg-green-600 px-5 py-2 text-white"
            onClick={() => router.push('/inventory/update')}
          >
            Update Stock
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          loading={statsLoading}
          title="Total Products"
          value={stats.totalProducts ?? totalCount}
          helper="+12.5% vs last month"
          icon={<UpIcon />}
        />
        <StatCard
          loading={statsLoading}
          title="Low Stock Items"
          value={stats.lowStockItems ?? 0}
          helper="Requires attention"
          icon={<WarnIcon />}
        />
        <StatCard
          loading={statsLoading}
          title="Out of Stock"
          value={stats.outOfStockItems}
          helper={`${(((stats.outOfStockItems ?? 0) / Math.max(stats.totalProducts ?? totalCount, 1)) * 100).toFixed(1)}% of inventory`}
          icon={<LowIcon />}
        />
        <StatCard
          loading={statsLoading}
          title="Inventory Value AED"
          value={`${(stats.inventoryValue ?? 0).toFixed(2)}`}
          helper="+8.2% vs last month"
          icon={<UpIcon />}
        />
      </div>

      <Box>
        <div className="flex flex-col gap-4 md:flex-row">
          <Input
            placeholder="Search"
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
            <Option value="all">All Statuses</Option>
            <Option value="in-stock">In Stock</Option>
            <Option value="low-stock">Low Stock</Option>
            <Option value="out-of-stock">Out of Stock</Option>
          </Select>
        </div>
      </Box>

      <Box padding="p-0">
        <div className="px-6 pt-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Inventory Items</h2>
            <p className="text-sm text-gray-500">
              Showing {filteredProducts.length} of {totalCount} products
            </p>
          </div>

          <SegmentedTabs
            activeTab={activeTab}
            onChange={setActiveTab}
            tabs={tabItems}
            className="w-fit"
          />
        </div>

        <div className="min-h-[500px] px-5">
          {isLoading || isFetching ? (
            <div className="p-6">
              <Skeleton active paragraph={{ rows: 8 }} />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-gray-500">
              No products found
            </div>
          ) : (
            <div>
              {filteredProducts.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  isExpanded={expandedProducts.has(product.id)}
                  onToggle={() => toggleProduct(product.id)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end border-t border-gray-100 px-6 py-4">
          <CursorPagination
            paginationKey={`${PAGINATION_KEYS.INVENTORY}_${activeTab}`}
            pageInfo={data?.pageInfo ?? {}}
            totalCount={totalCount}
            pageSize={pageState.pageSize}
            loading={isLoading || isFetching}
          />
        </div>
      </Box>
    </div>
  );
};

export default InventoryPage;
