import React, { useState, useEffect } from 'react'
import { getEntityByID } from 'libs/utils/gis-apis'
import './map3d.css'
import {
  Viewer,
  Scene,
  Globe,
  Camera,
  Entity,
  ImageryLayer,
  CameraFlyTo,
} from 'resium'

import {
  Cartesian3,
  ArcGisMapServerImageryProvider,
  ArcGISTiledElevationTerrainProvider,
  WebMapServiceImageryProvider,
  // VRTheWorldTerrainProvider,
} from 'cesium'

import { useParams } from 'react-router-dom'

import 'cesium/Build/Cesium/Widgets/widgets.css'

// Ion.defaultAccessToken =
// 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlNmY2ZDE5ZC00ZWNjLTQ5YTgtYWIxNS01NmQxZmY2Yjk4NzQiLCJpZCI6Mzg3MTcsImlhdCI6MTYwNjc1NDA3MX0.SuZ8BKmJZBWGw_w-XR7dXdZvmgOUW-OaQH09bsR_LpQ'
const GisMap3DView = () => {
  const { mapId } = useParams()
  const [map, setMap] = useState({})
  const [mapLayers, setMapLayers] = useState([])

  const getMapObject = async () => {
    try {
      const { data = [] } = await getEntityByID({
        entityName: 'entity/Map',
        entityID: mapId,
      })
      const [mapObj = {}] = data
      setMap(mapObj)
    } catch (e) {}
  }

  useEffect(() => {
    mapId && getMapObject()
  }, [mapId])

  useEffect(() => {
    if (map.id) {
      const mapLayers = (map.layers || []).map((layer = {}) => {
        return {
          url: (layer.mapServer || {}).url,
          layers: layer.name,
          parameters: {
            service: 'WMS',
            version: '1.1.1',
            request: 'GetMap',
            styles: '',
            format: 'image/png',
            transparent: 'true',
          },
        }
      })
      setMapLayers(mapLayers)
    }
  }, [map])

  console.log({ mapLayers })
  return (
    <div>
      <Viewer
        full
        vrButton={true}
        timeline={false}
        imageryProvider={false}
        navigationHelpButton={false}
        baseLayerPicker={false}
        projectionPicker={false}
        geocoder={false}
        animation={false}
      >
        <CameraFlyTo
          duration={15}
          destination={Cartesian3.fromDegrees(58.547913, 23.635288, 5000)}
          once={true}
        />
        <ImageryLayer
          imageryProvider={
            new ArcGisMapServerImageryProvider({
              url:
                'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
            })
          }
        />
        {mapLayers.map(layer => {
          return (
            <ImageryLayer
              key={layer.name}
              alpha={0.6}
              imageryProvider={new WebMapServiceImageryProvider(layer)}
            />
          )
        })}
        <Scene>
          <Globe
            enableLighting
            terrainProvider={
              new ArcGISTiledElevationTerrainProvider({
                url:
                  'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer',
              })
              // new VRTheWorldTerrainProvider({
              //   url: 'http://www.vr-theworld.com/vr-theworld/tiles1.0.0/73/',
              // })
            }
          >
            <Camera>
              <Entity />
            </Camera>
          </Globe>
        </Scene>
      </Viewer>
      <p>
        {`MAP ID :`} <strong>{mapId}</strong>
      </p>
      <p>Map Label : {map.label ? map.label : '...'}</p>
    </div>
  )
}

export default GisMap3DView
