/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo, Fragment } from 'react'
import { SVGIcon } from 'react-md'
import { flatMap, get } from 'lodash'
import { Collapse, Button, message, Tooltip, Popover, Checkbox } from 'antd'
import { Icon } from '@ant-design/compatible'
import PropTypes from 'prop-types'
import {
  getXMLCoords,
  formatLandResults,
  randomIntFromInterval,
  formatInputCoordinates,
} from 'libs/utils/helpers'
import buffer from '@turf/buffer'
import wkt from 'terraformer-wkt-parser'
import InputView from './input-view'
import UploadImage from './upload-image'
import UploadFile from './upload-file'
import ResultsView from 'components/common/verification-components/results-view'
import Loader from 'components/ui-kit/loader'
import {
  transformPoints,
  checkIntersections,
  getImageData,
  getDXFData,
} from 'libs/utils/gis-apis'
import i18n from 'i18n-js'
import l from 'libs/langs/keys'
import AreaList from 'components/common/verification-components/area-list'

import coordImg from './images/coordinate.svg'
import uploadImg from './images/upload-image.svg'
import UploadCloudImg from './images/cloud-upload-outline.svg'

import { v4 as uuidv4 } from 'uuid'

import './styles.scss'

const { Panel } = Collapse

const NurseryPermit = props => {
  const {
    layers,
    drawingDataFromMap,
    addROWLayer,
    onInputModeChange,
    verificationMode,
    selectedDrawingId,
  } = props
  const [expandedViews, setExpandedViews] = useState([])
  const [loading, setLoading] = useState({ status: false, text: '' })
  const [results, setResults] = useState([])
  const [areasDetails, setAreasDetails] = useState([]) // [{name: 'Shape1', coords: [], coordsCode: ''}]
  const [uploadedImage, setUploadedImage] = useState('')
  const [uploadedFile, setUploadedFile] = useState('')
  const [expandedAreasIndices, setExpandedAreasIndices] = useState([0])
  const [toDelIndex, setToDelIndex] = useState(-1)
  const [inputMode, setInputMode] = useState('') // 'map' || 'manual'
  const [showAreaWiseResults, setShowAreaWiseResults] = useState(true)
  const [showRejectedOnly, setShowRejectedOnly] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedArea, setSelectedArea] = useState({})

  useEffect(() => {
    if (selectedDrawingId) {
      const index = areasDetails.findIndex(a => a.id === selectedDrawingId)
      if (index > -1) {
        setExpandedAreasIndices([index])
      }
    }
  }, [selectedDrawingId])

  useEffect(() => {
    uploadedFile && handleFileUploadComplete(uploadedFile)
  }, [uploadedFile])

  useEffect(() => {
    uploadedImage && recognizeText(uploadedImage)
  }, [uploadedImage])

  useEffect(() => {
    if (inputMode === 'map') {
      formatMapToCoordinates(drawingDataFromMap)
      setExpandedViews(['input-view'])
    }
  }, [drawingDataFromMap])

  const inputModeBtns = [
    {
      icon: UploadCloudImg,
      name: 'file',
      title: `${i18n.t(l.upload_dxf_file)}`,
      onClick: () => {
        onInputModeChange('file')
        setInputMode('file')
        setExpandedViews(['upload-file-view'])
      },
    },
    {
      icon: uploadImg,
      name: 'image',
      title: `${i18n.t(l.upload_kroki)}`,
      onClick: () => {
        onInputModeChange('imgae')
        setInputMode('image')
        setExpandedViews(['upload-image-view'])
      },
    },
    {
      icon: coordImg,
      name: 'map',
      title: `${i18n.t(l.draw_on_map)}`,
      onClick: () => {
        message.info(`${i18n.t(l.draw_shape_on_map)}`)
        onInputModeChange('map')
        setInputMode('map')
        setExpandedViews(['input-view'])
      },
    },
    // {
    //   icon: drawImg,
    //   name: 'manual',
    //   title: 'Input Coordinates',
    //   onClick: () => {
    //     if (inputMode !== 'manual') {
    //       setAreasDetails([
    //         ...areasDetails,
    //         {
    //           id: `${uuidv4()}`,
    //           selected: true,
    //           coords: [],
    //           coordsCode: 32640,
    //           areaSource: 'Manual Entry',
    //         },
    //       ])
    //       setExpandedAreasIndices([areasDetails.length])
    //       onInputModeChange('manual')
    //       setInputMode('manual')
    //     }

    //     setExpandedViews(['input-view'])
    //   },
    // },
  ]

  const recognizeText = image => {
    if (!image) return
    try {
      const {
        src,
        details: { name },
      } = image
      setLoading({ status: true, text: `${i18n.t(l.loading_info)}` })
      getImageData(src)
        .then(response => {
          if (response && response.IsErroredOnProcessing) {
            message.info(response.ErrorDetails || 'Error while reading image')
          } else if (response && response.ParsedResults) {
            const text = get(response, 'ParsedResults.0.TextOverlay.Lines')
            const formatedText = formatInputCoordinates(text)
            const _coords = formatCoordinatesToTable(formatedText)

            setAreasDetails([
              ...areasDetails,
              {
                id: `${uuidv4()}`,
                selected: true,
                coords: _coords,
                coordsCode: 32640,
                areaSource: `Krooki (${name})`,
                areaPopulation: randomIntFromInterval(10000, 30000),
              },
            ])
            setExpandedAreasIndices([areasDetails.length])
            inputMode === 'image' && drawCoordsToMap(_coords, 32640)
            setExpandedViews(['input-view'])
          }
        })
        .catch(e => {
          let msg = 'Error while reading image'
          msg = e && e.message
          message.info(msg)
        })
        .finally(() => setLoading({ status: false, text: '' }))
    } catch (e) {}
  }

  const formatCoordinatesToTable = list => {
    return list.map((p, index) => ({
      ...p,
      key: `${index + 1}`,
      northing: +p.northing,
      easting: +p.easting,
    }))
  }

  const formatCoordinatesToMap = list => {
    let coords = list.map((list, index) => ({
      id: `${index + 1}`,
      longitude: +list.longitude,
      latitude: +list.latitude,
    }))
    coords = coords.concat(coords[0])
    return coords
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

  const focusAreaOnMap = async (_coords, _coordsCode) => {
    if (_coords.length < 2) {
      return
    }
    let points = []
    if (_coordsCode !== 4326) {
      const res = await transformPoints({
        source: { code: _coordsCode, authority: 'epsg' },
        target: { code: 4326, authority: 'epsg' },
        points: _coords.map(({ northing, easting }) => ({
          y: +northing,
          x: +easting,
        })),
      })
      points = res.map(({ x, y }) => ({
        longitude: x,
        latitude: y,
        plotType: 'Residential',
        coordinateSystem: 'New Projection - WGS 84 Zone 40',
      }))
    } else {
      points = _coords.map(({ northing, easting }) => ({
        longitude: +easting,
        latitude: +northing,
      }))
    }

    const rowLayer = {
      id: 'plot-id',
      displayName: 'Plot Block-Temp',
      type: 'polygon',
      visible: true,
      items: [
        {
          name: 'PlotBlock',
          id: 'pid1',
          color: '0,148,255,0.2',
          coordinates: formatCoordinatesToMap(points),
        },
      ],
    }
    addROWLayer && addROWLayer(rowLayer)
  }

  const drawCoordsToMap = async (_coords, _coordsCode) => {
    if (_coords.length < 2) {
      return
    }
    let points = []
    if (_coordsCode !== 4326) {
      const res = await transformPoints({
        source: { code: _coordsCode, authority: 'epsg' },
        target: { code: 4326, authority: 'epsg' },
        points: _coords.map(({ northing, easting }) => ({
          y: +northing,
          x: +easting,
        })),
      })
      points = res.map(({ x, y }) => ({
        longitude: x,
        latitude: y,
        plotType: 'Residential',
        coordinateSystem: 'New Projection - WGS 84 Zone 40',
      }))
    } else {
      points = _coords.map(({ northing, easting }) => ({
        longitude: +easting,
        latitude: +northing,
      }))
    }

    const rowLayer = {
      id: 'plot-id',
      displayName: 'Plot Block',
      type: 'polygon',
      visible: true,
      items: [
        {
          name: 'PlotBlock',
          id: 'pid1',
          color: '0,148,255,0.2',
          coordinates: formatCoordinatesToMap(points),
        },
      ],
    }
    addROWLayer && addROWLayer(rowLayer)
  }

  const handleValidate = async area => {
    try {
      setLoading({
        status: true,
        text: `${i18n.t(l.loading_info)}`,
      })

      const poly = makePolygon(area.coords)
      var polygonJSON = wkt.parse(poly)

      var bufferedJson = buffer(polygonJSON, 15, { units: 'kilometers' })

      const bufferLandLayer = {
        type: 'geojson',
        id: 'geojson-buff',
        displayName: 'Land Buffer(15KM)',
        items: [
          {
            id: 'temp-buffer',
            color: '255,0,0,0.2',
            geojson: bufferedJson,
          },
        ],
      }

      addROWLayer && addROWLayer(bufferLandLayer)
      // const coordsToCheck = getBufferCoords(bufferedJson)
      // const polygon = makePolygon(coordsToCheck)
      const wktk = wkt
        .convert(bufferedJson.geometry)
        .replace('POLYGON ', 'POLYGON')

      const data = await getAreaValidationResults(wktk)
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

  const getAreaValidationResults = async polygon => {
    // const _promises = layers.map(layer => checkIntersection(layer, polygon))
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
            groupName: layers[i].groupName,
            layerDisplayName: layers[i].displayName,
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
      .map(({ easting, northing }) => `${easting} ${northing}`)
      .join(',')}))`
  }

  const formatMapToCoordinates = (items, drawOnMap) => {
    try {
      let newAreas = []
      items.forEach(({ id, polygon: shapeFromMap }) => {
        const res = shapeFromMap
          .split('((')[1]
          .split('))')[0]
          .split(',')
          .map(line => ({
            plotType: null,
            coordinateSystem: null,
            easting: line.split(' ')[0],
            northing: line.split(' ')[1],
          }))
          .slice(0, length - 1)
        const precisePoints = res.map((r, ind) => ({
          ...r,
          northing: r.northing,
          easting: r.easting,
          key: `${ind + 1}`,
        }))

        const alreadyInd = areasDetails.findIndex(a => a.id === id)
        if (alreadyInd === -1) {
          const area = {
            id: id || `${uuidv4()}`,
            selected: true,
            coords: precisePoints,
            coordsCode: 4326,
            areaSource: 'Map',
            areaPopulation: randomIntFromInterval(10000, 30000),
          }
          newAreas.push(area)
        } else {
          areasDetails.splice(alreadyInd, 1, {
            ...areasDetails[alreadyInd],
            coords: precisePoints,
          })
        }
      })

      setAreasDetails([...areasDetails, ...newAreas])
      setExpandedAreasIndices([newAreas.length - 1])

      if (drawOnMap) {
        ;[...areasDetails, ...newAreas].map(area => {
          drawCoordsToMap(area.coords, area.coordsCode)
        })
      }
    } catch (e) {}
  }

  const handleFileUploadComplete = async uploadedFile => {
    try {
      const {
        fileData,
        details: { name },
      } = uploadedFile
      setLoading({ status: true, text: `${i18n.t(l.loading_info)}` })
      const res = await getDXFData(fileData)
      const str = await res.text()
      const data = await new window.DOMParser().parseFromString(str, 'text/xml')
      const coords = getXMLCoords(data)
      setAreasDetails([
        ...areasDetails,
        {
          id: `${uuidv4()}`,
          selected: true,
          coords: coords || [],
          coordsCode: 4326,
          areaSource: `File (${name})`,
          areaPopulation: randomIntFromInterval(10000, 30000),
        },
      ])
      setExpandedAreasIndices([areasDetails.length])
    } catch (e) {
      message.info('Error while reading file...')
    } finally {
      setLoading({ status: false, text: '' })
    }
  }

  const updateAreaCoordCode = (code, areaIndex) => {
    const _areasDetails = [...areasDetails]
    const area = _areasDetails[areaIndex]
    const updatedArea = { ...area, coordsCode: code }
    _areasDetails.splice(areaIndex, 1, updatedArea)
    setAreasDetails(_areasDetails)
  }

  const updateAreaCoords = (coords, areaIndex) => {
    const _areasDetails = [...areasDetails]
    const area = _areasDetails[areaIndex]
    const updatedArea = { ...area, coords }
    _areasDetails.splice(areaIndex, 1, updatedArea)
    setAreasDetails(_areasDetails)
  }

  const handleAreaDelete = areaIndex => {
    let _areas = [...areasDetails]
    _areas.splice(areaIndex, 1)
    setAreasDetails(_areas)
  }

  const toggleAreaSelection = (e, areaIndex) => {
    const _areasDetails = [...areasDetails]
    const area = _areasDetails[areaIndex]
    const updatedArea = { ...area, selected: e.target.checked }
    _areasDetails.splice(areaIndex, 1, updatedArea)
    setAreasDetails(_areasDetails)
  }

  const renderAreaExtraActions = (area, index) => {
    return (
      <div className="flex-center-center-g area-extra-actions">
        <Tooltip title={toDelIndex === index ? '' : 'Delete Area'}>
          <Popover
            placement="right"
            visible={toDelIndex === index}
            onVisibleChange={() => {
              setToDelIndex(-1)
            }}
            content={
              <div className="flex-col-center-between">
                <h6> Are You Sure? </h6>
                <div className="flex-center-center-g">
                  <Button
                    style={{ width: '40%', marginRight: '10px' }}
                    onClick={e => {
                      e.stopPropagation()
                      handleAreaDelete(index)
                      setToDelIndex(-1)
                    }}
                  >
                    Yes
                  </Button>
                  <Button
                    style={{ width: '40%' }}
                    onClick={e => {
                      e.stopPropagation()
                      setToDelIndex(-1)
                    }}
                  >
                    No
                  </Button>
                </div>
              </div>
            }
            title="Delete"
            trigger="click"
          >
            <Icon
              style={{ width: '30px' }}
              type="delete"
              onClick={e => {
                e.stopPropagation()
                setToDelIndex(index)
              }}
            />{' '}
          </Popover>
        </Tooltip>
        <Tooltip title={'Show Area on Map'}>
          <Icon
            type="eye"
            onClick={e => {
              e.stopPropagation()
              focusAreaOnMap(area.coords, area.coordsCode)
            }}
          />
        </Tooltip>
      </div>
    )
  }

  const renderInputViewForAreas = () => {
    return (
      <Collapse
        bordered={false}
        expandIconPosition={'right'}
        expandIcon={({ isActive }) => (
          <Icon type="caret-right" rotate={isActive ? 90 : 0} />
        )}
        activeKey={expandedAreasIndices}
        onChange={setExpandedAreasIndices}
        className="row-collapse areas-details-collapse"
      >
        {areasDetails.map((area, index) => {
          return (
            <Panel
              header={
                <span onClick={e => e.stopPropagation()}>
                  <Checkbox
                    style={{ marginRight: '7px' }}
                    onChange={e => {
                      e.stopPropagation()
                      toggleAreaSelection(e, index)
                    }}
                    checked={area.selected}
                  ></Checkbox>
                  <Tooltip title={`Source: ${area.areaSource}`}>
                    {`${i18n.t(l.area)} #${index + 1}`}
                  </Tooltip>
                </span>
              }
              key={index}
              extra={renderAreaExtraActions(area, index)}
              className="row-collapse-panel areas-details-panel"
            >
              <InputView
                setCoordCode={code => {
                  updateAreaCoordCode(code, index)
                }}
                updatePoints={coords => {
                  updateAreaCoords(coords, index)
                }}
                points={area.coords}
                selectedCoordCode={area.coordsCode}
              />
            </Panel>
          )
        })}
      </Collapse>
    )
  }

  const renderResultOptionsPopover = () => {
    return (
      <Popover
        placement="leftTop"
        title="Results Options"
        content={
          <div className="results-options-popover">
            <Checkbox
              onChange={event => {
                setShowAreaWiseResults(event.target.checked)
              }}
              onClick={event => event.stopPropagation()}
              checked={showAreaWiseResults}
            >
              Show Area Wise Result
            </Checkbox>
            <Checkbox
              style={{ marginTop: '12px' }}
              onClick={event => event.stopPropagation()}
              onChange={event => setShowRejectedOnly(event.target.checked)}
              checked={showRejectedOnly}
            >
              Show Rejected Only
            </Checkbox>
          </div>
        }
        trigger="click"
      >
        <Tooltip title="Result Options">
          <Icon
            type="setting"
            onClick={event => event.stopPropagation()}
            style={{ marginRight: '7px' }}
          />
        </Tooltip>
      </Popover>
    )
  }
  const renderViews = () => {
    return (
      <Collapse
        bordered={false}
        activeKey={expandedViews}
        expandIconPosition={'right'}
        expandIcon={({ isActive }) => (
          <Icon type="caret-right" rotate={isActive ? 90 : 0} />
        )}
        onChange={setExpandedViews}
        className="row-collapse"
      >
        {inputMode === 'file' && (
          <Panel
            header={`${i18n.t(l.upload_file)}`}
            key="upload-file-view"
            className="row-collapse-panel"
          >
            <UploadFile onUploadComplete={setUploadedFile} />
          </Panel>
        )}
        {inputMode === 'image' && (
          <Panel
            header={`${i18n.t(l.upload_image)}`}
            key="upload-image-view"
            className="row-collapse-panel"
          >
            <UploadImage onUploadComplete={setUploadedImage} />
          </Panel>
        )}
        <Panel
          header={`${i18n.t(l.areas_details)}`}
          key="input-view"
          className="row-collapse-panel"
        >
          {/* {renderInputViewForAreas()} */}
          <AreaList
            areasDetails={areasDetails.map((area, index) => {
              return {
                ...area,
                title: `${i18n.t(l.area)}# ${index + 1}`,
              }
            })}
            handleValidate={handleValidate}
          />
        </Panel>
        {/* {!!(results || []).length && (
          <Panel
            header="Validation Results"
            key="results-view"
            className="row-collapse-panel"
            extra={renderResultOptionsPopover()}
          >
            {renderResults()}
          </Panel>
        )} */}
      </Collapse>
    )
  }

  const ifAreaIntersect = layers => {
    return layers.find(item => item.intersectionPoints)
  }

  const filterRejectedResults = results => {
    return results.map(m => ({
      name: m.name,
      data: m.data.filter(f => f.intersectionPoints),
    }))
  }
  const showExportBtn = false
  // const showExportBtn =
  //   Object.keys(results).length > 0 &&
  //   expandedViews.indexOf('results-view') > -1

  const renderInputModeButtons = () => {
    return (
      <div className="modes-containers">
        {inputModeBtns.map((m, ind) => (
          <Tooltip key={ind} title={m.title}>
            <div
              style={{
                background: inputMode === m.name ? '#bfd5f8' : '#f8f8f8',
              }}
              className="icon"
              onClick={() => m.onClick()}
            >
              <img src={m.icon} />
            </div>
          </Tooltip>
        ))}
      </div>
    )
  }

  const renderHeader = () => {
    return (
      <div className="row-header">
        <div className="title">{`${i18n.t(l.nursery_permit)}`}</div>
        {renderInputModeButtons()}
      </div>
    )
  }

  return (
    <main id="nursery-permit">
      {inputMode ? (
        showResults && (results || []).length > 0 ? (
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
          <>
            {renderHeader()}
            <section className="views-section">{renderViews()}</section>
          </>
        )
      ) : (
        renderHeader()
      )}
      {/* {inputMode && renderMainFooter()} */}
      {loading.status && <Loader text={loading.text} />}
    </main>
  )
}

NurseryPermit.propTypes = {
  layers: PropTypes.array,
  addROWLayer: PropTypes.func,
  drawingDataFromMap: PropTypes.object,
  onInputModeChange: PropTypes.func,
  selectedDrawingId: PropTypes.string,
  verificationMode: PropTypes.string,
}

export default NurseryPermit
