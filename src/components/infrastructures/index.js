import React from 'react'
import MapCard from 'components/map-card'
import Toolbar from 'components/toolbar'

import PropTypes from 'prop-types'

import { infsList } from './helpers'

const Infs = props => {
  const renderInfsList = () => {
    let newInfsList = infsList

    return (newInfsList || []).map((map, index) => {
      const count = (index + 1) % 5
      return (
        <MapCard
          {...map}
          type={map._type}
          mapTitle={map.name}
          creationDate={map.createdDate}
          mapImage={map.image || require(`./images/Map${count}.png`)}
          key={index}
          className={'md-cell md-cell--3'}
          onClick={() => {
            map._type === 'intrastructure'
              ? props.history.push(`/infrastructure/${map.id}`)
              : props.history.push(`/gis-map/${map.id}`)
          }}
          onEdit={() => {}}
          onViewDetails={() => {}}
        />
      )
    })
  }

  return (
    <>
      <Toolbar {...props} />

      <div className="infs">
        <div className="md-grid">{renderInfsList()}</div>
      </div>
    </>
  )
}

Infs.propTypes = {
  history: PropTypes.object,
}
export default Infs
