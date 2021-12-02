/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useMemo } from 'react'
import { groupBy, orderBy } from 'lodash'
import { Tree, Tooltip, Popover, Slider, Col, Input } from 'antd'
import LayerData from './layer-data'
import { Icon } from '@ant-design/compatible'
import { SVGIcon } from 'react-md'
import ContrastSVG from './images/contrast_enable.svg'
import VisibleSVG from './images/view_enable.svg'
import InVisibleSVG from './images/view_disabled.svg'
import { getLayerFilterRange, isWelfareLayer } from '../helper'

import i18n from 'i18n-js'
import l from 'libs/langs/keys'

import './styles.scss'

import { getIconByLabel } from './get-icon'

const { Search } = Input
const iconStyle = {
  width: '14px',
  height: '14px',
  margin: '0 8px',
  opacity: 0.97,
}

const MapLayers = props => {
  const {
    layers = [],
    onChange,
    setLayersVisibility,
    setLayersTransparency,
    zoomToLayer,
    showTitleBar,
    showWelfareLayer,
    showHeatMapLayer,
    welfareMap,
    plotWelfareLayerOnMap,
    welfareLayers,
    removeWelfareLayer,
  } = props

  const [searchString, setSearchString] = useState('')
  const [selectedLayer, setSelectedLayer] = useState({})
  const [expandedKeys, setExpandedKeys] = useState([])
  const [layersWithOutGrp, setLayersWithOutGrp] = useState([])
  const [groups, setGroups] = useState([])

  const welfareLayerObj = {
    displayName: 'Welfare salary distribution',
    layerName: 'Welfare salary distribution',
    opacity: 1,
    visible: showWelfareLayer,
    featureAttribute: 'Wilayat',
    id: 'wf-layer',
    spetialCase: true,
    type: 'welfare',
  }

  const heatMapLayerObj = {
    displayName: 'Heatmap salary distribution',
    layerName: 'Heatmap salary distribution',
    opacity: 1,
    visible: showHeatMapLayer,
    featureAttribute: 'Wilayat',
    id: 'wf-heat-layer',
    spetialCase: true,
    type: 'welfare',
  }

  const initLayers = () => {
    let filteredLayers = layers.filter(l =>
      (l.displayName || l.label || '')
        .toLowerCase()
        .includes((searchString || '').toLowerCase()),
    )
    filteredLayers = orderBy(filteredLayers, 'displayOrder')
    const layersWithGrp = filteredLayers.filter(l => !!l.groupName)
    const _layersWithOutGrp = filteredLayers.filter(l => !l.groupName)
    const _groups = groupBy(layersWithGrp, 'groupName')
    setLayersWithOutGrp(_layersWithOutGrp)
    setGroups(_groups)
    searchString && setExpandedKeys(Object.keys(_groups))
  }

  const refreshSelectedLayer = () => {
    if (layers.findIndex(l => l.id === (selectedLayer || {}).id) > -1) {
      setSelectedLayer(layers.find(l => l.id === selectedLayer.id))
    }
  }

  useEffect(() => {
    initLayers()
    refreshSelectedLayer()
  }, [layers, searchString])

  const renderTitle = (title, index, groupChildren) => {
    return (
      <div
        style={{ lineHeight: groupChildren ? 1.2 : 0.5 }}
        className="title-container"
      >
        <Tooltip title={title} placement="bottom">
          {groupChildren ? (
            <div className="label">{title}</div>
          ) : (
            <h4 className="label">{title}</h4>
          )}
        </Tooltip>
        {index % 4 === 0 ? (
          <span className="premium">Premium</span>
        ) : (
          <span className="free">Free</span>
        )}
      </div>
    )
  }

  const renderMapsList = layer => {
    const data = [
      {
        title: 'Heat Map',
        value: 'heatMap',
        imgSrc:
          'M17.55,11.2C17.32,10.9 17.05,10.64 16.79,10.38C16.14,9.78 15.39,9.35 14.76,8.72C13.3,7.26 13,4.85 13.91,3C13,3.23 12.16,3.75 11.46,4.32C8.92,6.4 7.92,10.07 9.12,13.22C9.16,13.32 9.2,13.42 9.2,13.55C9.2,13.77 9.05,13.97 8.85,14.05C8.63,14.15 8.39,14.09 8.21,13.93C8.15,13.88 8.11,13.83 8.06,13.76C6.96,12.33 6.78,10.28 7.53,8.64C5.89,10 5,12.3 5.14,14.47C5.18,14.97 5.24,15.47 5.41,15.97C5.55,16.57 5.81,17.17 6.13,17.7C7.17,19.43 9,20.67 10.97,20.92C13.07,21.19 15.32,20.8 16.93,19.32C18.73,17.66 19.38,15 18.43,12.72L18.3,12.46C18.1,12 17.83,11.59 17.5,11.21L17.55,11.2M14.45,17.5C14.17,17.74 13.72,18 13.37,18.1C12.27,18.5 11.17,17.94 10.5,17.28C11.69,17 12.39,16.12 12.59,15.23C12.76,14.43 12.45,13.77 12.32,13C12.2,12.26 12.22,11.63 12.5,10.94C12.67,11.32 12.87,11.7 13.1,12C13.86,13 15.05,13.44 15.3,14.8C15.34,14.94 15.36,15.08 15.36,15.23C15.39,16.05 15.04,16.95 14.44,17.5H14.45Z',
      },
      {
        title: 'Cluster Map',
        value: 'cluster',
        imgSrc:
          'M11 6H14L17.29 2.7A1 1 0 0 1 18.71 2.7L21.29 5.29A1 1 0 0 1 21.29 6.7L19 9H11V11A1 1 0 0 1 10 12A1 1 0 0 1 9 11V8A2 2 0 0 1 11 6M5 11V15L2.71 17.29A1 1 0 0 0 2.71 18.7L5.29 21.29A1 1 0 0 0 6.71 21.29L11 17H15A1 1 0 0 0 16 16V15H17A1 1 0 0 0 18 14V13H19A1 1 0 0 0 20 12V11H13V12A2 2 0 0 1 11 14H9A2 2 0 0 1 7 12V9Z',
      },
    ]

    return (
      <div className="flex-col-center-center-g">
        {data.map(d => {
          return (
            <div
              className="welfare-map-select"
              key={d.value}
              onClick={() => plotWelfareLayerOnMap({ layer, mapType: d.value })}
            >
              <div className="flex-center-between-g">
                <div className="flex-center-center-g">
                  <SVGIcon
                    size={18}
                    style={{ marginRight: '7px', marginTop: '2px' }}
                  >
                    <path fill={'#398cff'} d={d.imgSrc} />
                  </SVGIcon>
                  {d.title}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const isWFLayerVisible = layer => {
    if (welfareLayers.length > 0) {
      const [idd] = layer.id.split('-')
      return (
        welfareLayers[0].id.split('-')[0] === idd &&
        welfareLayers[0].items &&
        welfareLayers[0].items.length > 0
      )
    }
    return false
  }

  const renderWelfareLayerActions = layer => {
    const rangeDef = getLayerFilterRange(layer)
    const {
      min = 1,
      max = 100,
      step = 1,
      defaultVal = [20, 50],
      marks = {},
    } = rangeDef
    return (
      <div className="right" onClick={e => e.stopPropagation()}>
        <Popover
          title={
            <div
              className="flex-center-center-g"
              style={{
                height: '25px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: '600',
                justifyContent: 'left',
              }}
            >
              <SVGIcon style={{ marginRight: '7px' }}>
                <path d="M14,12V19.88C14.04,20.18 13.94,20.5 13.71,20.71C13.32,21.1 12.69,21.1 12.3,20.71L10.29,18.7C10.06,18.47 9.96,18.16 10,17.87V12H9.97L4.21,4.62C3.87,4.19 3.95,3.56 4.38,3.22C4.57,3.08 4.78,3 5,3V3H19V3C19.22,3 19.43,3.08 19.62,3.22C20.05,3.56 20.13,4.19 19.79,4.62L14.03,12H14Z" />
              </SVGIcon>
              {layer.displayName}
            </div>
          }
          placement="bottomRight"
          content={
            <div style={{ width: '400px', padding: '0 25px' }}>
              <Slider
                marks={marks}
                min={min}
                max={max}
                onAfterChange={val => {
                  plotWelfareLayerOnMap({ layer, filter: val })
                }}
                range
                step={step}
                defaultValue={defaultVal}
              />
            </div>
          }
          trigger="click"
        >
          <Tooltip title={'Filter Category'} placement="left">
            <SVGIcon size={16} style={{ marginRight: '7px' }}>
              <path
                fill={
                  isWFLayerVisible(layer) ? '#398cff' : 'rgba(0, 0, 0, 0.54)'
                }
                d="M3,17V19H9V17H3M3,5V7H13V5H3M13,21V19H21V17H13V15H11V21H13M7,9V11H3V13H7V15H9V9H7M21,13V11H11V13H21M15,9H17V7H21V5H17V3H15V9Z"
              />
            </SVGIcon>
          </Tooltip>
        </Popover>
        <Tooltip title="Set Visible" placement="bottom">
          <img
            src={isWFLayerVisible(layer) ? VisibleSVG : InVisibleSVG}
            style={iconStyle}
            className="visibility-icon"
            onClick={() => {
              isWFLayerVisible(layer)
                ? removeWelfareLayer(layer)
                : plotWelfareLayerOnMap({ layer })
            }}
          />
        </Tooltip>

        <Popover
          title="Select Map"
          placement="bottomLeft"
          className="welfare-pop"
          content={
            <div style={{ width: '150px' }}>{renderMapsList(layer)}</div>
          }
          trigger="click"
        >
          <Tooltip title="Map Type" placement="bottom">
            <Icon type="more" />
          </Tooltip>
        </Popover>
      </div>
    )
  }

  const renderLayerActions = ({ layer, mode = 'default' }) => {
    const rightStyle =
      mode === 'single'
        ? {
          width: '65%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }
        : {}

    const singleIconStyle = {
      width: '20px',
      height: '20px',
      margin: '0',
      opacity: '0.97',
      cursor: 'pointer',
    }

    return welfareMap && isWelfareLayer(layer) ? (
      renderWelfareLayerActions(layer)
    ) : (
      <div
        className="right"
        style={rightStyle}
        onClick={e => e.stopPropagation()}
      >
        <Tooltip title={`${i18n.t(l.zoom_to_layer)}`} placement="bottom">
          <SVGIcon
            size={mode === 'single' ? 20 : 17}
            style={mode === 'single' ? { cursor: 'pointer' } : {}}
            onClick={() => {
              zoomToLayer && zoomToLayer(layer.id)
            }}
          >
            <path
              fill="rgba(0, 0, 0, 0.54)"
              d="M9.5,13.09L10.91,14.5L6.41,19H10V21H3V14H5V17.59L9.5,13.09M10.91,9.5L9.5,10.91L5,6.41V10H3V3H10V5H6.41L10.91,9.5M14.5,13.09L19,17.59V14H21V21H14V19H17.59L13.09,14.5L14.5,13.09M13.09,9.5L17.59,5H14V3H21V10H19V6.41L14.5,10.91L13.09,9.5Z"
            />
          </SVGIcon>
        </Tooltip>
        <Popover
          title={`${i18n.t(l.opacity)}`}
          placement="bottomRight"
          content={
            <div style={{ width: '150px' }}>
              <Slider
                tipFormatter={val => `${val}%`}
                defaultValue={layer.opacity * 100}
                min={0}
                max={100}
                onChange={val => {
                  setLayersTransparency &&
                    setLayersTransparency([{ id: layer.id, value: val / 100 }])
                }}
              />
            </div>
          }
          trigger="click"
        >
          <Tooltip title={`${i18n.t(l.set_opacity)}`} placement="bottom">
            <img
              src={ContrastSVG}
              style={mode === 'single' ? singleIconStyle : iconStyle}
            />
          </Tooltip>
        </Popover>
        <Tooltip title={`${i18n.t(l.set_visible)}`} placement="bottom">
          <img
            src={layer.visible ? VisibleSVG : InVisibleSVG}
            style={mode === 'single' ? singleIconStyle : iconStyle}
            className="visibility-icon"
            onClick={() =>
              setLayersVisibility &&
              setLayersVisibility([{ id: layer.id, value: !layer.visible }])
            }
          />
        </Tooltip>
      </div>
    )
  }

  const renderTreeLayerItem = (layer, index, groupChildren) => {
    const srcPath = getIconByLabel(layer.displayName || layer.label)
    const welfareLayerItem = isWelfareLayer(layer)
    return (
      <div
        className={`layer-item ${!groupChildren && ' first-level-item'}`}
        onClick={e => {
          if (welfareLayerItem) {
            e.stopPropagation()
          }
        }}
      >
        <div className="left">
          <img
            className="layer-icon"
            src={srcPath}
            width={groupChildren ? '25' : '30'}
          />
          {renderTitle(layer.displayName || layer.label, index, groupChildren)}
        </div>
        {renderLayerActions({ layer })}
      </div>
    )
  }

  const renderTreeGroupItem = groupName => {
    const visible = groupName === 'Welfare' ? false : isGroupVisible(groupName)
    return (
      <div className="layer-item first-level-item">
        <div className="left">
          <img className="layer-icon" src={getIconByLabel(groupName)} />
          {renderTitle(groupName, 4, false)}
        </div>
        <div className="right">
          <Tooltip title="Set Visibe">
            <img
              style={iconStyle}
              className="visibility-icon"
              src={visible ? VisibleSVG : InVisibleSVG}
              onClick={() => {
                const ids = (groups[groupName] || []).map(l => {
                  return { id: l.id, value: !visible }
                })
                setLayersVisibility && setLayersVisibility(ids)
              }}
            />
          </Tooltip>
        </div>
      </div>
    )
  }

  const isGroupVisible = groupName => {
    const hiddenLayer =
      groups[groupName] && groups[groupName].find(l => !l.visible)
    return !hiddenLayer
  }

  const renderLayersTree = useMemo(() => {
    const treeDataGrps = Object.keys(groups).map(groupName => {
      return {
        title: renderTreeGroupItem(groupName),
        key: groupName,
        children: groups[groupName].map((layer, i) => {
          return {
            title: renderTreeLayerItem(layer, i, true),
            key: layer.id,
            isLeaf: true,
          }
        }),
      }
    })

    const treeDataLayers = layersWithOutGrp.map((layer, i) => {
      return {
        title: renderTreeLayerItem(layer, i),
        key: layer.id,
        isLeaf: true,
      }
    })
    const welfareLayer = {
      title: renderTreeLayerItem(welfareLayerObj, 0),
      key: 'wf-layer',
      isLeaf: true,
    }

    const heatMapLayer = {
      title: renderTreeLayerItem(heatMapLayerObj, 0),
      key: 'wf-layer',
      isLeaf: true,
    }

    const otherLayers = (props.otherLayers || []).map((otherLayer, i) => {
      return {
        title: renderTreeLayerItem(otherLayer, 0),
        key: otherLayer.id || 'other1' + i,
        isLeaf: true,
      }
    })

    let treeLayers = [...treeDataGrps, ...treeDataLayers]
    showWelfareLayer && treeLayers.unshift(welfareLayer)
    showHeatMapLayer && treeLayers.unshift(heatMapLayer)

    return [...otherLayers, ...treeLayers]
  }, [showWelfareLayer, groups, layersWithOutGrp])

  return (
    <main className="mapLayers">
      {selectedLayer && Object.keys(selectedLayer).length > 0 ? (
        <LayerData
          selectedLayer={selectedLayer}
          onBack={() => {
            onChange('-1')
            setSelectedLayer({})
            showTitleBar(true)
          }}
          onZoomToLayer={layer => {
            zoomToLayer && zoomToLayer(layer.id)
          }}
          onTransparencyChange={transparency => {
            setLayersTransparency && setLayersTransparency(transparency)
          }}
          onVisibleClick={visibility => {
            setLayersVisibility && setLayersVisibility(visibility)
          }}
          {...props}
        />
      ) : (
        <Col>
          {Array.isArray(layers) && layers.length > 0 && (
            <div className="search-container">
              <Search
                className="sc--search-box"
                placeholder={`${i18n.t(l.search_categories)}`}
                onChange={e => {
                  setSearchString(e.target.value)
                }}
              />
            </div>
          )}
          <Tree
            showIcon
            onSelect={(keys, { selectedNodes }) => {
              if (selectedNodes[0] && selectedNodes[0].isLeaf) {
                onChange(keys[0])
                showTitleBar(false)
                try {
                  document.getElementsByClassName(
                    'layers-aside',
                  )[0].scrollTop = 0
                } catch {}
                setSelectedLayer(
                  selectedNodes[0].key === 'wf-layer'
                    ? welfareLayerObj
                    : layers.find(l => l.id === selectedNodes[0].key, {}),
                )
              }
            }}
            treeData={renderLayersTree}
            expandedKeys={expandedKeys}
            onExpand={keys => {
              setExpandedKeys(keys)
            }}
          />
        </Col>
      )}
    </main>
  )
}

export default MapLayers
