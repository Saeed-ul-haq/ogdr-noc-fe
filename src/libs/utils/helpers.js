import { uniq } from 'lodash-es'
import { get, groupBy } from 'lodash'

import { getCookie } from 'tiny-cookie'
import { Meerafs } from '@target-energysolutions/generated-meerafs'

export function extractUniqValue(data, name) {
  return data && data.length ? uniq(data.map(i => i[name])) : []
}

export function deepCopy(o) {
  var output, v, key
  output = Array.isArray(o) ? [] : {}
  for (key in o) {
    v = o[key]
    output[key] = typeof v === 'object' ? deepCopy(v) : v
  }
  return output
}

export const getAccessToken = () => {
  const accessToken =
    process.env.NODE_ENV === 'development'
      ? localStorage.getItem('access_token')
      : getCookie('__Secure-id_token') ||
        getCookie('__Secure-access_token') ||
        localStorage.getItem('access_token')
  return accessToken
}

export const getFileSize = size => {
  const sizeInKB = size / 1024
  if (sizeInKB < 1024) {
    return `${sizeInKB.toFixed(2)} KB`
  } else {
    const sizeInMB = sizeInKB / 1024
    if (sizeInMB < 1024) {
      return `${sizeInMB.toFixed(2)} MB `
    } else {
      return `${(sizeInMB / 1024).toFixed(2)} GB `
    }
  }
}

export const formatDate = date => {
  if (date) {
    let convertedDate = new Date(date)
    convertedDate = `${convertedDate}`.split(' ')
    const uploadedDate =
      convertedDate[1] + ' ' + convertedDate[2] + ',' + convertedDate[3]
    return uploadedDate
  }
}

export const getNamespace = wsId => {
  // `0` mean Personal Folder
  return wsId === '0'
    ? Meerafs.Namespace.NAMESPACE_INDIVIDUAL
    : Meerafs.Namespace.NAMESPACE_WORKSPACE
}

export const getNamespace2 = wsId => (wsId === '0' ? 'INDIVIDUAL' : 'WORKSPACE')

export const getLabel = path => {
  const label = path ? path.split('/').pop() : ''
  return label
}

export const getDateString = date => {
  const d = new Date(date)
  const time = d.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  })
  const dateString = `${d.getDate()}/${d.getMonth() +
    1}/${d.getFullYear()} ${time}`
  return dateString
}

export const getUploadURL = (orgId, workspaceId, makePublic, needThumbnail) => {
  let metaInfo = JSON.stringify({
    fm: {
      group: `target-subscription-store:${orgId}:Member`,
      source: `edge`,
    },
  })
  let uploadUrl = ''
  uploadUrl = `/fm/upload?meta=${metaInfo}&need_thumbnail=${needThumbnail}`
  if (!makePublic && workspaceId) {
    uploadUrl = `${uploadUrl}&share_with=target:workspace:${workspaceId}&permission=share`
  } else {
    uploadUrl = `${uploadUrl}&share_with=sys:authenticated&permission=share`
  }
  return uploadUrl
}

export const getXMLCoords = xml => {
  try {
    const json = xmlToJson(xml)

    const coordsStr =
      // eslint-disable-next-line standard/computed-property-even-spacing
      json['wfs:FeatureCollection']['gml:featureMember']['feature:features'][
        'feature:geometry'
      ]['gml:LineString']['gml:coordinates']['#text']
    const coordArr = coordsStr.split(' ')
    return coordArr.map(c => {
      const cord = c.split(',')
      return {
        northing: cord[0],
        easting: cord[1],
      }
    })
  } catch {
    return []
  }
}

export const xmlToJson = xml => {
  // Create the return object
  var obj = {}

  if (xml.nodeType === 1) {
    // element
    // do attributes
    if (xml.attributes.length > 0) {
      obj['@attributes'] = {}
      for (var j = 0; j < xml.attributes.length; j++) {
        var attribute = xml.attributes.item(j)
        obj['@attributes'][attribute.nodeName] = attribute.nodeValue
      }
    }
  } else if (xml.nodeType === 3) {
    // text
    obj = xml.nodeValue
  }

  // do children
  if (xml.hasChildNodes()) {
    for (var i = 0; i < xml.childNodes.length; i++) {
      var item = xml.childNodes.item(i)
      var nodeName = item.nodeName
      if (typeof obj[nodeName] === 'undefined') {
        obj[nodeName] = xmlToJson(item)
      } else {
        if (typeof obj[nodeName].push === 'undefined') {
          var old = obj[nodeName]
          obj[nodeName] = []
          obj[nodeName].push(old)
        }
        obj[nodeName].push(xmlToJson(item))
      }
    }
  }
  return obj
}

export const formatLandResults = (r = []) => {
  const results = r.map(r => ({ ...r, groupName: 'undefined' }))
  const formatedResults = {}
  const resByGroups = groupBy(results, 'groupName')
  Object.keys(resByGroups).forEach(groupName => {
    const ress = resByGroups[groupName]
    const groupLayers = groupBy(ress, 'layerName')
    formatedResults[groupName] = groupLayers
  })
  return formatedResults
}

export const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const getBufferCoords = land => {
  const coords = get(land, 'geometry.coordinates[0]')
  const _coordinates = coords.map(c => {
    return {
      latitude: c[0],
      longitude: c[1],
    }
  })
  return _coordinates
}

export const formatInputCoordinates = lines => {
  let points = []
  try {
    if (Array.isArray(lines) && lines.length > 0) {
      let headerLine = ''
      let startIndex = lines.findIndex(
        l =>
          l.LineText.indexOf('NORTHING') > -1 &&
          l.LineText.indexOf('EASTING') > -1,
      )

      if (startIndex > -1) {
        headerLine = lines[startIndex].LineText.split(' ')
        const northingIndex = headerLine.indexOf('NORTHING')
        const eastingIndex = headerLine.indexOf('EASTING')

        points = lines
          .slice(startIndex + 1, startIndex + 5)
          .map(line => line.LineText)
          .map(lineText => {
            const textArr = lineText.split(' ')
            return {
              northing: textArr[northingIndex + 1],
              easting: textArr[eastingIndex + 1],
            }
          })
      }
    }
    return points
  } catch (e) {
    return points
  }
}
