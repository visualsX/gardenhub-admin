import { Tag, Switch } from 'antd';
import ColumnActions from '@/components/shared/column-actions';
import Link from 'next/link';

export function PaymentMethodCols(router) {
    return [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Link
                    className="text-primary! cursor-pointer font-medium hover:underline"
                    href={`/configuration/payment-methods/${record.id}`}
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
            title: 'Provider',
            dataIndex: 'gatewayProvider',
            key: 'gatewayProvider',
            render: (provider) => provider || 'N/A',
        },
        {
            title: '',
            key: 'actions',
            width: 100,
            render: (_, record) => <ColumnActions path={'configuration/payment-methods'} id={record?.id} />,
        },
    ];
}
