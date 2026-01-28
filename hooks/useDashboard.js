'use client';

import { useQuery } from '@tanstack/react-query';
import graphqlClient from '@/lib/api/graphql-client';
import { DASHBOARD_QUERIES } from '@/lib/api/queries';

// Query Keys
export const dashboardKeys = {
    all: ['dashboard'],
    stats: () => [...dashboardKeys.all, 'stats'],
    salesAnalytics: (period) => [...dashboardKeys.all, 'salesAnalytics', period],
    topProducts: () => [...dashboardKeys.all, 'topProducts'],
    lowStockAlerts: () => [...dashboardKeys.all, 'lowStockAlerts'],
    customerAnalytics: () => [...dashboardKeys.all, 'customerAnalytics'],
    recentOrders: () => [...dashboardKeys.all, 'recentOrders'],
    activePromotions: () => [...dashboardKeys.all, 'activePromotions'],
    recentReviews: () => [...dashboardKeys.all, 'recentReviews'],
};

/**
 * Hook to fetch dashboard stats
 */
export function useDashboardStats() {
    return useQuery({
        queryKey: dashboardKeys.stats(),
        queryFn: async () => {
            const response = await graphqlClient.request(DASHBOARD_QUERIES.GET_DASHBOARD_STATS);
            return response.dashboardStats;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

/**
 * Hook to fetch sales analytics
 * @param {string} period - 'year', 'month', 'week', or 'day'
 */
export function useSalesAnalytics(period = 'year') {
    return useQuery({
        queryKey: dashboardKeys.salesAnalytics(period),
        queryFn: async () => {
            const response = await graphqlClient.request(DASHBOARD_QUERIES.GET_SALES_ANALYTICS, {
                period,
            });
            return response.salesAnalytics;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        enabled: !!period,
    });
}

/**
 * Hook to fetch top selling products
 */
export function useTopSellingProducts() {
    return useQuery({
        queryKey: dashboardKeys.topProducts(),
        queryFn: async () => {
            const response = await graphqlClient.request(DASHBOARD_QUERIES.GET_TOP_SELLING_PRODUCTS);
            return response.topSellingProducts;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

/**
 * Hook to fetch low stock alerts
 */
export function useLowStockAlerts() {
    return useQuery({
        queryKey: dashboardKeys.lowStockAlerts(),
        queryFn: async () => {
            const response = await graphqlClient.request(DASHBOARD_QUERIES.GET_LOW_STOCKS_ALERT);
            return response.lowStockAlerts;
        },
        staleTime: 1000 * 60 * 2, // 2 minutes - more frequent for inventory
    });
}

/**
 * Hook to fetch customer analytics
 */
export function useCustomerAnalytics() {
    return useQuery({
        queryKey: dashboardKeys.customerAnalytics(),
        queryFn: async () => {
            const response = await graphqlClient.request(DASHBOARD_QUERIES.GET_CUSTOMER_ANALYTICS);
            return response.customerAnalytics;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

/**
 * Hook to fetch recent orders
 */
export function useRecentOrders() {
    return useQuery({
        queryKey: dashboardKeys.recentOrders(),
        queryFn: async () => {
            const response = await graphqlClient.request(DASHBOARD_QUERIES.GET_RECENT_ORDERS);
            return response.recentOrders;
        },
        staleTime: 1000 * 60 * 2, // 2 minutes - more frequent for orders
    });
}

/**
 * Hook to fetch active promotions
 */
export function useActivePromotions() {
    return useQuery({
        queryKey: dashboardKeys.activePromotions(),
        queryFn: async () => {
            const response = await graphqlClient.request(DASHBOARD_QUERIES.GET_ACTIVE_PROMOTIONS);
            return response.activePromotions;
        },
        staleTime: 1000 * 60 * 10, // 10 minutes - promotions change less frequently
    });
}

/**
 * Hook to fetch recent reviews
 */
export function useRecentReviews() {
    return useQuery({
        queryKey: dashboardKeys.recentReviews(),
        queryFn: async () => {
            const response = await graphqlClient.request(DASHBOARD_QUERIES.GET_RECENT_REVIEWS);
            return response.recentReviews;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
