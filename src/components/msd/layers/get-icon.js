export const getIconByLabel = (label = '') => {
  try {
    const iconTypes = [
      'private',
      'government',
      'hospital',
      'bank',
      'gas',
      'grocery',
      'groceries',
      'hotel',
      'incident',
      'innovation',
      'job',
      'people',
      'post office',
      'post_office',
      'project',
      'resturant',
      '2D seismic',
      '3D seismic',
      'administrative',
      'al khuwair',
      'basin',
      'blue',
      'book',
      'chart',
      'group',
      'geological',
      'apartment',
      'layer',
      'permit',
      'petrol',
      'pipeline',
      'powerline',
      'tourism',
      'travel',
      'water',
      'resturant',
      'well',
      'guard',
      'correctional',
      'embassies',
      'mission',
      'police',
    ]
    const type = iconTypes.find(
      a => label && label.toLowerCase().includes(a.toLowerCase()),
    )
    switch (type) {
      case 'private':
        return require('./images/private_school_pin.svg')
      case 'government':
        return require('./images/government_school_pin.svg')
      case 'hospital':
        return require('./images/hospitals.svg')
      case 'bank':
        return require('./images/banks.svg')
      case 'gas':
        return require('./images/wells_card.svg')
      case 'gas_stations':
        return require('./images/gas_stations.svg')
      case 'grocery':
        return require('./images/groceries.svg')
      case 'groceries':
        return require('./images/groceries.svg')
      case 'hotel':
        return require('./images/hotels_pin.svg')
      case 'incident':
        return require('./images/incidents.svg')
      case 'innovation':
        return require('./images/innovation.svg')
      case 'job':
        return require('./images/jobs.svg')
      case 'people':
        return require('./images/people.svg')
      case 'permit':
        return require('./images/permit.svg')
      case 'post office':
        return require('./images/post_offices.svg')
      case 'post_office':
        return require('./images/post_offices.svg')
      case 'project':
        return require('./images/projects.svg')
      case 'restaurant':
        return require('./images/restaurants_pin.svg')
      case 'resturant':
        return require('./images/restaurants_pin.svg')
      case '2D seismic':
        return require('./images/2d_seismic.svg')
      case '3D seismic':
        return require('./images/3d_seismic.svg')
      case 'administrative':
        return require('./images/administrative.svg')
      case 'al khuwair':
        return require('./images/al_khuwair.svg')
      case 'blue':
        return require('./images/blue_book.svg')
      case 'book':
        return require('./images/blue_book.svg')
      case 'chart':
        return require('./images/chart_group.svg')
      case 'group':
        return require('./images/chart_group.svg')
      case 'geological':
        return require('./images/geological_units.svg')
      case 'apartment':
        return require('./images/hotel_apartments.svg')
      case 'layer':
        return require('./images/layers.svg')
      case 'petrol':
        return require('./images/petroleum_fields.svg')
      case 'pipeline':
        return require('./images/pipelines.svg')
      case 'powerline':
        return require('./images/powerlines.svg')
      case 'tourism':
        return require('./images/tourism_attractions_pin.svg')
      case 'travel':
        return require('./images/travel_agencies_pin.svg')
      case 'water':
        return require('./images/water.svg')
      case 'well':
        return require('./images/wells.svg')
      case 'guard':
        return require('./images/coast_guard.svg')
      case 'correctional':
        return require('./images/correctional_facilities.svg')
      case 'embassies':
        return require('./images/embassies_pin.svg')
      case 'mission':
        return require('./images/international_mission.svg')
      case 'police':
        return require('./images/police_station_pin.svg')
      default:
        return require('./images/layers.svg')
    }
  } catch (e) {
    return require('./images/default-layer.svg')
  }
}
