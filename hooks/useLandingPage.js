import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api/client';
import graphqlClient from '@/lib/api/graphql-client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { LANDING_PAGE_QUERIES } from '@/lib/api/queries';
import useCursorPagination from '@/hooks/useCursorPagination';

const landingPageKeys = {
    all: ['landingPage'],
    banners: () => [...landingPageKeys.all, 'banners'],
    bannerList: (filters) => [...landingPageKeys.banners(), { filters }],
    bannerDetail: (id) => [...landingPageKeys.banners(), id],
    featuredCategories: () => [...landingPageKeys.all, 'featuredCategories'],
    featuredCategoryList: (filters) => [...landingPageKeys.featuredCategories(), { filters }],
    featuredCategoryDetail: (id) => [...landingPageKeys.featuredCategories(), id],
};

// ==============================
// Banners Hooks
// ==============================

// List Banners
export const useBanners = (filters = {}) => {
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
        queryKey: landingPageKeys.bannerList(queryKeyFilters),
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
                LANDING_PAGE_QUERIES.GET_BANNERS,
                variables
            );
            return response.allBanners;
        },
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

// Get Banner Detail
export const useBanner = (id) => {
    return useQuery({
        queryKey: landingPageKeys.bannerDetail(id),
        queryFn: async () => {
            if (!id) return null;
            const response = await graphqlClient.request(LANDING_PAGE_QUERIES.GET_BANNER_BY_ID, {
                id: +id,
            });
            return response.bannerById;
        },
        enabled: !!id,
    });
};

// Create Banner
export const useCreateBanner = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: async (data) => {
            const response = await apiClient.post(API_ENDPOINTS.LANDING_PAGE.BANNERS.CREATE, data);
            return response;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: landingPageKeys.banners() });
            message.success('Banner created successfully');
            // Navigate to the edit page to upload images if needed, or back to list
            router.push(`/configuration/landing-page/${data.id}`);
        },
        onError: (error) => {
            message.error(error.response?.data?.message || 'Failed to create banner');
        },
    });
};

// Update Banner
export const useUpdateBanner = () => {
    const queryClient = useQueryClient();
    const router = useRouter();
    return useMutation({
        mutationFn: async (data) => {
            const response = await apiClient.put(API_ENDPOINTS.LANDING_PAGE.BANNERS.UPDATE(data?.id), data);
            return response;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: landingPageKeys.banners() });
            queryClient.invalidateQueries({ queryKey: landingPageKeys.bannerDetail(variables.id) });
            message.success('Banner updated successfully');
            router.push(`/configuration/landing-page/${variables.id}`);
        },
        onError: (error) => {
            message.error(error.response?.data?.message || 'Failed to update banner');
        },
    });
};

// Delete Banner
export const useDeleteBanner = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id) => {
            const response = await apiClient.delete(API_ENDPOINTS.LANDING_PAGE.BANNERS.DELETE(id));
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: landingPageKeys.banners() });
            message.success('Banner deleted successfully');
        },
        onError: (error) => {
            message.error(error.response?.data?.message || 'Failed to delete banner');
        },
    });
};

// Update Banner Images
export const useUpdateBannerImages = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, formData }) => {
            const response = await apiClient.post(API_ENDPOINTS.LANDING_PAGE.BANNERS.UPDATE_IMAGES(id), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: landingPageKeys.bannerDetail(variables.id) });
            message.success('Banner images updated successfully');
        },
        onError: (error) => {
            message.error(error.response?.data?.message || 'Failed to update banner images');
        },
    });
};

// ==============================
// Featured Categories Hooks
// ==============================

// List Featured Categories
export const useFeaturedCategories = () => {
    return useQuery({
        queryKey: landingPageKeys.featuredCategoryList(),
        queryFn: async () => {
            const response = await graphqlClient.request(
                LANDING_PAGE_QUERIES.GET_FEATURED_CATEGORIES,
            );
            return response.allFeaturedCategories?.nodes;
        },
    });
};

// Get Featured Category Detail
export const useFeaturedCategory = (id) => {
    return useQuery({
        queryKey: landingPageKeys.featuredCategoryDetail(id),
        queryFn: async () => {
            if (!id) return null;
            const response = await graphqlClient.request(LANDING_PAGE_QUERIES.GET_FEATURED_CATEGORY_BY_ID, {
                id: +id,
            });
            return response.featuredCategoryById;
        },
        enabled: !!id,
    });
};

// Create Featured Category
export const useCreateFeaturedCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data) => {
            const response = await apiClient.post(API_ENDPOINTS.LANDING_PAGE.FEATURED_CATEGORIES.CREATE, data);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: landingPageKeys.featuredCategories() });
            message.success('Featured category created successfully');
        },
        onError: (error) => {
            message.error(error.response?.data?.message || 'Failed to create featured category');
        },
    });
};

// Update Featured Category
export const useUpdateFeaturedCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data) => {
            const response = await apiClient.put(API_ENDPOINTS.LANDING_PAGE.FEATURED_CATEGORIES.UPDATE(data?.id), data);
            return response;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: landingPageKeys.featuredCategories() });
            queryClient.invalidateQueries({ queryKey: landingPageKeys.featuredCategoryDetail(variables.id) });
            message.success('Featured category updated successfully');
        },
        onError: (error) => {
            message.error(error.response?.data?.message || 'Failed to update featured category');
        },
    });
};

// Delete Featured Category
export const useDeleteFeaturedCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id) => {
            const response = await apiClient.delete(API_ENDPOINTS.LANDING_PAGE.FEATURED_CATEGORIES.DELETE(id));
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: landingPageKeys.featuredCategories() });
            message.success('Featured category deleted successfully');
        },
        onError: (error) => {
            message.error(error.response?.data?.message || 'Failed to delete featured category');
        },
    });
};

// Update Featured Category Image
export const useUpdateFeaturedCategoryImage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, formData }) => {
            const response = await apiClient.post(API_ENDPOINTS.LANDING_PAGE.FEATURED_CATEGORIES.UPDATE_IMAGE(id), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: landingPageKeys.featuredCategoryList() });
            // queryClient.invalidateQueries({ queryKey: landingPageKeys.featuredCategories() });
            queryClient.invalidateQueries({ queryKey: landingPageKeys.featuredCategoryDetail(variables.id) });
            message.success('Featured category image updated successfully');
        },
        onError: (error) => {
            message.error(error.response?.data?.message || 'Failed to update featured category image');
        },
    });
};
