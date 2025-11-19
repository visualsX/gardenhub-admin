'use client';

import { useState } from 'react';
import { Button, Input } from 'antd';
import { ArrowLeft } from '@/lib/const/icons';

const InfoRow = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 uppercase">{label}</p>
    <p className="mt-1 font-medium text-gray-900">{value ?? '—'}</p>
  </div>
);

const StatBadge = ({ title, value, helper, icon }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
    <p className="text-xs tracking-wider text-gray-500 uppercase">{title}</p>
    <div className="mt-3 flex items-center gap-3">
      <div className="rounded-full bg-gray-50 p-3">{icon}</div>
      <div>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {helper && <p className="text-sm text-gray-500">{helper}</p>}
      </div>
    </div>
  </div>
);

const StockProgress = ({ stock = 0, min = 10, max = 100 }) => {
  const percent = Math.min(100, Math.round((stock / max) * 100));
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
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
    </div>
  );
};

const AdjustmentForm = () => {
  const [mode, setMode] = useState('add');
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <p className="text-lg font-semibold text-gray-900">Quick Actions</p>
      <p className="mb-6 text-sm text-gray-500">Adjust inventory levels</p>

      <div className="mb-6 flex gap-3">
        <button
          type="button"
          onClick={() => setMode('add')}
          className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl border text-sm font-semibold ${
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
          className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl border text-sm font-semibold ${
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
    </div>
  );
};

const ActivitySummary = ({ lastUpdated, transactions, totalValue }) => (
  <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
    <p className="text-lg font-semibold text-gray-900">Activity Summary</p>
    <div className="mt-5 space-y-5 text-sm text-gray-600">
      <div className="flex items-center justify-between">
        <span>Last Updated</span>
        <span className="font-semibold text-gray-900">{lastUpdated ?? '—'}</span>
      </div>
      <hr />
      <div className="flex items-center justify-between">
        <span>Total Transactions</span>
        <span className="font-semibold text-gray-900">{transactions ?? 0}</span>
      </div>
      <hr />
      <div className="flex items-center justify-between">
        <span>Total Value</span>
        <span className="font-semibold text-gray-900">${totalValue?.toFixed(2) ?? '0.00'}</span>
      </div>
    </div>
  </div>
);

const ProductInfo = ({ product }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <p className="text-lg font-semibold text-gray-900">Product Information</p>
    <p className="mt-1 text-sm text-gray-500">Basic details about this inventory item</p>

    <div className="mt-6 grid gap-6 md:grid-cols-2">
      <InfoRow label="Product Name" value={product.name} />
      <InfoRow label="SKU" value={product.sku} />
      <InfoRow label="Category" value={product.category} />
      <InfoRow label="Sub Category" value={product.subCategory} />
      <InfoRow label="Retail Price" value={`$${product.retailPrice.toFixed(2)}`} />
      <InfoRow label="Unit Price" value={`$${product.unitPrice.toFixed(2)}`} />
      <InfoRow label="Weight" value={`${product.weight} kg`} />
      <InfoRow label="Dimensions" value={product.dimensions} />
    </div>

    {product.description && (
      <div className="mt-6">
        <p className="text-xs text-gray-500 uppercase">Description</p>
        <p className="mt-1 text-sm text-gray-700">{product.description}</p>
      </div>
    )}
  </div>
);

const TransactionHistory = ({ transactions }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <p className="text-lg font-semibold text-gray-900">Transaction History</p>
    <p className="mt-1 text-sm text-gray-500">Recent stock movements and adjustments</p>
    <div className="mt-6 overflow-hidden rounded-xl border border-gray-100">
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50 text-left text-sm text-gray-500">
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
            <tr key={tx.reference}>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${tx.type === 'Stock In' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}
                >
                  {tx.type}
                </span>
              </td>
              <td className="px-4 py-3 font-semibold">
                <span className={tx.type === 'Stock In' ? 'text-emerald-600' : 'text-red-600'}>
                  {tx.type === 'Stock In' ? '+' : '-'}
                  {tx.quantity}
                </span>
              </td>
              <td className="px-4 py-3">{tx.date}</td>
              <td className="px-4 py-3">{tx.reason}</td>
              <td className="px-4 py-3">{tx.performedBy}</td>
              <td className="px-4 py-3">{tx.reference}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const InventoryTabs = ({ product, transactions }) => {
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
        <ProductInfo product={product} />
      ) : (
        <TransactionHistory transactions={transactions} />
      )}
    </div>
  );
};

const InventoryDetail = () => {
  const product = {
    name: 'Fiddle Leaf Fig',
    sku: 'FLF-001',
    category: 'Indoor Plants',
    subCategory: 'Low Light',
    retailPrice: 49.99,
    unitPrice: 49.99,
    weight: 5,
    dimensions: '60cm x 30cm x 30cm',
    description:
      'Large indoor plant with vibrant, violin-shaped leaves. Makes a stunning statement piece for any room.',
    availableStockQuantity: 45,
    lowStockThreshold: 10,
  };

  const transactions = [
    {
      type: 'Stock In',
      quantity: 20,
      date: '2024-01-15',
      reason: 'Stock Replenishment',
      performedBy: 'Sarah Smith',
      reference: 'PO-5678',
    },
    {
      type: 'Stock Out',
      quantity: 8,
      date: '2024-01-14',
      reason: 'Bulk Order #1240',
      performedBy: 'John Doe',
      reference: 'ORD-9821',
    },
    {
      type: 'Stock Out',
      quantity: 2,
      date: '2024-01-13',
      reason: 'Customer Order #1235',
      performedBy: 'Mike Johnson',
      reference: 'ORD-9785',
    },
    {
      type: 'Stock In',
      quantity: 15,
      date: '2024-01-10',
      reason: 'Stock Replenishment',
      performedBy: 'Sarah Smith',
      reference: 'PO-5623',
    },
  ];

  const stock = product.availableStockQuantity;
  const reorderPoint = product.lowStockThreshold;
  const unitPrice = product.unitPrice;
  const inventoryValue = stock * unitPrice;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button icon={<ArrowLeft />} className="rounded-full border-gray-200" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-sm text-gray-500">SKU: {product.sku}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button className="rounded-lg border-gray-200 px-4">Export History</Button>
          <Button className="rounded-lg border-gray-200 px-4">Edit Product</Button>
          <Button danger className="rounded-lg border border-red-200 px-4 text-red-600">
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatBadge
          title="Current Stock"
          value={`${stock}`}
          helper="units available"
          icon={<div className="text-2xl">📦</div>}
        />
        <StatBadge
          title="Reorder Point"
          value={reorderPoint}
          helper="minimum threshold"
          icon={<div className="text-2xl">⚠️</div>}
        />
        <StatBadge
          title="Inventory Value"
          value={`$${inventoryValue.toFixed(2)}`}
          helper={`at $${unitPrice.toFixed(2)} per unit`}
          icon={<div className="text-2xl">💰</div>}
        />
        <StatBadge
          title="Status"
          value={stock > 0 ? 'In Stock' : 'Out of Stock'}
          helper="Updated just now"
          icon={<div className="text-2xl">✅</div>}
        />
        <StatBadge
          title="Reorder Alerts"
          value="2"
          helper="Pending requests"
          icon={<div className="text-2xl">🔔</div>}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <InventoryTabs product={product} transactions={transactions} />
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-lg font-semibold text-gray-900">Stock Levels</p>
            <p className="mt-1 text-sm text-gray-500">Current inventory thresholds</p>
            <div className="mt-6">
              <StockProgress stock={stock} min={reorderPoint} max={100} />
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <AdjustmentForm />
          <ActivitySummary
            lastUpdated="2 hours ago"
            transactions={transactions.length}
            totalValue={inventoryValue}
          />
        </div>
      </div>
    </div>
  );
};

export default InventoryDetail;
