import { Tag } from 'antd';
import useUiStates from '@/store/useUiStates';
import ColumnActions from '@/components/shared/column-actions';

export function AddonTypeCols() {
  const { openModal, openDeleteModal } = useUiStates();

  return [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Display Order',
      dataIndex: 'displayOrder',
      key: 'displayOrder',
      sorter: true,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'success' : 'error'}>{isActive ? 'Active' : 'Inactive'}</Tag>
      ),
    },
    {
      title: '',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <ColumnActions id={record.id} onEdit={() => openModal(true, record)} />
      ),
    },
  ];
}
