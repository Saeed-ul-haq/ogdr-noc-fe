import { getCookie } from 'tiny-cookie'

let authRefreshToken = null

function getAuthRefreshTokenWithoutCache () {
  if (process.env.NODE_ENV !== 'production') {
    authRefreshToken = localStorage.getItem('oauthRefreshToken')
  } else {
    authRefreshToken =
      getCookie('__Secure-refresh_token') ||
      localStorage.getItem('oauthRefreshToken')
  }
}

export function clearAuthRefreshTokenCache () {
  authRefreshToken = null
}

export default function getAuthRefreshToken () {
  if (authRefreshToken == null) {
    getAuthRefreshTokenWithoutCache()
  }

  return authRefreshToken
}
