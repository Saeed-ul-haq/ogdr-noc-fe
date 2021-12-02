import fetch from 'isomorphic-fetch'
import { getAccessToken } from 'libs/utils/helpers'
import axios from 'axios'
import { OauthHelper } from '@target-energysolutions/hoc-oauth'
import getAuthToken from 'libs/utils/get-auth-token'

export function fetchGeneric (url, opts, auth = true) {
  const accessToken = getAccessToken()
  return fetch(url, {
    ...opts,
    headers: {
      ...((opts || {}).isFormData
        ? {}
        : {
          // If content-type is multipart/form-data it should have a boundary,
          // So let browser generate it
          'Content-Type': 'application/json',
        }),
      Authorization: `Bearer ${accessToken}`,
      mode: 'no-cors',
      ...((opts && opts.headers) || {}),
    },
  })
}

export async function fetchJSON (url, opts, auth = true) {
  const res = await fetchGeneric(url, opts, auth)

  if (!res.ok) {
    const err = new Error(`network status error ${res.statusText}`)
    if (res.status === 401) {
      localStorage.removeItem('allcounts')
      OauthHelper.redirectToSSO()
    }

    err.status = res.status
    try {
      const json = await res.json()
      if (json) {
        err.body = json
      }
    } catch (e) {
      // ignore if there is no json body
      console.log('Fetch Error', e)
    }
    throw err
  }

  let json
  try {
    json = await res.json()
    if (json.error) {
      const err = new Error('error')
      err.body = json.error
      throw err
    }
  } catch (e) {
    // ignore if response is no json.
  }

  return json
}

export async function download (url) {
  // We have to call fetch directly, as the shared utils in libs/fetch do not handle non-json responses
  const res = await fetchGeneric(url, { method: 'GET' })
  const blob = await res.blob()
  return {
    response: res,
    ok: res.ok,
    blobURL: URL.createObjectURL(blob),
    blob: blob,
  }
}

export async function axiosGeneric (url, opts, auth = true) {
  return axios({
    url,
    ...opts,
    headers: {
      ...((opts || {}).isFormData
        ? {}
        : {
          // If content-type is multipart/form-data it should have a boundary,
          // So let browser generate it
          'Content-Type': 'text/octet-stream',
        }),
      Authorization: `Bearer ${getAuthToken()}`,
      // refresh_token: `${getAuthRefreshToken()}`,
      ...((opts && opts.headers) || {}),
    },
  })
}
