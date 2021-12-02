import { fetchJSON, fetchGeneric } from 'libs/fetch'
import { getAccessToken } from 'libs/utils/helpers'
export const gisProtocol = `/service/`

export const transformPoints = async params => {
  let res
  try {
    res = await fetchJSON(`/spatial/api/v1/transform/bulk/points`, {
      method: 'POST',
      body: JSON.stringify(params),
    })
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export const checkIntersections = params => {
  return fetchJSON(`/spatial/api/v1/wfs/readjson`, {
    method: 'POST',
    body: JSON.stringify(params),
  })
}

export const getDXFData = content => {
  return fetchGeneric(`/spatial/api/v1/convert/dxf`, {
    method: 'POST',
    body: JSON.stringify({
      epsgCode: 4326,
      content,
    }),
  })
}
export const getWelfareData = ({ page = 1, size = 100 }) => {
  return fetchJSON(
    `/wf-be/api/v1/user-extended-info?page=${page}&size=${size}`,
    {
      method: 'GET',
    },
  )
}

export const getServerLayers = wmsUrl => {
  return fetchJSON(`/spatial/api/v1/wfs/wms_layers?wmsUrl=${wmsUrl}`, {
    method: 'GET',
  })
}

export const getImageData = image => {
  var formData = new FormData()
  formData.append('base64Image', image)
  formData.append('language', 'eng')
  formData.append('apikey', '4cce86b4c588957')
  formData.append('isOverlayRequired', true)
  formData.append('isTable', true)
  formData.append('OCREngine', 2)
  // formData.append('scale', true)
  formData.append('detectOrientation', true)

  return fetchJSON(`https://api.ocr.space/parse/image`, {
    method: 'POST',
    body: formData,
    isFormData: true,
  })
}

export async function workspaceMembers(id) {
  return fetchJSON(
    `/graphql`,
    {
      body: JSON.stringify({
        query: `query workspaceMembers($wsID: Int!) {
          workspaceMembers(wsID: $wsID) {
            Members {
              edges {
                node {
                  id
                  profile {
                    groups
                    title
                    fullName
                    subject
                    email
                    photo
                  }
                }
              }
            }
            }
          }`,
        operationName: 'workspaceMembers',
        variables: { wsID: Number(id) },
      }),
      method: 'POST',
    },
    true,
  )
}

export async function fetchAttributes({ resquestParams }) {
  const URL = `/spatial/api/v1/wfs/layer_info`
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

export async function getEntity({ entityName }) {
  const URL = `${gisProtocol}${entityName}`
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

export async function getEntityByID({ entityName, entityID }) {
  const URL = `${gisProtocol}${entityName}/${entityID}`
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

export async function saveEntity({ data, entityName, method = 'POST' }) {
  const URL = `${gisProtocol}`
  const resquestBody = {
    studio: {
      entityName: `${entityName}`,
      data,
    },
  }
  const accessToken = getAccessToken()
  let res = await fetch(URL, {
    method: method,
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
      return data
    })
    .catch(error => {
      return error
    })
  return res
}

export async function updateEntity({ data, entityName }) {
  const resquestBody = {
    studio: {
      entityName: `${entityName}`,
      data,
    },
  }
  const URL = `${gisProtocol}`
  const accessToken = getAccessToken()
  let res = await fetch(URL, {
    method: 'PUT',
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
      return data
    })
    .catch(error => {
      return error
    })
  return res
}

export async function deleteEntity({ entityName, id }) {
  const URL = `${gisProtocol}${entityName}/${id}`
  const accessToken = getAccessToken()
  let res = await fetch(URL, {
    method: 'DELETE',
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

export async function getMapThemes(mapId) {
  const URL = `${gisProtocol}themes/map/${mapId}`
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
