import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { message } from 'antd'
import { orderBy } from 'lodash'
import OlLayerGroup from 'ol/layer/Group'
import { MeeraMap } from '@target-energysolutions/gis-map'
import OlLayerVector from 'ol/layer/Vector'
import OlSourceVector from 'ol/source/Vector'
import * as OlExtent from 'ol/extent.js'

import OlStyle from 'ol/style/Style'
import OlStyleFill from 'ol/style/Fill'
import OlStyleStroke from 'ol/style/Stroke'
import OlStyleCircle from 'ol/style/Circle'

import Toolbar from 'components/toolbar'
import SearchBar from 'components/search/search-bar'

import { SPATIAL_INDEX_API } from 'components/indices/api'
import randomMaterialColor from 'libs/utils/material-color-generator'
import { guid } from 'libs/utils/uuid'
import './styles.scss'

const selectSource = new OlSourceVector({
  useSpatialIndex: false,
})
const selectLayer = new OlLayerVector({
  source: selectSource,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
})

const Search = props => {
  const { hideToolBar = false, defaultSearch = '' } = props
  const mapRef = useRef()
  const [loading, setLoading] = useState(false)
  const [indices, setIndices] = useState([])
  const [currentExtent, setCurrentExtent] = useState(null)
  const [mapLayers, setMapLayers] = useState([])
  // const [selectedLayerItem, setSelectedLayerItem] = useState({})

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

  useEffect(() => {
    setLoading(true)
    SPATIAL_INDEX_API({
      api: 'indices',
      body: {
        elasticConfig: {
          server: ELASTIC_CONFIG_DEFAULT_SERVER,
          port: ELASTIC_CONFIG_DEFAULT_PORT,
          scheme: ELASTIC_CONFIG_DEFAULT_SCHEME,
          ...(ELASTIC_CONFIG_DEFAULT_USER === '*'
            ? {}
            : {
              user: ELASTIC_CONFIG_DEFAULT_USER,
              password: ELASTIC_CONFIG_DEFAULT_PASSWORD,
            }),
        },
        prefix: 'spatial',
      },
    })
      .then(INDICES_LIST_RESPONSE => {
        setIndices(
          orderBy(
            INDICES_LIST_RESPONSE.map(i => ({
              ...i,
              markerColor: randomMaterialColor(),
            })) || [],
            ['index'],
            ['asc'],
          ),
        )
      })
      .catch(exception => {
        const { body } = exception
        if (body) {
          message.error(body.message || body.error)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const generateLayer = ({ layerItem = {} }) => {
    if (layerItem.id) {
      const layers = [...mapRef.current.map.getLayers().getArray()]
      const lyr = layers.find(l => {
        return (
          typeof l.get('id') !== 'undefined' &&
          l.get('id') === layerItem.layer.id
        )
      })
      if (lyr) {
        const source = lyr.getSource()
        if (source) {
          source.forEachFeature(feature => {
            if (
              feature.get('fid') === layerItem.id ||
              feature.get('id') === layerItem.id
            ) {
              const geom = feature.getGeometry()
              const cloneGeom = feature.clone()
              const color = 'rgb(0,255,255)'
              const polyStyle = new OlStyle({
                image: new OlStyleCircle({
                  radius: 6,
                  fill: new OlStyleFill({
                    color,
                  }),
                }),
                stroke: new OlStyleStroke({
                  width: 3,
                  color,
                }),
              })
              cloneGeom.setStyle(polyStyle)
              selectLayer.setMap(mapRef.current.map)
              selectSource.clear()
              selectSource.addFeature(cloneGeom)
              if (geom) {
                const empExtent = OlExtent.createEmpty()
                const radius = 2000
                OlExtent.extend(empExtent, geom.getExtent())
                if (isFinite(empExtent[0])) {
                  const bufferedExtent = OlExtent.buffer(empExtent, radius)
                  mapRef.current.map
                    .getView()
                    .fit(bufferedExtent, mapRef.current.map.getSize())
                }
              }
            }
          })
        }
      }
    }
  }

  return (
    <div className="search">
      {!hideToolBar && <Toolbar {...props} />}
      <div
        className="search-main"
        style={hideToolBar ? { height: 'calc(100%)' } : {}}
      >
        <MeeraMap
          ref={mapRef}
          aoiTools={false}
          isMinimap={true}
          footer={{
            visible: true,
            style: {
              color: '#fff',
              background: 'rgba(4,15,27,.7)',
              whiteSpace: 'nowrap',
            },
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
          baseMapVisibleID={`ARCGIS_WORLD_TOPO`}
          layers={mapLayers}
          defaultToolsPosition={{ x: 418, y: -15 }}
          onSymbolClick={symbol => {
            console.log({
              symbol,
            })
          }}
        />
        {indices.length > 0 && (
          <SearchBar
            fetchingIndices={loading}
            indices={indices}
            currentExtent={currentExtent}
            defaultSearch={defaultSearch}
            hideCategories={hideToolBar}
            onResultClick={result => {
              mapLayers.forEach(mapLayer => {
                const { items = [] } = mapLayer
                items.forEach(singleLayerItem => {
                  if (singleLayerItem.id === result._id) {
                    // setSelectedLayerItem({
                    //   ...singleLayerItem,
                    //   layer: mapLayer,
                    // })
                    generateLayer({
                      layerItem: {
                        ...singleLayerItem,
                        layer: mapLayer,
                      },
                    })
                  }
                })
              })
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
              const mapLayers = Object.keys(searchLayers).map(indexKey => {
                return {
                  type: 'wkt',
                  id: `wkt-${indexKey}-${guid()}`,
                  displayName: `${indexKey}`,
                  items: searchLayers[indexKey].map((item, index) => {
                    let color = getIndexColor(indexKey)
                    if (item._source.location.includes('POLYGON')) {
                      // color = '78,148,80,0.2'
                      color = '207,0,15,0.3'
                    }
                    if (item._source.location.includes('LINESTRING')) {
                      color = '225,89,137,1'
                    }
                    let popup = {}
                    Object.keys(item._source).forEach(itemKey => {
                      if (itemKey !== 'location') {
                        popup = {
                          ...popup,
                          [itemKey]: item._source[itemKey],
                        }
                      }
                    })
                    return {
                      id: item._id,
                      color,
                      wkt: item._source.location,
                      popup,
                    }
                  }),
                }
              })
              if (mapRef) {
                const layers = [...mapRef.current.map.getLayers().getArray()]
                layers.forEach(layer => {
                  if (!(layer instanceof OlLayerGroup)) {
                    mapRef.current.map.removeLayer(layer)
                  }
                })
              }
              setMapLayers(mapLayers)
            }}
            liveExtentSearch={false}
          />
        )}
      </div>
    </div>
  )
}

export default Search
Search.propTypes = {
  history: PropTypes.object,
  hideToolBar: PropTypes.object,
  defaultSearch: PropTypes.string,
}
