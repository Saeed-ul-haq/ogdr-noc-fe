/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import DeckGL from '@deck.gl/react'
import { StaticMap } from 'react-map-gl'
import { useSelector } from 'react-redux'
import { GeoJsonLayer, IconLayer } from '@deck.gl/layers'

import { fetchWFSDataDeckgl } from 'libs/utils/gis-apis/read-json'
import { scaleThreshold } from 'd3-scale'
import { AmbientLight, PointLight, LightingEffect } from '@deck.gl/core'
import { Button } from 'react-md'
import './styles.scss'
// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN =
  'pk.eyJ1Ijoic2FiaXJpaXVpIiwiYSI6ImNrNzAzc3FrOTFhdTYzbG84MDY2amVidDIifQ.a3rhPMPUOw4OPrIvPjrPxg'
// Initial viewport settings
const INITIAL_VIEW_STATE = {
  latitude: 23.5971285,
  longitude: 58.4127607,
  zoom: 13,
  maxZoom: 22,
  pitch: 60,
  bearing: 0,
}
const cluster = true
const ICON_MAPPING = {
  marker: { x: 0, y: 0, width: 128, height: 128, mask: true },
}
// Data to be used by the LineLayer
const DATA_PIPELINE =
  'https://raw.githubusercontent.com/peerusman/projectData/master/pipelinePolygon3.geojson'
const DATA_BUILDINGS =
  'https://raw.githubusercontent.com/peerusman/projectData/master/omanbuildings.geojson'
const DATA_BUILDINGSOSM =
  'https://raw.githubusercontent.com/peerusman/projectData/master/osmBuildingsArea.geojson'
const DATA_HOSPITAL =
  'https://raw.githubusercontent.com/peerusman/projectData/master/hospital.geojson'
const tileServer = 'https://c.tile.openstreetmap.org/'
const DATA_SCHOOLHEATMAP =
  'https://raw.githubusercontent.com/peerusman/projectData/master/allSchools.json'
// 'http://localhost:8080/geoserver/filespace/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=filespace%3ABuilding_Height&maxFeatures=500&outputFormat=application%2Fjson'
const GOVERNMENT_COLOR = [0, 128, 255]
const PRIVATE_COLOR = [255, 0, 128]
const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0,
})
const pointLight1 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-0.144528, 49.739968, 80000],
})
const pointLight2 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-3.807751, 54.104682, 8000],
})
const lightingEffect = new LightingEffect({
  ambientLight,
  pointLight1,
  pointLight2,
})
const material = {
  ambient: 0.64,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [51, 51, 51],
}
const colorRange = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78],
]
const elevationScale = { min: 1, max: 50 }
const COLOR_SCALE = scaleThreshold()
  .domain([
    4.3,
    8.6,
    12.9,
    15.04,
    0,
    16.7380008698,
    16.879999,
    18.2369995117,
    18.8239994049,
    19.4880008698,
    20.9449996948,
    22.4939994812,
    23.767999649,
  ])
  .range([
    [65, 182, 196],
    [127, 205, 187],
    [199, 233, 180],
    [237, 248, 177],
    // zero
    [255, 255, 204],
    [255, 237, 160],
    [254, 217, 118],
    [254, 178, 76],
    [253, 141, 60],
    [252, 78, 42],
    [227, 26, 28],
    [189, 0, 38],
    [128, 0, 38],
  ])
const landCover = [
  [
    [-123.0, 49.196],
    [-123.0, 49.324],
    [-123.306, 49.324],
    [-123.306, 49.196],
  ],
]
const DeckWrapper = props => {
  const [schoolData, setSchoolsData] = useState([])
  useEffect(() => {
    getData()
  }, [])

  const getData = async id => {
    const res = await fetchWFSDataDeckgl({
      wfsUrl: 'https://was.demo-aws.meeraspace.com/geoserver/wfs?',
      layerName: 'filespace:School_Government',
      crsCode: 4326,
      filter: null,
    })
    if (res && res.status && res.status === 500) {
      setSchoolsData([])
    } else {
      setSchoolsData(res)
    }
  }

  const chartMap = useSelector(({ app }) => {
    return app.chartMap
  })
  const activeMap = useSelector(({ app }) => {
    return app.activeMap
  })
  // const lineLayer = new LineLayer({ id: 'line-layer', data })
  // const layers = [lineLayer]
  let infId = ''
  try {
    infId = props.match.params.infId
  } catch (e) {}
  const { showToolbar = true } = props
  return (
    <div className="outer-container">
      {showToolbar && (
        <div className="primarybar-v5">
          <Button
            flat
            onClick={() => props.history.goBack()}
            className="back-btn"
          >
            Back
          </Button>
          <div className="map-title">{(infId || '').toUpperCase()}</div>
        </div>
      )}
      <DeckGL
        layers={renderLayers(infId, schoolData)}
        // effects={this._effects}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        getTooltip={({ object }) => {
          if (object) {
            let txt = ''
            for (let x in object) {
              if (x) {
                if (
                  !(
                    x === 'X' ||
                    x === 'x' ||
                    x === 'Y' ||
                    x === 'y' ||
                    x === 'coordinates' ||
                    x === 'geometry'
                  )
                ) {
                  if (
                    !(typeof object[x] === 'undefined' || object[x] === null)
                  ) {
                    if (x === 'properties') {
                      const propval = object[x]
                      for (let y in propval) {
                        if (
                          !(
                            typeof propval[y] === 'undefined' ||
                            propval[y] === null
                          )
                        ) {
                          txt += propval[y] + '\n'
                        }
                      }
                      continue
                    }
                    txt += object[x] + '\n'
                  }
                }
              }
            }
            return txt
          }
        }}
      >
        <StaticMap
          reuseMaps
          // mapStyle={'mapbox://styles/mapbox/dark-v9'}
          // mapStyle={'mapbox://styles/mapbox/dark-v11'}
          mapStyle={'mapbox://styles/mapbox/streets-v11'}
          // mapStyle={'mapbox://styles/mapbox/satellite-streets-v11'}
          preventStyleDiffing={true}
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
        />
      </DeckGL>
    </div>
  )
}

const renderLayers = (id, schoolData) => {
  const trymapping = './location-icon-mapping.json'
  const iconAtlas = './location-icon-atlas.png'
  const school2 = new IconLayer({
    id: 'icon-layer-school',
    data: DATA_SCHOOLHEATMAP,
    pickable: true,
    iconAtlas:
      'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
    iconMapping: ICON_MAPPING,
    getIcon: d => 'marker',
    sizeScale: 5,
    getPosition: d => d.coordinates,
    getSize: d => 7,
    getColor: d => {
      const colr = d.SchoolType === 'Government' ? [0, 0, 0] : [255, 0, 0]
      return colr
    },
  })
  // const textLayer = new TextLayer({
  //   id: 'twitter-topics-raw',
  //   data: DATA_SCHOOLHEATMAP,
  //   getText: d => `Name: ${d.NAMEEN} \r\nSchool Type: ${d.SchoolType}`,
  //   getPosition: x => x.coordinates,
  //   getColor: d => [189, 31, 167],
  //   getSize: d => 12,
  //   sizeScale: 32 / 20,
  // })
  const hospital = new GeoJsonLayer({
    id: 'DATA_HOSPITAL',
    data: DATA_HOSPITAL,
    opacity: 0.5,
    iconAtlas,
    iconMapping: trymapping,
    getIcon: d => 'marker',
    sizeUnits: 'meters',
    sizeScale: 2000,
    sizeMinPixels: 6,
  })
  const pipeline = new GeoJsonLayer({
    id: 'DATA_PIPELINE',
    data: DATA_PIPELINE,
    opacity: 0.8,
    stroked: false,
    filled: true,
    extruded: true,
    wireframe: true,
    getElevation: f => Math.sqrt(f.properties.Diameter),
    getFillColor: f => COLOR_SCALE(f.properties.Diameter),
    getLineColor: [255, 0, 0],
    pickable: true,
  })
  const building = new GeoJsonLayer({
    id: 'DATA_BUILDINGS',
    data: DATA_BUILDINGS,
    opacity: 0.8,
    stroked: false,
    filled: true,
    extruded: true,
    wireframe: true,
    getElevation: f => Math.sqrt(f.properties.Height) * 10,
    getFillColor: f => COLOR_SCALE(f.properties.Height),
    getLineColor: [255, 255, 255],
    pickable: true,
  })
  const buildingOsm = new GeoJsonLayer({
    id: 'DATA_BUILDINGSOSM',
    data: DATA_BUILDINGSOSM,
    opacity: 0.8,
    stroked: false,
    filled: true,
    extruded: true,
    wireframe: true,
    getElevation: f => f.properties.height,
    getFillColor: f => COLOR_SCALE(f.properties.height),
    getLineColor: [255, 255, 255],
    pickable: true,
  })
  switch (id) {
    case 'buildings':
      return [building, buildingOsm]
    case 'hospitals':
      return [hospital]
    case 'schools':
      return [school2]
    case 'pipelines':
      return [pipeline]
    default:
      return [school2, hospital, pipeline, building]
  }
}

DeckWrapper.propTypes = {
  showToolbar: PropTypes.bool,
  match: PropTypes.object,
  history: PropTypes.object,
}
export default DeckWrapper
