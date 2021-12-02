/* eslint-disable react/prop-types */
import React from 'react'
import { Tooltip, Menu, Dropdown } from 'antd'
import { Icon } from '@ant-design/compatible'
import { SVGIcon } from 'react-md'
import { getDateString } from '../../libs/utils/helpers'
import './style.scss'

import i18n from 'i18n-js'
import l from 'libs/langs/keys'

const MapCard = ({
  id,
  mapTitle,
  description,
  creationDate,
  mapImage,
  className,
  type,
  layers = [],
  activeMap,
  onViewDetails,
  history,
  onDelete,
  onClick,
  label,
}) => {
  const menuItems = [
    {
      leftIcon: <Icon type="infoCircle" />,
      primaryText: i18n.t(l.view_details),
      onClick: () => onViewDetails && onViewDetails(),
    },
    {
      leftIcon: <Icon type="deploymentUnit" />,
      primaryText: i18n.t(l.view_in_3d),
      onClick: () => history.push(`/gis-map/3d-view/${id}`),
    },

    {
      leftIcon: <Icon type="edit" />,
      primaryText: i18n.t(l.edit_map),
      onClick: () => history.push(`/maps/edit/${id}`),
    },

    {
      leftIcon: <Icon type="delete" />,
      primaryText: i18n.t(l.delete),
      onClick: e => {
        onDelete && onDelete(id)
      },
    },
    {
      leftIcon: <Icon type="project" />,
      primaryText: i18n.t(l.set_layers_group),
      onClick: () => history.push(`/maps/${id}/groups/add`),
    },
    {
      leftIcon: <Icon type="form" />,
      primaryText: i18n.t(l.set_theme),
      onClick: () => history.push(`/maps/${id}/themes/add`),
    },
  ]
  const menu = (
    <Menu>
      {menuItems.map((item, index) => (
        <Menu.Item
          key={index}
          onClick={({ domEvent }) => {
            domEvent.stopPropagation()
            item.onClick()
          }}
        >
          <>
            {item.leftIcon}
            {item.primaryText}
          </>
        </Menu.Item>
      ))}
    </Menu>
  )
  let mapImgSrc = mapImage
  if (mapTitle.toLowerCase().includes('ogdr')) {
    mapImgSrc = '/static/images/ogdr.png'
  }

  if (label && label.toLowerCase().includes('welfare')) {
    mapImgSrc = '/static/images/welfare_map.png'
  }

  return (
    <div
      className={`mapCard ${className || ''}`}
      onClick={() => {
        if (onClick) {
          onClick()
        } else {
          history.push(`/gis-map/${id}`)
        }
      }}
    >
      <div className="mapCard-imageWrapper">
        <img src={mapImgSrc} />
      </div>
      <div className="mapCard-container">
        <div className="mapCard-title">{mapTitle}</div>
        <p className="mapCard-desciption">{description || mapTitle}</p>
        <div className="mapCard-layers">
          {layers.slice(0, 3).map((item, key) => {
            return <span key={key}>{item}</span>
          })}
          {layers.length > 3 && (
            <span key={'more'}>{`${layers.length - 3} more`}</span>
          )}
        </div>
        <div className="mapCard-content">
          {creationDate && (
            <span>
              <i className="mdi mdi-calendar" />
              {`${i18n.t(l.created)}`}
              <span className="date">{getDateString(creationDate)}</span>
            </span>
          )}
          <div className="flex-center-center-g">
            <div className="icons-container">
              <Tooltip
                title={
                  activeMap ? i18n.t(l.active_map) : i18n.t(l.inactive_map)
                }
                placement="bottom"
              >
                <SVGIcon size={16}>
                  <path
                    fill={activeMap ? '#50c078' : 'rgba(0, 0, 0, 0.54)'}
                    d="M17.9,17.39C17.64,16.59 16.89,16 16,16H15V13A1,1 0 0,0 14,12H8V10H10A1,1 0 0,0 11,9V7H13A2,2 0 0,0 15,5V4.59C17.93,5.77 20,8.64 20,12C20,14.08 19.2,15.97 17.9,17.39M11,19.93C7.05,19.44 4,16.08 4,12C4,11.38 4.08,10.78 4.21,10.21L9,15V16A2,2 0 0,0 11,18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
                  />
                </SVGIcon>
              </Tooltip>
            </div>
            <Dropdown overlay={menu} trigger="click" placement="topLeft">
              <Icon
                type="more"
                onClick={e => {
                  e.stopPropagation()
                }}
              />
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  )
}
export default MapCard
