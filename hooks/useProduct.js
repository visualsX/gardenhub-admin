import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { message } from 'antd';
import { useRouter } from 'next/navigation';
import { PRODUCTS_QUERIES } from '@/lib/api/queries';
import graphqlClient from '@/lib/api/graphql-client';
import { usePagination } from './usePagination';
import useUiStates from '@/store/useUiStates';

// Query Keys
export const productKeys = {
  all: ['products'],
  lists: () => [...productKeys.all, 'list'],
  list: (filters) => [...productKeys.lists(), { filters }],
  details: () => [...productKeys.all, 'detail'],
  detail: (id) => [...productKeys.details(), id],
};

// Get all products with pagination
export const useProducts = (filters = {}) => {
  const query = useQuery({
    queryKey: productKeys.list({ ...filters }),
    queryFn: async () => {
      const variables = {
        first: null,
        after: null,
        last: null,
        before: null,
        where: filters.where || null,
        order: filters.order || null,
      };

      const response = await graphqlClient.request(PRODUCTS_QUERIES.GET_PRODUCTS, variables);

      return response.products;
    },
    keepPreviousData: true,
  });

  return {
    ...query,
  };
};
// Get single product
export const useProduct = (id) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      const variables = {
        id: id,
      };
      const response = await graphqlClient.request(PRODUCTS_QUERIES.GET_PRODUCT_DETAIL, variables);
      return response.productDetail;
    },
    enabled: !!id,
  });
};

// Create product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post(API_ENDPOINTS.PRODUCTS.CREATE, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      message.success('Product created successfully!');
      router.push('/products');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to create product');
    },
  });
};

// Update product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const response = await apiClient.put(API_ENDPOINTS.PRODUCTS.UPDATE(id), data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(data.id) });
      message.success('Product updated successfully!');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to update product');
    },
  });
};

// Delete product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { closeDeleteModal } = useUiStates();

  return useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(API_ENDPOINTS.PRODUCTS.DELETE(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      message.success('Product deleted successfully!');
      closeDeleteModal();
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to delete product');
    },
  });
};
