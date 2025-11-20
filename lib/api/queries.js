import { gql } from 'graphql-request';

// Category Queries
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
};

export const ATTRIBUTES_QUERIES = {
  // Get all categories with pagination
  GET_ATTRIBUTES: gql`
    query ($where: FilterAttributeDtoFilterInput, $order: [FilterAttributeDtoSortInput!]) {
      filterAttributes(where: $where, order: $order) {
        name
        isMultiSelect
        options {
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
export const PRODUCTS_QUERIES = {
  // Get all categories with pagination
  // $where: ProductDtoFilterInput
  // $order: [ProductDtoSortInput!]
  // where: $where
  // order: $order
  GET_PRODUCTS: gql`
    query ($first: Int, $after: String, $last: Int, $before: String) {
      products(first: $first, after: $after, last: $last, before: $before) {
        nodes {
          categories {
            name
            subCategories {
              name
            }
          }
          availableStockQuantity
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
          images {
            id
            imageUrl
            isMain
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
  GET_PRODUCT_DETAIL: gql`
    query ($id: Int, $slug: String) {
      productDetail(id: $id, slug: $slug) {
        availableStockQuantity
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
      }
    }
  `,
};

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
          availableStock
          categoryName
          costPrice
          createdAt
          createdBy
          currentStock
          id
          lastUpdatedAt
          lastUpdatedBy
          lowStockThreshold
          mainImageUrl
          maxCapacity
          name
          regularPrice
          sku
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
  GET_INVENTORY_ITEM: gql`
    query ($id: Int) {
      inventoryDashboardItems(where: { id: { eq: $id } }) {
        nodes {
          availableStock
          categoryName
          costPrice
          createdAt
          createdBy
          currentStock
          id
          lastUpdatedAt
          lastUpdatedBy
          lowStockThreshold
          mainImageUrl
          maxCapacity
          name
          regularPrice
          sku
          stockStatus
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
};
