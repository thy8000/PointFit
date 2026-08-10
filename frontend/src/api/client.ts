import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { API_URL } from '../utils/constants'
import { storage } from '../utils/storage'

const httpLink = createHttpLink({
  uri: API_URL,
})

const authLink = setContext(async (_, { headers }) => {
  const token = await storage.getToken()
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.extensions?.statusCode === 401) {
        // Token expirado/inválido: limpa sessão local
        void storage.clearAll()
      }
    }
  }
  if (networkError) {
    console.error('[Apollo] Erro de rede:', networkError.message)
  }
})

export const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink.concat(httpLink)]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
})