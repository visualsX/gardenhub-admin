import Badge from '@/components/ui/badge';
import Trash2 from '@/public/shared/trash.svg';
import Edit2 from '@/public/shared/edit.svg';
import useUiStates from '@/store/useUiStates';
import ColumnActions from '@/components/shared/column-actions';

export function ProductCols() {
  const { isDeleteModalOpen, closeDeleteModal } = useUiStates();

  return [
    {
      title: 'Name & Picture',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full text-2xl">
            <img
              className="h-full w-full bg-cover"
              src={record?.images[0]?.imageUrl}
              alt="product main image"
            />
          </div>
          <div>
            <div className="font-medium text-gray-900">{text}</div>
            <div className="text-sm text-gray-500">{record.sku}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Category/subcategory',
      dataIndex: 'category',
      key: 'category',
      render: (text, record) => (
        <div>
          <div className="text-gray-900">{text}</div>
          <div className="text-sm text-gray-500">{record.subcategory}</div>
        </div>
      ),
    },
    {
      title: 'Stock Status',
      dataIndex: 'stockStatus',
      key: 'stockStatus',
      render: (el, record) => {
        const status = record.stockQuantity > 0 ? 'In Stock' : 'Out of Stock';
        let color = 'success';
        if (status === 'Low Stock') color = 'warning';
        if (status === 'Out of Stock') color = 'error';
        return (
          <Badge variant={color}>{record.stockQuantity > 1 ? 'In Stock' : 'Out of Stock'}</Badge>
        );
      },
    },
    {
      title: 'Stock',
      dataIndex: 'stockQuantity',
      key: 'stock',
      align: 'left',
    },
    {
      title: 'Prices (AED)',
      dataIndex: 'costPrice',
      key: 'costPrice',
      align: 'left',
      render: (text) => <span className="text-gray-900">{text} AED</span>,
    },
    {
      title: 'Sold',
      dataIndex: 'sold',
      key: 'sold',
      align: 'left',
      render: (text) => <span className="text-gray-900">{'N/A'}</span>,
    },
    {
      title: '',
      key: 'actions',
      width: 100,
      render: (_, record) => <ColumnActions record={record} />,
    },
  ];
}
