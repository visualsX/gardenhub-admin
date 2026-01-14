import { Button } from 'antd';
import Badge from '@/components/ui/badge';
import TrashIcon from '@/public/shared/trash.svg';
import ColumnActions from '@/components/shared/column-actions';

const statusBadge = {
  COMPLETED: <Badge variant="success">Completed</Badge>,
  DELIVERED: <Badge variant="success">Delivered</Badge>,
  PROCESSING: <Badge variant="info">Processing</Badge>,
  SHIPPED: <Badge variant="secondary">Shipped</Badge>,
  PENDING: <Badge variant="warning">Pending</Badge>,
  CANCELLED: <Badge variant="danger">Cancelled</Badge>,
  REFUNDED: <Badge variant="danger">Refunded</Badge>,
  PARTIALLY_REFUNDED: <Badge variant="warning">Partially Refunded</Badge>,
  PAYMENT_FAILED: <Badge variant="danger">Payment Failed</Badge>,
};

export const OrderColumns = (onDelete) => [
  {
    title: 'Order Number',
    dataIndex: 'orderNumber',
    key: 'orderNumber',
    render: (orderNumber) => <span className="font-semibold text-gray-900">#{orderNumber}</span>,
  },
  {
    title: 'Customer',
    dataIndex: 'customer',
    key: 'customer',
    render: (customer) => (
      <span className="text-gray-900">
        {customer?.firstName} {customer?.lastName}
      </span>
    ),
  },
  {
    title: 'Date',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (date) => <span className="text-gray-600">{new Date(date).toLocaleDateString()}</span>,
  },
  {
    title: 'Items',
    dataIndex: 'itemCount',
    key: 'itemCount',
    render: (count) => <span className="text-gray-600">{count} items</span>,
  },
  {
    title: 'Total',
    dataIndex: 'grandTotal',
    key: 'grandTotal',
    render: (total) => <span className="font-semibold text-gray-900">{total} AED</span>,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => statusBadge[status] ?? <Badge variant="info">{status}</Badge>,
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (_, record) => <ColumnActions edit={false} id={record?.id} />,
  },
];

export default OrderColumns;
