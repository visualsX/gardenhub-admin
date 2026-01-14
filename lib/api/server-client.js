import { GraphQLClient } from 'graphql-request';
import { cookies } from 'next/headers';
import { GRAPHQL_BASE } from '../const/variable.global';

const getGraphQLClient = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const client = new GraphQLClient(GRAPHQL_BASE, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return client;
};

export default getGraphQLClient;
