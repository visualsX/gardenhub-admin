import React from 'react';
import { Select } from 'antd';
import InputSearch from '@/components/ui/input-search';

const { Option } = Select;

export default function CouponFilters({
  searchTerm,
  selectedStatus,
  onSearchChange,
  onStatusChange,
}) {
  return (
    <div className="border-with-radius flex flex-col items-center gap-4 p-6 md:flex-row">
      <div className="w-full flex-1 md:w-auto">
        <InputSearch
          placeholder="Search by code or name"
          defaultValue={searchTerm}
          onSearchChange={onSearchChange}
        />
      </div>
      <Select
        placeholder="All Status"
        className="w-full md:w-48"
        style={{ height: '40px' }}
        value={selectedStatus || undefined}
        onChange={onStatusChange}
        allowClear
      >
        <Option value="active">Active</Option>
        <Option value="inactive">Inactive</Option>
      </Select>
    </div>
  );
}
