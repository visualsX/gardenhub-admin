'use client';

import { useMemo, useState } from 'react';
import { Button, Input, Table } from 'antd';
import Search from '@/public/shared/search.svg';
import PlusIcon from '@/public/shared/plus-green.svg';
import MinusIcon from '@/public/shared/minus-red.svg';
import SetValueIcon from '@/public/shared/blue-restart.svg';
import GoBack from '@/components/ui/go-back.jsx';
import Badge from '@/components/ui/badge';
import { Box } from '@/components/wrappers/box';

const inventoryData = [
  {
    key: '1',
    name: 'Fiddle Leaf Fig',
    sku: 'FLF-001',
    category: 'Indoor Plants',
    stock: 45,
    status: 'In Stock',
  },
  {
    key: '2',
    name: 'Snake Plant',
    sku: 'SNP-002',
    category: 'Indoor Plants',
    stock: 8,
    status: 'Low Stock',
  },
  {
    key: '3',
    name: 'Monstera Deliciosa',
    sku: 'MON-003',
    category: 'Indoor Plants',
    stock: 0,
    status: 'Out of Stock',
  },
  {
    key: '4',
    name: 'Succulent Mix Pack',
    sku: 'SUC-004',
    category: 'Succulents',
    stock: 89,
    status: 'In Stock',
  },
  {
    key: '5',
    name: 'Pothos Plant',
    sku: 'POT-005',
    category: 'Indoor Plants',
    stock: 34,
    status: 'In Stock',
  },
  {
    key: '6',
    name: 'Peace Lily',
    sku: 'PEL-006',
    category: 'Indoor Plants',
    stock: 5,
    status: 'Low Stock',
  },
];

const statusBadge = (status) => {
  if (status === 'In Stock') return <Badge variant="success">In Stock</Badge>;
  if (status === 'Low Stock') return <Badge variant="warning">Low Stock</Badge>;
  return <Badge variant="danger">Out of Stock</Badge>;
};

const columns = [
  {
    title: 'Product',
    dataIndex: 'name',
    key: 'name',
    render: (text) => (
      <div className="flex items-center gap-3">
        <span className="bg-primary/5 text-primary grid h-10 w-10 place-items-center rounded-xl text-lg font-semibold">
          {text.charAt(0)}
        </span>
        <span className="font-medium text-gray-900">{text}</span>
      </div>
    ),
  },
  {
    title: 'SKU',
    dataIndex: 'sku',
    key: 'sku',
    render: (val) => <Badge variant="default">{val}</Badge>,
  },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
    render: (val) => <Badge variant="transparent">{val}</Badge>,
  },
  {
    title: 'Current Stock',
    dataIndex: 'stock',
    key: 'stock',
    render: (stock) => <span className="font-semibold text-gray-900">{stock}</span>,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: statusBadge,
  },
];

const UpdateTypeButton = ({ label, helper, value, active, icon: Icon, onClick, tone }) => (
  <button
    type="button"
    onClick={() => onClick(value)}
    className={`flex w-full items-center gap-3 rounded-3xl border px-4 py-3 text-left transition ${
      active
        ? tone === 'danger'
          ? 'border-red-500 bg-red-50'
          : tone === 'info'
            ? 'border-blue-500 bg-blue-50'
            : 'border-emerald-500 bg-emerald-50'
        : 'border-gray-200 bg-white hover:border-gray-300'
    }`}
  >
    <span className="rounded-full bg-white p-2 shadow-sm">
      <Icon />
    </span>
    <div>
      <p className="text-sm font-semibold text-gray-900">{label}</p>
      <p className="text-xs text-gray-500">{helper}</p>
    </div>
  </button>
);

const UpdateStockPage = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [updateType, setUpdateType] = useState('add');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  };

  return (
    <div className="min-h-screen space-y-6">
      <GoBack title="Update Stock" desc="Bulk update inventory levels across products" />

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Box
          header
          title={'Select Products'}
          description={'Choose products to update stock levels'}
        >
          <Input
            placeholder="Search products by name or SKU"
            prefix={<Search className="text-gray-400" />}
            className="mb-4 h-11 rounded-2xl"
          />
          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={inventoryData}
              pagination={false}
            />
          </div>
        </Box>

        <Box header title={'Update Settings'} description={'Configure stock adjustment parameters'}>
          <div className="mb-6 space-y-3">
            <UpdateTypeButton
              label="Add Stock"
              helper="Increase inventory levels"
              value="add"
              icon={PlusIcon}
              tone="success"
              active={updateType === 'add'}
              onClick={setUpdateType}
            />
            <UpdateTypeButton
              label="Remove Stock"
              helper="Decrease inventory levels"
              value="remove"
              icon={MinusIcon}
              tone="danger"
              active={updateType === 'remove'}
              onClick={setUpdateType}
            />
            <UpdateTypeButton
              label="Set to Value"
              helper="Set exact stock level"
              value="set"
              icon={SetValueIcon}
              tone="info"
              active={updateType === 'set'}
              onClick={setUpdateType}
            />
          </div>

          <div className="mb-5">
            <p className="text-sm font-semibold text-gray-700">Adjustment Quantity</p>
            <Input
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              className="mt-2 h-12 rounded-2xl border-gray-200"
            />
            <p className="mt-2 text-xs text-gray-500">Amount to add to current stock</p>
          </div>

          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700">Reason for Update</p>
            <Input.TextArea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for stock adjustment..."
              rows={4}
              className="mt-2 rounded-2xl border-gray-200"
            />
            <p className="mt-2 text-xs text-gray-500">This will be recorded in the audit log</p>
          </div>

          <Button type="primary" className="mt-4 h-12 w-full rounded-2xl bg-green-700 text-white">
            Update Changes
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default UpdateStockPage;
