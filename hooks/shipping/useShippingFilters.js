import { useRouter, useSearchParams } from 'next/navigation';

export const useShippingFilters = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const searchTerm = searchParams.get('search') || '';
    const selectedEmirate = searchParams.get('emirate') || '';

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
        selectedEmirate,
        setSearch: (value) => updateParams('search', value),
        setEmirate: (value) => updateParams('emirate', value),
    };
};
