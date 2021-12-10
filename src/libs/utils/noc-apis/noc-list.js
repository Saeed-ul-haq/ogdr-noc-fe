import { getAccessToken } from '../helpers'
import { fetchJSON } from 'libs/fetch'
import axios from 'axios'
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

export const storeUrl = async data => {
  debugger;
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

export const fileUpload = async (file, config) => {
  const uploadURL = `https://api.dev.meeraspace.com/fm/upload?bucket=gisfe&share_with=sys:anonymous,sys:authenticated&meta={"fm":{"group":"target-qais-file-group","source":"energy"}}`
  const form = new FormData()
  form.append('file', file)
  const res = await axios({
    method: 'POST',
    url: uploadURL,
    data: form,
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      mode: 'no-cors',
      'Content-Type': 'multipart/form-data',
    },
    ...config,
  })

  return res
}
