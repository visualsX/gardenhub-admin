import { gql } from 'graphql-request';

// Category Queries
export const CATEGORY_QUERIES = {
  // Get all categories with pagination
  GET_CATEGORIES: gql`
    query ($first: Int, $after: String, $last: Int, $before: String) {
      categories(first: $first, after: $after, last: $last, before: $before) {
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
