import Badge from '@/components/ui/badge';
import Trash2 from '@/public/shared/trash.svg';
import Edit2 from '@/public/shared/edit.svg';
import useUiStates from '@/store/useUiStates';
import { useRouter } from 'next/navigation';
import ColumnActions from '@/components/shared/column-actions';

export function CouponCols() {
  return [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      width: 150,
      render: (text, record) => (
        <div>
          <div className="font-semibold text-gray-900">{text}</div>
          <div className="text-sm text-gray-500">{record.name}</div>
        </div>
      ),
    },
    {
      title: 'Discount',
      dataIndex: 'discountValue',
      key: 'discountValue',
      render: (value, record) => (
        <span className="font-medium text-gray-900">
          {record.isPercentage ? `${value}%` : `${value} AED`}
        </span>
      ),
    },
    {
      title: 'Scope',
      dataIndex: 'couponScope',
      key: 'couponScope',
      render: (scope) => {
        const scopeMap = {
          Global: 'All Products',
          Category: 'Category',
          Product: 'Specific Products',
        };
        return <span className="text-gray-900">{scopeMap[scope] || scope}</span>;
      },
    },
    {
      title: 'Usage',
      key: 'usage',
      render: (_, record) => (
        <div className="text-gray-900">
          {record.globalCurrentUsage || 0}
          {record.globalUsageLimit ? ` / ${record.globalUsageLimit}` : ' / ∞'}
        </div>
      ),
    },
    {
      title: 'Min. Order',
      dataIndex: 'minimumOrderAmount',
      key: 'minimumOrderAmount',
      render: (value) => (
        <span className="text-gray-900">{value ? `${value} AED` : 'No minimum'}</span>
      ),
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expirationDate',
      key: 'expirationDate',
      render: (date) => {
        if (!date) return <span className="text-gray-500">No expiry</span>;
        const expiryDate = new Date(date);
        const isExpired = expiryDate < new Date();
        return (
          <span className={isExpired ? 'text-red-600' : 'text-gray-900'}>
            {expiryDate.toLocaleDateString()}
          </span>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Badge variant={isActive ? 'success' : 'error'}>{isActive ? 'Active' : 'Inactive'}</Badge>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 100,
      render: (_, record) => <ColumnActions path={'coupons'} id={record?.id} />,
    },
  ];
}
