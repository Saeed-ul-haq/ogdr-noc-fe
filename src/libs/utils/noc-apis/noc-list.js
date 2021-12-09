import { getAccessToken } from '../helpers'
import { fetchJSON } from 'libs/fetch'

export const URL = '/print/api/'

export default async subject => {
  const response = await fetchJSON(
    `${URL}request/created/${subject}`,
    // {
    //   method: 'GET',
    //   headers: {
    // 'Content-Type': 'application/json',
    // Authorization: `Bearer ${getAccessToken()}`,
    //   },
    // },
  )

  return response
}

export const createNocRequest = async data => {
  const url = `${URL}request`
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: JSON.stringify(data),
  }
  const response = await fetchJSON(url, options)

  return response
}
