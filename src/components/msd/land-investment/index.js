/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { getLandsInfo, getAllAreas } from './helper'
import {
  formatLandResults,
  getBufferCoords,
  getAccessToken,
} from 'libs/utils/helpers'
import PropTypes from 'prop-types'
import Loader from 'components/ui-kit/loader'
import AreaList from 'components/msd/verification-components/area-list'
import ResultsView from 'components/msd/verification-components/results-view'
import { checkIntersections } from 'libs/utils/gis-apis'
import buffer from '@turf/buffer'
import i18n from 'i18n-js'
import l from 'libs/langs/keys'
import { flatMap, get } from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import { Icon } from '@ant-design/compatible'
import InputView from 'components/msd/input-view'

import {
  LeftOutlined,
  RightOutlined,
  BarChartOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import { Collapse, Button, message } from 'antd'

import './styles.scss'
const { Panel } = Collapse

const LandInvestment = props => {
  const {
    layers,
    drawingDataFromMap,
    addROWLayer,
    selectedDrawingId,
    verificationMode,
    removeROWLayer,
  } = props

  const [results, setResults] = useState([])
  const [areasDetails, setAreasDetails] = useState([]) // [{name: 'Shape1', coords: [], coordsCode: ''}]
  const [selectedArea, setSelectedArea] = useState({})
  const [pdfSrc, setPdfSrc] = useState('')
  const [mode, setMode] = useState('list')
  const [resultRadius, setResultRadius] = useState(15)

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
      setSelectedArea(land)
      setMode('details')
      focusOnMap(land)
      // handleValidate(land)
    }
  }, [selectedDrawingId])

  useEffect(() => {
    Object.keys(selectedArea).length > 0 && handleValidate(selectedArea)
  }, [resultRadius])

  const focusOnMap = land => {
    const omanland = getLandsInfo()

    var bufferedJson = buffer(omanland, 0.0001, { units: 'kilometers' })

    const focusedBuff = bufferedJson.features.find(
      f => f.properties.id === land.id,
    )

    const bufferLandLayer = {
      type: 'geojson',
      id: 'geojson-buff',
      displayName: 'Land Selection',
      items: [
        {
          id: 'temp-buffer',
          color: '255,255,255,0.3',
          lineColor: '0,253,255,1',
          geojson: focusedBuff,
        },
      ],
    }

    addROWLayer && addROWLayer(bufferLandLayer)
  }

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
      message.loading({
        content: `Validating Results...`,
        duration: 30,
        key: 'results',
      })
      const omanland = getLandsInfo()

      var bufferedJson = buffer(omanland, resultRadius, { units: 'kilometers' })

      const focusedBuff = bufferedJson.features.find(
        f => f.properties.id === area.id,
      )

      const bufferLandLayer = {
        type: 'geojson',
        id: 'geojson-buff',
        displayName: `Land Buffer(${resultRadius}KM)`,
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
      setMode('results')
    } finally {
      message.success({
        content: `Results Loaded`,
        duration: 2,
        key: 'results',
      })
    }
  }
  const renderAreaItemHeader = () => {
    return (
      <div className="area-item-header">
        <span
          onClick={() => {
            setMode('list')
            const bufferLandLayer = {
              type: 'geojson',
              id: 'geojson-buff',
              displayName: `Land Buffer(${resultRadius}KM)`,
              items: [],
            }
            addROWLayer && addROWLayer(bufferLandLayer)
            removeROWLayer('geojson-buff')
          }}
          className="back-icon"
        >
          {localStorage.language === 'ar' ? (
            <RightOutlined />
          ) : (
            <LeftOutlined />
          )}
        </span>
        <div
          className="area-icon"
          style={{
            backgroundColor: 'royalblue',
          }}
        >
          <BarChartOutlined />
        </div>
        {selectedArea.title}
      </div>
    )
  }

  const renderInputViewForAreas = () => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          paddingLeft: '15px',
          flex: '1',
        }}
      >
        {renderAreaItemHeader()}

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '12px 16px',
            marginBottom: '5px',
            borderRadius: '4px',
            background: '#fafafa',
          }}
        >
          <h4
            style={{
              marginBottom: 0,
              marginRight: '7px',
            }}
          >
            Land Use:{' '}
          </h4>
          {selectedArea.landUse || 'Not In Use'}
        </div>
        <Collapse
          bordered={false}
          expandIconPosition={'right'}
          expandIcon={({ isActive }) => (
            <Icon type="caret-right" rotate={isActive ? 90 : 0} />
          )}
          defaultActiveKey={['1']}
          // onChange={setExpandedAreasIndices}
          className="row-collapse areas-details-collapse"
        >
          <Panel
            key={'1'}
            // header={'Coordinates'}

            header={
              <h4
                style={{
                  marginBottom: 0,
                  marginRight: '7px',
                  display: 'inline',
                }}
              >
                Coordinates
              </h4>
            }
            // extra={genExtra()}
            className="row-collapse-panel areas-details-panel"
          >
            <InputView
              setCoordCode={code => {
                // updateAreaCoordCode(code, index)
              }}
              updatePoints={coords => {
                // updateAreaCoords(coords, index)
              }}
              points={selectedArea.coords}
              selectedCoordCode={selectedArea.coordsCode}
            />
          </Panel>
        </Collapse>
      </div>
    )
  }

  const updateResultRadius = radius => {
    setResultRadius(radius)
  }

  const renderInputViewFooter = () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%',
        padding: '10px 12px',
        borderTop: '1px dashed #ddd',
      }}
    >
      <Button
        type="primary"
        onClick={() => {
          handleValidate(selectedArea)
        }}
      >
        Validate Investment
      </Button>
    </div>
  )

  return (
    <main id="land-investment">
      <div className="row-header">
        <div className="title">
          {mode === 'list' && 'Ministry of Social Development Lands'}
          {mode === 'details' && 'Land Details'}
          {mode === 'results' && 'Investment Validation Results'}
        </div>

        {mode === 'details' && (
          <Button
            icon={<EyeOutlined />}
            type="secondary"
            onClick={event => {
              event.stopPropagation()
              const generatedUrl = `/spatial/api/v1/housing/file/${
                selectedArea.title
              }?access_token=${getAccessToken()}`

              window.open(
                `/static/web/viewer.html?file=${encodeURIComponent(
                  generatedUrl,
                )}`,
                '_blank',
                'width=800,height=600,resizable,scrollbars=yes,status=1',
              )
            }}
          >
            Preview File
          </Button>
        )}
      </div>
      {mode === 'details' && renderInputViewForAreas()}
      {mode === 'results' && (
        <ResultsView
          results={formatLandResults(results)}
          selectIntersection={showIntersectionOnMap}
          panelTitle={selectedArea.title}
          areaPopulation={selectedArea.areaPopulation}
          type={verificationMode}
          resultRadius={resultRadius}
          updateResultRadius={value => updateResultRadius(value)}
          onGoBack={() => {
            setMode('details')
            // setSelectedArea({})
            setResults([])
          }}
        />
      )}
      {mode === 'list' && (
        <AreaList
          areasDetails={areasDetails}
          handleValidate={area => {
            setMode('details')
            setSelectedArea(area)
            focusOnMap(area)
          }}
        />
      )}
      {mode === 'details' && renderInputViewFooter()}
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
  removeROWLayer: PropTypes.func,
}

export default LandInvestment
