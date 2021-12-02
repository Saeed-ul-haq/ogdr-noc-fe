import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import ClientOauth2 from 'client-oauth2'
import oauthConfig from 'libs/oauth'

import { getAccessToken } from 'libs/utils/helpers'

const errorLink = onError(({ graphQLErrors, networkError }) => {
  const client = new ClientOauth2(oauthConfig)
  const redirectToSSO = () => {
    localStorage.setItem('redirectTo', window.location.pathname)
    window.location.href = client.code.getUri()
  }
  // Go to login page if unauthorized.
  if (
    networkError &&
    networkError.statusCode === 401 &&
    // location.pathname !== '/login' &&
    location.pathname !== '/sso/callback'
  ) {
    redirectToSSO()
    // window.location.href = `/login?url=${encodeURIComponent(
    //   `${location.pathname}${location.search}`
    // )}`
  }
})

const authLink = setContext((_, { headers }) => {
  let extraHeaders = {}
  const accessToken = getAccessToken()
  extraHeaders['Authorization'] = `Bearer ${accessToken}`
  return {
    headers: {
      ...headers,
      ...extraHeaders,
    },
  }
})

const httpLink = new HttpLink({
  uri: '/graphql',
  credentials: 'include',
})

export default new ApolloClient({
  link: errorLink.concat(authLink.concat(httpLink)),
  cache: new InMemoryCache({
    dataIdFromObject: object => null,
  }),
})
