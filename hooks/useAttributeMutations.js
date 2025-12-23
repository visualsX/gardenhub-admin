import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { message } from 'antd';
import { attributeKeys } from './useAttribute';

// ===================================
// Attribute Mutations
// ===================================

// Create attribute
export const useCreateAttribute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post(API_ENDPOINTS.FILTERS.ATTRIBUTES.CREATE, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attributeKeys.lists() });
      message.success('Attribute created successfully!');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to create attribute');
    },
  });
};

// Update attribute
export const useUpdateAttribute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.put(API_ENDPOINTS.FILTERS.ATTRIBUTES.UPDATE(data.id), data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attributeKeys.lists() });
      message.success('Attribute updated successfully!');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to update attribute');
    },
  });
};

// Delete attribute
export const useDeleteAttribute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(API_ENDPOINTS.FILTERS.ATTRIBUTES.DELETE(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attributeKeys.lists() });
      message.success('Attribute deleted successfully!');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to delete attribute');
    },
  });
};

// ===================================
// Option Mutations
// ===================================

// Create option
export const useCreateOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post(API_ENDPOINTS.FILTERS.OPTIONS.CREATE, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attributeKeys.lists() });
      message.success('Option created successfully!');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to create option');
    },
  });
};

// Update option
export const useUpdateOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.put(API_ENDPOINTS.FILTERS.OPTIONS.UPDATE(data.id), data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attributeKeys.lists() });
      message.success('Option updated successfully!');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to update option');
    },
  });
};

// Delete option
export const useDeleteOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(API_ENDPOINTS.FILTERS.OPTIONS.DELETE(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attributeKeys.lists() });
      message.success('Option deleted successfully!');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to delete option');
    },
  });
};
