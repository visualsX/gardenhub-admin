import { GraphQLClient } from 'graphql-request';

// Create GraphQL client
const graphqlClient = new GraphQLClient('http://api.gardenhub.ae/graphql/', {
  headers: {},
});

// Function to set auth token dynamically
export const setAuthToken = (token) => {
  if (token) {
    graphqlClient.setHeader('Authorization', `Bearer ${token}`);
  }
};

// Function to set locale
// export const setLocale = (locale) => {
//   graphqlClient.setHeader('Accept-Language', locale);
// };

// Setup interceptor-like behavior
export const setupGraphQLClient = () => {
  if (typeof window !== 'undefined') {
    // Get token from cookie
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1];

    if (token) {
      setAuthToken(token);
    }

    // Get locale from localStorage
    // const locale = localStorage.getItem('locale') || 'en';
    // setLocale(locale);
  }
};

// Initialize on import
setupGraphQLClient();

export default graphqlClient;
