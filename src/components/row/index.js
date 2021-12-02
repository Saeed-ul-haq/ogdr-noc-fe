/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo, Fragment } from 'react'
import InputView from './input-view'
import ResultsView from './results-view'
import UploadImage from './upload-image'
import UploadFile from './upload-file'
import { formatResults } from './helper'
import { getXMLCoords, formatInputCoordinates } from 'libs/utils/helpers'
import PropTypes from 'prop-types'
import Loader from 'components/ui-kit/loader'
import {
  transformPoints,
  checkIntersections,
  getImageData,
  getDXFData,
} from 'libs/utils/gis-apis'

import i18n from 'i18n-js'
import l from 'libs/langs/keys'

import { Collapse, Button, message, Tooltip, Popover, Checkbox } from 'antd'
import { Icon } from '@ant-design/compatible'
import { flatMap, get, startCase } from 'lodash'
import coordImg from './images/coordinate.svg'
import drawImg from './images/draw.svg'
import uploadImg from './images/upload-image.svg'
import UploadCloudImg from './images/cloud-upload-outline.svg'
import { SVGIcon } from 'react-md'

import { v4 as uuidv4 } from 'uuid'

import './styles.scss'

const { Panel } = Collapse

const RightOfWay = props => {
  const {
    layers,
    drawingDataFromMap,
    addROWLayer,
    onInputModeChange,
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
    {
      icon: drawImg,
      name: 'manual',
      title: `${i18n.t(l.input_coordinate)}`,
      onClick: () => {
        if (inputMode !== 'manual') {
          setAreasDetails([
            ...areasDetails,
            {
              id: `${uuidv4()}`,
              selected: true,
              coords: [],
              coordsCode: 32640,
              areaSource: 'Manual Entry',
            },
          ])
          setExpandedAreasIndices([areasDetails.length])
          onInputModeChange('manual')
          setInputMode('manual')
        }

        setExpandedViews(['input-view'])
      },
    },
  ]

  const recognizeText = image => {
    if (!image) return
    try {
      const {
        src,
        details: { name },
      } = image
      setLoading({ status: true, text: 'Reading Image...' })
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

  const handleValidate = async () => {
    // TODO
    if (areasDetails.length === 0) {
      message.info(`${i18n.t(l.input_area_details)}`)
      return
    }

    try {
      setLoading({
        status: true,
        text: `${i18n.t(l.validating_areas_details)}`,
      })
      let areasResuts = []
      const selectedAreas = areasDetails.filter(a => a.selected)
      if (selectedAreas.length === 0) {
        message.info('Please select some area to proceed!')
        return
      }
      /**
       * Using areasDetails instead of selectedAreas in below for loop intentionally (to get name of areas)
       */
      for (let i = 0; i < areasDetails.length; i++) {
        const area = areasDetails[i]
        if (area.selected) {
          const polygon = makePolygon(area.coords)
          focusAreaOnMap(area.coords, area.coordsCode)
          const data = await getAreaValidationResults(polygon)
          areasResuts.push({ name: `${i18n.t(l.area)} #${i + 1}`, data })
        }
      }
      setResults(areasResuts)
      setExpandedViews(['results-view'])
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
      setLoading({ status: true, text: 'Reading File...' })
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
        <Tooltip title={toDelIndex === index ? '' : `${i18n.t(l.delete_area)}`}>
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
                    {`${i18n.t(l.Yes)}`}
                  </Button>
                  <Button
                    style={{ width: '40%' }}
                    onClick={e => {
                      e.stopPropagation()
                      setToDelIndex(-1)
                    }}
                  >
                    {`${i18n.t(l.no)}`}
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
        <Tooltip title={`${i18n.t(l.show_area_on_map)}`}>
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
        <Tooltip title={`${i18n.t(l.result_options)}`}>
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
          {renderInputViewForAreas()}
        </Panel>
        {!!(results || []).length && (
          <Panel
            header={`${i18n.t(l.validation_results)}`}
            key="results-view"
            className="row-collapse-panel"
            extra={renderResultOptionsPopover()}
          >
            {renderResults()}
          </Panel>
        )}
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

  const renderResults = () => {
    let formattedResults = results
    if (showRejectedOnly) {
      formattedResults = filterRejectedResults(formattedResults)
    }
    return showAreaWiseResults ? (
      <Collapse
        bordered={false}
        expandIconPosition={'right'}
        expandIcon={({ isActive }) => (
          <Icon type="caret-right" rotate={isActive ? 90 : 0} />
        )}
        className="row-collapse areas-results-collapse"
      >
        {formattedResults
          .filter(f => f.data.length > 0)
          .map((areasResuts, index) => {
            return (
              <Panel
                header={areasResuts.name}
                key={index}
                className="row-collapse-panel areas-results-panel"
                extra={
                  ifAreaIntersect(areasResuts.data) ? (
                    <div className="flex-center-center-g">
                      <SVGIcon className="intersect-icon" size={14}>
                        <path
                          fill="red"
                          d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
                        />
                      </SVGIcon>
                      <div>{`${i18n.t(l.intersection)}`}</div>
                    </div>
                  ) : (
                    <div className="result">
                      <SVGIcon size={12} className="result-icon">
                        <path
                          fill="#1ee11e"
                          d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"
                        />
                      </SVGIcon>
                      {`${i18n.t(l.approved)}`}
                    </div>
                  )
                }
              >
                <ResultsView
                  results={formatResults(areasResuts.data)}
                  selectIntersection={showIntersectionOnMap}
                />
              </Panel>
            )
          })}
      </Collapse>
    ) : (
      <ResultsView
        results={formatResults(flatMap(formattedResults.map(r => r.data)))}
        selectIntersection={showIntersectionOnMap}
      />
    )
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

  const renderMainFooter = () => {
    return (
      <footer className="input-view-footer">
        <Button
          className="footer-action-btn"
          onClick={handleValidate}
          type="primary"
        >
          {`${i18n.t(l.validate)}`}
        </Button>
        {showExportBtn && (
          <Button
            className="footer-action-btn"
            onClick={() => {}}
            type="primary"
          >
            {`${i18n.t(l.export_results)}`}
          </Button>
        )}
      </footer>
    )
  }

  return (
    <main id="row-main">
      <div className="row-header">
        <div className="title">ROW</div>
        {renderInputModeButtons()}
      </div>
      {inputMode && <div className="views-section">{renderViews()}</div>}
      {inputMode && renderMainFooter()}

      {loading.status && <Loader text={loading.text} />}
    </main>
  )
}

RightOfWay.propTypes = {
  layers: PropTypes.array,
  addROWLayer: PropTypes.func,
  drawingDataFromMap: PropTypes.object,
  onInputModeChange: PropTypes.func,
  selectedDrawingId: PropTypes.string,
}

export default RightOfWay
