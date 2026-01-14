import getGraphQLClient from '../server-client';
import { CATEGORY_QUERIES } from '../queries';

export const getCategoriesDropdown = async () => {
  try {
    const client = await getGraphQLClient();
    const response = await client.request(CATEGORY_QUERIES.GET_CATEGORIES_DD);
    return response.categories?.nodes ?? [];
  } catch (error) {
    console.error('Error fetching categories (SSR):', error);
    return [];
  }
};
