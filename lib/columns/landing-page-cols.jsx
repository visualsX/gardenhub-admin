import ColumnActions from '@/components/shared/column-actions';
import Link from 'next/link';

export function LandingPageCols(router) {
  return [
    {
      title: 'Banner Heading',
      dataIndex: 'heading',
      key: 'heading',
      render: (text, record) => (
        <Link
          className="text-primary! cursor-pointer font-medium hover:underline"
          href={`/configuration/landing-page/${record.id}`}
        >
          {text || 'Untitled Banner'}
        </Link>
      ),
    },
    {
      title: 'Subheading',
      dataIndex: 'subheading',
      key: 'subheading',
    },
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (url) => (
        <div className="h-10 w-20 overflow-hidden rounded border border-gray-100 bg-gray-50">
          {url ? (
            <img src={url} alt="Banner" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
              No Image
            </div>
          )}
        </div>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 100,
      render: (_, record) => <ColumnActions path={'configuration/landing-page'} id={record?.id} />,
    },
  ];
}
