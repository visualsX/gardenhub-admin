'use client';

import React from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import DataTable from '@/components/shared/data-table';
import { useAddonTypes, useDeleteAddonType } from '@/hooks/useAddons';
import AddonTypeModal from '@/components/pages/configuration/AddonTypeModal';
import DeleteModal from '@/components/shared/delete-modal';
import useUiStates from '@/store/useUiStates';
import { AddonTypeCols } from '@/lib/columns/addon-type-cols';

export default function AddonTypesPage() {
  const { openModal, isDeleteModalOpen, closeDeleteModal } = useUiStates();
  const { data: addonTypes, isLoading } = useAddonTypes();
  const deleteAddonType = useDeleteAddonType();

  const handleDelete = async () => {
    if (isDeleteModalOpen.data) {
      try {
        await deleteAddonType.mutateAsync(isDeleteModalOpen.data.id);
        closeDeleteModal();
      } catch (error) {
        // Error handled in hook
      }
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    // Implement sorting logic if needed
  };

  return (
    <div className="">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Addon Types</h1>
          <p className="text-gray-500">Manage types of addons available for products</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal(true, null)}>
          Add Addon Type
        </Button>
      </div>

      <DataTable
        columns={AddonTypeCols()}
        dataSource={addonTypes || []}
        loading={isLoading}
        rowKey="id"
        pagination={false}
        onChange={handleTableChange}
      />

      <AddonTypeModal />

      <DeleteModal
        isOpen={isDeleteModalOpen.open}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Delete Addon Type"
        message={`Are you sure you want to delete "${isDeleteModalOpen.data?.name}"? This action cannot be undone.`}
        loading={deleteAddonType.isPending}
        entityName="Addon Type"
      />
    </div>
  );
}
