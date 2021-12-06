import { MeeraMap } from '@target-energysolutions/gis-map'
import '@target-energysolutions/gis-map/styles.css'
import { Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { Button, SVGIcon } from 'react-md'
import Primarybar from './csv-parsing'
import getWorkSpaces, {
  getOrganizations,
} from 'libs/utils/gis-apis/get-workspaces-api'
import './styles.scss'

const GisMapView = () => {
  const [username, setusername] = useState('')
  const [organizationName, setorganizationName] = useState('')

  const setOrganizationName = async () => {
    const response = await getOrganizations()
    const { meOrganizations } = response.data || {}
    setorganizationName(meOrganizations[0].Name)
    localStorage.setItem('organizationName', meOrganizations[0].Name)
  }

  const getUserName = () => {
    return localStorage.getItem('sso-username')
  }
  useEffect(() => {
    setOrganizationName()
  }, [organizationName])
  return (
    <div className={`gis-map-container `}>
      {/* Primary bar above the map */}
      <Primarybar
        username={getUserName()}
        organizationName={organizationName}
      />

      <Tooltip title="Current Location">
        <Button
          icon
          onClick={() => {
            //   handleCurrentLcationChange()
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
        footer={{
          visible: true,
          style: {
            color: '#fff',
            background: 'rgba(4,15,27,.7)',
            whiteSpace: 'nowrap',
          },
        }}
      />
    </div>
  )
}

export default GisMapView
