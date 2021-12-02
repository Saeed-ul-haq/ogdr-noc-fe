import { getAccessToken } from 'libs/utils/helpers'

export async function fetchWFSData(requestBody) {
  // const body = `{"url": "${url}","layerName":"${layerName}","filter":${filter ? `"${filter}"`:`null`},"crsCode":"${crsCode}"}`
  const URL = `/spatial/api/v1/data/request`
  let response = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: JSON.stringify(requestBody),
  })
  if (response && response.ok) {
    return response.json()
  } else if (response && response.status && response.status === 500) {
    return response
  } else {
    const response = {
      status: 500,
      message: 'No Result Found',
    }
    return response
  }
}
export const fetchWFSDataDeckgl = fetchWFSData
