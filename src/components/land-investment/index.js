/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { getLandsInfo, getAllAreas } from './helper'
import { formatLandResults, getBufferCoords } from 'libs/utils/helpers'

import PropTypes from 'prop-types'
import Loader from 'components/ui-kit/loader'
import AreaList from 'components/common/verification-components/area-list'
import ResultsView from 'components/common/verification-components/results-view'
import { checkIntersections } from 'libs/utils/gis-apis'
import buffer from '@turf/buffer'
import i18n from 'i18n-js'
import l from 'libs/langs/keys'
import { flatMap, get } from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import './styles.scss'

const LandInvestment = props => {
  const {
    layers,
    drawingDataFromMap,
    addROWLayer,
    selectedDrawingId,
    verificationMode,
  } = props

  const [loading, setLoading] = useState({ status: false, text: '' })
  const [results, setResults] = useState([])
  const [areasDetails, setAreasDetails] = useState([]) // [{name: 'Shape1', coords: [], coordsCode: ''}]
  const [selectedArea, setSelectedArea] = useState({})
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    if (verificationMode === 'land_investment') {
      const lands = getLandsInfo()
      drawLandsOnMap(lands)
      setAreasDetails(getAllAreas())
    }
  }, [verificationMode])

  useEffect(() => {
    if (selectedDrawingId && selectedDrawingId.id) {
      const land = areasDetails.find(a => a.id === selectedDrawingId.id)
      handleValidate(land)
    }
  }, [selectedDrawingId])

  const showIntersectionOnMap = point => {
    try {
      const rowLayer = {
        type: 'xyLayer',
        id: 'newID23232',
        displayName: 'Row Intersection Point',
        lyrColor: '#FF4500',
        items: [
          {
            id: `${uuidv4()}`,
            longitude: +point.x,
            latitude: +point.y,
          },
        ],
      }
      addROWLayer && addROWLayer(rowLayer)
    } catch (e) {}
  }

  const drawLandsOnMap = omanland => {
    const landLayer = {
      type: 'geojson',
      id: 'geojson-id1223144433',
      displayName: 'Lands for Investment',
      items: [
        {
          id: 'pid152',
          color: '49,47,175,0.8',
          geojson: omanland,
        },
      ],
    }
    addROWLayer && addROWLayer(landLayer)
  }

  const getAreaValidationResults = async polygon => {
    const _promises = layers
      .filter(l => !!l.wfsUrl)
      .map(layer => checkIntersection(layer, polygon))
    const resolvedPromises = await Promise.all(_promises)
    let unformatedRes = flatMap(
      resolvedPromises.map((layerResults, i) => {
        return layerResults.map(r => {
          return {
            ...r,
            layerName: layers[i].lyrName,
            layerDisplayName: layers[i].displayName,
            groupName: layers[i].groupName,
            wfsUrl: layers[i].wfsUrl,
          }
        })
      }),
    )

    return unformatedRes
  }

  const checkIntersection = async (layer, coordsPolygon) => {
    if (layer) {
      const params = {
        wfsUrl: layer.url,
        layerName: layer.lyrName,
        crsCode: 4326,
        filter: `INTERSECTS(the_geom, SRID=4326;${coordsPolygon})`,
      }
      try {
        const res = await checkIntersections(params)
        if (((res || {}).features || []).length === 0) {
          return [{}]
        }
        let data = flatMap(
          get(res, 'features', []).map(feature => {
            if (feature.geometry && feature.geometry.type === 'Point') {
              const coordinates = get(feature, 'geometry.coordinates', [])
              return {
                intersectionPoints: [
                  {
                    x: coordinates[0],
                    y: coordinates[1],
                    itemName: feature.properties[layer.featureAttribute],
                  },
                ],
              }
            } else {
              return {
                intersectionPoints: get(
                  feature,
                  'geometry.coordinates.0.0',
                  [],
                ).map(coordinates => ({
                  x: coordinates[0],
                  y: coordinates[1],
                  itemName: feature.properties[layer.featureAttribute],
                })),
              }
            }
          }),
          e => e,
        )
        return data
      } catch (e) {
        return [{}]
      }
    }
  }

  const makePolygon = list => {
    return `POLYGON((${(list && list.length ? list.concat(list[0]) : [])
      .map(({ latitude, longitude }) => `${latitude} ${longitude}`)
      .join(',')}))`
  }

  const handleValidate = async area => {
    try {
      setLoading({
        status: true,
        text: `${i18n.t(l.loading_info)}`,
      })
      const omanland = getLandsInfo()

      var bufferedJson = buffer(omanland, 15, { units: 'kilometers' })

      const focusedBuff = bufferedJson.features.find(
        f => f.properties.id === area.id,
      )

      console.log({ focusedBuff })

      const bufferLandLayer = {
        type: 'geojson',
        id: 'geojson-buff',
        displayName: 'Land Buffer(15KM)',
        items: [
          {
            id: 'temp-buffer',
            color: '255,0,0,0.2',
            geojson: focusedBuff,
          },
        ],
      }

      addROWLayer && addROWLayer(bufferLandLayer)
      const coordsToCheck = getBufferCoords(focusedBuff)
      const polygon = makePolygon(coordsToCheck)
      const data = await getAreaValidationResults(polygon)
      setResults(data)
      setSelectedArea(area)
      setShowResults(true)
    } finally {
      setLoading({
        status: false,
        text: '',
      })
    }
  }

  return (
    <main id="land-investment">
      {!showResults && (
        <div className="row-header">
          <div className="title">{`${i18n.t(l.land_investment)}`}</div>
        </div>
      )}
      {loading.status && <Loader text={loading.text} />}
      {showResults ? (
        <ResultsView
          results={formatLandResults(results)}
          selectIntersection={showIntersectionOnMap}
          panelTitle={selectedArea.title}
          areaPopulation={selectedArea.areaPopulation}
          type={verificationMode}
          onGoBack={() => {
            setShowResults(false)
            setSelectedArea({})
            setResults([])
          }}
        />
      ) : (
        <AreaList areasDetails={areasDetails} handleValidate={handleValidate} />
      )}
    </main>
  )
}

LandInvestment.propTypes = {
  layers: PropTypes.array,
  addROWLayer: PropTypes.func,
  drawingDataFromMap: PropTypes.object,
  onInputModeChange: PropTypes.func,
  selectedDrawingId: PropTypes.string,
  verificationMode: PropTypes.string,
}

export default LandInvestment
