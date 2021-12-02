import { getCookie } from 'tiny-cookie'

let authToken = null

function getAuthTokenWithoutCache () {
  if (process.env.NODE_ENV !== 'production') {
    authToken = localStorage.getItem('access_token')
  } else {
    authToken =
      getCookie('__Secure-id_token') ||
      getCookie('__Secure-access_token') ||
      localStorage.getItem('access_token')
  }
}

export function clearAuthTokenCache () {
  authToken = null
}

export default function getAuthToken () {
  if (authToken == null) {
    getAuthTokenWithoutCache()
  }

  return authToken
}
