import { getAccessToken } from 'libs/utils/helpers'

export const getMapLayers = async () => {
  const mapUrl = '/service/entity/MapLayer'
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
