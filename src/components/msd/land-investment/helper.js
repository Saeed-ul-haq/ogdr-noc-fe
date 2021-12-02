import lands from './lands.json'
import { randomIntFromInterval } from 'libs/utils/helpers'

import { get, groupBy } from 'lodash'
export const getLandsInfo = () => {
  return lands
}

export const getLandById = id => {
  const landsInfo = getLandsInfo()
  const land = ((landsInfo || {}).features || []).find(
    f => (f.properties || {}).id === id,
  )
  return land
}

export const getCoords = land => {
  const coords = get(land, 'geometry.coordinates[0][0]')
  const _coordinates = (coords || []).map(c => {
    return {
      northing: c[0],
      easting: c[1],
    }
  })
  return _coordinates
}

export const getAllAreas = () => {
  const landsInfo = getLandsInfo()
  const fs = landsInfo.features
  const areas = fs.map(area => {
    return {
      ...area.properties,
      title: area.properties.id,
      coords: getCoords(area),
      id: area.properties.id,
      areaPopulation: randomIntFromInterval(10000, 30000),
    }
  })
  return areas
}

export const formatResults = (r = []) => {
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
