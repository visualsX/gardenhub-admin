import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

/**
 * Generic hook for cursor-based pagination
 * @param {string[]} queryKey - React Query key
 * @param {Function} queryFn - Function that accepts variables and returns paginated data
 * @param {Object} filters - Additional filters
 * @param {number} pageSize - Items per page
 * @param {Object} options - Additional React Query options
 */
export const useCursorPagination = (
  queryKey,
  queryFn,
  filters = {},
  pageSize = 2,
  options = {}
) => {
  const [paginationParams, setPaginationParams] = useState({
    first: pageSize,
    after: null,
    last: null,
    before: null,
  });

  const query = useQuery({
    queryKey: [...queryKey, { ...filters, ...paginationParams }],
    queryFn: () => queryFn({ ...paginationParams, ...filters }),
    keepPreviousData: true,
    ...options,
  });

  const handlePaginate = (newParams) => {
    setPaginationParams(newParams);
  };

  const resetPagination = () => {
    setPaginationParams({
      first: pageSize,
      after: null,
      last: null,
      before: null,
    });
  };

  return {
    ...query,
    handlePaginate,
    resetPagination,
    pageSize,
  };
};
