export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/Authentication/login',
  },

  // Products
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id) => `/products/${id}`,
    CREATE: '/products',
    UPDATE: (id) => `/products/${id}`,
    DELETE: (id) => `/products/${id}`,
    BULK_DELETE: '/products/bulk-delete',
  },

  // Categories
  CATEGORIES: {
    LIST: '/categories',
    DETAIL: (id) => `/categories/${id}`,
    CREATE: '/Category',
    UPDATE: (id) => `/categories/${id}`,
    DELETE: (id) => `/categories/${id}`,
    TREE: '/categories/tree',
  },

  // Orders
  ORDERS: {
    LIST: '/orders',
    DETAIL: (id) => `/orders/${id}`,
    CREATE: '/orders',
    UPDATE: (id) => `/orders/${id}`,
    UPDATE_STATUS: (id) => `/orders/${id}/status`,
  },

  // Customers
  CUSTOMERS: {
    LIST: '/customers',
    DETAIL: (id) => `/customers/${id}`,
    CREATE: '/customers',
    UPDATE: (id) => `/customers/${id}`,
  },

  // Analytics
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    SALES: '/analytics/sales',
    PRODUCTS: '/analytics/products',
  },
};
