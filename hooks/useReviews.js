import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import apiClient from '@/lib/api/client';
import graphqlClient from '@/lib/api/graphql-client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { REVIEW_QUERIES } from '@/lib/api/queries';
import useCursorPagination from '@/hooks/useCursorPagination';

const reviewKeys = {
  all: ['reviews'],
  lists: () => [...reviewKeys.all, 'list'],
  list: (filters) => [...reviewKeys.lists(), { filters }],
};

// List Reviews
export const useReviews = (filters = {}) => {
  const {
    status = 'All',
    productId = null,
    paginationKey,
    pageSize = 10,
    where = null,
    order = {
      createdAt: 'DESC',
    },
    ...paginationFilters
  } = filters;

  const pageState = paginationKey ? useCursorPagination(paginationKey, { pageSize }) : null;
  const { first = null, after = null, last = null, before = null } = pageState ?? paginationFilters;

  const queryKeyFilters = {
    status,
    productId,
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
    queryKey: reviewKeys.list(queryKeyFilters),
    queryFn: async () => {
      const variables = {
        status,
        productId,
        first: first ?? null,
        after: after ?? null,
        last: last ?? null,
        before: before ?? null,
        where: where || null,
        order: order || null,
      };

      const response = await graphqlClient.request(REVIEW_QUERIES.GET_REVIEWS, variables);
      return response.reviews;
    },
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

// Approve Review
export const useApproveReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await apiClient.post(API_ENDPOINTS.REVIEWS.APPROVE(id));
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      message.success('Review approved successfully');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to approve review');
    },
  });
};

// Reject Review
export const useRejectReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await apiClient.post(API_ENDPOINTS.REVIEWS.REJECT(id));
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      message.success('Review rejected successfully');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to reject review');
    },
  });
};

// Delete Review
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await apiClient.delete(API_ENDPOINTS.REVIEWS.DELETE(id));
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      message.success('Review deleted successfully');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to delete review');
    },
  });
};
