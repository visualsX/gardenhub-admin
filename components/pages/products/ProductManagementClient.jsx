'use client';

import Plus from '@/public/shared/plus-white.svg';
import StatsCard from '@/components/shared/stats-card';
import DataTable from '@/components/shared/data-table';
import Link from 'next/link';
import { useDeleteProduct, useProducts } from '@/hooks/products/useProduct';
import { ProductCols } from '@/lib/columns/product-cols';
import DeleteModal from '@/components/shared/delete-modal';
import useUiStates from '@/store/useUiStates';
import { useRouter } from 'next/navigation';
import { DEFAULT_CURSOR_PAGE_SIZE, PAGINATION_KEYS } from '@/lib/const/pagination';
import { useProductFilters } from '@/hooks/products/useProductFilters';
import { buildProductWhereClause } from '@/lib/filters/productFilters';
import ProductFilters from '@/components/pages/products/ProductFilters';

const ProductManagementClient = ({ categories }) => {
  const { isDeleteModalOpen } = useUiStates();
  const router = useRouter();

  // Filter management
  const filters = useProductFilters();
  const where = buildProductWhereClause({
    searchTerm: filters.searchTerm,
    category: filters.selectedCategory,
    stockStatus: filters.selectedStockStatus,
  });

  // Data fetching
  const { data, isLoading, isFetching, pageState } = useProducts({
    paginationKey: PAGINATION_KEYS.PRODUCTS,
    pageSize: DEFAULT_CURSOR_PAGE_SIZE,
    where,
  });

  const deleteProduct = useDeleteProduct();
  const pageInfo = data?.pageInfo ?? {};

  return (
    <div className="min-h-screen">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
            <p className="mt-1 text-sm text-gray-600">Manage and organise products</p>
          </div>
          <Link
            href={'/products/add'}
            className="bg-primary hover:bg-primary/80 flex items-center gap-2 rounded-lg px-4 py-2.5 text-white transition-colors"
          >
            <Plus size={20} />
            Add New Product
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <StatsCard title="Total Products" value="23,999" />
          <StatsCard title="In Stock" value="142" />
          <StatsCard title="Out of Stock" value="05" variant="danger" />
          <StatsCard title="Low Stock" value="23" variant="warning" />
        </div>

        <ProductFilters
          searchTerm={filters.searchTerm}
          categories={categories}
          filters={{
            selectedCategory: filters.selectedCategory,
            selectedStockStatus: filters.selectedStockStatus,
          }}
          onFilterChange={{
            setSearch: filters.setSearch,
            setCategory: filters.setCategory,
            setStockStatus: filters.setStockStatus,
          }}
        />

        {/* Table Card */}
        <DataTable
          loading={isFetching || isLoading}
          rowKey="id"
          columns={ProductCols()}
          data={data?.nodes}
          onRow={(record) => ({
            onClick: () => router.push(`/products/${record.id}`),
            style: { cursor: 'pointer' },
          })}
          pagination={false}
          cursorPaginationProps={{
            paginationKey: PAGINATION_KEYS.PRODUCTS,
            pageInfo,
            totalCount: data?.totalCount ?? 0,
            pageSize: pageState.pageSize,
            loading: isLoading || isFetching,
          }}
          cursorPaginationWrapperClassName="flex items-center justify-end border-t border-gray-100 px-6 py-4"
        />

        <DeleteModal
          loading={deleteProduct?.isPending}
          onConfirm={() => {
            deleteProduct.mutate(isDeleteModalOpen?.data?.id);
          }}
        />
      </div>
    </div>
  );
};

export default ProductManagementClient;
