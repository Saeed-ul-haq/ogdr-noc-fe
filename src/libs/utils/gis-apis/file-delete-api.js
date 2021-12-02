import { Meerafs } from '@target-energysolutions/generated-meerafs'
import { getNamespace, getAccessToken } from 'libs/utils/helpers'

export async function deleteFile(wsId, path) {
  const client = Meerafs.getMeeraFSPromiseClient(
    `${PRODUCT_APP_URL_API}/meerafs/grpc`,
  )
  const request = new Meerafs.RemoveRequest()
  request.setNamespace(getNamespace(wsId))
  request.setWorkspace(wsId)
  request.setPathsList([path])
  return client.remove(request, {
    Authorization: `Bearer ${getAccessToken()}`,
  })
}
