'use client';

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import graphqlClient from '@/lib/api/graphql-client';
import { INVENTORY_QUERIES } from '@/lib/api/queries';
import useCursorPagination from '@/hooks/useCursorPagination';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { message } from 'antd';

export const inventoryKeys = {
  all: ['inventory'],
  lists: () => [...inventoryKeys.all, 'list'],
  list: (filters) => [...inventoryKeys.lists(), { filters }],
  detail: (id) => [...inventoryKeys.all, 'detail', id],
  stats: () => [...inventoryKeys.all, 'stats'],
  transactions: (id) => [...inventoryKeys.all, 'transactions', id],
};

export const useInventory = (filters = {}) => {
  const {
    paginationKey,
    pageSize = 10,
    where = null,
    order = null,
    ...paginationFilters
  } = filters;
  const pageState = paginationKey ? useCursorPagination(paginationKey, { pageSize }) : null;

  const { first = null, after = null, last = null, before = null } = pageState ?? paginationFilters;

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

  const exposedPageState = pageState ?? {
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

export const useInventoryTransactions = ({
  productId,
  varientId,
  pageSize = 10,
  order = null,
} = {}) => {
  return useInfiniteQuery({
    queryKey: inventoryKeys.transactions(productId),
    enabled: !!productId,
    queryFn: async ({ pageParam = null }) => {
      const variables = {
        productId,
        varientId,
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

export const useAdjustInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const response = await apiClient.post(API_ENDPOINTS.INVENTORY.UPDATE_STOCK, payload);
      return response.data;
    },
    onSuccess: (_, variables) => {
      const productId = variables?.products[0].productId;
      console.log('variables', productId);
      message.success('Inventory updated successfully');
      queryClient.invalidateQueries({ queryKey: inventoryKeys.stats() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      if (productId) {
        queryClient.invalidateQueries({ queryKey: inventoryKeys.detail(productId) });
        queryClient.invalidateQueries({ queryKey: inventoryKeys.transactions(productId) });
      }
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to delete category');
    },
  });
};
export const useUpdateInventory = () => {
  return useMutation({
    mutationFn: async (payload) => {
      const response = await apiClient.post(API_ENDPOINTS.INVENTORY.UPDATE_STOCK, payload);
      return response.data;
    },
    onSuccess: (_, variables) => {
      message.success('Inventory stocks updated successfully');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to delete category');
    },
  });
};
