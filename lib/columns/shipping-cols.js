import { Tag } from 'antd';
import ColumnActions from '@/components/shared/column-actions';
import Link from 'next/link';

export function ShippingCols(router) {
  return [
    {
      title: 'Zone Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Link
          className="text-primary! cursor-pointer font-medium hover:underline"
          href={`/shipping/${record.id}`}
        >
          {text}
        </Link>
      ),
    },
    {
      title: 'Emirates / Regions',
      dataIndex: 'countryCodes',
      key: 'countryCodes',
      render: (codes) => {
        const list =
          typeof codes === 'string' ? codes.split(',') : Array.isArray(codes) ? codes : [];
        return (
          <div className="flex flex-wrap gap-1">
            {list.slice(0, 3).map((code, idx) => (
              <Tag key={idx}>{code.trim()}</Tag>
            ))}
            {list.length > 3 && <Tag>+{list.length - 3} more</Tag>}
          </div>
        );
      },
    },
    {
      title: '',
      key: 'actions',
      width: 100,
      render: (_, record) => <ColumnActions path={'shipping'} id={record?.id} />,
    },
  ];
}
