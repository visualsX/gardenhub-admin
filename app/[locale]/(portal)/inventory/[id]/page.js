'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Button, Input, Skeleton } from 'antd';
import ArrowLeft from '@/public/shared/arrow-left.svg';
import CurrentStockIcon from '@/public/shared/current-stock.svg';
import InventoryValueIcon from '@/public/shared/inventory-value.svg';
import ReorderIcon from '@/public/shared/reorder-point.svg';
import StatusSuccessIcon from '@/public/shared/status-success.svg';
import EditIcon from '@/public/shared/edit-btn.svg';
import ExportIcon from '@/public/shared/export-btn.svg';
import TrashIcon from '@/public/shared/trash-red.svg';
import { Box } from '@/components/wrappers/box';
import { useInventoryItem, useInventoryTransactions } from '@/hooks/useInventory';
import { useParams } from 'next/navigation';
import LabelAndValue from '@/components/ui/label-value';
import GoBack from '@/components/ui/go-back';

const InventoryDetail = ({ params }) => {
  // const productId = Number(params.id);
  const { id } = useParams();
  const { data: product, isLoading: productLoading } = useInventoryItem(+id);
  const {
    data: transactionData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: transactionsLoading,
  } = useInventoryTransactions({ productId: +id, pageSize: 10, order: [{ createdAt: 'DESC' }] });
  const loadMoreRef = useRef(null);

  useEffect(() => {
    if (!hasNextPage) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        fetchNextPage();
      }
    });
    const node = loadMoreRef.current;
    if (node) observer.observe(node);
    return () => {
      if (node) observer.unobserve(node);
    };
  }, [hasNextPage, fetchNextPage]);

  const transactions = useMemo(() => {
    if (!transactionData?.pages) return [];
    return transactionData.pages.flatMap((page) =>
      (page?.edges ?? []).map((edge) => ({
        type: edge.node.type?.replace(/_/g, ' ') ?? '—',
        quantity: edge.node.quantityChange,
        date: edge.node.createdAt,
        reason: edge.node.reason,
        performedBy: edge.node.createdBy,
        reference: edge.node.referenceId,
        cursor: edge.cursor,
      }))
    );
  }, [transactionData]);

  const stock = product?.currentStock ?? product?.availableStock ?? 0;
  const reorderPoint = product?.lowStockThreshold ?? 10;
  const unitPrice = product?.regularPrice ?? product?.costPrice ?? 0;
  const inventoryValue = stock * unitPrice;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <GoBack href="/inventory" title={product?.name} desc={`SKU: ${product?.sku}`} />
        <div className="flex flex-wrap gap-3">
          <Button icon={<ExportIcon />}>Export History</Button>
          <Button icon={<EditIcon />}>Edit Product</Button>
          <Button icon={<TrashIcon />} danger>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatBadge
          loading={productLoading}
          title="Current Stock"
          value={`${stock}`}
          helper="units available"
          icon={<CurrentStockIcon />}
        />
        <StatBadge
          loading={productLoading}
          title="Reorder Point"
          value={reorderPoint}
          helper="minimum threshold"
          icon={<ReorderIcon />}
        />
        <StatBadge
          loading={productLoading}
          title="Inventory Value"
          value={`$${inventoryValue.toFixed(2)}`}
          helper={`at $${unitPrice.toFixed(2)} per unit`}
          icon={<InventoryValueIcon />}
        />
        <StatBadge
          loading={productLoading}
          title="Status"
          value={
            product?.stockStatus?.replace(/_/g, ' ') ?? (stock > 0 ? 'In Stock' : 'Out of Stock')
          }
          helper="Updated just now"
          icon={<StatusSuccessIcon />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <InventoryTabs
            loading={productLoading || transactionsLoading}
            product={product}
            transactions={transactions}
            loadMoreRef={loadMoreRef}
            isFetchingNextPage={isFetchingNextPage}
          />
          <StockProgress
            loading={productLoading}
            stock={stock}
            min={reorderPoint}
            max={product?.maxCapacity ?? 100}
          />
        </div>

        <div className="space-y-6">
          <AdjustmentForm />
          <ActivitySummary
            lastUpdated={product?.lastUpdatedAt ?? '—'}
            transactions={transactions?.length}
            totalValue={inventoryValue}
          />
        </div>
      </div>
    </div>
  );
};

export default InventoryDetail;

function InventoryTabs({ product, transactions, loadMoreRef, isFetchingNextPage, loading }) {
  const [activeTab, setActiveTab] = useState('info');
  const tabs = [
    { key: 'info', label: 'Product Info' },
    { key: 'history', label: 'Transaction History' },
  ];

  return (
    <div>
      <div className="mb-4 flex rounded-full bg-gray-100 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-full px-6 py-2 text-sm font-semibold transition ${
              activeTab === tab.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'info' ? (
        <ProductInfo product={product} loading={loading} />
      ) : (
        <TransactionHistory
          transactions={transactions}
          loadMoreRef={loadMoreRef}
          isFetchingNextPage={isFetchingNextPage}
          loading={loading}
        />
      )}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase">{label}</p>
      <p className="mt-1 font-medium text-gray-900">{value ?? '—'}</p>
    </div>
  );
}

function StatBadge({ title, value, helper, icon, loading }) {
  return (
    <Box>
      <p className="text-xs tracking-wider text-gray-500 uppercase">{title}</p>
      <div className="pt-3">
        <Skeleton loading={loading} paragraph={{ rows: 1 }}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-2xl font-semibold text-gray-900">{value}</p>
              {helper && <p className="text-sm text-gray-500">{helper}</p>}
            </div>
            {icon}
          </div>
        </Skeleton>
      </div>
    </Box>
  );
}

function StockProgress({ stock = 0, min = 10, max = 100, loading }) {
  const percent = Math.min(100, Math.round((stock / (max || 1)) * 100));
  return (
    <Box
      loading={loading}
      header
      title={'Stock Levels'}
      description={'Current inventory thresholds'}
    >
      <div className="my-2 flex items-center justify-between text-sm text-gray-600">
        <span>
          Current Stock <span className="font-medium text-gray-900">{stock} units</span>
        </span>
        <span>
          Min / Max <span className="font-medium text-gray-900">{min}</span> /{' '}
          <span className="font-medium text-gray-900">{max}</span>
        </span>
      </div>
      <div className="h-3 w-full rounded-full bg-gray-100">
        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${percent}%` }} />
      </div>
      <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
        <div className="text-center">
          <p className="font-medium text-gray-900">{stock}</p>
          <p>Available</p>
        </div>
        <div className="text-center">
          <p className="font-medium text-gray-900">{min}</p>
          <p>Low Stock Alert</p>
        </div>
        <div className="text-center">
          <p className="font-medium text-gray-900">{max}</p>
          <p>Max Capacity</p>
        </div>
      </div>
    </Box>
  );
}

function AdjustmentForm() {
  const [mode, setMode] = useState('add');
  return (
    <Box header title={'Quick Actions'} description={'Adjust inventory levels'}>
      <div className="mb-6 flex gap-3">
        <button
          type="button"
          onClick={() => setMode('add')}
          className={`flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border text-sm font-semibold ${
            mode === 'add'
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
              : 'border-gray-200 bg-white text-gray-600'
          }`}
        >
          <span className="text-lg">+</span> Add Stock
        </button>
        <button
          type="button"
          onClick={() => setMode('remove')}
          className={`flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border text-sm font-semibold ${
            mode === 'remove'
              ? 'border-gray-200 bg-gray-50 text-gray-700'
              : 'border-gray-200 bg-white text-gray-500'
          }`}
        >
          <span className="text-lg">−</span> Remove Stock
        </button>
      </div>

      <div className="space-y-5">
        <div>
          <p className="text-sm font-semibold text-gray-700">Quantity</p>
          <Input
            placeholder="Enter quantity"
            className="mt-2 h-12 rounded-2xl border-gray-200 px-4"
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700">Reason</p>
          <Input.TextArea
            rows={3}
            placeholder="Enter reason for adjustment..."
            className="mt-2 rounded-2xl border-gray-200 px-4 py-3"
          />
        </div>

        <Button
          type="primary"
          className="h-12 w-full rounded-2xl border border-green-700 bg-green-700 text-base font-semibold"
        >
          ✓ Apply Adjustment
        </Button>
      </div>
    </Box>
  );
}

function ActivitySummary({ lastUpdated, transactions, totalValue }) {
  return (
    <Box header title={'Activity Summary'}>
      <div className="divide-smoke-light flex flex-col gap-y-4 divide-y text-sm text-gray-600">
        <div className="flex items-center justify-between pb-4">
          <span>Last Updated</span>
          <span className="font-semibold text-gray-900">{lastUpdated ?? '—'}</span>
        </div>
        <div className="flex items-center justify-between pb-4">
          <span>Total Transactions</span>
          <span className="font-semibold text-gray-900">{transactions ?? 0}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Total Value</span>
          <span className="font-semibold text-gray-900">${totalValue?.toFixed(2) ?? '0.00'}</span>
        </div>
      </div>
    </Box>
  );
}

function ProductInfo({ product, loading }) {
  return (
    <Box
      header
      title={'Product Information'}
      description={'Basic details about this inventory item'}
      loading={loading}
    >
      <div className="mt-2 grid gap-6 md:grid-cols-2">
        <LabelAndValue label="Product Name" value={product?.name} />
        <LabelAndValue label="SKU" value={product?.sku} />
        <LabelAndValue label="Category" value={product?.categoryName} />
        <LabelAndValue label="Retail Price" value={`$${(product?.regularPrice ?? 0).toFixed(2)}`} />
        <LabelAndValue label="Cost Price" value={`$${(product?.costPrice ?? 0).toFixed(2)}`} />
        <LabelAndValue
          label="Available Stock"
          value={product?.currentStock ?? product?.availableStock}
        />
        <LabelAndValue label="Low Stock Threshold" value={product?.lowStockThreshold ?? '—'} />
        <LabelAndValue label="Max Capacity" value={product?.maxCapacity ?? '—'} />
      </div>

      {product?.mainImageUrl && (
        <div className="mt-6">
          <img
            src={product?.mainImageUrl}
            alt={product?.name}
            className="h-40 w-40 rounded-lg object-cover ring-1 ring-gray-100"
          />
        </div>
      )}
    </Box>
  );
}

const TransactionHistory = ({ transactions, loadMoreRef, isFetchingNextPage, loading }) => {
  return (
    <Box
      header
      title={'Transaction History'}
      description={'Recent stock movements and adjustments'}
      loading={loading}
    >
      <div className="overflow-hidden rounded-xl border border-gray-100">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-white text-left text-sm text-black">
            <tr>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Quantity</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Reason</th>
              <th className="px-4 py-3 font-medium">Performed By</th>
              <th className="px-4 py-3 font-medium">Reference</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white text-sm text-gray-700">
            {transactions.map((tx) => (
              <tr key={tx.cursor}>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${tx.type.includes('Out') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}
                  >
                    {tx.type}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold">
                  <span className={tx.quantity < 0 ? 'text-red-600' : 'text-emerald-600'}>
                    {tx.quantity > 0 ? '+' : ''}
                    {tx.quantity}
                  </span>
                </td>
                <td className="px-4 py-3">{new Date(tx.date).toLocaleDateString()}</td>
                <td className="px-4 py-3">{tx.reason}</td>
                <td className="px-4 py-3">{tx.performedBy}</td>
                <td className="px-4 py-3">{tx.reference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div ref={loadMoreRef} className="h-10 w-full">
        {isFetchingNextPage && (
          <p className="mt-3 text-center text-sm text-gray-500">Loading more transactions...</p>
        )}
      </div>
    </Box>
  );
};
