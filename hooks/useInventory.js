'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import graphqlClient from '@/lib/api/graphql-client';
import { INVENTORY_QUERIES } from '@/lib/api/queries';
import useCursorPagination from '@/hooks/useCursorPagination';

export const inventoryKeys = {
  all: ['inventory'],
  lists: () => [...inventoryKeys.all, 'list'],
  list: (filters) => [...inventoryKeys.lists(), { filters }],
  detail: (id) => [...inventoryKeys.all, 'detail', id],
  stats: () => [...inventoryKeys.all, 'stats'],
  transactions: (id) => [...inventoryKeys.all, 'transactions', id],
};

export const useInventory = (filters = {}) => {
  const { paginationKey, pageSize = 10, where = null, order = null, ...paginationFilters } = filters;
  const pageState = paginationKey ? useCursorPagination(paginationKey, { pageSize }) : null;

  const {
    first = null,
    after = null,
    last = null,
    before = null,
  } = pageState ?? paginationFilters;

  const queryKeyFilters = {
    paginationKey,
    pageSize,
    first,
    after,
    last,
    before,
    where,
    order,
  };

  const query = useQuery({
    queryKey: inventoryKeys.list(queryKeyFilters),
    queryFn: async () => {
      const variables = {
        first: first ?? null,
        after: after ?? null,
        last: last ?? null,
        before: before ?? null,
        where: where || null,
        order: order || null,
      };

      const response = await graphqlClient.request(INVENTORY_QUERIES.GET_INVENTORY, variables);
      return response.inventoryDashboardItems;
    },
    keepPreviousData: true,
    placeholderData: (previousData) => previousData,
  });

  const exposedPageState =
    pageState ??
    {
      first,
      after,
      last,
      before,
      pageSize,
      page: 1,
    };

  return {
    ...query,
    pageState: exposedPageState,
  };
};

export const useInventoryItem = (id) => {
  return useQuery({
    queryKey: inventoryKeys.detail(id),
    enabled: !!id,
    queryFn: async () => {
      const response = await graphqlClient.request(INVENTORY_QUERIES.GET_INVENTORY_ITEM, { id });
      return response.inventoryDashboardItems?.nodes?.[0] ?? null;
    },
  });
};

export const useInventoryStats = () => {
  return useQuery({
    queryKey: inventoryKeys.stats(),
    queryFn: async () => {
      const response = await graphqlClient.request(INVENTORY_QUERIES.GET_INVENTORY_STATS);
      return response.inventorySummary;
    },
  });
};

export const useInventoryTransactions = ({ productId, pageSize = 10, order = null } = {}) => {
  return useInfiniteQuery({
    queryKey: inventoryKeys.transactions(productId),
    enabled: !!productId,
    queryFn: async ({ pageParam = null }) => {
      const variables = {
        productId,
        first: pageSize,
        after: pageParam,
        order,
      };

      const response = await graphqlClient.request(
        INVENTORY_QUERIES.GET_PRODUCT_TRANSACTION_HISTORY,
        variables
      );

      return response.productTransactionHistory;
    },
    getNextPageParam: (lastPage) => {
      const edges = lastPage?.edges ?? [];
      if (!edges.length || edges.length < pageSize) return undefined;
      return edges[edges.length - 1]?.cursor ?? undefined;
    },
  });
};
