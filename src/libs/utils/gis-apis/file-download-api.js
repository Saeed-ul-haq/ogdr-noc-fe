import { download } from 'libs/fetch'
import { getNamespace2 } from 'libs/utils/helpers'

export async function downloadFile(url, fileName, wsId) {
  const _path = `${PRODUCT_APP_URL_API}/meerafs/rest${url}?namespace=${getNamespace2(
    wsId,
  )}&workspace=${wsId}`
  let { blobURL } = await download(_path)
  var a = document.createElement('a')
  a.href = blobURL
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
