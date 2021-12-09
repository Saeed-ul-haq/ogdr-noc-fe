// import folder from 'images/folder.svg'
import { getCookie } from 'tiny-cookie'
export const unitConversion = number => {
  if (number < 2 ** 10) return number.toFixed(1) + ' M'
  if (number < 2 ** 20) return (number / 2 ** 10).toFixed(1) + ' G'
  if (number < 2 ** 30) return Math.floor(number / 2 ** 20) + ' T'
  return Math.floor(number / 2 ** 30) + ' P'
}

export const getUploadURL = wsSubject => {
  let orgId = getCookie('organizationId')
  let metaInfo = JSON.stringify({
    fm: {
      group: `target-subscription-store:${orgId}:Member`,
      source: `edge`
    }
  })
  let uploadUrl = ''
  uploadUrl = `${PRODUCT_APP_URL_FILEMANAGER}/upload?meta=${metaInfo}`
  if (!MAKE_FILES_PUBLIC) {
    if (wsSubject) {
      uploadUrl = `${uploadUrl}&share_with=${wsSubject}&permission=share`
    }
  } else {
    uploadUrl = `${uploadUrl}&share_with=sys:authenticated&permission=share`
  }
  return uploadUrl
}

export const getFileIcon = (type = '') => {
  const extension = type.toLowerCase()
  switch (extension) {
    case 'las':
      return require('images/file_las.svg')
    case 'pdf':
      return require('images/file_pdf.svg')
    case 'xls':
      return require('images/file_xls.svg')
    case 'xlsx':
      return require('images/file_xls.svg')
    case 'pptx':
      return require('images/file_ppt.svg')
    case 'ppt':
      return require('images/file_ppt.svg')
    case 'doc':
      return require('images/file_doc.svg')
    case 'docx':
      return require('images/file_doc.svg')
    case 'txt':
      return require('images/file_txt.svg')
    case 'asc':
      return require('images/file_asc.svg')
    case 'cgm':
      return require('images/file_cgm.svg')
    case 'dat':
      return require('images/file_dat.svg')
    case 'hdr':
      return require('images/file_hdr.svg')
    case 'obd':
      return require('images/file_obd.svg')
    case 'pds':
      return require('images/file_pds.svg')
    case 'prn':
      return require('images/file_prn.svg')
    case 'rtf':
      return require('images/file_rtf.svg')
    case 'tif':
      return require('images/file_tif.svg')
    case 'zip':
      return require('images/file_zip.svg')
    case 'sgy':
      return require('images/file_sgy.svg')
    case 'p190':
      return require('images/file_p190.svg')
      case 'csv':
        return require('images/file_csv.svg')
    case 'directory':
      return require('images/folder.svg')
    case 'file':
      return 'mdi-file'
    default:
      return require('images/others.svg')
  }
}

export const bytesToSize = bytes => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
}

export const bytesToSize2 = bytes => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y']
  let i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toPrecision(3)) + ' ' + sizes[i]
}

export function fileToObject(file) {
  return {
    lastModified: file.lastModified,
    lastModifiedDate: file.lastModifiedDate,
    name: file.name,
    size: file.size,
    type: file.type,
    uid: file.uid,
    percent: 0,
    webkitRelativePath: file.webkitRelativePath,
    originFileObj: file
  }
}
export function getAppMode() {
  return 'Advanced'
}

export function validURL(str) {
  var regex = /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/i
  if (!regex.test(str)) {
    return false
  } else {
    return true
  }
}
