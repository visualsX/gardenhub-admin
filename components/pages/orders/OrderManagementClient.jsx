'use client';

import { useState } from 'react';
import { Segmented } from 'antd';
import DataTable from '@/components/shared/data-table';
import GoBack from '@/components/ui/go-back.jsx';
import { Box } from '@/components/wrappers/box';
import { OrderColumns } from '@/lib/columns/order-cols';
import { useOrders, useDeleteOrder } from '@/hooks/orders/useOrders';
import { PAGINATION_KEYS, DEFAULT_CURSOR_PAGE_SIZE } from '@/lib/const/pagination';
import { useRouter } from 'next/navigation';
import DeleteModal from '@/components/shared/delete-modal';
import useUiStates from '@/store/useUiStates';

const OrderManagementClient = () => {
  const [filter, setFilter] = useState('all');
  const router = useRouter();
  // const { isDeleteModalOpen } = useUiStates();
  const deleteOrder = useDeleteOrder();
  const where = filter !== 'all' ? { status: { eq: filter } } : null;

  const { data, isLoading, isFetching, pageState } = useOrders({
    paginationKey: PAGINATION_KEYS.ORDERS,
    pageSize: DEFAULT_CURSOR_PAGE_SIZE,
    where,
    // order: [{ createdAt: 'DESC' }],
  });

  const stats = [
    { title: 'Total Orders', value: data?.totalCount ?? 0 },
    { title: 'Pending', value: '_' },
    { title: 'Shipped', value: '_' },
    { title: 'Total Revenue', value: '_' },
  ];

  const handleDelete = (record) => {
    useUiStates.getState().openDeleteModal(record);
  };

  return (
    <div className="space-y-6">
      <GoBack title="Order Management" desc="View and manage all customer orders" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Box key={stat.title} padding="p-4">
            <p className="text-sm text-gray-500">{stat.title}</p>
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
          </Box>
        ))}
      </div>

      <Box padding="p-0">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4 px-6 pt-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">All Orders</h2>
            <p className="text-sm text-gray-500">Complete list of all orders placed</p>
          </div>
          <Segmented
            options={[
              { label: 'All Orders', value: 'all' },
              { label: 'Pending', value: 'PENDING' },
              { label: 'Processing', value: 'PROCESSING' },
              { label: 'Shipped', value: 'SHIPPED' },
              { label: 'Delivered', value: 'DELIVERED' },
              { label: 'Completed', value: 'COMPLETED' },
              { label: 'Cancelled', value: 'CANCELLED' },
            ]}
            value={filter}
            onChange={setFilter}
            className="bg-gray-100"
          />
        </div>

        <DataTable
          loading={isLoading || isFetching}
          rowKey="id"
          columns={OrderColumns(handleDelete)}
          data={data?.nodes}
          pagination={false}
          onRow={(record) => ({
            onClick: () => router.push(`/orders/${record.id}`),
            style: { cursor: 'pointer' },
          })}
          cursorPaginationProps={{
            paginationKey: PAGINATION_KEYS.ORDERS,
            pageInfo: data?.pageInfo,
            totalCount: data?.totalCount ?? 0,
            pageSize: pageState.pageSize,
            loading: isLoading || isFetching,
          }}
          className="pb-6"
        />
      </Box>

      <DeleteModal
        loading={deleteOrder?.isPending}
        onConfirm={() => {
          deleteOrder.mutate();
        }}
      />
    </div>
  );
};

export default OrderManagementClient;
