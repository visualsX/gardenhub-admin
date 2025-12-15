import Badge from '@/components/ui/badge';
import ColumnActions from '@/components/shared/column-actions';
import ImagePlaceholder from '@/public/shared/sidebar/image-placeholder.svg';

export function ProductCols() {
  return [
    {
      title: 'Name & Picture',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <div className="border-smoke flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border bg-gray-50 text-2xl">
            {record?.images?.[0]?.imageUrl ? (
              <img
                className="h-full w-full object-cover"
                src={record.images[0].imageUrl}
                alt="product main image"
              />
            ) : (
              <ImagePlaceholder className="h-4 w-4 text-gray-400" />
            )}
          </div>
          <div>
            <div className="font-medium text-gray-900">{text}</div>
            <div className="text-sm text-gray-500">{record.sku}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'categories',
      key: 'categories',
      render: (text) => <div className="text-gray-900">{text[0]?.name}</div>,
    },
    {
      title: 'Stock Status',
      dataIndex: 'stockStatus',
      key: 'stockStatus',
      render: (el) => {
        let color = 'success';
        if (el === 'Low Stock') color = 'warning';
        if (el === 'Out of Stock') color = 'error';
        return <Badge variant={color}>{el}</Badge>
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
      dataIndex: 'regularPrice',
      key: 'regularPrice',
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
      render: (_, record) => <ColumnActions path={"products"} id={record?.id} />,
    },
  ];
}
