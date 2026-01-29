import { Tag, Switch } from 'antd';
import ColumnActions from '@/components/shared/column-actions';
import Link from 'next/link';

const TYPE_LABELS = {
  OnlineGateway: 'Online Gateway',
  CashOnDelivery: 'Cash on Delivery',
  BankTransfer: 'Bank Transfer',
};

export function PaymentMethodCols(router) {
  return [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Link
          className="text-primary! cursor-pointer font-medium hover:underline"
          href={`/configuration/payment-methods/edit/${record.id}`}
        >
          {text}
        </Link>
      ),
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: (code) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => TYPE_LABELS[type] || type,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>{isActive ? 'Active' : 'Inactive'}</Tag>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <ColumnActions path={'configuration/payment-methods'} id={record?.id} />
      ),
    },
  ];
}
