import { Meerafs } from '@target-energysolutions/generated-meerafs'
import { getNamespace, getAccessToken } from 'libs/utils/helpers'

export async function filesList(wsID) {
  const client = Meerafs.getMeeraFSPromiseClient(
    `${PRODUCT_APP_URL_API}/meerafs/grpc`,
  )
  const request = new Meerafs.ListRequest()
  request.setNamespace(getNamespace(wsID))
  request.setWorkspace(wsID)
  request.setPath('/GIS')
  request.setRecursive(false)

  const response = await client.list(request, {
    Authorization: `Bearer ${getAccessToken()}`,
  })
  return response
}
