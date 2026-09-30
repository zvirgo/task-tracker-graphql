import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:4000/',
  }),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          tasks: {
            merge(_existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
});