import { Select } from 'antd';
import InputSearch from '@/components/ui/input-search';
import { useCategories } from '@/hooks/useCategories';

const { Option } = Select;

/**
 * Product filters component with search, category, and stock status filters
 */
export default function ProductFilters({ searchTerm, filters, onFilterChange }) {
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.nodes ?? [];

  return (
    <div className="flex flex-col gap-4 p-6 md:flex-row border-with-radius">
      <div className="flex-1">
        <InputSearch
          placeholder="Search Products"
          defaultValue={searchTerm}
          onSearchChange={onFilterChange.setSearch}
        />
      </div>
      <Select
        placeholder="All Categories"
        className="w-full md:w-48"
        style={{ height: '40px' }}
        value={+filters.selectedCategory || undefined}
        onChange={onFilterChange.setCategory}
        allowClear
      >
        {categories.map((category) => (
          <Option key={category.id} value={category.id}>
            {category.name}
          </Option>
        ))}
      </Select>
      <Select
        placeholder="All stock status"
        className="w-full md:w-48"
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
