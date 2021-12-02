/* eslint-disable no-unused-vars */
import {
  GeoJsonLayer,
  PolygonLayer,
  BitmapLayer,
  ScatterplotLayer,
} from '@deck.gl/layers'
import { TileLayer } from '@deck.gl/geo-layers'

import { scaleThreshold } from 'd3-scale'
import { load } from '@loaders.gl/core'
import { AmbientLight, PointLight, LightingEffect } from '@deck.gl/core'
import { HeatmapLayer, HexagonLayer } from '@deck.gl/aggregation-layers'

// Data to be used by the LineLayer

const DATA_PIPELINE =
  'https://raw.githubusercontent.com/peerusman/projectData/master/pipelinePolygon3.geojson'
const DATA_BUILDINGS =
  'https://raw.githubusercontent.com/peerusman/projectData/master/omanbuildings.geojson'
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
const iconMapping = './location-icon-mapping.json'
const iconAtlas = './location-icon-atlas.png'

const school = new HexagonLayer({
  id: 'school-hexgon',
  colorRange,
  coverage: 1,
  data: DATA_SCHOOLHEATMAP,
  elevationRange: [0, 100],
  elevationScale: 50,
  extruded: true,
  getPosition: d => [d.X, d.Y],
  radius: 50,
  upperPercentile: 100,
  material,

  transitions: {
    elevationScale: 100,
  },
})
const school1 = new ScatterplotLayer({
  id: 'scatter-plot',
  data: DATA_SCHOOLHEATMAP,
  radiusScale: 30,
  radiusMinPixels: 0.25,
  getPosition: d => [d.X, d.Y, 0],
  getFillColor: d => (d.Weight === 2 ? GOVERNMENT_COLOR : PRIVATE_COLOR),
  getRadius: 1,
  updateTriggers: {
    getFillColor: [GOVERNMENT_COLOR, PRIVATE_COLOR],
  },
})
const hospital = new GeoJsonLayer({
  id: 'DATA_HOSPITAL',
  data: DATA_HOSPITAL,
  opacity: 0.5,
  iconAtlas,
  iconMapping,
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

export const getLayers = id => {
  switch (id) {
    case 'buildings':
      return [building]
    case 'hospitals':
      return [hospital]
    case 'schools':
      return [school, school1]
    case 'pipelines':
      return [pipeline]
  }
}
