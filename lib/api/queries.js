import { gql } from 'graphql-request';
// ===================================
// Category Queries
// ===================================
export const CATEGORY_QUERIES = {
  // Get all categories with pagination
  GET_CATEGORIES: gql`
    query (
      $first: Int
      $after: String
      $last: Int
      $before: String
      $where: CategoryDtoFilterInput
      $order: [CategoryDtoSortInput!]
    ) {
      categories(
        first: $first
        after: $after
        last: $last
        before: $before
        where: $where
        order: $order
      ) {
        nodes {
          id
          isVisible
          name
          parentCategoryId
          slug
          subCategories {
            id
            isVisible
            name
            parentCategoryId
            slug
            subCategories {
              id
              isVisible
              name
              parentCategoryId
              slug
            }
          }
        }
        totalCount
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
      }
    }
  `,

  GET_CATEGORIES_DD: gql`
    query {
      categories {
        nodes {
          id
          name
          subCategories {
            id
            name
            subCategories {
              id
              name
            }
          }
        }
        totalCount
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
      }
    }
  `,
};

// ===================================
// Attributes Queries
// ===================================
export const ATTRIBUTES_QUERIES = {
  GET_ATTRIBUTES: gql`
    query ($where: FilterAttributeDtoFilterInput, $order: [FilterAttributeDtoSortInput!]) {
      filterAttributes(where: $where, order: $order) {
        name
        isMultiSelect
        options {
          description
          value
          id
          slug
          filterAttributeId
        }
        id
      }
    }
  `,
};

// ===================================
// Products Queries
// ===================================
export const PRODUCTS_QUERIES = {
  // Get all categories with pagination
  GET_PRODUCTS: gql`
    query (
      $first: Int
      $after: String
      $last: Int
      $before: String
      $where: ProductDtoFilterInput
      $order: [ProductDtoSortInput!]
    ) {
      products(
        first: $first
        after: $after
        last: $last
        before: $before
        where: $where
        order: $order
      ) {
        nodes {
          categories {
            name
          }
          id
          name
          regularPrice
          sku
          stockQuantity
          images {
            id
            imageUrl
            isMain
          }
          shortDescription
          stockStatus
        }
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
        totalCount
      }
    }
  `,
  GET_PRODUCT_DETAIL: gql`
    query ($id: Int, $slug: String) {
      productDetail(id: $id, slug: $slug) {
        costPrice
        detailedDescription
        discount
        height
        id
        isActive
        isFeatured
        isFragile
        isShippingRequired
        keywords
        length
        lowStockThreshold
        metaDescription
        metaTitle
        name
        regularPrice
        salePrice
        shortDescription
        sku
        slug
        stockQuantity
        weight
        width
        categories {
          name
          subCategories {
            name
          }
        }
        filterOptions {
          value
        }
        images {
          imageUrl
          isMain
        }
        variants {
          discount
          id
          lowStockThreshold
          name
          price
          productId
          salePrice
          sku
          stockQuantity
          trackInventory
          optionValues {
            value
            name
            id
            colorHex
          }
        }
        options {
          id
          name
          type
          values {
            name
            value
            colorHex
            id
          }
        }
      }
    }
  `,
  GET_EDIT_PRODUCT_DETAIL: gql`
    query ($id: Int!) {
      productDetailById(id: $id) {
        costPrice
        detailedDescription
        discount
        height
        id
        isActive
        isFeatured
        isFragile
        isShippingRequired
        keywords
        length
        lowStockThreshold
        metaDescription
        metaTitle
        name
        regularPrice
        salePrice
        shortDescription
        sku
        slug
        stockQuantity
        stockStatus
        weight
        width
        hasVariants
        images {
          id
          imageUrl
          isMain
        }
        categoriesWithPathsForEdit {
          currentCategory {
            id
          }
          ancestors {
            id
          }
        }
        allFilterAttributesWithSelection {
          id
          isMultiSelect
          name
          options {
            value
            id
            isSelected
          }
        }
        options {
          id
          name
          type
          values {
            id
            value
            colorHex
          }
        }
        trackInventory
        variants {
          id
          price
          salePrice
          sku
          stockQuantity
          trackInventory
          lowStockThreshold
          discount
          optionValues {
            id
            value
            name
          }
        }
      }
    }
  `,
};

// ===================================
// Inventory Queries
// ===================================
export const INVENTORY_QUERIES = {
  GET_INVENTORY: gql`
    query (
      $first: Int
      $after: String
      $last: Int
      $before: String
      $where: InventoryDashboardItemDtoFilterInput
      $order: [InventoryDashboardItemDtoSortInput!]
    ) {
      inventoryDashboardItems(
        first: $first
        after: $after
        last: $last
        before: $before
        where: $where
        order: $order
      ) {
        nodes {
          id
          name
          sku
          variants {
            availableStock
            categoryName
            currentStock
            id
            lowStockThreshold
            name
            price
            sku
            stockStatus
            totalValue
            trackInventory
          }
        }
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
        totalCount
      }
    }
  `,
  GET_INVENTORY_ITEM: gql`
    query ($id: Int) {
      inventoryDashboardItems(where: { id: { eq: $id } }) {
        nodes {
          availableStock
          categoryName
          costPrice
          currentStock
          id
          lastUpdatedAt
          lowStockThreshold
          mainImageUrl
          maxCapacity
          name
          regularPrice
          sku
          stockStatus
          hasVariants
        }
      }
    }
  `,
  GET_INVENTORY_STATS: gql`
    query {
      inventorySummary {
        inventoryValue
        lowStockItems
        outOfStockItems
        totalProducts
      }
    }
  `,
  GET_PRODUCT_TRANSACTION_HISTORY: gql`
    query (
      $productId: Int!
      $varientId: Int
      $first: Int
      $after: String
      $last: Int
      $before: String
      $order: [InventoryAdjustmentDtoSortInput!]
    ) {
      productTransactionHistory(
        productId: $productId
        varientId: $varientId
        first: $first
        after: $after
        last: $last
        before: $before
        order: $order
      ) {
        edges {
          cursor
          node {
            createdAt
            createdBy
            id
            lastUpdatedAt
            lastUpdatedBy
            newStockQuantity
            productId
            quantityChange
            reason
            referenceId
            type
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  `,
};

// ===================================
// Coupons Queries
// ===================================
export const COUPONS_QUERIES = {
  GET_COUPONS: gql`
    query (
      $first: Int
      $after: String
      $last: Int
      $before: String
      $where: CouponDtoFilterInput
      $order: [CouponDtoSortInput!]
    ) {
      coupons(
        first: $first
        after: $after
        last: $last
        before: $before
        where: $where
        order: $order
      ) {
        nodes {
          allowedCustomerIds
          appliesToCategoryIds
          appliesToProductIds
          code
          couponScope
          createdAt
          createdBy
          description
          discountValue
          expirationDate
          globalCurrentUsage
          globalUsageLimit
          id
          isActive
          isCustomerSpecific
          isPercentage
          lastUpdatedAt
          lastUpdatedBy
          maxUsagePerCustomer
          minimumOrderAmount
          name
        }
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
        totalCount
      }
    }
  `,
  GET_COUPONS_BY_ID: gql`
    query ($id: Int!) {
      couponById(id: $id) {
        allowedCustomerIds
        appliesToCategoryIds
        appliesToProductIds
        code
        couponScope
        createdAt
        createdBy
        description
        discountValue
        expirationDate
        globalCurrentUsage
        globalUsageLimit
        id
        isActive
        isCustomerSpecific
        isPercentage
        lastUpdatedAt
        lastUpdatedBy
        maxUsagePerCustomer
        minimumOrderAmount
        name
      }
    }
  `,
};

// ===================================
// Customer Queries
// ===================================
export const Customer_QUERIES = {
  // GET_CUSTOMER_ADDRESSES: gql`
  //   query (
  //     $first: Int
  //     $after: String
  //     $last: Int
  //     $before: String
  //     $where: AddressDtoFilterInput
  //     $order: [AddressDtoSortInput!]
  //   ) {
  //     customerAddresses(
  //       first: $first
  //       after: $after
  //       last: $last
  //       before: $before
  //       where: $where
  //       order: $order
  //     ) {
  //       totalCount
  //       nodes {
  //         addressLine2
  //         city
  //         country
  //         customerId
  //         emirate
  //         firstName
  //         id
  //         isDefault
  //         lastName
  //         phone
  //         postalCode
  //         streetAddress
  //       }
  //       pageInfo {
  //         endCursor
  //         hasNextPage
  //         hasPreviousPage
  //         startCursor
  //       }
  //     }
  //   }
  // `,
  // GET_CUSTOMER_ADDRESS: gql`
  //   query {
  //     customerProfile {
  //       email
  //       firstName
  //       id
  //       lastName
  //       addresses {
  //         addressLine2
  //         city
  //         country
  //         customerId
  //         emirate
  //         firstName
  //         id
  //         isDefault
  //         lastName
  //         phone
  //         postalCode
  //         streetAddress
  //       }
  //     }
  //   }
  // `,
};

// ===================================
// Bundles Queries
// ===================================
export const BUNDLES_QUERIES = {
  GET_PRODUCTS_FOR_BUNDLES: gql`
    query (
      $first: Int
      $after: String
      $last: Int
      $before: String
      $where: ProductDtoFilterInput
      $order: [ProductDtoSortInput!]
    ) {
      products(
        first: $first
        after: $after
        last: $last
        before: $before
        where: $where
        order: $order
      ) {
        nodes {
          id
          name
          regularPrice
          sku
          stockQuantity
          images {
            id
            imageUrl
            isMain
          }
          stockStatus
          variants {
            discount
            id
            lowStockThreshold
            name
            price
            productId
            salePrice
            sku
            stockQuantity
            trackInventory
            optionValues {
              colorHex
              id
              name
              value
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
        totalCount
      }
    }
  `,
  GET_BUNDLES: gql`
    query (
      $first: Int
      $after: String
      $last: Int
      $before: String
      $where: BundleDetailDtoFilterInput
      $order: [BundleDetailDtoSortInput!]
    ) {
      bundles(
        first: $first
        after: $after
        last: $last
        before: $before
        where: $where
        order: $order
      ) {
        totalCount
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
        nodes {
          bundlePrice
          createdAt
          customerSaves
          description
          discountPercentage
          expiryDate
          id
          isActive
          isFeatured
          name
          originalPrice
          slug
          images {
            imageUrl
            isMain
          }
          items {
            productId
          }
        }
      }
    }
  `,
  BUNDLE_DETAIL: gql`
    query ($id: Int, $slug: String) {
      bundleDetail(id: $id, slug: $slug) {
        bundlePrice
        createdAt
        customerSaves
        description
        discountPercentage
        expiryDate
        shortDescription
        detailedDescription
        keywords
        metaTitle
        metaDescription
        id
        isActive
        isFeatured
        name
        originalPrice
        slug
        images {
          id
          imageUrl
          isMain
        }
        items {
          displayName
          imageUrl
          originalUnitPrice
          productId
          productName
          productVariantId
          quantity
          variantAttributes
        }
      }
    }
  `,
};

// ===================================
// ShippingZone Queries
// ===================================
export const SHIPPING_ZONE_QUERIES = {
  GET_SHIPPING_ZONES: gql`
    query (
      $first: Int
      $after: String
      $last: Int
      $before: String
      $where: ShippingZoneDtoFilterInput
      $order: [ShippingZoneDtoSortInput!]
    ) {
      shippingZones(
        first: $first
        after: $after
        last: $last
        before: $before
        where: $where
        order: $order
      ) {
        nodes {
          countryCodes
          id
          name
          rates {
            baseCost
            freeShippingThreshold
            id
            rateName
            shippingZoneId
          }
        }
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
        totalCount
      }
    }
  `,
  SHIPPING_RATE_BY_ID: gql`
    query ($id: Int!) {
      shippingRateById(id: $id) {
        baseCost
        freeShippingThreshold
        id
        rateName
        shippingZoneId
      }
    }
  `,
};

// ===================================
// Addon Queries
// ===================================
export const ADDON_QUERIES = {
  GET_ADDONS_TYPES: gql`
    query ($where: AddonTypeDtoFilterInput, $order: [AddonTypeDtoSortInput!]) {
      addonTypes(where: $where, order: $order) {
        description
        displayOrder
        id
        isActive
        name
      }
    }
  `,
  GET_ADDONS: gql`
    query ($id: Int, $where: GlobalAddonDtoFilterInput, $order: [GlobalAddonDtoSortInput!]) {
      globalAddons(addonTypeId: $id, where: $where, order: $order) {
        addonTypeId
        addonTypeName
        description
        id
        isActive
        name
        options {
          defaultPrice
          description
          discountPercentage
          displayOrder
          id
          imageUrl
          isActive
          isDefault
          name
          salePrice
        }
      }
    }
  `,
  GET_ADDON_BY_ID: gql`
    query ($id: Int!) {
      globalAddonById(id: $id) {
        addonTypeId
        addonTypeName
        description
        id
        isActive
        name
        options {
          defaultPrice
          description
          discountPercentage
          displayOrder
          id
          imageUrl
          isActive
          isDefault
          name
          salePrice
        }
      }
    }
  `,
  GET_PRODUCT_ADDONS_FOR_DISPLAY: gql`
    query ($productId: Int!, $variantId: Int) {
      productAddonsForDisplay(productId: $productId, variantId: $variantId) {
        productAddonAssignmentId
        addonTypeName
        name
        description
        displayOrder
        globalAddonId
        isRequired
        options {
          description
          discountPercentage
          displayOrder
          id
          imageUrl
          isDefault
          name
          price
          salePrice
        }
      }
    }
  `,
};

// ===================================
// Landing Page (Banners) Queries
// ===================================
export const LANDING_PAGE_QUERIES = {
  GET_BANNERS: gql`
    query (
      $first: Int
      $after: String
      $last: Int
      $before: String
      $where: HeroBannerDtoFilterInput
      $order: [HeroBannerDtoSortInput!]
    ) {
      allBanners(
        first: $first
        after: $after
        last: $last
        before: $before
        where: $where
        order: $order
      ) {
        nodes {
          id
          heading
          isActive
          subheading
          description
          imageUrl
          mobileImageUrl
          backgroundOverlay
          overlayOpacity
          primaryButton {
            text
            link
            style
          }
          secondaryButton {
            text
            link
            style
          }
          textAlignment
          textPosition
          videoUrl
        }
        totalCount
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
      }
    }
  `,

  GET_BANNER_BY_ID: gql`
    query ($id: Int!) {
      bannerById(id: $id) {
        id
        heading
        subheading
        description
        imageUrl
        mobileImageUrl
        backgroundOverlay
        overlayOpacity
        primaryButton {
          text
          link
          style
        }
        secondaryButton {
          text
          link
          style
        }
        textAlignment
        textPosition
        videoUrl
        isActive
        name
        endDate
        startDate
      }
    }
  `,
  GET_FEATURED_CATEGORIES: gql`
   query ($first: Int, $after: String, $last: Int, $before: String, $where: FeaturedCategoryDtoFilterInput, $order: [FeaturedCategoryDtoSortInput!]) {
  allFeaturedCategories(
    first: $first
    after: $after
    last: $last
    before: $before
    where: $where
    order: $order
  ) {
    totalCount
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
    nodes {
      categoryId
      categoryName
      categorySlug
      customTitle
      displayOrder
      id
      imageUrl
      placementArea
      isActive
    }
  }
}
  `,
  GET_FEATURED_CATEGORY_BY_ID: gql`
    query ($id: Int!) {
      featuredCategoryById(id: $id) {
        categoryId
        categoryName
        categorySlug
        customTitle
        displayOrder
        id
        imageUrl
        products {
          categoryName
          discountPercentage
          hasVariants
          id
          isOnSale
          isSoldOut
          mainImageUrl
          name
          price
          salePrice
          slug
        }
      }
    }
  `,
};
