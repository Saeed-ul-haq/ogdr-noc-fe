import { fetchJSON } from 'libs/fetch'
const API_HOST = `/spatial/index/v1`

export const SPATIAL_INDEX_API = params => {
  const { body = {}, api = 'list' } = params
  return fetchJSON(`${API_HOST}/${api}`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
