import React, { useState, useEffect } from 'react'
// import LayersIconView from 'components/map-layers/layers-icon-view'
import LayersTableView from 'components/map-layers/layers-table-view'

import { getMapLayers } from 'libs/utils/gis-apis/get-map-layers-api'
import { message } from 'antd'

import { sortBy } from 'lodash'

import i18n from 'i18n-js'
import l from 'libs/langs/keys'

import './styles.scss'

import PropTypes from 'prop-types'

const MapLayers = props => {
  const { history } = props
  const [loading, setLoading] = useState(false)
  const [mapLayers, setMapLayers] = useState([])

  const fetchMapLayers = async () => {
    setLoading(true)
    try {
      const { data } = await getMapLayers()
      if (data) {
        const sortedLayers = sortBy(data || [], 'createdDate').reverse()
        setLoading(false)
        setMapLayers(sortedLayers)
      } else {
        setLoading(false)
        setMapLayers([])
      }
    } catch (e) {
      message.error(`${i18n.t(l.retrieve_error)}`)
      setLoading(false)
      setMapLayers([])
    }
  }

  useEffect(() => {
    fetchMapLayers()
  }, [])

  return (
    <main className="layers-main-page">
      <LayersTableView
        loading={loading}
        history={history}
        mapLayers={mapLayers}
      />
    </main>
  )
}

MapLayers.propTypes = {
  history: PropTypes.object,
}

export default MapLayers
