'use client';

import React, { useState } from 'react';
import Plus from '@/public/shared/plus-white.svg';
import {
  useDashboardStats,
  useSalesAnalytics,
  useTopSellingProducts,
  useLowStockAlerts,
  useCustomerAnalytics,
  useRecentOrders,
  useActivePromotions,
  useRecentReviews,
} from '@/hooks/useDashboard';

import StatsGrid from '@/components/pages/dashboard/StatsGrid';
import SalesAnalyticsCard from '@/components/pages/dashboard/SalesAnalyticsCard';
import TopProductsCard from '@/components/pages/dashboard/TopProductsCard';
import RecentOrdersCard from '@/components/pages/dashboard/RecentOrdersCard';
import CustomerDemographicsCard from '@/components/pages/dashboard/CustomerDemographicsCard';
import InventoryStatusCard from '@/components/pages/dashboard/InventoryStatusCard';
import ActivePromotionsCard from '@/components/pages/dashboard/ActivePromotionsCard';
import RecentReviewsCard from '@/components/pages/dashboard/RecentReviewsCard';

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('year');

  // Fetch all dashboard data using hooks
  const { data: dashboardStats, isLoading: statsLoading } = useDashboardStats();
  const { data: salesAnalytics, isLoading: salesLoading } = useSalesAnalytics(selectedPeriod);
  const { data: topProducts, isLoading: productsLoading } = useTopSellingProducts();
  const { data: lowStockAlerts, isLoading: stockLoading } = useLowStockAlerts();
  const { data: customerAnalytics, isLoading: customerLoading } = useCustomerAnalytics();
  const { data: recentOrders, isLoading: ordersLoading } = useRecentOrders();
  const { data: activePromotions, isLoading: promotionsLoading } = useActivePromotions();
  const { data: recentReviews, isLoading: reviewsLoading } = useRecentReviews();

  // Map period to API format
  const periodMap = {
    Year: 'year',
    Month: 'month',
    Week: 'week',
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(periodMap[period] || 'year');
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard Overview</h1>
            <p className="mt-1 text-sm text-gray-500">
              Insights and analytics for the GardenHub platform.
            </p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-800">
            <Plus size={18} />
            <span>New Product</span>
          </button>
        </div>

        {/* Stats Row */}
        <StatsGrid stats={dashboardStats} loading={statsLoading} />

        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Sales Analytics */}
          <SalesAnalyticsCard
            data={salesAnalytics}
            loading={salesLoading}
            selectedPeriod={selectedPeriod}
            onPeriodChange={handlePeriodChange}
          />

          {/* Top Products */}
          <TopProductsCard data={topProducts} loading={productsLoading} />
        </div>

        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Recent Orders */}
          <RecentOrdersCard data={recentOrders} loading={ordersLoading} />

          {/* Customer Demographics */}
          <CustomerDemographicsCard data={customerAnalytics} loading={customerLoading} />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Inventory */}
          <InventoryStatusCard data={lowStockAlerts} loading={stockLoading} />

          {/* Promotions */}
          <ActivePromotionsCard data={activePromotions} loading={promotionsLoading} />

          {/* Reviews */}
          <RecentReviewsCard data={recentReviews} loading={reviewsLoading} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
