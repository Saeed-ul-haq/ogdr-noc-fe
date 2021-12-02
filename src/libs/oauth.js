/* eslint-disable no-undef */
export default {
  clientId: OAUTH_CLIENT_ID,
  clientSecret: OAUTH_CLIENT_SECRET,
  accessTokenUri: process.env.ACCESS_TOKEN_URI || `${OAUTH_HOST}/token`,
  authorizationUri: process.env.AUTHORIZATION_URI || `${OAUTH_HOST}/auth`,
  redirectUri:
    process.env.REDIRECT_URI ||
    (process.env.NODE_ENV === 'development'
      ? 'http://localhost:8000/sso/callback'
      : `${OAUTH_CALLBACK_HOST}/sso/callback`),
  userinfoUri: process.env.USERINFO_URI || `${OAUTH_HOST}/userinfo`,
  scopes: ['openid', 'email', 'groups', 'profile', 'offline_access'],
}
