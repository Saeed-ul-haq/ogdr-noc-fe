import { getAccessToken } from 'libs/utils/helpers'
import { fetchJSON, fetchGeneric } from 'libs/fetch'
export const geoServerProtocol = `/spatial/`

export async function findSRS({ apiURL, search, type }) {
  const resquestBody = {
    search,
    type,
  }
  const URL = `${geoServerProtocol}${apiURL}`
  const accessToken = getAccessToken()
  let res = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(resquestBody),
  })
    .then(response => {
      return response.json()
    })
    .then(data => {
      return data ? data.slice(0, 20) : []
    })
    .catch(error => {
      return error
    })
  return res
}
export async function postCrsAPICall({ apiURL, resquestParams }) {
  const URL = `${geoServerProtocol}${apiURL}`
  const accessToken = getAccessToken()
  let res = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(resquestParams),
  })
    .then(response => {
      return response.json()
    })
    .then(data => {
      return data
    })
    .catch(error => {
      return error
    })
  return res
}
