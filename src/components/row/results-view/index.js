/* eslint-disable react/prop-types */
import React from 'react'
import { Collapse, Tooltip, Empty } from 'antd'
import { SVGIcon } from 'react-md'
import { Icon } from '@ant-design/compatible'
import i18n from 'i18n-js'
import l from 'libs/langs/keys'
import './styles.scss'
const { Panel } = Collapse

const MapResult = ({ results = {}, selectIntersection }) => {
  const renderApprovedLayer = (layerName = '', index) => {
    return (
      <div className="results-layers-div" key={index}>
        <Tooltip title={layerName}>
          <div className="layer-name">{layerName}</div>
        </Tooltip>
        <div className="result">
          <SVGIcon size={12} className="result-icon">
            <path
              fill="#1ee11e"
              d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"
            />
          </SVGIcon>
          {`${i18n.t(l.approved)}`}
        </div>
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

  const renderIntersectionCollapse = (
    layerName = '',
    intersectionPoints,
    index,
  ) => {
    return (
      <div key={index}>
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
            header={layerName}
            extra={
              <div className="flex-center-center-g">
                <SVGIcon className="intersect-icon" size={14}>
                  <path
                    fill="red"
                    d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
                  />
                </SVGIcon>
                <div>{`${i18n.t(l.intersection)}`}</div>
              </div>
            }
          >
            <div className="intersection-container">
              <div className="labels-container">
                <div className="label">X Point</div>
                <div className="label">Y Point</div>
              </div>
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
                      <div className="point-cell">{p.x}</div>
                      <div className="point-cell">{p.y}</div>
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
    return Object.keys(groupLayers).map((layerName, index) => {
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
        )
      } else {
        return renderApprovedLayer(formatedLayerName, index)
      }
    })
  }

  const ifGroupIntersect = groupLayers => {
    return Object.keys(groupLayers).find(layerName => {
      return !!groupLayers[layerName].find(item => item.intersectionPoints)
    })
  }

  return (
    <main className="results-section-main">
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
                      <span className="ellipses-span">{groupName || ''}</span>
                    </Tooltip>
                  }
                  key={index}
                  className="groups-collapse-panel"
                  extra={
                    ifGroupIntersect(results[groupName]) ? (
                      <div className="flex-center-center-g">
                        <SVGIcon className="intersect-icon" size={14}>
                          <path
                            fill="red"
                            d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
                          />
                        </SVGIcon>
                        <div>{`${i18n.t(l.intersection)}`}</div>
                      </div>
                    ) : (
                      <div className="result">
                        <SVGIcon size={12} className="result-icon">
                          <path
                            fill="#1ee11e"
                            d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"
                          />
                        </SVGIcon>
                        {`${i18n.t(l.approved)}`}
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
    </main>
  )
}

export default MapResult
