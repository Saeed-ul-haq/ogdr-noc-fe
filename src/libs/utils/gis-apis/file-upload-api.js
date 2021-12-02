import tus from 'tus-js-client'
import { getAccessToken, getUploadURL } from 'libs/utils/helpers'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'

export default async ({
  file,
  onSuccess,
  wsID,
  onProgress,
  onError,
  isPublic = false,
}) => {
  let metadata = {
    path: `/GIS/${file.name}`,
    size: file.size,
    contenttype: file.type,
    namespace: 'WORKSPACE',
    workspace: wsID, // place ID of your workspace.
  }

  if (isPublic) {
    metadata.share_with = 'sys:authenticated'
    metadata.path = `/GIS/MapIcons/${uuidv4()}/${file.name}`
  }
  tus.canStoreUrls = false
  const uploadCallBack = new tus.Upload(file, {
    endpoint: `${PRODUCT_APP_URL_API}/meerafs/rest/files/`,
    // retryDelays: [0, 3000, 5000, 10000, 20000],
    resume: false,
    metadata: {
      ...metadata,
    },
    canStoreUrls: false,
    onError: onError,
    onProgress: onProgress,
    onSuccess: e => onSuccess(e, uploadCallBack),
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      'Tus-Upload-Metadata': encodeMetadata(metadata),
    },
  })
  uploadCallBack.start()
  return uploadCallBack
}

export function encodeMetadata(metadata) {
  let encoded = []
  for (let key in metadata) {
    // eslint-disable-next-line
    encoded.push(key + ' ' + Base64.encode(metadata[key]))
  }
  return encoded.join(',')
}

export async function uploadPost({
  files,
  onProgress,
  workspaceId = null,
  isPublic = false,
  orgId,
  ...rest
}) {
  const body = new FormData()
  if (Array.isArray(files)) {
    files.map(file => {
      body.append('files', file)
    })
  } else if (files) {
    body.append('files', files)
  }
  const uploadUrl = getUploadURL(
    orgId,
    workspaceId,
    isPublic,
    rest.needThumbnail,
  )
  try {
    const PromiseRespo = axios({
      url: uploadUrl,
      method: 'POST',
      data: body,
      'Content-Type': 'application/json',
      onUploadProgress: onProgress,
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })

    return PromiseRespo
  } catch (error) {
    console.log(error, 'Error in uplload method')
  }
}
