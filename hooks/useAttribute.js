import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { message } from 'antd';
import { ATTRIBUTES_QUERIES, CATEGORY_QUERIES } from '@/lib/api/queries';
import graphqlClient from '@/lib/api/graphql-client';

// Query Keys
export const attributeKeys = {
  all: ['attributes'],
  lists: () => [...attributeKeys.all, 'list'],
  list: (filters) => [...attributeKeys.lists(), { filters }],
  tree: () => [...attributeKeys.all, 'tree'],
  details: () => [...attributeKeys.all, 'detail'],
  detail: (id) => [...attributeKeys.details(), id],
};

// Get all categories
export const useAttributes = (params = {}) => {
  return useQuery({
    queryKey: attributeKeys.list(JSON.stringify(params)),
    queryFn: async () => {
      const variables = {
        first: 10,
        after: null,
        last: null,
        before: null,
      };

      const response = await graphqlClient.request(ATTRIBUTES_QUERIES.GET_ATTRIBUTES);
      return response.filterAttributes;
    },
  });
};

// Get category tree
export const useCategoryTree = () => {
  return useQuery({
    queryKey: attributeKeys.tree(),
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.TREE);
      return response.data;
    },
  });
};

// Get single category
export const useCategory = (id) => {
  return useQuery({
    queryKey: attributeKeys.detail(id),
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
      queryClient.invalidateQueries({ queryKey: attributeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: attributeKeys.tree() });
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
      queryClient.invalidateQueries({ queryKey: attributeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: attributeKeys.tree() });
      queryClient.invalidateQueries({ queryKey: attributeKeys.detail(data.id) });
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
      queryClient.invalidateQueries({ queryKey: attributeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: attributeKeys.tree() });
      message.success('Category deleted successfully!');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to delete category');
    },
  });
};
