import { groupBy } from 'lodash'

export const formatResults = (results = []) => {
  const formatedResults = {}
  const resByGroups = groupBy(results, 'groupName')
  Object.keys(resByGroups).forEach(groupName => {
    const ress = resByGroups[groupName]
    const groupLayers = groupBy(ress, 'layerName')
    formatedResults[groupName] = groupLayers
  })
  return formatedResults
}
