/* eslint-disable react/prop-types */
import React from 'react'
import { Button } from 'react-md'
import { Tabs } from 'antd'
import { cls } from 'reactutils/lib/utils'
import { mapDetailsHelper } from '../helpers'

import './style.scss'

const MapDetailsBody = ({ className, onClick, map = {} }) => {
  const { TabPane } = Tabs
  return (
    <div className={cls('mapDetails-content md-paper--1', className)}>
      <div className="mapDetails-leftSide">
        <img
          src={(map && map.userImg) || mapDetailsHelper.userImg}
          className="map-img"
        />
        <div className="information">
          <Button
            className="btn-contact"
            primary
            flat
            swapTheming
            onClick={onClick}
          >
            Preview Map
          </Button>
        </div>
      </div>
      <div className="mapDetails-rightSide">
        <div className="main-wrapper">
          <div className="header">
            <div className="name">{(map && map.name) || 'Map'}</div>
            <div className="provider">
              Provider: &nbsp; <img src="/static/favicon.png" alt="target" />
              &nbsp;
              <b>Target Oil Field Services</b>
            </div>
          </div>
          <div className="tabs-container">
            <Tabs defaultActiveKey="1">
              <TabPane tab="Overview" key="1">
                <h3>Map Description</h3>
                <div className="description">
                  {(map && map.description) || 'No description found'}
                </div>
                <h3>Map Layers</h3>
                <div className="layers">
                  {map && map.layers && map.layers.length > 0 ? (
                    map.layers.map(({ label }, index) => {
                      return (
                        <div className="layer-label" key={index}>
                          {label}
                        </div>
                      )
                    })
                  ) : (
                    <div>No layers found</div>
                  )}
                </div>
                <h3>Map Gallery</h3>
                <div>In-app screenshots and video on how to use this map</div>
                <div className="imgs-gallery">
                  <Tabs defaultActiveKey="1" className="imgs-tabs">
                    {[1, 2, 3, 4].map(i => (
                      <TabPane
                        tab={
                          <img
                            style={{ objectFit: 'cover' }}
                            width="150px"
                            height="100px"
                            src={`/static/gallery-images/${i}.PNG`}
                            alt="map"
                          />
                        }
                        key={i}
                      >
                        <div
                          style={{ display: 'flex', justifyContent: 'center' }}
                        >
                          <img
                            style={{ objectFit: 'cover' }}
                            width="100%"
                            height="500px"
                            src={`/static/gallery-images/${i}.PNG`}
                          />
                        </div>
                      </TabPane>
                    ))}
                  </Tabs>
                </div>
              </TabPane>
              <TabPane tab={`Plans & Pricing`} key="2">
                <div className="pricing-tab">
                  <div>{mapDetailsHelper.plansAndPricing}</div>
                  <Button
                    className="btn-contact"
                    primary
                    flat
                    swapTheming
                    onClick={() => {}}
                  >
                    Get Map
                  </Button>
                </div>
              </TabPane>
              <TabPane tab="Support" key="3">
                <div>{mapDetailsHelper.support}</div>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapDetailsBody
