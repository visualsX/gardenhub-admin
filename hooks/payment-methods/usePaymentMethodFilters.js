import { useRouter, useSearchParams } from 'next/navigation';

export const usePaymentMethodFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchTerm = searchParams.get('search') || '';

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
    searchTerm,
    setSearch: (value) => updateParams('search', value),
  };
};
