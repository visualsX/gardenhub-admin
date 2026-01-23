import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { message } from 'antd';
import { ORDER_QUERIES } from '@/lib/api/queries';
import graphqlClient from '@/lib/api/graphql-client';
import useCursorPagination from '@/hooks/useCursorPagination';
import useUiStates from '@/store/useUiStates';

// Query Keys
export const orderKeys = {
  all: ['orders'],
  lists: () => [...orderKeys.all, 'list'],
  list: (filters) => [...orderKeys.lists(), { filters }],
  details: () => [...orderKeys.all, 'detail'],
  detail: (id) => [...orderKeys.details(), id],
};

// Get all orders with pagination
export const useOrders = (filters = {}) => {
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
    queryKey: orderKeys.list(queryKeyFilters),
    queryFn: async () => {
      const variables = {
        first: first ?? null,
        after: after ?? null,
        last: last ?? null,
        before: before ?? null,
        where: where || null,
        order: order || null,
      };

      const response = await graphqlClient.request(ORDER_QUERIES.GET_ORDERS, variables);
      return response.orders;
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

// Get single order
export const useOrder = (id) => {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: async () => {
      const variables = { id: +id };
      const response = await graphqlClient.request(ORDER_QUERIES.GET_ORDER_BY_ID, variables);
      return response.orderById;
    },
    enabled: !!id,
  });
};

// Update order status
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient.patch(API_ENDPOINTS.ORDERS.UPDATE_STATUS(id), data);
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(+variables.id) });
      message.success('Order status updated successfully!');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to update order status');
    },
  });
};

// Refund order
export const useRefundOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post(API_ENDPOINTS.ORDERS.REFUND(data.id), data);
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(+variables.id) });
      message.success('Refund processed successfully!');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to process refund');
    },
  });
};

// Delete order
export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  const { closeDeleteModal, isDeleteModalOpen } = useUiStates();

  return useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(API_ENDPOINTS.ORDERS.DELETE(isDeleteModalOpen?.data?.id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      message.success('Order deleted successfully!');
      closeDeleteModal();
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to delete order');
    },
  });
};
