import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { message } from 'antd';

// Query Keys
export const productKeys = {
  all: ['products'],
  lists: () => [...productKeys.all, 'list'],
  list: (filters) => [...productKeys.lists(), { filters }],
  details: () => [...productKeys.all, 'detail'],
  detail: (id) => [...productKeys.details(), id],
};

// Get all products
export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: productKeys.list(JSON.stringify(params)),
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.LIST, { params });
      return response;
    },
  });
};

// Get single product
export const useProduct = (id) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.DETAIL(id));
      return response.data;
    },
    enabled: !!id,
  });
};

// Create product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post(API_ENDPOINTS.PRODUCTS.CREATE, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      message.success('Product created successfully!');
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

  return useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(API_ENDPOINTS.PRODUCTS.DELETE(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      message.success('Product deleted successfully!');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to delete product');
    },
  });
};
