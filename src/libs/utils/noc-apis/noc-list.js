import { getAccessToken } from '../helpers'
export const URL = '/print/api/'
const getNocLists = async subject => {
  const response = await fetch(
    `${URL}request/created/${subject}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAccessToken()}`,
      },
    },
  )
  return response;
}

export default getNocLists
