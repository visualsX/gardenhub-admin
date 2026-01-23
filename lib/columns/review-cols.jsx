import Badge from '@/components/ui/badge';
import Trash2 from '@/public/shared/trash.svg';
import useUiStates from '@/store/useUiStates';
import { Button, Tooltip } from 'antd';
import dayjs from 'dayjs';

export function ReviewTableCols({ onApprove, onReject, approveLoading, rejectLoading }) {
  const { openDeleteModal } = useUiStates();

  return [
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 200,
      render: (text) => <div className="font-medium text-gray-900">{text}</div>,
    },
    {
      title: 'Review',
      dataIndex: 'title',
      key: 'review',
      render: (text, record) => (
        <div>
          <div className="font-medium text-gray-800">{text}</div>
          <p className="line-clamp-2 text-sm text-gray-500">{record.description}</p>
        </div>
      ),
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      width: 100,
      render: (rating) => (
        <div className="flex items-center gap-1">
          <span className="font-medium text-gray-900">{rating}</span>
          <span className="text-yellow-400">★</span>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isApproved',
      key: 'status',
      width: 120,
      render: (isApproved) => {
        const variant = isApproved ? 'success' : 'warning';
        const label = isApproved ? 'Approved' : 'Pending';
        return <Badge variant={variant}>{label}</Badge>;
      },
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'date',
      width: 150,
      render: (date) => <span className="text-gray-500">{dayjs(date).format('DD MMM YYYY')}</span>,
    },
    {
      title: '',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-3">
          {!record.isApproved && (
            <>
              <Tooltip title="Approve">
                <Button
                  loading={approveLoading}
                  onClick={() => onApprove(record.id)}
                  className="h-7! w-9! rounded-full bg-green-100! text-green-600! hover:bg-green-100!"
                  icon={<CheckIcon size={16} />}
                />
              </Tooltip>
              <Tooltip title="Reject">
                <Button
                  danger
                  loading={rejectLoading}
                  onClick={() => onReject(record.id)}
                  className="h-7! w-9! rounded-full bg-orange-100! text-orange-600! hover:bg-orange-100!"
                  icon={<CloseIcon size={16} />}
                />
              </Tooltip>
            </>
          )}
          <Trash2
            className="cursor-pointer"
            onClick={() => openDeleteModal(true, { id: record.id })}
          />
        </div>
      ),
    },
  ];
}

const CheckIcon = ({ size = 16, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CloseIcon = ({ size = 16, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
