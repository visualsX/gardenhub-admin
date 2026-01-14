import React from 'react';
import { Box } from '@/components/wrappers/box';
import DataTable from '@/components/shared/data-table';
import Image from 'next/image';

const ItemsTab = ({ order, isLoading }) => {
  const columns = [
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded border">
            <Image
              src={record.imageUrl || '/shared/placeholder.png'}
              alt={text}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-medium text-gray-900">{text}</p>
            <p className="text-xs text-gray-500">SKU: {record.productSku}</p>
            {record.variantAttributes && (
              <p className="text-xs text-gray-400">{record.variantAttributes}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'pricePerUnit',
      key: 'pricePerUnit',
      render: (price) => <span>{price} AED</span>,
    },
    {
      title: 'Qty',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (qty) => <span className="font-medium">{qty}</span>,
    },
    {
      title: 'Total',
      dataIndex: 'itemTotal',
      key: 'itemTotal',
      render: (total) => <span className="font-semibold text-gray-900">{total} AED</span>,
    },
  ];

  const expandedRowRender = (record) => {
    if (!record.addons?.length) return null;

    return (
      <div className="ml-12 rounded-lg bg-gray-50 p-4">
        <h5 className="mb-3 text-sm font-semibold text-gray-700">Addons</h5>
        <div className="space-y-3">
          {record.addons.map((addon) => (
            <div
              key={addon.id}
              className="flex items-center justify-between border-b pb-2 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="relative h-8 w-8 overflow-hidden rounded border">
                  <Image
                    src={addon.imageUrl || '/shared/placeholder.png'}
                    alt={addon.addonName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-medium">{addon.addonName}</p>
                  <p className="text-[10px] text-gray-500">{addon.optionName}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold">{addon.priceAtPurchase} AED</p>
                <p className="text-[10px] text-gray-500">x{addon.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Box
      loading={isLoading}
      header
      title="Ordered Items"
      description="List of products and their configurations"
    >
      <DataTable
        rowKey={(record) => `${record.productId}-${record.productVariantId}`}
        columns={columns}
        data={order?.items || []}
        pagination={false}
        expandable={{
          expandedRowRender,
          rowExpandable: (record) => record.addons?.length > 0,
        }}
      />
    </Box>
  );
};

export default ItemsTab;
