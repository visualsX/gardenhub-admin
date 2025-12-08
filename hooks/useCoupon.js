import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { message } from 'antd';
import { COUPONS_QUERIES } from '@/lib/api/queries';
import graphqlClient from '@/lib/api/graphql-client';
import useUiStates from '@/store/useUiStates';
import useCursorPagination from '@/hooks/useCursorPagination';

// Query Keys
export const couponKeys = {
  all: ['coupons'],
  lists: () => [...couponKeys.all, 'list'],
  list: (filters) => [...couponKeys.lists(), { filters }],
  details: () => [...couponKeys.all, 'detail'],
  detail: (id) => [...couponKeys.details(), id],
};

// Get all coupons with pagination
export const useCoupons = (filters = {}) => {
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
    queryKey: couponKeys.list(queryKeyFilters),
    queryFn: async () => {
      const variables = {
        first: first ?? null,
        after: after ?? null,
        last: last ?? null,
        before: before ?? null,
        where: where || null,
        order: order || null,
      };

      const response = await graphqlClient.request(COUPONS_QUERIES.GET_COUPONS, variables);

      return response.coupons;
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

// Get single coupon
export const useCoupon = (id) => {
  return useQuery({
    queryKey: couponKeys.detail(id),
    queryFn: async () => {
      const variables = {
        id: id,
      };
      const response = await graphqlClient.request(COUPONS_QUERIES.GET_COUPONS_BY_ID, variables);
      return response.couponById;
    },
    enabled: !!id,
  });
};

// Create coupon
export const useCreateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post(API_ENDPOINTS.COUPONS.CREATE, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
      message.success('Coupon created successfully!');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to create coupon');
    },
  });
};

// Update coupon
export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient.put(API_ENDPOINTS.COUPONS.UPDATE(id), data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
      queryClient.invalidateQueries({ queryKey: couponKeys.detail(variables.id) });
      message.success('Coupon updated successfully!');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to update coupon');
    },
  });
};

// Delete coupon
export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();
  const { closeDeleteModal } = useUiStates();

  return useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(API_ENDPOINTS.COUPONS.DELETE(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
      message.success('Coupon deleted successfully!');
      closeDeleteModal();
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to delete coupon');
    },
  });
};
