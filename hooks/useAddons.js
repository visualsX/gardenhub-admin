import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { message } from 'antd';
import { ADDON_QUERIES } from '@/lib/api/queries';
import graphqlClient from '@/lib/api/graphql-client';

// Query Keys
export const addonKeys = {
  types: {
    all: ['addonTypes'],
    list: (filters) => [...addonKeys.types.all, { filters }],
  },
  addons: {
    all: ['addons'],
    list: (filters) => [...addonKeys.addons.all, { filters }],
    detail: (id) => [...addonKeys.addons.all, 'detail', id],
  },
};

// ==========================================
// Addon Types Hooks
// ==========================================

export const useAddonTypes = (filters = {}) => {
  const { where = null, order = null } = filters;

  return useQuery({
    queryKey: addonKeys.types.list({ where, order }),
    queryFn: async () => {
      const variables = {
        where,
        order,
      };
      const response = await graphqlClient.request(ADDON_QUERIES.GET_ADDONS_TYPES, variables);
      return response.addonTypes;
    },
  });
};

export const useCreateAddonType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post(API_ENDPOINTS.ADDONS.TYPES.CREATE, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addonKeys.types.all });
      message.success('Addon Type created successfully');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to create addon type');
    },
  });
};

export const useUpdateAddonType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      // API expects PUT /api/Addon/types with ID in body
      const response = await apiClient.put(API_ENDPOINTS.ADDONS.TYPES.UPDATE(), data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addonKeys.types.all });
      message.success('Addon Type updated successfully');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to update addon type');
    },
  });
};

export const useDeleteAddonType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(API_ENDPOINTS.ADDONS.TYPES.DELETE(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addonKeys.types.all });
      message.success('Addon Type deleted successfully');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to delete addon type');
    },
  });
};

// ==========================================
// Addons Hooks
// ==========================================

export const useAddons = (filters = {}) => {
  const { id = null, where = null, order = null } = filters;

  return useQuery({
    queryKey: addonKeys.addons.list({ id, where, order }),
    queryFn: async () => {
      const variables = {
        id,
        where,
        order,
      };
      const response = await graphqlClient.request(ADDON_QUERIES.GET_ADDONS, variables);
      return response.globalAddons;
    },
  });
};

export const useAddon = (id) => {
  return useQuery({
    queryKey: addonKeys.addons.detail(id),
    queryFn: async () => {
      const response = await graphqlClient.request(ADDON_QUERIES.GET_ADDON_BY_ID, { id });
      return response.globalAddonById;
    },
    enabled: !!id,
  });
};

export const useCreateAddon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post(API_ENDPOINTS.ADDONS.MAIN.CREATE, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addonKeys.addons.all });
      message.success('Addon created successfully');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to create addon');
    },
  });
};

export const useUpdateAddon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      // API expects PUT /api/Addon with ID in body
      const response = await apiClient.put(API_ENDPOINTS.ADDONS.MAIN.UPDATE, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addonKeys.addons.all });
      message.success('Addon updated successfully');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to update addon');
    },
  });
};

export const useDeleteAddon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(API_ENDPOINTS.ADDONS.MAIN.DELETE(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addonKeys.addons.all });
      message.success('Addon deleted successfully');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to delete addon');
    },
  });
};

// ==========================================
// Addon Option Image Hooks
// ==========================================

export const useUploadAddonOptionImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ optionId, file }) => {
      const formData = new FormData();
      formData.append('imageFile', file);
      const response = await apiClient.post(
        API_ENDPOINTS.ADDONS.MAIN.OPTION_IMAGE.CREATE(optionId),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addonKeys.addons.all });
      message.success('Option image uploaded successfully');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to upload option image');
    },
  });
};

export const useDeleteAddonOptionImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (optionId) => {
      await apiClient.delete(API_ENDPOINTS.ADDONS.MAIN.OPTION_IMAGE.DELETE(optionId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addonKeys.addons.all });
      message.success('Option image deleted successfully');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to delete option image');
    },
  });
};

// ==========================================
// Product Addon Assignment Hooks
// ==========================================

export const useProductAddons = (productId, variantId = null) => {
  return useQuery({
    queryKey: ['productAddons', productId, variantId],
    queryFn: async () => {
      const variables = {
        productId: parseInt(productId),
        variantId: variantId ? parseInt(variantId) : null,
      };
      const response = await graphqlClient.request(
        ADDON_QUERIES.GET_PRODUCT_ADDONS_FOR_DISPLAY,
        variables
      );
      return response.productAddonsForDisplay;
    },
    enabled: !!productId,
  });
};

export const useAssignProductAddon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post(
        API_ENDPOINTS.ADDONS.MAIN.PRODUCT_ASSIGNMENT.ASSIGN,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productAddons'] });
      message.success('Addon assigned successfully');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to assign addon');
    },
  });
};

export const useUpdateProductAddonAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.put(
        API_ENDPOINTS.ADDONS.MAIN.PRODUCT_ASSIGNMENT.UPDATE,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productAddons'] });
      message.success('Assignment updated successfully');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to update assignment');
    },
  });
};

export const useDeleteProductAddonAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assignmentId) => {
      await apiClient.delete(API_ENDPOINTS.ADDONS.MAIN.PRODUCT_ASSIGNMENT.DELETE(assignmentId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productAddons'] });
      message.success('Assignment deleted successfully');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to delete assignment');
    },
  });
};
