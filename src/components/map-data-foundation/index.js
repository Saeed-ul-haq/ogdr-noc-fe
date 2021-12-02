import React, { useState, useEffect } from 'react'
import { Tabs } from 'antd'
import Layers from 'components/map-layers'
import Toolbar from 'components/toolbar'
import MapGroups from 'components/map-groups'
import MapThemes from 'components/map-themes'
import PropTypes from 'prop-types'

import { SVGIcon } from 'react-md'
import i18n from 'i18n-js'
import l from 'libs/langs/keys'

import './styles.scss'

const { TabPane } = Tabs

const MapDataFoundation = props => {
  const { match, history } = props
  const [selectedTab, setSelectedTab] = useState('layers')
  useEffect(() => {
    if (match && match.path) {
      setSelectedTab(match.path.split('/').pop())
    }
  }, [match])
  return (
    <>
      <Toolbar {...props} />
      <div className="map-foundation-container">
        <Tabs
          type="card"
          tabPosition="left"
          activeKey={selectedTab}
          onChange={key => {
            history.push(key)
          }}
        >
          <TabPane
            tab={
              <div className="flex-center-center-g">
                <SVGIcon size={20} style={{ marginRight: '7px' }}>
                  <path
                    fill={
                      selectedTab === 'layers'
                        ? '#398cff'
                        : 'rgba(0, 0, 0, 0.54)'
                    }
                    d="M12,16L19.36,10.27L21,9L12,2L3,9L4.63,10.27M12,18.54L4.62,12.81L3,14.07L12,21.07L21,14.07L19.37,12.8L12,18.54Z"
                  />
                </SVGIcon>
                {i18n.t(l.layers)}
              </div>
            }
            key="layers"
          >
            <Layers {...props} />
          </TabPane>
          <TabPane
            tab={
              <div className="flex-center-center-g">
                <SVGIcon size={20} style={{ marginRight: '7px' }}>
                  <path
                    fill={
                      selectedTab === 'layerGroups'
                        ? '#398cff'
                        : 'rgba(0, 0, 0, 0.54)'
                    }
                    d="M17,14H19V17H22V19H19V22H17V19H14V17H17V14M11,16L2,9L11,2L20,9L11,16M11,18.54L12,17.75V18C12,18.71 12.12,19.39 12.35,20L11,21.07L2,14.07L3.62,12.81L11,18.54Z"
                  />
                </SVGIcon>
                {i18n.t(l.groups)}
              </div>
            }
            key="layerGroups"
          >
            <MapGroups {...props} />
          </TabPane>
          <TabPane
            tab={
              <div className="flex-center-center-g">
                <SVGIcon size={20} style={{ marginRight: '7px' }}>
                  <path
                    fill={
                      selectedTab === 'themes'
                        ? '#398cff'
                        : 'rgba(0, 0, 0, 0.54)'
                    }
                    d="M7.5,2C5.71,3.15 4.5,5.18 4.5,7.5C4.5,9.82 5.71,11.85 7.53,13C4.46,13 2,10.54 2,7.5A5.5,5.5 0 0,1 7.5,2M19.07,3.5L20.5,4.93L4.93,20.5L3.5,19.07L19.07,3.5M12.89,5.93L11.41,5L9.97,6L10.39,4.3L9,3.24L10.75,3.12L11.33,1.47L12,3.1L13.73,3.13L12.38,4.26L12.89,5.93M9.59,9.54L8.43,8.81L7.31,9.59L7.65,8.27L6.56,7.44L7.92,7.35L8.37,6.06L8.88,7.33L10.24,7.36L9.19,8.23L9.59,9.54M19,13.5A5.5,5.5 0 0,1 13.5,19C12.28,19 11.15,18.6 10.24,17.93L17.93,10.24C18.6,11.15 19,12.28 19,13.5M14.6,20.08L17.37,18.93L17.13,22.28L14.6,20.08M18.93,17.38L20.08,14.61L22.28,17.15L18.93,17.38M20.08,12.42L18.94,9.64L22.28,9.88L20.08,12.42M9.63,18.93L12.4,20.08L9.87,22.27L9.63,18.93Z"
                  />
                </SVGIcon>
                {i18n.t(l.themes)}
              </div>
            }
            key="themes"
          >
            <MapThemes {...props} />
          </TabPane>
        </Tabs>
      </div>
    </>
  )
}

MapDataFoundation.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object,
}

export default MapDataFoundation
