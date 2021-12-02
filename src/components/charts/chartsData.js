import { data } from './data'
const { RESIDENT } = data
export const governorateWiseResident = () => {
  let tempData = {}
  RESIDENT.forEach(row => {
    const { Governorate } = row
    if (tempData[Governorate]) {
      tempData = { ...tempData, [Governorate]: [...tempData[Governorate], row] }
    } else {
      tempData = { ...tempData, [Governorate]: [row] }
    }
  })
  return tempData
}
