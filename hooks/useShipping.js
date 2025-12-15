import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api/client';
import graphqlClient from '@/lib/api/graphql-client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { SHIPPING_ZONE_QUERIES } from '@/lib/api/queries';
import useCursorPagination from '@/hooks/useCursorPagination';

const shippingKeys = {
  all: ['shipping'],
  zones: () => [...shippingKeys.all, 'zones'],
  zoneList: (filters) => [...shippingKeys.zones(), { filters }],
  zoneDetail: (id) => [...shippingKeys.zones(), id],
  rates: () => [...shippingKeys.all, 'rates'],
};

// ==============================
// Shipping Zones Hooks
// ==============================

// List Zones
export const useShippingZones = (filters = {}) => {
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
    queryKey: shippingKeys.zoneList(queryKeyFilters),
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
        SHIPPING_ZONE_QUERIES.GET_SHIPPING_ZONES,
        variables
      );
      return response.shippingZones;
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

// Get Zone Detail
export const useShippingZone = (id) => {
  return useQuery({
    queryKey: shippingKeys.zoneDetail(id),
    queryFn: async () => {
      if (!id) return null;
      const variables = {
        where: { id: { eq: +id } },
        first: 1,
      };
      const response = await graphqlClient.request(
        SHIPPING_ZONE_QUERIES.GET_SHIPPING_ZONES,
        variables
      );
      return response.shippingZones?.nodes?.[0] || null;
    },
    enabled: !!id,
  });
};

// Get Rate Detail (for editing)
export const useShippingRate = (id) => {
  return useQuery({
    queryKey: ['shipping', 'rate', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await graphqlClient.request(SHIPPING_ZONE_QUERIES.SHIPPING_RATE_BY_ID, {
        id,
      });
      return response.shippingRateById;
    },
    enabled: !!id,
  });
};

// Create Zone
export const useCreateShippingZone = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post(API_ENDPOINTS.SHIPPING.ZONES.CREATE, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shippingKeys.zones() });
      message.success('Shipping zone created successfully');
      router.push('/shipping');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to create shipping zone');
    },
  });
};

// Update Zone
export const useUpdateShippingZone = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient.put(API_ENDPOINTS.SHIPPING.ZONES.UPDATE(id), data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: shippingKeys.zones() });
      queryClient.invalidateQueries({ queryKey: shippingKeys.zoneDetail(variables.id) });
      message.success('Shipping zone updated successfully');
      router.push('/shipping');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to update shipping zone');
    },
  });
};

// Delete Zone
export const useDeleteShippingZone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await apiClient.delete(API_ENDPOINTS.SHIPPING.ZONES.DELETE(id));
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shippingKeys.zones() });
      message.success('Shipping zone deleted successfully');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to delete shipping zone');
    },
  });
};

// ==============================
// Shipping Rates Hooks
// ==============================

// Create Rate
export const useCreateShippingRate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post(API_ENDPOINTS.SHIPPING.RATES.CREATE, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate the ZONE detail because rates are attached to zone
      if (variables.shippingZoneId) {
        queryClient.invalidateQueries({
          queryKey: shippingKeys.zoneDetail(variables.shippingZoneId),
        });
      }
      message.success('Shipping rate created successfully');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to create shipping rate');
    },
  });
};

// Update Rate
export const useUpdateShippingRate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient.put(API_ENDPOINTS.SHIPPING.RATES.UPDATE(id), data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      if (variables.data.shippingZoneId || variables.shippingZoneId) {
        queryClient.invalidateQueries({
          queryKey: shippingKeys.zoneDetail(
            variables.data.shippingZoneId || variables.shippingZoneId
          ),
        });
      }
      // Fallback invalidation strategies if zone ID not readily available in args
      queryClient.invalidateQueries({ queryKey: shippingKeys.zones() });
      message.success('Shipping rate updated successfully');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to update shipping rate');
    },
  });
};

// Delete Rate
export const useDeleteShippingRate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, shippingZoneId }) => {
      const response = await apiClient.delete(API_ENDPOINTS.SHIPPING.RATES.DELETE(id));
      return response.data;
    },
    onSuccess: (_, variables) => {
      if (variables.shippingZoneId) {
        queryClient.invalidateQueries({
          queryKey: shippingKeys.zoneDetail(variables.shippingZoneId),
        });
      } else {
        queryClient.invalidateQueries({ queryKey: shippingKeys.zones() });
      }
      message.success('Shipping rate deleted successfully');
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to delete shipping rate');
    },
  });
};
