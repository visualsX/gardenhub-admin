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

// Get products for bundles (with variants)
export const useProductsForBundles = (filters = {}) => {
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
    queryKey: [...bundleKeys.all, 'products', queryKeyFilters],
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
        BUNDLES_QUERIES.GET_PRODUCTS_FOR_BUNDLES,
        variables
      );
      return response.products;
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
  if (data.shortDescription) formData.append('ShortDescription', data.shortDescription);
  if (data.detailedDescription) formData.append('DetailedDescription', data.detailedDescription);
  formData.append('DiscountPercentage', data.discountPercentage || 0);

  if (data.expiryDate) {
    // Handle Antd DatePicker value (Dayjs/Moment)
    const dateStr =
      typeof data.expiryDate.toISOString === 'function'
        ? data.expiryDate.toISOString()
        : data.expiryDate;
    formData.append('ExpiryDate', dateStr);
  }

  if (data.metaTitle) formData.append('MetaTitle', data.metaTitle);
  if (data.metaDescription) formData.append('MetaDescription', data.metaDescription);
  if (data.keywords) formData.append('Keywords', data.keywords);

  // Explicitly handle boolean as strings/booleans depending on client
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

  // Existing Image URLs (for Update)
  if (data.existingImageUrls && data.existingImageUrls.length > 0) {
    data.existingImageUrls.forEach((url) => {
      formData.append('ExistingImageUrls', url);
    });
  }

  // Items (Array of Objects)
  if (data.items && data.items.length > 0) {
    data.items.forEach((item, index) => {
      // Corrected payload structure based on Postman collection
      // Uses indexed keys: Items[0].ProductId
      // Uses PascalCase properties: ProductId, ProductVariantId, Quantity

      formData.append(`Items[${index}].ProductId`, item.productId);

      // Only append ProductVariantId if it exists (skip for simple products)
      if (item.productVariantId) {
        formData.append(`Items[${index}].ProductVariantId`, item.productVariantId);
      }

      formData.append(`Items[${index}].Quantity`, item.quantity || 1);
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
