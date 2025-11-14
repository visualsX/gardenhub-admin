import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Zustand store for managing pagination state across multiple entities
 * Each entity (products, orders, customers, etc.) has its own pagination state
 */
const usePaginationStore = create(
  devtools(
    (set, get) => ({
      // Store structure: { entityName: { currentPage, pageSize, cursorHistory, filters } }
      entities: {},

      /**
       * Initialize pagination for an entity
       * @param {string} entityName - Name of the entity (e.g., 'products', 'orders')
       * @param {number} pageSize - Items per page (default: 10)
       */
      initPagination: (entityName, pageSize = 10) => {
        set(
          (state) => ({
            entities: {
              ...state.entities,
              [entityName]: {
                currentPage: 1,
                pageSize,
                cursorHistory: [null], // Stack to track cursors for each page
                filters: {},
              },
            },
          }),
          false,
          `init/${entityName}`
        );
      },

      /**
       * Get pagination state for an entity
       * @param {string} entityName
       */
      getPaginationState: (entityName) => {
        const state = get().entities[entityName];
        if (!state) {
          // Auto-initialize if not exists
          get().initPagination(entityName);
          return get().entities[entityName];
        }
        return state;
      },

      /**
       * Get GraphQL variables for current page
       * @param {string} entityName
       * @returns {{ first, after, last, before }}
       */
      getGraphQLVariables: (entityName) => {
        const state = get().getPaginationState(entityName);
        const currentCursor = state.cursorHistory[state.currentPage - 1] || null;

        return {
          first: state.pageSize,
          after: currentCursor,
          last: null,
          before: null,
        };
      },

      /**
       * Navigate to next page
       * @param {string} entityName
       * @param {string} endCursor - End cursor from GraphQL response
       */
      goToNextPage: (entityName, endCursor) => {
        set(
          (state) => {
            const entity = state.entities[entityName];
            if (!entity) return state;

            const newPage = entity.currentPage + 1;
            const newCursorHistory = [...entity.cursorHistory];

            // Store the cursor for this page if not already stored
            if (!newCursorHistory[newPage - 1]) {
              newCursorHistory[newPage - 1] = endCursor;
            }

            return {
              entities: {
                ...state.entities,
                [entityName]: {
                  ...entity,
                  currentPage: newPage,
                  cursorHistory: newCursorHistory,
                },
              },
            };
          },
          false,
          `nextPage/${entityName}`
        );
      },

      /**
       * Navigate to previous page
       * @param {string} entityName
       */
      goToPreviousPage: (entityName) => {
        set(
          (state) => {
            const entity = state.entities[entityName];
            if (!entity || entity.currentPage <= 1) return state;

            return {
              entities: {
                ...state.entities,
                [entityName]: {
                  ...entity,
                  currentPage: entity.currentPage - 1,
                },
              },
            };
          },
          false,
          `prevPage/${entityName}`
        );
      },

      /**
       * Go to specific page
       * @param {string} entityName
       * @param {number} page
       * @param {string} endCursor - End cursor if going forward
       */
      goToPage: (entityName, page, endCursor = null) => {
        const state = get().getPaginationState(entityName);
        const isGoingForward = page > state.currentPage;

        if (page === 1) {
          get().resetPagination(entityName);
        } else if (isGoingForward && endCursor) {
          get().goToNextPage(entityName, endCursor);
        } else if (page < state.currentPage) {
          get().goToPreviousPage(entityName);
        }
      },

      /**
       * Reset pagination to first page
       * @param {string} entityName
       */
      resetPagination: (entityName) => {
        set(
          (state) => {
            const entity = state.entities[entityName];
            if (!entity) return state;

            return {
              entities: {
                ...state.entities,
                [entityName]: {
                  ...entity,
                  currentPage: 1,
                  cursorHistory: [null],
                },
              },
            };
          },
          false,
          `reset/${entityName}`
        );
      },

      /**
       * Update page size and reset to first page
       * @param {string} entityName
       * @param {number} pageSize
       */
      setPageSize: (entityName, pageSize) => {
        set(
          (state) => {
            const entity = state.entities[entityName];
            if (!entity) return state;

            return {
              entities: {
                ...state.entities,
                [entityName]: {
                  ...entity,
                  pageSize,
                  currentPage: 1,
                  cursorHistory: [null],
                },
              },
            };
          },
          false,
          `setPageSize/${entityName}`
        );
      },

      /**
       * Store filters for an entity (useful for resetting pagination on filter change)
       * @param {string} entityName
       * @param {object} filters
       */
      setFilters: (entityName, filters) => {
        set(
          (state) => {
            const entity = state.entities[entityName];
            if (!entity) return state;

            // Check if filters actually changed
            const filtersChanged = JSON.stringify(entity.filters) !== JSON.stringify(filters);

            return {
              entities: {
                ...state.entities,
                [entityName]: {
                  ...entity,
                  filters,
                  // Reset pagination if filters changed
                  ...(filtersChanged && {
                    currentPage: 1,
                    cursorHistory: [null],
                  }),
                },
              },
            };
          },
          false,
          `setFilters/${entityName}`
        );
      },

      /**
       * Clear all pagination data for an entity
       * @param {string} entityName
       */
      clearPagination: (entityName) => {
        set(
          (state) => {
            const { [entityName]: _, ...rest } = state.entities;
            return { entities: rest };
          },
          false,
          `clear/${entityName}`
        );
      },

      /**
       * Clear all pagination data for all entities
       */
      clearAllPagination: () => {
        set({ entities: {} }, false, 'clearAll');
      },
    }),
    { name: 'PaginationStore' }
  )
);

export default usePaginationStore;
