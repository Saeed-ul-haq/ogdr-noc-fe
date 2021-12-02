/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { Button, SVGIcon } from 'react-md'
import { unionBy, orderBy } from 'lodash'
import { Icon } from '@ant-design/compatible'
import { Tooltip, message, Pagination } from 'antd'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import SplitterLayout from 'react-splitter-layout'
import 'react-splitter-layout/lib/index.css'
import OlLayerGroup from 'ol/layer/Group'

import { MeeraMap } from '@target-energysolutions/gis-map'
import Mht from '@target-energysolutions/mht'

import Loader from 'components/ui-kit/loader'
import SearchBar from 'components/search/search-bar'
import LayersContainer from './layers'

import { SPATIAL_INDEX_API } from 'components/indices/api'
import { getEntity, getEntityByID } from 'libs/utils/gis-apis'
import randomMaterialColor from 'libs/utils/material-color-generator'
import i18n from 'i18n-js'
import l from 'libs/langs/keys'
import { guid } from 'libs/utils/uuid'
import {
  getWilayatDataItems,
  featureToWTK,
  getWelfareItems,
  injectGroupNameToLayers,
  filterThemeLayers,
  hideSubTitleBar,
  // getCovidData,
} from './helper'

import '@target-energysolutions/gis-map/styles.css'
import './styles.scss'
import 'react-reflex/styles.css'

const GisMapView = props => {
  const allMaps = useSelector(({ app }) => app.allMaps)

  // const selectedLayerType = 'land_investment'

  const [selectedLayerType, setSelectedLayerType] = useState('land_investment')
  const [rowLayerForMap, setRowLayerForMap] = useState(null)
  const [refreshLayerId, setRefreshLayerId] = useState(null)
  const [drawingDataFromMap, setDrawingDataFromMap] = useState([])
  let [activeLayerId, setActiveLayerId] = useState('-1')
  const [pannedItems, setPannedItems] = useState([])
  const [zoomedItem, setZoomedItem] = useState('')
  const [zoomedLayer, setZoomedLayer] = useState('')
  const [targetLocation, setTargetLocation] = useState({})
  const [sourceLocation, setSourceLocation] = useState({})
  const [updatedMap, setUpdatedMap] = useState({})
  const [layersVisibility, setLayersVisibility] = useState([])
  const [selectedLayerData, setSelectedLayerData] = useState([])
  const [layersTransparency, setLayersTransparency] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingMap, setLoadingMap] = useState(false)
  const [selectedMapState, setSelectedMap] = useState({})
  const [geoLocation, setGeoLocation] = useState(false)
  const [serverLayerItems, setServerLayerItems] = useState(null)
  const [serverBaseLayerItems, setServerBaseLayerItems] = useState(null)
  const [rowInputMode, setROWInputMode] = useState('')
  const [welfareLayers, setWelfareLayers] = useState([])
  const [selectedDrawingId, setSelectedDrawingId] = useState('')
  const [mapLayersWithGroupName, setMapLayersWithGroupName] = useState([])
  const [mapRefInState, setMapRef] = useState(null)
  /** SEARCH BAR STATE VARIABLES - START */
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [indices, setIndices] = useState([])
  const [currentExtent, setCurrentExtent] = useState(null)
  const [forceCollapseRight, setForceCollapseRight] = useState(false)
  const [layerContainerVisibility, setLayerContainerVisibility] = useState(true)
  const [mapLayers, setMapLayers] = useState([])
  const [currentPageData, setCurrentPageData] = useState([])
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(15)
  /** SEARCH BAR STATE VARIABLES - END */

  const {
    showToolbar = true,
    showLayersTreeAside = true,
    showToast,
    showChartLayersOnly = false,
    onActiveMapLoaded,
    onLayerIdChange,
    showLoader,
    hideFooter = false,
    // isTocEnable = false,
    hideTable = false,
    hideSearch = false,
  } = props

  const heatmapDataLayer = useMemo(() => {
    return {
      type: 'heatMap',
      id: 'heatMap-layer-id',
      displayName: 'HeatMap people',
    }
  }, [])
  const getIndexColor = index => {
    let indexColor = randomMaterialColor()
    indices.forEach(i => {
      if (i.index === index) {
        if (i.markerColor) {
          indexColor = i.markerColor
        }
      }
    })
    return indexColor
  }
  const getMHTConfigs = layerData => {
    let tempConfig = []
    layerData.forEach(data => {
      Object.keys(data).forEach(dataKey => {
        if (typeof data[dataKey] === 'string') {
          let flag = true
          tempConfig.forEach(config => {
            if (config.key === dataKey) {
              flag = false
            }
          })
          if (flag) {
            tempConfig.push({
              label: dataKey,
              key: dataKey,
              width: '200',
              icon: 'mdi mdi-pound-box',
            })
          }
        }
      })
    })
    return tempConfig
  }
  const getMapObject = async () => {
    try {
      if (props.selectedMap) {
        onActiveMapLoaded && onActiveMapLoaded(props.selectedMap)
        return props.selectedMap
      } else {
        const mapId = getMapId()
        const { data = [] } = await getEntityByID({
          entityName: 'entity/Map',
          entityID: mapId,
        })
        onActiveMapLoaded && onActiveMapLoaded(data[0])
        return data[0]
      }
    } catch (e) {}
  }

  const getMapId = () => {
    return (
      allMaps.find(m => m.name === 'Ministry of Social Development') || {}
    ).id
  }

  const getActiveMapObject = async () => {
    // Map Layer Groups with respect to active map layers
    // CALL REST ENDPOINT TO GET MAP LAYERS GROUP DATA
    try {
      setLoadingMap(true)
      const selectedMap = await getMapObject()
      setSelectedMap(selectedMap)
      const { data: groups, success } = await getEntity({
        entityName: 'entity/MapLayerGroup',
      })
      const { layers = [] } = selectedMap || {}
      if (success) {
        const layersWithGrpName = injectGroupNameToLayers(layers, groups)
        const { layers: mapLys = [] } = selectedMap

        const uniqueLayersWithGrpName = unionBy(
          [...layersWithGrpName],
          [...mapLys],
          'id',
        )
        setMapLayersWithGroupName(uniqueLayersWithGrpName)
        const updatedMap = {
          ...selectedMap,
          layers: uniqueLayersWithGrpName,
        }
        setUpdatedMap(updatedMap)
      }
    } catch (e) {
      console.log('error ocuured:', e.message)
    } finally {
      setLoadingMap(false)
    }
  }

  const loadDataInTable = params => {
    const { onLayerDataLoaded } = props
    let layerData = []
    if (params && params.layerData && params.layerData.features) {
      layerData = params.layerData.features.map(d => {
        return {
          ...d.properties,
          __geom: d.geometry,
        }
      })
    }

    setPageNumber(1)
    setPageSize(15)

    setSelectedLayerData(layerData)
    setLoading(false)
    onLayerDataLoaded && onLayerDataLoaded(layerData)
  }

  useEffect(() => {
    if (selectedLayerData.length > 0) {
      const minValue = (pageNumber - 1) * pageSize
      const maxValue = pageNumber * pageSize
      setCurrentPageData((selectedLayerData || []).slice(minValue, maxValue))
    }
  }, [pageNumber, pageSize, selectedLayerData])

  useEffect(() => {
    getActiveMapObject()
    setLoadingSearch(true)
    const elseClause = {
      user: ELASTIC_CONFIG_DEFAULT_USER,
      password: ELASTIC_CONFIG_DEFAULT_PASSWORD,
    }
    SPATIAL_INDEX_API({
      api: 'indices',
      body: {
        elasticConfig: {
          server: ELASTIC_CONFIG_DEFAULT_SERVER,
          port: ELASTIC_CONFIG_DEFAULT_PORT,
          scheme: ELASTIC_CONFIG_DEFAULT_SCHEME,
          ...(ELASTIC_CONFIG_DEFAULT_USER === '*' ? {} : elseClause),
        },
        prefix: 'spatial',
      },
    })
      .then(INDICES_LIST_RESPONSE => {
        setIndices(orderBy(INDICES_LIST_RESPONSE || [], ['index'], ['asc']))
      })
      .catch(exception => {
        const { body } = exception
        if (body) {
          message.error(body.message || body.error)
        }
      })
      .finally(() => {
        setLoadingSearch(false)
      })
  }, [props.selectedMap, allMaps])

  const validateBound = bound => {
    let value = bound.value
    switch (bound.type) {
      case 'minX':
        if (bound.value < -180) {
          value = -180
        }
        break
      case 'minY':
        if (bound.value < -90) {
          value = -90
        }
        break
      case 'maxX':
        if (bound.value > 180) {
          value = 180
        }
        break
      case 'maxY':
        if (bound.value > 90) {
          value = 90
        }
        break
    }
    return value
  }

  const filteredLayers = (
    (selectedMapState && selectedMapState.layers) ||
    []
  ).filter(layer => layer.name === 'filespace:Governate_Population_2020')
  let layers = updatedMap.layers || []
  if (showChartLayersOnly) {
    layers = filteredLayers
    const [firstLayer] = filteredLayers
    // activeLayerId = firstLayer && firstLayer.id
    if (firstLayer && firstLayer.id && activeLayerId !== firstLayer.id + '') {
      setTimeout(() => {
        setActiveLayerId(firstLayer.id + '')
      }, 2000)
    }
  }

  const updateMapInState = (property, layers) => {
    try {
      // getting layers and baselayers from updatedMap instead of state here.. Intentionaly
      // So that layers being passed to map could be avoided from being mutated
      const _updatedMap = { ...updatedMap }
      const _layers = [
        ...(_updatedMap.layers || []),
        ...(updatedMap.baseLayers || []),
      ]
      const updatedLayerIds = layers.map(l => l.id + '')
      _layers
        .filter(l => updatedLayerIds.indexOf(l.id + '') > -1)
        .forEach(l => {
          l[property] = (
            layers.find(ll => ll.id + '' === l.id + '') || {}
          ).value
        })
      setUpdatedMap(_updatedMap)
    } catch (e) {}
  }

  const layerItems =
    layers.length > 0 &&
    layers.slice().map(layer => {
      const {
        bounds = {
          SRS: 4326,
          minX: -180,
          minY: -90,
          maxX: 180,
          maxY: 90,
        },
        rendered = true,
      } = layer
      const layerItem = {
        id: `${layer.id}`,
        displayName: layer.label || layer.name || 'WMS Layer',
        url: layer.mapServer ? layer.mapServer.url || '' : '',
        lyrName: layer.name || '',
        groupName: layer.groupName || '',
        attributes: layer.attributes || [],
        opacity: layer.opacity || 1,
        visible: layer.visible || rendered,
        legendUrl: layer.legendUrl || '',
        wfsUrl: layer.mapServer ? layer.mapServer.featureServerUrl || '' : '',
        wfsName: layer.featureType || '',
        mapName: layer.map ? layer.map.name : 'unknown',
        serverName: layer.mapServer ? layer.mapServer.name : 'unknown',
        format: layer.layerType || 'image/png',
        tiled: !layer.useSingleTile,
        geomName: layer.geomName,
        featureAttribute: layer.featureAttribute,
        ext: {
          minx: validateBound({
            value: bounds.minX || -180,
            type: 'minX',
          }),
          miny: validateBound({
            value: bounds.minY || -90,
            type: 'minY',
          }),
          maxx: validateBound({
            value: bounds.maxX || 180,
            type: 'maxX',
          }),
          maxy: validateBound({
            value: bounds.maxY || 90,
            type: 'maxY',
          }),
        },
        proxyUrl: (layer.mapServer || {}).enableProxy,
        enableProxy: (layer.mapServer || {}).enableProxy,
      }
      if (layerItem.groupName === '') {
        delete layerItem.groupName
      }
      if (layerItem.attributes.length === 0) {
        delete layerItem.attributes
      }
      return layerItem
    })

  const baserLayerItems = ((updatedMap && updatedMap.baseLayers) || [])
    .slice()
    .reverse()
    .map(baseLayer => {
      const { rendered = false } = baseLayer
      const baseLayerItem = {
        id: `${baseLayer.id || ''}`,
        layerType: baseLayer.layerType || '',
        displayName: baseLayer.label || baseLayer.name || 'BASE Layer',
        lyrName: baseLayer.name || '',
        url: baseLayer.url || '',
        visible: baseLayer.visible || rendered,
      }
      return baseLayerItem
    })

  if (
    Object.keys(updatedMap).length > 0 &&
    Array.isArray(baserLayerItems) &&
    !serverBaseLayerItems
  ) {
    setServerBaseLayerItems([...baserLayerItems])
  }

  if (
    Object.keys(updatedMap).length > 0 &&
    Array.isArray(layerItems) &&
    !serverLayerItems
  ) {
    setServerLayerItems([...layerItems])
  }

  const mapExt = {
    minx: updatedMap.minX,
    miny: updatedMap.minY,
    maxx: updatedMap.maxX,
    maxy: updatedMap.maxY,
  }

  const handleCurrentLcationChange = () => {
    setPannedItems([])
    setZoomedItem('')
    setZoomedLayer('')
    setGeoLocation(false)
    setTimeout(() => {
      setGeoLocation(true)
      try {
        navigator.geolocation.getCurrentPosition(({ coords }) => {
          // swap of lat lon is intentional
          setSourceLocation({
            lon: coords.latitude,
            lat: coords.longitude,
          })
        })
      } catch (e) {}
    }, 200)
  }

  const handleLayerChange = layerId => {
    if (layerId !== '-1' && layerId !== activeLayerId) {
      setSelectedLayerData([])
      setLoading(true)
    }
    if (layerId === '-1') {
      setSelectedLayerData([])
      setLoading(false)
    }
    setTimeout(() => {
      setActiveLayerId(layerId)
    }, 2000)
    onLayerIdChange && onLayerIdChange(layerId)
  }

  const getDirections = () => {
    if (
      Object.keys(sourceLocation).length > 0 &&
      Object.keys(targetLocation).length > 0
    ) {
      const direction = {
        source: { lat: +sourceLocation.lat, lon: +sourceLocation.lon },
        target: { lat: +targetLocation.lat, lon: +targetLocation.lon },
      }
      console.log('Direction', direction)

      return direction
    }
    return {}
  }

  const handleFilterByExtent = () => {
    // API call to get layers by extent
  }

  const handleDirectMapFromCurrLocation = obj => {
    try {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        // swap of lat lon is intentional
        setSourceLocation({
          lon: coords.latitude,
          lat: coords.longitude,
        })
      })
      setTargetLocation(obj)
    } catch (e) {}
  }

  const getMOSDLayer = () => {
    const wlayer = {
      type: 'other',
      id: 'mosd',
      displayName: 'MOSD Krookies',
      name: 'MOSD_Krookies',
    }
    return wlayer
  }

  const getWelfareLayer = () => {
    const wlayer = {
      type: 'quantitative',
      id: 'wf-layer',
      displayName: 'Welfare Program',
      name: 'welfareLayer',
      maxResolution: 2500,
    }
    return wlayer
  }

  const getClusterLayer = () => {
    const wlayer = {
      type: 'cluster',
      id: 'wf-layer',
      displayName: 'Welfare Program',
      name: 'clusterLayer',
    }
    return wlayer
  }

  // const otherLayers = () => {
  // const cdata = getCovidData()
  // const heatVisible = (
  //   layersVisibility.find(l => l.id === 'covidHeat') || { value: true }
  // ).value
  // const qVisible = (
  //   layersVisibility.find(l => l.id === 'covidQuantity') || { value: false }
  // ).value

  // return [
  //   {
  //     displayName: 'Covid 19 Heat-Map',
  //     layerName: 'Covid 19 Heat-Map',
  //     opacity: 1,
  //     id: 'covidHeat',
  //     spetialCase: true,
  //     type: 'heatMap',
  //     visible: heatVisible,
  //     groupName: 'Covid',
  //     items: cdata,
  //   },
  //   {
  //     displayName: 'Covid 19 Quantitative-Map',
  //     layerName: 'Covid 19 Quantitative-Map',
  //     opacity: 1,
  //     id: 'covidQuantity',
  //     spetialCase: true,
  //     type: 'quantitative',
  //     visible: qVisible,
  //     groupName: 'Covid',
  //     items: qVisible ? cdata : [],
  //   },
  // ]
  // }

  const getLayersFroMap = () => {
    let layers = [
      {
        type: 'wms',
        // clearLayersBeforeAdd: true,
        items: (serverLayerItems || []).reverse(),
      },
      {
        type: 'baseLayers',
        // clearLayersBeforeAdd: true,
        items: serverBaseLayerItems || [],
      },
    ]
    layers = [...layers, ...mapLayers]
    if (rowLayerForMap) {
      layers.push(rowLayerForMap)
    }

    if (welfareLayers.length > 0) {
      welfareLayers.forEach(l => {
        layers.push(l)
      })
    }
    return layers

    // if ((updatedMap || {}).name === 'Oman Government') {
    //   return [...layers, ...otherLayers()]
    // } else {
    //   return layers
    // }
  }

  const renderHeatMapLegend = () => {
    return (
      <section
        className="flex-center-between-g heat-map-lagends"
        style={{ flow: 1 }}
      >
        <div className="label-div"> {welfareLayers[0].displayName} </div>
        <div className="heat-map-min">Min</div>
        <div className="color-chips flex-center-center-g">
          <div className="color-chip" />
          <div className="color-chip" />
          <div className="color-chip" />
          <div className="color-chip" />
          <div className="color-chip" />
        </div>
        <div className="heat-map-max">Max</div>
      </section>
    )
  }

  const handleFeatureSelect = (e = {}) => {
    try {
      if (Array.isArray(e.selected) && e.selected.length === 0) {
        setSelectedDrawingId('')
      } else {
        setSelectedDrawingId(e.selected[0].values_.geometry.ol_uid)
      }
    } catch (e) {}
  }

  const handleFeatureModifyEnd = (e = {}) => {
    try {
      const _drawingDataFromMap = [...drawingDataFromMap]
      const polygon = featureToWTK(e.features.array_[0])
      const selIndex = _drawingDataFromMap.findIndex(
        s => s.id === selectedDrawingId,
      )
      if (selIndex > -1) {
        _drawingDataFromMap.splice(selIndex, 1, {
          id: selectedDrawingId,
          polygon,
        })
      }
      setDrawingDataFromMap(_drawingDataFromMap)
    } catch (e) {}
  }

  const handleFeatureDrawEnd = (e = {}) => {
    try {
      const id = e.feature.values_.geometry.ol_uid
      const polygon = featureToWTK(e.feature)
      setDrawingDataFromMap([...drawingDataFromMap, { id, polygon }])
    } catch (e) {}
  }

  const removeWelfareLayer = layer => {
    // TODO remove passed layer only
    if (welfareLayers.length > 0) {
      setWelfareLayers([{ ...welfareLayers[0], items: [] }])
    }
  }
  const handlePlotWelfareLayerOnMap = ({ layer, mapType, filter }) => {
    let addedLayer = { type: 'heatMap' }
    if (welfareLayers.length > 0) {
      const [idd] = layer.id.split('-')
      if (welfareLayers[0].id.split('-')[0] === idd) {
        addedLayer = welfareLayers[0]
      }
    }

    let mType = mapType || addedLayer.type
    const items = getWelfareItems(layer, filter)
    let l = {}
    if (mType === 'heatMap') {
      l = heatmapDataLayer
    } else if (mType === 'quantitative') {
      l = getWelfareLayer()
    } else if (mType === 'cluster') {
      l = getClusterLayer()
    }
    l = {
      ...l,
      items,
      id: layer.id + '-' + mType,
      displayName: layer.displayName,
    }

    if (welfareLayers.length > 0) {
      setWelfareLayers([{ ...welfareLayers[0], items: [] }])
      setTimeout(() => {
        setWelfareLayers([l])
      }, 100)
      return
    }
    setWelfareLayers([l])
  }

  const handleRowsSelection = rows => {
    try {
      const activeL = updatedMap.layers.find(
        l => Number(l.id) === Number(activeLayerId),
      )
      const featureAttrib = activeL.featureAttribute || ''

      const pann = rows.map(r => {
        return r[featureAttrib]
      })
      setPannedItems(pann)
    } catch {}
  }

  const handleThemeChange = theme => {
    const themeKey = 'themeKey'
    message.loading({
      content: `Applying ${theme.label || theme.name}`,
      key: themeKey,
    })
    try {
      if (theme.id === 'defaultTheme') {
        setUpdatedMap({
          ...updatedMap,
          layers: mapLayersWithGroupName,
        })
      } else {
        setUpdatedMap({
          ...updatedMap,
          layers: filterThemeLayers(mapLayersWithGroupName, theme),
        })
      }

      message.success({
        content: `${theme.label || theme.name || 'Theme'} Applied Successfully`,
        key: themeKey,
        duration: 2,
      })
    } catch {
      message.warning({
        content: `Error While Applying ${theme.label || theme.name}`,
        key: themeKey,
        duration: 2,
      })
    }
  }
  return (
    allMaps.length > 0 && (
      <div className="outer-container">
        {showToolbar && (
          <div className="primarybar-v5">
            <div className="left">
              <Icon
                onClick={() => {
                  props.history.goBack()
                }}
                type={
                  localStorage.language === 'ar' ? 'arrow-right' : 'arrow-left'
                }
              />
              <div className="btn-separator"></div>
              <div className="map-icon">
                <SVGIcon>
                  <path
                    fill="#1890ff"
                    d="M15,19L9,16.89V5L15,7.11M20.5,3C20.44,3 20.39,3 20.34,3L15,5.1L9,3L3.36,4.9C3.15,4.97 3,5.15 3,5.38V20.5A0.5,0.5 0 0,0 3.5,21C3.55,21 3.61,21 3.66,20.97L9,18.9L15,21L20.64,19.1C20.85,19 21,18.85 21,18.62V3.5A0.5,0.5 0 0,0 20.5,3Z"
                  />
                </SVGIcon>
              </div>
              <div>{updatedMap.name}</div>
            </div>
            {/* <div className="right">
            <LayersToolBar
              onTypeChange={handleLayerTypeChange}
              onClearDirection={() => setTargetLocation({})}
              onLiveTraficClick={toggleLiveTrafic}
              showLiveTrafic={checkLiveTraficVisibility()}
              onExtentClick={toggleExtent}
              enableExtent={enableExtent}
              onThemeChange={handleThemeChange}
              mapId={getMapId()}
            />
          </div> */}
          </div>
        )}
        <div className="map-aside-container">
          <SplitterLayout
            secondaryInitialSize={22.5}
            percentage={true}
            primaryIndex={0}
            primaryMinSize={60}
            secondaryMinSize={22.5}
          >
            <div
              className={`gis-map-container ${document.dir === 'rtl' && 'rtl'}`}
            >
              <ReflexContainer orientation="horizontal">
                <ReflexElement
                  onResize={({ domElement, component }) => {
                    if (mapRefInState) {
                      mapRefInState.updateSize()
                    }
                  }}
                  className="left-pane"
                >
                  <div className="map-section pane-content">
                    <Tooltip title="Current Location">
                      <Button
                        icon
                        onClick={() => {
                          handleCurrentLcationChange()
                        }}
                        className="current-location-btn"
                        iconEl={
                          <SVGIcon size={25}>
                            <path
                              fill="#398cff"
                              d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M19,19H15V21H19A2,2 0 0,0 21,19V15H19M19,3H15V5H19V9H21V5A2,2 0 0,0 19,3M5,5H9V3H5A2,2 0 0,0 3,5V9H5M5,15H3V19A2,2 0 0,0 5,21H9V19H5V15Z"
                            />
                          </SVGIcon>
                        }
                      ></Button>
                    </Tooltip>
                    <MeeraMap
                      maxZoom={
                        (selectedMapState || { maxZoom: 23 }).maxZoom || 23
                      }
                      minZoom={
                        (selectedMapState || { minZoom: 2.3 }).minZoom || 2.3
                      }
                      baseMapVisibleID={'BING_HYBRID'}
                      mapRef={r => {
                        setMapRef(r)
                        r.updateSize()
                      }}
                      onSymbolClick={setSelectedDrawingId}
                      onDrawEnd={handleFeatureDrawEnd}
                      onTranslateEnd={handleFeatureModifyEnd}
                      onModifyEnd={handleFeatureModifyEnd}
                      onFeatureSelect={handleFeatureSelect}
                      zoomToLayer={zoomedLayer}
                      // focusedItems={focusedItems}
                      loadDataOnExtentChange={false}
                      // mapExtent={mapExt}
                      geolocation={geoLocation}
                      footer={{
                        visible: !hideFooter,
                        style: {
                          color: '#fff',
                          background: 'rgba(4,15,27,.7)',
                          whiteSpace: 'nowrap',
                        },
                      }}
                      panMapToItems={pannedItems}
                      zoomMapToItem={zoomedItem}
                      drawDirections={getDirections()}
                      isTocEnable={true}
                      layersTransparency={layersTransparency}
                      layersVisibility={layersVisibility}
                      onActiveLayerChange={layerId => {
                        console.log('Active Layer ID Changed...', {
                          layerId,
                        })
                        if (layerId !== activeLayerId) {
                          setTimeout(() => {
                            setActiveLayerId(layerId)
                          }, 2000)
                          onLayerIdChange && onLayerIdChange(layerId)
                        }
                      }}
                      activeLayerID={activeLayerId + '' || `-1`}
                      onLayerIdChange={layerId => {
                        if (layerId !== activeLayerId) {
                          setTimeout(() => {
                            setActiveLayerId(layerId)
                          }, 2000)
                        }
                      }}
                      onTableClick={layerConfig => {
                        console.log({
                          layerConfig,
                        })
                        showLoader && showLoader(true)
                      }}
                      onReverseGeocoding={addressInfo => {
                        console.log('Reverse GeoCoding', addressInfo)
                      }}
                      aoiTools={true}
                      layers={getLayersFroMap()}
                      onLayerDataLoadedOnPolygon={params => {
                        console.log('onLayerDataLoaded', {
                          params,
                        })
                        props.onLayerDataLoadedOnPolygon &&
                          props.onLayerDataLoadedOnPolygon(params)
                        props.filterData && props.filterData(params) // REPLACE ME WITH onLayerDataLoadedOnPolygon prop
                        /* CALLBACK TO RETURN CONFIGURATION */
                        if (typeof params.layerData === 'string') {
                          showToast &&
                            showToast({
                              message: params.layerData,
                              error: 'error',
                            })
                          setSelectedLayerData([])
                          setPannedItems([])
                          setZoomedItem('')
                          setZoomedLayer('')
                          setLoading(false)
                        } else {
                          if (params.layerData.status === 500) {
                            showToast &&
                              showToast({
                                type: 'error',
                                message:
                                  params.layerData.message ||
                                  params.layerData.statusText ||
                                  'Internal Server Error',
                              })
                            setSelectedLayerData([])
                            setPannedItems([])
                            setZoomedItem('')
                            setZoomedLayer('')
                            setLoading(false)
                          } else {
                            loadDataInTable(params)
                            setPannedItems([])
                            setZoomedItem('')
                            setZoomedLayer('')
                          }
                        }
                      }}
                      onLayerDataLoaded={params => {
                        console.log('onLayerDataLoaded', {
                          params,
                        })
                        // props.onLayerDataLoaded && props.onLayerDataLoaded(params)
                        /* CALLBACK TO RETURN CONFIGURATION */
                        if (params && typeof params.layerData === 'string') {
                          showToast &&
                            showToast({
                              message: params.layerData,
                              error: 'error',
                            })
                          setSelectedLayerData([])
                          setPannedItems([])
                          setZoomedItem('')
                          setZoomedLayer('')
                          setLoading(false)
                        } else {
                          if (params.layerData.status === 500) {
                            showToast &&
                              showToast({
                                type: 'error',
                                message:
                                  params.layerData.message ||
                                  params.layerData.statusText ||
                                  'Internal Server Error',
                              })
                            setSelectedLayerData([])
                            setPannedItems([])
                            setZoomedItem('')
                            setZoomedLayer('')
                            setLoading(false)
                          } else {
                            loadDataInTable(params)
                            setPannedItems([])
                            setZoomedLayer('')
                            setZoomedItem('')
                          }
                        }
                      }}
                      onClearAoi={() => {
                        props.onClearAoi && props.onClearAoi()
                      }}
                      onExtentChange={rawExtent => {
                        try {
                          const extentString = rawExtent.replace(
                            /(['"])?([a-z0-9A-Z_]+)(['"])?:/g,
                            '"$2": ',
                          )
                          const jsonExt = JSON.parse(extentString)
                          setCurrentExtent(jsonExt)
                        } catch (exp) {
                          message.error(exp)
                        }
                      }}
                    />
                    {!hideSearch && (
                      <SearchBar
                        fetchingIndices={loadingSearch}
                        indices={indices}
                        currentExtent={currentExtent}
                        onResultClick={result => {
                          console.log({
                            result,
                          })
                        }}
                        onClearSearch={() => {
                          setMapLayers([])
                        }}
                        onResults={(results = []) => {
                          let searchLayers = {}
                          results.forEach(searchResult => {
                            if (searchLayers[searchResult._index]) {
                              searchLayers = {
                                ...searchLayers,
                                [searchResult._index]: [
                                  ...searchLayers[searchResult._index],
                                  searchResult,
                                ],
                              }
                            } else {
                              searchLayers = {
                                ...searchLayers,
                                [searchResult._index]: [searchResult],
                              }
                            }
                          })
                          const mapLayers = Object.keys(searchLayers).map(
                            indexKey => {
                              return {
                                type: 'wkt',
                                id: `wkt-${indexKey}-${guid()}`,
                                displayName: `${indexKey}`,
                                items: searchLayers[indexKey].map(
                                  (item, index) => {
                                    let color = getIndexColor(indexKey)
                                    if (
                                      item._source.location.includes('POLYGON')
                                    ) {
                                      // color = '78,148,80,0.2'
                                      color = '207,0,15,0.3'
                                    }
                                    if (
                                      item._source.location.includes(
                                        'LINESTRING',
                                      )
                                    ) {
                                      color = '225,89,137,1'
                                    }
                                    let popup = {}
                                    Object.keys(item._source).forEach(
                                      itemKey => {
                                        if (itemKey !== 'location') {
                                          popup = {
                                            ...popup,
                                            [itemKey]: item._source[itemKey],
                                          }
                                        }
                                      },
                                    )
                                    return {
                                      id: item._id,
                                      color,
                                      wkt: item._source.location,
                                      popup,
                                    }
                                  },
                                ),
                              }
                            },
                          )
                          if (mapRefInState) {
                            const layers = [
                              ...mapRefInState.getLayers().getArray(),
                            ]
                            layers.forEach(layer => {
                              if (!(layer instanceof OlLayerGroup)) {
                                mapRefInState.removeLayer(layer)
                              }
                            })
                          }
                          setMapLayers(mapLayers)
                        }}
                        onPressEnter={() => {
                          // setForceCollapseRight(true)
                        }}
                        onCategoryClick={() => {
                          // setForceCollapseRight(true)
                        }}
                        onSuggestionClick={suggestion => {
                          // setForceCollapseRight(true)
                        }}
                        onCollapsed={collapsed => {
                          if (collapsed) {
                            setForceCollapseRight(true)
                            setLayerContainerVisibility(false)
                          }
                        }}
                        forcedExpanded={true}
                        defaultCollapsed={false}
                        liveExtentSearch={false}
                      />
                    )}
                  </div>
                </ReflexElement>

                {!hideTable && selectedLayerData.length > 0 && (
                  <ReflexSplitter />
                )}
                {!hideTable && selectedLayerData.length > 0 && (
                  <ReflexElement className="right-pane">
                    <div className="pane-content">
                      <div
                        className="layer-data-container"
                        style={{
                          maxWidth: layerContainerVisibility
                            ? 'calc(100vw - 370px)'
                            : 'calc(100%)',
                          height: '100%',
                        }}
                      >
                        <Mht
                          configs={getMHTConfigs(selectedLayerData)}
                          tableData={currentPageData}
                          commonActions
                          withFooter={false}
                          withColumnResize
                          footerTemplate={() => <div>Footer</div>}
                          headerTemplate={() => <div>Header</div>}
                          onSelectRows={handleRowsSelection}
                          withChecked={true}
                        />
                        <Pagination
                          onChange={page => {
                            setPageNumber(page)
                          }}
                          pageSize={pageSize}
                          total={(selectedLayerData || []).length}
                          className="layers-pagination"
                          hideOnSinglePage={true}
                          current={pageNumber}
                          onShowSizeChange={(page, pageSize) => {
                            setPageNumber(page)
                            setPageSize(pageSize)
                          }}
                          pageSizeOptions={['15', '30', '50']}
                        />
                      </div>
                    </div>
                  </ReflexElement>
                )}
              </ReflexContainer>
            </div>
            {showLayersTreeAside && (
              <LayersContainer
                layers={layerItems || []}
                baseLayers={baserLayerItems || []}
                onLayerChange={layerId => {
                  if (layerId === 'mosd') {
                    setSelectedLayerType('land_investment')
                    // setSelectedLayerData({})
                  } else if (layerId === 'wf-layer') {
                    setPageSize(15)
                    setPageNumber(1)
                    setSelectedLayerData(getWilayatDataItems())
                  } else {
                    handleLayerChange(layerId)
                  }
                }}
                type={selectedLayerType}
                selectedLayerData={selectedLayerData}
                setLayersVisibility={layers => {
                  updateMapInState('rendered', layers)
                  setLayersVisibility(layers)
                }}
                setLayersTransparency={layers => {
                  updateMapInState('opacity', layers)
                  setLayersTransparency(layers)
                }}
                panMapToItems={setPannedItems}
                zoomMapToItem={setZoomedItem}
                zoomToLayer={setZoomedLayer}
                directMapToItem={setTargetLocation}
                directMapFromItem={setSourceLocation}
                directMapFromCurrentLocation={handleDirectMapFromCurrLocation}
                loadingData={loading}
                onFilterbyExtent={handleFilterByExtent}
                hideTitle={hideSubTitleBar(selectedLayerType)}
                drawingDataFromMap={drawingDataFromMap}
                addROWLayer={setRowLayerForMap}
                removeROWLayer={id => {
                  setRefreshLayerId(id)
                }}
                refreshLayer={refreshLayerId}
                onInputModeChange={setROWInputMode}
                rowInputMode={rowInputMode}
                selectedDrawingId={selectedDrawingId}
                welfareMap={true} // {updatedMap.name === 'Welfare'}
                plotWelfareLayerOnMap={handlePlotWelfareLayerOnMap}
                // otherLayers={
                //   (updatedMap || {}).name === 'Oman Government'
                //     ? otherLayers()
                //     : []
                // }
                otherLayers={[...getMOSDLayer()]}
                removeWelfareLayer={removeWelfareLayer}
                welfareLayers={welfareLayers}
                onMapUpdateSize={() => {
                  if (mapRefInState) {
                    try {
                      setTimeout(() => {
                        mapRefInState.updateSize()
                      }, 500)
                    } catch (exp) {
                      message.error(exp)
                    }
                  }
                  setForceCollapseRight(false)
                }}
                forcedCollapse={forceCollapseRight}
                onLayerContainerHide={visibility => {
                  setLayerContainerVisibility(visibility)
                }}
              />
            )}
          </SplitterLayout>
        </div>
        {loadingMap && <Loader text={`${i18n.t(l.loading_map)}`} />}
        {welfareLayers.length > 0 &&
          welfareLayers[0].type === 'heatMap' &&
          renderHeatMapLegend()}
      </div>
    )
  )
}

GisMapView.propTypes = {
  location: PropTypes.object,
  selectedMap: PropTypes.object,
  layers: PropTypes.array,
  showToolbar: PropTypes.bool,
  history: PropTypes.object,
  goBack: PropTypes.func,
  showToast: PropTypes.func,
  match: PropTypes.object,
  mapId: PropTypes.Number,
  showChartLayersOnly: PropTypes.bool,
  hideFooter: PropTypes.bool,
  onLayerDataLoaded: PropTypes.func,
  onLayerDataLoadedOnPolygon: PropTypes.func,
  onClearAoi: PropTypes.func,
  filterData: PropTypes.func,
  onActiveMapLoaded: PropTypes.func,
  onLayerIdChange: PropTypes.func,
  showLoader: PropTypes.func,
  isTocEnable: PropTypes.bool,
  showLayersTreeAside: PropTypes.bool,
  hideTable: PropTypes.bool,
  hideSearch: PropTypes.bool,
}

export default GisMapView
