import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { message } from 'antd';
import { useRouter } from 'next/navigation';
import { PRODUCTS_QUERIES } from '@/lib/api/queries';
import graphqlClient from '@/lib/api/graphql-client';
import useUiStates from '@/store/useUiStates';
import useCursorPagination from '@/hooks/useCursorPagination';

// Query Keys
export const productKeys = {
  all: ['products'],
  lists: () => [...productKeys.all, 'list'],
  list: (filters) => [...productKeys.lists(), { filters }],
  details: () => [...productKeys.all, 'detail'],
  editDetails: () => [...productKeys.all, 'editDetail'],
  detail: (id) => [...productKeys.details(), id],
};

// Get all products with pagination
export const useProducts = (filters = {}) => {
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
    queryKey: productKeys.list(queryKeyFilters),
    queryFn: async () => {
      const variables = {
        first: first ?? null,
        after: after ?? null,
        last: last ?? null,
        before: before ?? null,
        where: where || null,
        order: order || null,
      };

      const response = await graphqlClient.request(PRODUCTS_QUERIES.GET_PRODUCTS, variables);

      return response.products;
    },
    keepPreviousData: true,
    // Keep showing the last page while the next one loads
    placeholderData: (previousData) => previousData,
  });

  // Expose pagination state so callers can wire UI without re-implementing setup.
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

// Get single product
export const useProductEdit = (id) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      const variables = {
        id: id,
      };
      const response = await graphqlClient.request(
        PRODUCTS_QUERIES.GET_EDIT_PRODUCT_DETAIL,
        variables
      );
      return response.productDetailById;
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
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient.put(API_ENDPOINTS.PRODUCTS.UPDATE(id), data,{
         headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate products list query (for index page)
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      // Invalidate product detail query (used by useProductEdit on edit page)
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
      message.success('Product updated successfully!');
      router.push('/products');
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
// update product Image
export const useUpdateProductImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      await apiClient.post(
        API_ENDPOINTS.PRODUCTS.UPDATE_IMAGES(payload.productId),
        payload.formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    },
    onSuccess: (data, variables) => {
      console.log('test:', variables);
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.productId) });
      message.success('Product Image successfully!');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to update product image');
    },
  });
};
// Delete product Image
export const useDeleteProductImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids) => {
      await apiClient.delete(API_ENDPOINTS.PRODUCTS.DELETE_IMAGES(ids.productId, ids.imageId));
    },
    onSuccess: (data, variables) => {
      // console.log('test:', variables);
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.productId) });
      message.success('Product Image deleted successfully!');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to delete product image');
    },
  });
};
