import { Tag } from 'antd';
import useUiStates from '@/store/useUiStates';
import ColumnActions from '@/components/shared/column-actions';

export function AddonCols() {
  const { openModal, openDeleteModal } = useUiStates();

  return [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
    },
    {
      title: 'Type',
      dataIndex: 'addonTypeName',
      key: 'addonTypeName',
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
