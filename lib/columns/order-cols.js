import { Button } from 'antd';
import Badge from '@/components/ui/badge';
import EyeIcon from '@/public/shared/Eye.svg';
import Link from 'next/link';

const statusBadge = {
  Completed: <Badge variant="success">Completed</Badge>,
  Processing: <Badge variant="info">Processing</Badge>,
  Shipped: <Badge variant="secondary">Shipped</Badge>,
  Pending: <Badge variant="warning">Pending</Badge>,
  Cancelled: <Badge variant="danger">Cancelled</Badge>,
};

export const OrderColumns = () => [
  { title: 'Order ID', dataIndex: 'id', key: 'id' },
  { title: 'Customer', dataIndex: 'customer', key: 'customer' },
  { title: 'Date', dataIndex: 'date', key: 'date' },
  { title: 'Items', dataIndex: 'items', key: 'items' },
  { title: 'Total', dataIndex: 'total', key: 'total' },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => statusBadge[status] ?? status,
  },
  {
    title: 'Actions',
    key: 'actions',
    render: () => (
      <Link href="#" className="flex items-center gap-x-2">
        <EyeIcon />
        <span className="font-outfit text-black">View Details</span>
      </Link>
    ),
  },
];

export default OrderColumns;
