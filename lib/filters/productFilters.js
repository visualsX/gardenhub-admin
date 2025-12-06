/**
 * Build GraphQL where clause from product filters
 * @param {Object} filters - Filter values
 * @returns {Object|null} GraphQL where clause
 */
export const buildProductWhereClause = ({ searchTerm, category, stockStatus }) => {
  const conditions = [];

  // Search by name
  if (searchTerm) {
    conditions.push({
      name: { contains: searchTerm },
    });
  }

  // Filter by category
  if (category) {
    conditions.push({
      categories: {
        some: {
          id: { eq: parseInt(category) },
        },
      },
    });
  }

  // Filter by stock status
  if (stockStatus) {
    conditions.push({
      stockStatus: { eq: stockStatus },
    });
  }

  // Return combined where clause
  return conditions.length > 0 ? { and: conditions } : null;
};
