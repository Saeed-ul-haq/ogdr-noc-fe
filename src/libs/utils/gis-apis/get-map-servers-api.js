import { getAccessToken } from 'libs/utils/helpers'

export const getMapServers = async () => {
  const serverUrl = '/service/entity/MapServer'
  return fetch(serverUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessToken()}`,
    },
  }).then(response => response.json())
}
