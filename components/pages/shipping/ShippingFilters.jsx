import { Select } from 'antd';
import InputSearch from '@/components/ui/input-search';
import { UAE_EMIRATES } from '@/lib/const/regions';

const { Option } = Select;

export default function ShippingFilters({ searchTerm, selectedEmirate, onSearchChange, onEmirateChange }) {
  return (
    <div className="flex flex-col gap-4 p-6 md:flex-row border-with-radius items-center">
      <div className="flex-1 w-full md:w-auto">
        <InputSearch
          placeholder="Search by Zone Name"
          defaultValue={searchTerm}
          onSearchChange={onSearchChange}
        />
      </div>
      <Select
        placeholder="Filter by Emirate"
        className="w-full md:w-64"
        style={{ height: '40px' }}
        value={selectedEmirate || undefined}
        onChange={onEmirateChange}
        allowClear
      >
        {UAE_EMIRATES.map((emirate) => (
          <Option key={emirate.code} value={emirate.code}>
            {emirate.name}
          </Option>
        ))}
      </Select>
    </div>
  );
}
