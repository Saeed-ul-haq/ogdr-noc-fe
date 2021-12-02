/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { getEntityByID } from 'libs/utils/gis-apis/entity'

import NavigateBar from './navigate-bar'
import MapDetailsBody from './map-details-body'
import MapDetailsRightSide from './map-details-right-side'
import Loader from 'components/ui-kit/loader'

import { infsList } from 'components/maps/helpers'

import './styles.scss'

const MapDetails = props => {
  const [loading, setloading] = useState(false)
  const [map, setMap] = useState({})

  const getMap = async () => {
    try {
      setloading(true)
      const mapId = props.match.params.mapId
      const { data = [] } = await getEntityByID({
        entityName: 'entity/Map',
        entityID: mapId,
      })
      setMap(data[0])
      setloading(false)
    } catch (e) {}
  }

  useEffect(() => {
    getMap()
  }, [])
  const navigateToMap = () => {
    try {
      const paramId = props.match.params.mapId
      props.history && props.history.push(`/gis-map/preview/${paramId}`)
    } catch (e) {}
  }

  return (
    <>
      <NavigateBar
        onClickBack={() => {
          props.history.goBack()
        }}
        dashboardName={'Map'}
      />
      <div className="map-details">
        <MapDetailsBody {...props} onClick={navigateToMap} map={map} />
        <MapDetailsRightSide
          similarMapList={infsList || [].slice(0, 3)}
          {...props}
        />
      </div>
      {loading && <Loader text="Loading Map Details..." />}
    </>
  )
}
export default MapDetails
