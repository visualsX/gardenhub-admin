import { useRouter, useSearchParams } from 'next/navigation';

/**
 * Custom hook to manage URL-based product filters
 * Note: Search debouncing is handled by InputSearch component
 * @returns {Object} Filter values and update functions
 */
export const useProductFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get filter values from URL
  const searchTerm = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || '';
  const selectedStockStatus = searchParams.get('status') || '';

  // Update URL params
  const updateParams = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return {
    // Values
    searchTerm,
    selectedCategory,
    selectedStockStatus,
    // Setters
    setSearch: (value) => updateParams('search', value),
    setCategory: (value) => updateParams('category', value),
    setStockStatus: (value) => updateParams('status', value),
  };
};
