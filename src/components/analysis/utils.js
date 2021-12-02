import GovtSchool from 'images/svg/school.svg'
import PrivateSchool from 'images/svg/school_private.svg'
import HotelAppart from 'images/svg/hotel_private.svg'
import Hotel from 'images/svg/hotel.svg'
import Resturant from 'images/svg/food.svg'
import Tourism from 'images/svg/travel_vacation.svg'
import Travel from 'images/svg/travel_agency.svg'
import UniversityGovt from 'images/svg/university.svg'
import UniversityPrivate from 'images/svg/university_private.svg'
import Population2017 from 'images/svg/population2017.svg'
import Population2018 from 'images/svg/population2018.svg'
import Population2019 from 'images/svg/population2019.svg'
import Population2020 from 'images/svg/population2020.svg'
export const getIcon = (name = '') => {
  const layerName = name.toLowerCase()
  if (layerName.includes('school') && layerName.includes('private')) {
    return PrivateSchool
  } else if (layerName.includes('school')) {
    return GovtSchool
  } else if (layerName.includes('hotel') && layerName.includes('apartments')) {
    return HotelAppart
  } else if (layerName.includes('hotel')) {
    return Hotel
  } else if (layerName.includes('resturant')) {
    return Resturant
  } else if (layerName.includes('tourism')) {
    return Tourism
  } else if (layerName.includes('travel')) {
    return Travel
  } else if (
    layerName.includes('private') &&
    layerName.includes('university')
  ) {
    return UniversityPrivate
  } else if (layerName.includes('university')) {
    return UniversityGovt
  } else if (layerName.includes('2017')) {
    return Population2017
  } else if (layerName.includes('2018')) {
    return Population2018
  } else if (layerName.includes('2019')) {
    return Population2019
  } else if (layerName.includes('2020')) {
    return Population2020
  }
}
