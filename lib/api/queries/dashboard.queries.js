import { gql } from 'graphql-request';
// ===================================
// Dashboard Queries
// ===================================
export const DASHBOARD_QUERIES = {
  GET_DASHBOARD_STATS: gql`
    query {
      dashboardStats {
        totalSales
        salesChangePercent
        totalOrders
        ordersChangePercent
        activeProducts
        productsChangePercent
        lowStockAlerts
        pendingOrders
      }
    }
  `,
  GET_SALES_ANALYTICS: gql`
    query ($period: String!) {
      salesAnalytics(period: $period) {
        #year, month, week
        period
        totalRevenue
        totalOrders
        dataPoints {
          label
          revenue
          orderCount
          date
        }
      }
    }
  `,
  GET_TOP_SELLING_PRODUCTS: gql`
    query {
      topSellingProducts(count: 7) {
        productId
        productName
        imageUrl
        unitsSold
        revenue
        stockStatus
        currentStock
      }
    }
  `,

  GET_LOW_STOCKS_ALERT: gql`
    query {
      lowStockAlerts {
        productId
        productName
        sku
        currentStock
        lowStockThreshold
        alertLevel
        hasVariants
        variantStocks {
          variantId
          variantSku
          variantAttributes
          stockQuantity
        }
      }
    }
  `,
  GET_CUSTOMER_ANALYTICS: gql`
    query {
      customerAnalytics {
        newCustomers
        returningCustomers
        newCustomersPercent
        returningCustomersPercent
      }
    }
  `,
  GET_RECENT_ORDERS: gql`
    query {
      recentOrders(count: 7) {
        id
        customerName
        status
        createdAt
        grandTotal
        itemCount
      }
    }
  `,
  GET_ACTIVE_PROMOTIONS: gql`
    query {
      activePromotions {
        code
        description
        type
        value
        usageCount
        expiresAt
        status
      }
    }
  `,
  GET_RECENT_REVIEWS: gql`
    query {
      recentReviews(count: 7) {
        id
        customerName
        productName
        rating
        title
        description
        createdAt
        isApproved
      }
    }
  `,
};
