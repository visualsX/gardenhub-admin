import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { message } from 'antd';
import { BUNDLES_QUERIES } from '@/lib/api/queries';
import graphqlClient from '@/lib/api/graphql-client';
import useUiStates from '@/store/useUiStates';
import useCursorPagination from '@/hooks/useCursorPagination';
import { useRouter } from 'next/navigation';

// Query Keys
export const bundleKeys = {
  all: ['bundles'],
  lists: () => [...bundleKeys.all, 'list'],
  list: (filters) => [...bundleKeys.lists(), { filters }],
  details: () => [...bundleKeys.all, 'detail'],
  detail: (id) => [...bundleKeys.details(), id],
};

// Get all bundles with pagination
export const useBundles = (filters = {}) => {
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
    queryKey: bundleKeys.list(queryKeyFilters),
    queryFn: async () => {
      const variables = {
        first: first ?? null,
        after: after ?? null,
        last: last ?? null,
        before: before ?? null,
        where: where || null,
        order: order || null,
      };

      const response = await graphqlClient.request(BUNDLES_QUERIES.GET_BUNDLES, variables);
      return response.bundles;
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

// Get single bundle
export const useBundle = (id) => {
  return useQuery({
    queryKey: bundleKeys.detail(id),
    queryFn: async () => {
      const variables = {
        id: id,
      };
      const response = await graphqlClient.request(BUNDLES_QUERIES.BUNDLE_DETAIL, variables);
      return response.bundleDetail;
    },
    enabled: !!id,
  });
};

// Helper to create FormData
const createBundleFormData = (data, isUpdate = false) => {
  const formData = new FormData();
  if (isUpdate && data.id) formData.append('Id', data.id);
  formData.append('Name', data.name);
  if (data.description) formData.append('Description', data.description);
  if (data.detailedDescription) formData.append('DetailedDescription', data.detailedDescription);
  formData.append('DiscountPercentage', data.discountPercentage || 0);
  // Explicitly handle boolean as strings/booleans depending on client (axios handles boolean usually fine, but swagger says boolean)
  formData.append('IsActive', data.isActive ?? true);
  formData.append('IsFeatured', data.isFeatured ?? false);

  // Images
  // Main Image (Single File)
  if (data.mainImage instanceof File) {
    formData.append('MainBundleImage', data.mainImage);
  }

  // Additional Images (Array of Files)
  if (data.additionalImages && data.additionalImages.length > 0) {
    data.additionalImages.forEach((file) => {
      if (file instanceof File) {
        formData.append('AdditionalBundleImages', file);
      }
    });
  }

  // Items (Array of Objects)
  if (data.items && data.items.length > 0) {
    data.items.forEach((item, index) => {
      if (item.productId) formData.append(`Items[${index}].productId`, item.productId);
      // formData.append(`Items[${index}].productVariantId`, item.productVariantId || 0); // If exists
      formData.append(`Items[${index}].quantity`, item.quantity || 1);
    });
  }

  // ExistingImageUrls (for Update)
  if (isUpdate && data.existingImageUrls && data.existingImageUrls.length > 0) {
    data.existingImageUrls.forEach((url, index) => {
      formData.append(`ExistingImageUrls[${index}]`, url); // Or just same key if server supports
    });
  }

  return formData;
};

// Create bundle
export const useCreateBundle = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data) => {
      const formData = createBundleFormData(data);
      const response = await apiClient.post(API_ENDPOINTS.BUNDLES.CREATE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bundleKeys.lists() });
      message.success('Bundle created successfully!');
      router.push('/bundles-and-deals');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to create bundle');
    },
  });
};

// Update bundle
export const useUpdateBundle = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const formData = createBundleFormData({ ...data, id }, true);
      const response = await apiClient.put(API_ENDPOINTS.BUNDLES.UPDATE(id), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: bundleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bundleKeys.detail(variables.id) });
      message.success('Bundle updated successfully!');
      router.push('/bundles-and-deals');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to update bundle');
    },
  });
};

// Delete bundle
export const useDeleteBundle = () => {
  const queryClient = useQueryClient();
  const { closeDeleteModal } = useUiStates();
  const router = useRouter();

  return useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(API_ENDPOINTS.BUNDLES.DELETE(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bundleKeys.lists() });
      message.success('Bundle deleted successfully!');
      closeDeleteModal();
      router.push('/bundles-and-deals');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to delete bundle');
    },
  });
};
