/* eslint-disable react/prop-types */
import React from 'react'
import { Collapse, Tooltip, Empty, Divider } from 'antd'
import { Icon } from '@ant-design/compatible'
import {
  UsergroupAddOutlined,
  LeftOutlined,
  RightOutlined,
  BarChartOutlined,
} from '@ant-design/icons'
import './styles.scss'

import i18n from 'i18n-js'
import l from 'libs/langs/keys'
const { Panel } = Collapse

const MapResult = ({
  results = {},
  selectIntersection,
  panelTitle,
  areaPopulation,
  onGoBack,
  type,
}) => {
  const renderApprovedLayer = (layerName = '', index, layer = []) => {
    return (
      <div
        className={`area-results-div`}
        key={index}
        style={{ display: !isHiddenItem(layer) ? 'flex' : 'none' }}
      >
        <Tooltip title={layerName}>
          <div className="layer-name">
            <UsergroupAddOutlined /> &nbsp;
            {layerName}
          </div>
        </Tooltip>
        <div className="result item-font">0</div>
      </div>
    )
  }
  const formatLayerName = (name, layers) => {
    try {
      const l = layers[name][0]
      return l.layerDisplayName || l.layerName
      // return startCase(name.split(':').pop())
    } catch {
      return name
    }
  }

  const isHiddenItem = (layer = []) => {
    const hiddenLayers = [
      'Population',
      'Salaries Distribution',
      'Eligibility Score',
      'Family Members',
    ]
    try {
      if (hiddenLayers.includes(layer[0].layerName)) {
        return true
      } else {
        return false
      }
    } catch {
      return false
    }
  }

  const renderIntersectionCollapse = (
    layerName = '',
    intersectionPoints = [],
    index,
    layer = [],
  ) => {
    const Header = () => {
      return (
        <Tooltip title={layerName}>
          <UsergroupAddOutlined /> &nbsp; {layerName}
        </Tooltip>
      )
    }

    return (
      <div
        key={index}
        style={{ display: !isHiddenItem(layer) ? 'block' : 'none' }}
      >
        <Collapse
          bordered={false}
          expandIconPosition={'right'}
          expandIcon={({ isActive }) => (
            <Icon type="caret-right" rotate={isActive ? 90 : 0} />
          )}
          className="layers-collapse-component"
        >
          <Panel
            className="layers-collapse-panel"
            header={<Header />}
            extra={
              <div className="flex-center-center-g">
                <div>{intersectionPoints.length}</div>
              </div>
            }
          >
            <div className="intersection-container">
              <div className="points-container">
                {intersectionPoints.map((p, i) => (
                  <Tooltip key={i} title={p.itemName || layerName}>
                    <div
                      className="points-row"
                      onClick={() =>
                        selectIntersection &&
                        selectIntersection({ x: p.x, y: p.y })
                      }
                    >
                      {p.itemName || layerName}
                    </div>
                  </Tooltip>
                ))}
              </div>
            </div>
          </Panel>
        </Collapse>
      </div>
    )
  }
  const renderLayerPanel = groupLayers => {
    if (typeof groupLayers !== 'object') {
      return ''
    }
    let pans = []
    try {
      pans = Object.keys(groupLayers).map((layerName, index) => {
        const formatedLayerName = formatLayerName(layerName, groupLayers)
        const layer = groupLayers[layerName]
        const layerItemsWithIntersection = layer.filter(
          item => item.intersectionPoints,
        )
        if (layerItemsWithIntersection.length > 0) {
          const intersectionPointsWithName = layerItemsWithIntersection.reduce(
            (prev, layerItem) => {
              prev = [...prev, ...layerItem.intersectionPoints]
              return prev
            },
            [],
          )

          return renderIntersectionCollapse(
            formatedLayerName,
            intersectionPointsWithName,
            index,
            layer,
          )
        } else {
          return renderApprovedLayer(formatedLayerName, index, layer)
        }
      })
    } catch {}
    pans.unshift(hardCodedPopulation())
    return pans
  }

  const ifGroupIntersect = groupLayers => {
    return Object.keys(groupLayers).find(layerName => {
      return !!groupLayers[layerName].find(item => item.intersectionPoints)
    })
  }
  const renderAreaItemHeader = () => {
    return (
      <div className="area-item-header">
        <span onClick={() => onGoBack()} className="back-icon">
          {localStorage.language === 'ar' ? (
            <RightOutlined />
          ) : (
            <LeftOutlined />
          )}
        </span>
        <div
          className="area-icon"
          style={{
            backgroundColor: 'royalblue',
          }}
        >
          <BarChartOutlined />
        </div>
        {panelTitle}
      </div>
    )
  }

  const hardCodedPopulation = () => {
    return (
      <div className="area-results-div" key={9999}>
        <Tooltip title={'Population'}>
          <div className="layer-name">
            <UsergroupAddOutlined /> {`${i18n.t(l.population)}`}
          </div>
        </Tooltip>
        <div style={{ marginRight: '3px' }} className="item-font">
          {areaPopulation}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="row-header">{renderAreaItemHeader()}</div>

      <main className="results-section-main">
        <section className="results-section-main--list">
          <section className="results-section-header">
            <div className="item-font">{`${i18n.t(l.area_radius)}`}</div>
            <div className="item-font">15 KM</div>
          </section>
          <Divider dashed />
          {results && Object.keys(results).length > 0 ? (
            <Collapse
              expandIconPosition={'right'}
              bordered={false}
              expandIcon={({ isActive }) => (
                <Icon type="caret-right" rotate={isActive ? 90 : 0} />
              )}
              className="groups-collapse-container"
            >
              {Object.keys(results)
                .filter(r => r !== 'undefined' && !!r)
                .map((groupName = '', index) => {
                  return (
                    <Panel
                      header={
                        <Tooltip title={groupName || ''}>
                          <span className="ellipses-span">
                            {groupName || ''}
                          </span>
                        </Tooltip>
                      }
                      key={index}
                      className="groups-collapse-panel"
                      extra={
                        ifGroupIntersect(results[groupName]) ? (
                          <div className="flex-center-center-g ">
                            <div>{(results[groupName] || []).length}</div>
                          </div>
                        ) : (
                          <div className="flex-center-center-g ">
                            <div className="item-font">0</div>
                          </div>
                        )
                      }
                    >
                      {renderLayerPanel(results[groupName])}
                    </Panel>
                  )
                })}
              {renderLayerPanel(results['undefined'])}
            </Collapse>
          ) : (
            <Empty description={'No Results Found'} />
          )}
        </section>
      </main>
    </>
  )
}

export default MapResult
