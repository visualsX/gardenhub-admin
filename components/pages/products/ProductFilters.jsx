import { Select } from 'antd';
import InputSearch from '@/components/ui/input-search';
import CategoryCascader from '@/components/ui/select-dropdowns/CategoryCascader';

const { Option } = Select;

const findPath = (nodes, id) => {
  for (const node of nodes) {
    if (node.id === id) return [node.id];
    if (node.subCategories?.length) {
      const path = findPath(node.subCategories, id);
      if (path) return [node.id, ...path];
    }
  }
  return null;
};

/**
 * Product filters component with search, category, and stock status filters
 */
export default function ProductFilters({
  searchTerm,
  filters,
  onFilterChange,
  categories,
}) {
  const handleCategoryChange = (value) => {
    // Cascader returns array of values. We want the last one for our single-select filter.
    const lastValue = value && value.length > 0 ? value[value.length - 1] : undefined;
    onFilterChange.setCategory(lastValue);
  };

  return (
    <div className="border-with-radius flex flex-col gap-4 p-6 md:flex-row">
      <div className="flex-1">
        <InputSearch
          placeholder="Search Products"
          defaultValue={searchTerm}
          onSearchChange={onFilterChange.setSearch}
        />
      </div>

      <CategoryCascader
        type="input"
        placeholder="All Categories"
        className="w-full md:w-96!"
        style={{ height: '40px' }}
        categories={categories}
        onChange={handleCategoryChange}
        changeOnSelect
        allowClear
      />

      <Select
        placeholder="All stock status"
        className="w-full md:w-64"
        style={{ height: '40px' }}
        value={filters.selectedStockStatus || undefined}
        onChange={onFilterChange.setStockStatus}
        allowClear
      >
        <Option value="In Stock">In Stock</Option>
        <Option value="Low Stock">Low Stock</Option>
        <Option value="Out of Stock">Out of Stock</Option>
      </Select>
    </div>
  );
}
