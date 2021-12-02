/* eslint-disable react/prop-types */
import React, { useState, useEffect, useMemo } from 'react'
import { getMapThemes } from 'libs/utils/gis-apis'
import { sortBy } from 'lodash'
import { Button, SVGIcon } from 'react-md'
import NoDirection from './images/no-direction.svg'
import { Tooltip, Switch, Select, Popover } from 'antd'
import RightOfWay from './images/rightofway__icon.svg'
import LandInvesment from './images/land_investment_icon.svg'
import i18n from 'i18n-js'
import l from 'libs/langs/keys'
// import MinistryDepartments from './images/ministry_departments_icon.svg'
// import MinistryDirectorates from './images/ministry_directorates_icon.svg'
// import AlwafaCenters from './images/al_wafa_centers_icon.svg'
// import AutismCenters from './images/autism_centers_icon.svg'
import Nurseries from './images/nurseries_icon.svg'
// import ChildCare from './images/childcare_centers_icon.svg'

import './styles.scss'
const { Option } = Select
// const { SubMenu } = Menu

const LayersToolbar = ({
  onTypeChange,
  onClearDirection,
  onLiveTraficClick,
  onExtentClick,
  showLiveTrafic,
  enableExtent,
  selectedTheme: selectedThemeProp = 'default',
  onThemeChange,
  mapId,
}) => {
  const [activeButton, setActiveButton] = useState('layers')
  const [loadingTheme, setLoadingTheme] = useState(false)
  const [mapThemes, setMapThemes] = useState([])
  const [selectedTheme, setSelectedTheme] = useState('default')
  const [rowVisibility, setRowVisibility] = useState(false)

  const rightOfWayOptions = [
    {
      value: 'row',
      label: `${i18n.t(l.right_of_way)}`,
      icon: RightOfWay,
    },
    {
      value: 'land_investment',
      label: `${i18n.t(l.land_investment)}`,
      icon: LandInvesment,
    },
    {
      value: 'nursery_permit', // change value to nursery_permit
      label: `${i18n.t(l.nursery_permit)}`,
      icon: Nurseries,
    },
  ]

  const menu = (
    <div className="popover-container">
      {rightOfWayOptions.map(item => {
        return (
          <div
            key={item.value}
            onClick={() => {
              setActiveButton('row')
              onTypeChange(item.value)
              setRowVisibility(false)
            }}
            className="item"
          >
            <img src={item.icon} alt={item.label} width="18" height="18" />
            <span>{item.label}</span>
          </div>
        )
      })}
    </div>
  )

  useEffect(() => {
    setSelectedTheme(selectedThemeProp)
  }, [selectedThemeProp])

  const loadAllThemes = async () => {
    try {
      setLoadingTheme(true)
      const { data, success } = await getMapThemes(mapId)
      if (success && data) {
        const sortedThemes = sortBy(data || [], 'createdDate')
        setLoadingTheme(false)
        setMapThemes(sortedThemes)
      } else {
        setLoadingTheme(false)
        setMapThemes([])
      }
    } catch (e) {
      setMapThemes([])
    } finally {
      setLoadingTheme(false)
    }
  }
  useEffect(() => {
    loadAllThemes()
  }, [])

  const themeOptions = useMemo(() => {
    let options = mapThemes.map(t => {
      return (
        <Option key={t.id} value={t.id}>
          {t.label || t.name}
        </Option>
      )
    })
    options.unshift(<Option value="default">{i18n.t(l.default_theme)}</Option>)
    return options
  }, [mapThemes])

  const handleThemeChange = themeId => {
    let selectedTheme = {}
    if (themeId === 'default') {
      selectedTheme = {
        id: 'defaultTheme',
        label: i18n.t(l.default_theme),
      }
    } else {
      selectedTheme = mapThemes.find(t => t.id === themeId)
    }
    setSelectedTheme(themeId)
    onThemeChange && onThemeChange(selectedTheme)
  }

  return (
    <main className="layers-toolbar">
      <Tooltip
        title={
          !enableExtent
            ? `${i18n.t(l.enable_data_updates)}`
            : `${i18n.t(l.disable_data_updates)}`
        }
      >
        <div className="switch-btn">
          {`${i18n.t(l.extent)}`}
          <Switch
            checked={enableExtent}
            size="small"
            onChange={checked => onExtentClick(checked)}
          />
        </div>
      </Tooltip>
      <div className="location-btn-sep" />
      <Select
        className="theme-select"
        value={selectedTheme}
        loading={loadingTheme}
        onChange={handleThemeChange}
      >
        {themeOptions}
      </Select>
      <div className="location-btn-sep" />
      {showLiveTrafic ? (
        <Tooltip title={`${i18n.t(l.hide_live_trafic)}`}>
          <Button
            icon
            onClick={onLiveTraficClick}
            className="map-content-btn"
            iconEl={
              <SVGIcon size={16}>
                <path
                  fill="#398cff"
                  d="M8,11L9.5,6.5H18.5L20,11M18.5,16A1.5,1.5 0 0,1 17,14.5A1.5,1.5 0 0,1 18.5,13A1.5,1.5 0 0,1 20,14.5A1.5,1.5 0 0,1 18.5,16M9.5,16A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 9.5,13A1.5,1.5 0 0,1 11,14.5A1.5,1.5 0 0,1 9.5,16M19.92,6C19.71,5.4 19.14,5 18.5,5H9.5C8.86,5 8.29,5.4 8.08,6L6,12V20A1,1 0 0,0 7,21H8A1,1 0 0,0 9,20V19H19V20A1,1 0 0,0 20,21H21A1,1 0 0,0 22,20V12L19.92,6M14.92,3C14.71,2.4 14.14,2 13.5,2H4.5C3.86,2 3.29,2.4 3.08,3L1,9V17A1,1 0 0,0 2,18H3A1,1 0 0,0 4,17V12.91C3.22,12.63 2.82,11.77 3.1,11C3.32,10.4 3.87,10 4.5,10H4.57L5.27,8H3L4.5,3.5H15.09L14.92,3Z"
                />
              </SVGIcon>
            }
          ></Button>
        </Tooltip>
      ) : (
        <Tooltip title={`${i18n.t(l.show_live_trafic)}`}>
          <Button
            icon
            onClick={onLiveTraficClick}
            className="map-content-btn"
            iconEl={
              <SVGIcon size={16}>
                <path
                  fill="rgba(0, 0, 0, 0.54)"
                  d="M20.5,19.85L6.41,5.76L2.41,1.76L1.11,3L4.57,6.46L3,11V19A1,1 0 0,0 4,20H5A1,1 0 0,0 6,19V18H16.11L20.84,22.73L22.11,21.46L20.5,19.85M6.5,15A1.5,1.5 0 0,1 5,13.5A1.5,1.5 0 0,1 6.5,12A1.5,1.5 0 0,1 8,13.5A1.5,1.5 0 0,1 6.5,15M5,10L5.78,7.67L8.11,10H5M17.5,5.5L19,10H13.2L16.12,12.92C16.5,12.17 17.37,11.86 18.12,12.21C18.87,12.57 19.18,13.47 18.83,14.21C18.68,14.5 18.43,14.77 18.12,14.92L21,17.8V11L18.92,5C18.71,4.4 18.14,4 17.5,4H7.2L8.7,5.5H17.5Z"
                />
              </SVGIcon>
            }
          ></Button>
        </Tooltip>
      )}
      <Tooltip title={`${i18n.t(l.clear_directions)}`}>
        <Button
          icon
          onClick={() => {
            onClearDirection()
          }}
          className="map-content-btn"
          iconEl={
            <img
              className="map-content-btn"
              src={NoDirection}
              width="20"
              height="20"
              onClick={() => {
                onClearDirection()
              }}
            />
          }
        ></Button>
      </Tooltip>
      <div className="location-btn-sep" />
      <Tooltip title={`${i18n.t(l.base_layers)}`}>
        <Button
          icon
          onClick={() => {
            setActiveButton('baselayers')
            onTypeChange('baselayers')
          }}
          className="map-content-btn"
          iconEl={
            <SVGIcon size={16}>
              <path
                fill={
                  activeButton === 'baselayers'
                    ? '#398cff'
                    : 'rgba(0, 0, 0, 0.54)'
                }
                d="M7,5H21V7H7V5M7,13V11H21V13H7M4,4.5A1.5,1.5 0 0,1 5.5,6A1.5,1.5 0 0,1 4,7.5A1.5,1.5 0 0,1 2.5,6A1.5,1.5 0 0,1 4,4.5M4,10.5A1.5,1.5 0 0,1 5.5,12A1.5,1.5 0 0,1 4,13.5A1.5,1.5 0 0,1 2.5,12A1.5,1.5 0 0,1 4,10.5M7,19V17H21V19H7M4,16.5A1.5,1.5 0 0,1 5.5,18A1.5,1.5 0 0,1 4,19.5A1.5,1.5 0 0,1 2.5,18A1.5,1.5 0 0,1 4,16.5Z"
              />
            </SVGIcon>
          }
        ></Button>
      </Tooltip>
      <Tooltip title={`${i18n.t(l.layers)}`}>
        <Button
          icon
          onClick={() => {
            setActiveButton('layers')
            onTypeChange('layers')
          }}
          className="map-content-btn"
          iconEl={
            <SVGIcon size={16}>
              <path
                fill={
                  activeButton === 'layers' ? '#398cff' : 'rgba(0, 0, 0, 0.54)'
                }
                d="M12 16.54L19.37 10.8L21 12.07L12 19.07L3 12.07L4.62 10.81L12 16.54M12 14L3 7L12 0L21 7L12 14M12 2.53L6.26 7L12 11.47L17.74 7L12 2.53M12 21.47L19.37 15.73L21 17L12 24L3 17L4.62 15.74L12 21.47"
              />
            </SVGIcon>
          }
        ></Button>
      </Tooltip>

      <Popover
        content={menu}
        trigger="click"
        overlayClassName="right-of-way-container"
        placement="bottomRight"
        visible={rowVisibility}
        onVisibleChange={() => setRowVisibility(!rowVisibility)}
      >
        <Tooltip title={`${i18n.t(l.right_of_way)}`}>
          <Button
            icon
            className="map-content-btn"
            onClick={() => {
              setRowVisibility(!rowVisibility)
            }}
            iconEl={
              <SVGIcon size={16}>
                <path
                  fill={
                    activeButton === 'row' ? '#398cff' : 'rgba(0, 0, 0, 0.54)'
                  }
                  d="M12 3L2 12H5V20H11V14H13V16.11L15 14.11V12H9V18H7V10.19L12 5.69L17 10.19V12.11L19.43 9.68L12 3M21.04 11.14C20.9 11.14 20.76 11.2 20.65 11.3L19.65 12.3L21.7 14.35L22.7 13.35C22.91 13.14 22.91 12.79 22.7 12.58L21.42 11.3C21.32 11.2 21.18 11.14 21.04 11.14M19.06 12.88L13 18.94V21H15.06L21.11 14.93L19.06 12.88Z"
                />
              </SVGIcon>
            }
          ></Button>
        </Tooltip>
      </Popover>
    </main>
  )
}

export default LayersToolbar
