/* eslint-disable react/prop-types */
import React from 'react'
import { cls } from 'reactutils/lib/utils'

import MapCard from 'components/map-card'

import './style.scss'

const MapDetailsRightSide = ({ className, similarMapList, history }) => {
  const renderSimilarMap = () => {
    return (
      similarMapList &&
      similarMapList.map((map, index) => {
        const count = (index + 1) % 5

        return (
          <MapCard
            {...map}
            type={map._type}
            mapTitle={map.name}
            creationDate={map.createdDate}
            mapImage={map.image || require(`../images/Map${count}.png`)}
            key={index}
            className={'md-cell md-cell--12'}
            onClick={() => {
              map._type === 'intrastructure'
                ? history.push(`/infrastructure/${map.id}`)
                : history.push(`/gis-map/${map.id}`)
            }}
            onEdit={() => {}}
          />
        )
      })
    )
  }
  return (
    <div className={cls('map-details-right-side md-paper--1', className)}>
      <h2>Similar Map</h2>
      <div className="map-details-right-side-content">{renderSimilarMap()}</div>
    </div>
  )
}
export default MapDetailsRightSide
