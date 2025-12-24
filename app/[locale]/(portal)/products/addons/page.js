'use client';

import React, { useState } from 'react';
import { Button, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import DataTable from '@/components/shared/data-table';
import { useAddons, useDeleteAddon, useAddonTypes } from '@/hooks/useAddons';
import AddonModal from '@/components/pages/products/addons/AddonModal';
import DeleteModal from '@/components/shared/delete-modal';
import InputSearch from '@/components/ui/input-search';
import useUiStates from '@/store/useUiStates';
import { AddonCols } from '@/lib/columns/addon-cols';

export default function AddonsPage() {
  const { openModal, isDeleteModalOpen, closeDeleteModal } = useUiStates();

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState(null);

  // Data
  const { data: addons, isLoading } = useAddons({
    // Filters here
  });

  const { data: addonTypes } = useAddonTypes();
  const deleteAddon = useDeleteAddon();

  const handleDelete = async () => {
    if (isDeleteModalOpen.data) {
      try {
        await deleteAddon.mutateAsync(isDeleteModalOpen.data.id);
        closeDeleteModal();
      } catch (error) {
        // Error handled in hook
      }
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    // Logic for sorting if needed
  };

  return (
    <div className="">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Addons</h1>
          <p className="text-gray-500">Manage global product addons (e.g., Warranty, Gift Wrap)</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal(true, null)}>
          Add Addon
        </Button>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <div className="w-64">
          <InputSearch placeholder="Search addons..." onSearch={setSearchTerm} />
        </div>
        <Select
          placeholder="Filter by Type"
          allowClear
          style={{ width: 200 }}
          onChange={setSelectedType}
          options={addonTypes?.map((t) => ({ label: t.name, value: t.id }))}
        />
      </div>

      <DataTable
        columns={AddonCols()}
        dataSource={addons || []}
        loading={isLoading}
        rowKey="id"
        pagination={false}
        onChange={handleTableChange}
        onRow={(record) => ({
          onClick: () => {
            window.location.href = `/products/addons/${record.id}`;
          },
          style: { cursor: 'pointer' },
        })}
      />

      <AddonModal />

      <DeleteModal
        isOpen={isDeleteModalOpen.open}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Delete Addon"
        message={`Are you sure you want to delete "${isDeleteModalOpen.data?.name}"?`}
        loading={deleteAddon.isPending}
        entityName="Addon"
      />
    </div>
  );
}
