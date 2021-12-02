import { get } from 'lodash'

export const getBufferCoords = land => {
  const coords = get(land, 'geometry.coordinates[0]')
  const _coordinates = (coords || []).map(c => {
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
