export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/Authentication/login',
    LOGOUT: '/Authentication/logout',
    ME: '/Authentication/me',
  },

  // Products
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id) => `/products/${id}`,
    CREATE: '/Product',
    UPDATE: (id) => `/Product/${id}`,
    UPDATE_IMAGES: (productId) => `/Product/${productId}/images`,
    UPDATE_VARIANTS: (id) => `/products/${id}/variants/bulk`,
    DELETE_IMAGES: (productId, imageId) => `/Product/${productId}/images/${imageId}`,
    DELETE: (id) => `/Product/${id}`,
    BULK_DELETE: '/products/bulk-delete',
  },

  // Categories
  CATEGORIES: {
    LIST: '/categories',
    DETAIL: (id) => `/categories/${id}`,
    CREATE: '/Category',
    UPDATE: (id) => `/categories/${id}`,
    DELETE: (id) => `/Category/${id}`,
    TREE: '/categories/tree',
  },

  // Inventory
  INVENTORY: {
    UPDATE_STOCK: '/Inventory/stock-levels',
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

  // Coupons
  COUPONS: {
    LIST: '/coupons',
    DETAIL: (id) => `/coupons/${id}`,
    CREATE: '/Coupon',
    UPDATE: (id) => `/Coupon/${id}`,
    DELETE: (id) => `/Coupon/${id}`,
  },

  // Bundles
  BUNDLES: {
    LIST: '/bundles',
    DETAIL: (id) => `/bundles/${id}`,
    CREATE: '/Bundle',
    UPDATE: (id) => `/Bundle/${id}`,
    DELETE: (id) => `/Bundle/${id}`,
    UPDATE: (id) => `/Bundle/${id}`,
    DELETE: (id) => `/Bundle/${id}`,
    UPDATE_IMAGES: (id) => `/Bundle/${id}/images`,
    DELETE_IMAGES: (bundleId, imageId) => `/Bundle/${bundleId}/images/${imageId}`,
  },

  // Shipping
  SHIPPING: {
    ZONES: {
      LIST: '/shipping/zones', // Assuming this exists or using GraphQL list
      CREATE: '/Shipping/zones',
      UPDATE: (id) => `/Shipping/zones/${id}`,
      DELETE: (id) => `/Shipping/zones/${id}`,
    },
    RATES: {
      CREATE: '/Shipping/rates',
      UPDATE: (id) => `/Shipping/rates/${id}`,
      DELETE: (id) => `/Shipping/rates/${id}`,
    },
  },

  // Filters (Attributes & Options)
  FILTERS: {
    ATTRIBUTES: {
      CREATE: '/filters/attributes',
      UPDATE: (id) => `/filters/attributes/${id}`,
      DELETE: (id) => `/filters/attributes/${id}`,
    },
    OPTIONS: {
      CREATE: '/filters/options',
      UPDATE: (id) => `/filters/options/${id}`,
      DELETE: (id) => `/filters/options/${id}`,
    },
  },
};
