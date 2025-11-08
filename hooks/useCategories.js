import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { message } from 'antd';
import { CATEGORY_QUERIES } from '@/lib/api/queries';
import graphqlClient from '@/lib/api/graphql-client';

// Query Keys
export const categoryKeys = {
  all: ['categories'],
  lists: () => [...categoryKeys.all, 'list'],
  list: (filters) => [...categoryKeys.lists(), { filters }],
  tree: () => [...categoryKeys.all, 'tree'],
  details: () => [...categoryKeys.all, 'detail'],
  detail: (id) => [...categoryKeys.details(), id],
};

// Get all categories
export const useCategories = (params = {}) => {
  return useQuery({
    queryKey: categoryKeys.list(JSON.stringify(params)),
    queryFn: async () => {
      const variables = {
        first: 10,
        after: null,
        last: null,
        before: null,
      };

      const response = await graphqlClient.request(CATEGORY_QUERIES.GET_CATEGORIES);

      return response.categories;
    },
  });
};

// Get category tree
export const useCategoryTree = () => {
  return useQuery({
    queryKey: categoryKeys.tree(),
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.TREE);
      return response.data;
    },
  });
};

// Get single category
export const useCategory = (id) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.DETAIL(id));
      return response.data;
    },
    enabled: !!id,
  });
};

// Create category
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post(API_ENDPOINTS.CATEGORIES.CREATE, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.tree() });
      message.success('Category created successfully!');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to create category');
    },
  });
};

// Update category
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const response = await apiClient.put(API_ENDPOINTS.CATEGORIES.UPDATE(id), data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.tree() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(data.id) });
      message.success('Category updated successfully!');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to update category');
    },
  });
};

// Delete category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(API_ENDPOINTS.CATEGORIES.DELETE(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.tree() });
      message.success('Category deleted successfully!');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to delete category');
    },
  });
};
