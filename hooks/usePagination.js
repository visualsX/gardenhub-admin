import { useEffect } from 'react';
import usePaginationStore from '@/store/usePaginationStore';

/**
 * Custom hook to manage pagination for any entity using Zustand store
 * @param {string} entityName - Unique name for the entity (e.g., 'products', 'orders')
 * @param {number} initialPageSize - Initial page size (default: 10)
 * @returns Pagination state and handlers
 */
export const usePagination = (entityName, initialPageSize = 10) => {
  const {
    getPaginationState,
    getGraphQLVariables,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    resetPagination,
    setPageSize,
    setFilters,
    initPagination,
  } = usePaginationStore();

  // Initialize pagination on mount
  useEffect(() => {
    initPagination(entityName, initialPageSize);
  }, [entityName, initialPageSize]);

  const state = getPaginationState(entityName);

  /**
   * Handle page change from pagination component
   * @param {number} page - Target page number
   * @param {object} pageInfo - GraphQL pageInfo from response
   */
  const handlePageChange = (page, pageInfo) => {
    const isGoingForward = page > state.currentPage;
    const isGoingBack = page < state.currentPage;

    if (page === 1) {
      resetPagination(entityName);
    } else if (isGoingForward && pageInfo?.hasNextPage) {
      goToNextPage(entityName, pageInfo.endCursor);
    } else if (isGoingBack && pageInfo?.hasPreviousPage) {
      goToPreviousPage(entityName);
    }
  };

  /**
   * Update filters and reset pagination
   * @param {object} filters - New filters
   */
  const updateFilters = (filters) => {
    setFilters(entityName, filters);
  };

  /**
   * Update page size and reset pagination
   * @param {number} newPageSize
   */
  const updatePageSize = (newPageSize) => {
    setPageSize(entityName, newPageSize);
  };

  return {
    // State
    currentPage: state?.currentPage || 1,
    pageSize: state?.pageSize || initialPageSize,
    filters: state?.filters || {},

    // GraphQL variables
    variables: getGraphQLVariables(entityName),

    // Handlers
    handlePageChange,
    resetPagination: () => resetPagination(entityName),
    updateFilters,
    updatePageSize,

    // Direct actions (if needed)
    goToNextPage: (endCursor) => goToNextPage(entityName, endCursor),
    goToPreviousPage: () => goToPreviousPage(entityName),
  };
};
