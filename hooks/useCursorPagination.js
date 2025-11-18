'use client';

import { useEffect, useMemo } from 'react';
import usePaginationStore from '@/store/usePagination';

const buildFallbackState = (pageSize) => ({
  page: 1,
  pageSize,
  after: null,
  before: null,
  first: pageSize,
  last: null,
});

/**
 * Sets up pagination state for a given key and returns a usable page state.
 * Keeps logic centralized so cursor pagination can be reused across pages.
 */
const useCursorPagination = (paginationKey, { pageSize = 10 } = {}) => {
  const pagination = usePaginationStore((state) => state.paginations[paginationKey]);
  const initPagination = usePaginationStore((state) => state.init);

  useEffect(() => {
    initPagination(paginationKey, { pageSize });
  }, [initPagination, pageSize, paginationKey]);

  return useMemo(() => pagination ?? buildFallbackState(pageSize), [pagination, pageSize]);
};

export default useCursorPagination;
