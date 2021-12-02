import { getAccessToken } from 'libs/utils/helpers'
export const gisProtocol = `/service/`

export const getMaps = async () => {
  const mapUrl = '/service/map/active'
  return fetch(mapUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessToken()}`,
    },
  })
    .then(response => {
      return response.json()
    })
    .catch(err => console.log('Error:', err))
}

export async function getActiveMapEntity() {
  const URL = `${gisProtocol}${`map/active?activeOnly=true`}`
  const accessToken = getAccessToken()
  let res = await fetch(URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
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
