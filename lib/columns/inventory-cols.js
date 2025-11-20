import ColumnActions from '@/components/shared/column-actions';

const getInventoryStatus = (stock, threshold = 5) => {
  if (stock <= 0) {
    return { label: 'Out of Stock', tone: 'danger', badgeClass: 'bg-red-50 text-red-600' };
  }
  if (stock <= threshold) {
    return { label: 'Low Stock', tone: 'warning', badgeClass: 'bg-amber-50 text-amber-600' };
  }
  return { label: 'In Stock', tone: 'success', badgeClass: 'bg-green-50 text-green-600' };
};

const formatCurrency = (value) =>
  typeof value === 'number' ? `$${value.toFixed(2)}` : value ?? '$0.00';

export const InventoryCols = () => [
  {
    title: 'Product',
    dataIndex: 'name',
    key: 'name',
    render: (_, record) => (
      <div className="flex items-center gap-3">
        <span className="bg-primary/5 text-primary inline-flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold uppercase">
          {record.name?.charAt(0) ?? '?'}
        </span>
        <div>
          <p className="font-medium text-gray-900">{record.name}</p>
          <p className="text-sm text-gray-500">{record.categoryName ?? 'Uncategorised'}</p>
        </div>
      </div>
    ),
  },
  {
    title: 'SKU',
    dataIndex: 'sku',
    key: 'sku',
    render: (sku) => <span className="text-gray-700">{sku ?? '—'}</span>,
  },
  {
    title: 'Category',
    dataIndex: 'categoryName',
    key: 'category',
    render: (value) => (
      <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">{value ?? '—'}</span>
    ),
  },
  {
    title: 'Stock',
    dataIndex: 'currentStock',
    key: 'stock',
    render: (value) => (
      <span className="font-medium text-gray-900">
        {value ?? 0} <span className="text-sm font-normal text-gray-500">units</span>
      </span>
    ),
  },
  {
    title: 'Status',
    key: 'status',
    render: (_, record) => {
      if (record.stockStatus) {
        const badgeClass =
          record.stockStatus === 'OUT_OF_STOCK'
            ? 'bg-red-50 text-red-600'
            : record.stockStatus === 'LOW_STOCK'
            ? 'bg-amber-50 text-amber-600'
            : 'bg-green-50 text-green-600';
        return (
          <span className={`rounded-full px-3 py-1 text-sm font-medium ${badgeClass}`}>
            {record.stockStatus?.replace(/_/g, ' ') ?? 'In Stock'}
          </span>
        );
      }
      const status = getInventoryStatus(record.currentStock ?? record.availableStock ?? 0, record.lowStockThreshold);
      return (
        <span className={`rounded-full px-3 py-1 text-sm font-medium ${status.badgeClass}`}>
          {status.label}
        </span>
      );
    },
  },
  {
    title: 'Unit Price',
    dataIndex: 'regularPrice',
    key: 'unitPrice',
    render: (_, record) => {
      const price = record.regularPrice ?? record.costPrice;
      return <span className="text-gray-900">{formatCurrency(price)}</span>;
    },
  },
  {
    title: 'Total Value',
    key: 'totalValue',
    render: (_, record) => {
      const stock = record.currentStock ?? record.availableStock ?? 0;
      const price = record.regularPrice ?? record.costPrice ?? 0;
      return <span className="text-gray-900">{formatCurrency(stock * price)}</span>;
    },
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (_, record) => <ColumnActions record={record} />,
  },
];
