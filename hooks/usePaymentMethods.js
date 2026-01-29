import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api/client';
import graphqlClient from '@/lib/api/graphql-client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { PAYMENT_METHOD_QUERIES } from '@/lib/api/queries';
import useCursorPagination from '@/hooks/useCursorPagination';

const paymentMethodKeys = {
  all: ['payment-methods'],
  list: (filters) => [...paymentMethodKeys.all, 'list', { filters }],
  detail: (id) => [...paymentMethodKeys.all, 'detail', id],
};

// List Payment Methods
export const usePaymentMethods = (filters = {}) => {
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
    queryKey: paymentMethodKeys.list(queryKeyFilters),
    queryFn: async () => {
      const variables = {
        first: first ?? null,
        after: after ?? null,
        last: last ?? null,
        before: before ?? null,
        where: where || null,
        order: order || null,
      };

      const response = await graphqlClient.request(
        PAYMENT_METHOD_QUERIES.GET_PAYMENT_METHODS,
        variables
      );
      return response.paymentMethods;
    },
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

// Get Payment Method Detail
export const usePaymentMethod = (id) => {
  return useQuery({
    queryKey: paymentMethodKeys.detail(id),
    queryFn: async () => {
      if (!id) return null;
      const variables = {
        where: { id: { eq: +id } },
        first: 1,
      };
      const response = await graphqlClient.request(
        PAYMENT_METHOD_QUERIES.GET_PAYMENT_METHODS,
        variables
      );
      return response.paymentMethods?.nodes?.[0] || null;
    },
    enabled: !!id,
  });
};

// Create Payment Method
export const useCreatePaymentMethod = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post(API_ENDPOINTS.PAYMENT_METHODS.CREATE, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentMethodKeys.all });
      message.success('Payment method created successfully');
      router.push('/configuration/payment-methods');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to create payment method');
    },
  });
};

// Update Payment Method
export const useUpdatePaymentMethod = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.put(API_ENDPOINTS.PAYMENT_METHODS.UPDATE(data.id), data);
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: paymentMethodKeys.all });
      queryClient.invalidateQueries({ queryKey: paymentMethodKeys.detail(variables.id) });
      message.success('Payment method updated successfully');
      router.push('/configuration/payment-methods');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to update payment method');
    },
  });
};

// Delete Payment Method
export const useDeletePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await apiClient.delete(API_ENDPOINTS.PAYMENT_METHODS.DELETE(id));
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentMethodKeys.all });
      message.success('Payment method deleted successfully');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to delete payment method');
    },
  });
};
