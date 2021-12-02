/* eslint-disable react/prop-types */
import React, { useState, useEffect, Fragment, useMemo } from 'react'
import { SVGIcon } from 'react-md'

import BaseLayers from './base-layers'
import Layers from './map-layers'
import RightOfWay from 'components/row'
import LandInvestment from 'components/msd/land-investment'
import NurseryPermit from 'components/nursery-permit'

import { Switch } from 'antd'

import './styles.scss'

import i18n from 'i18n-js'
import l from 'libs/langs/keys'

const LayersContainer = props => {
  const {
    type,
    baseLayers = [],
    layers = [],
    onLayerChange,
    setLayersVisibility,
    hideTitle = false,
    rowInputMode = '',
    onMapUpdateSize,
    forcedCollapse = false,
    onLayerContainerHide,
  } = props
  const [asideVisible, setAsideVisible] = useState(type !== '')
  const [visibleAllLayers, setVisibleAllLayers] = useState(false)
  const [titleVisible, setTitleVisible] = useState(true)
  const handleCollapse = ({ collapseFlag = true }) => {
    onMapUpdateSize && onMapUpdateSize()
    setAsideVisible(collapseFlag)
  }
  useEffect(() => {
    checkAllVisible()
    setTitleVisible(!hideTitle)
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (isMobile) {
      onMapUpdateSize && onMapUpdateSize()
      setAsideVisible(false)
    }
    if (forcedCollapse) {
      handleCollapse({
        collapseFlag: false,
      })
    }
  }, [hideTitle, type, forcedCollapse])
  const visibleAll = checked => {
    let formattedLayers = []
    switch (type) {
      case 'baselayers':
        formattedLayers = baseLayers.map(lyr => ({
          id: lyr.id,
          value: checked,
        }))
        break
      case 'layers':
        formattedLayers = layers.map(lyr => ({
          id: lyr.id,
          value: checked,
        }))
    }
    setLayersVisibility(formattedLayers)
    setVisibleAllLayers(checked)
  }

  const renderLayers = useMemo(() => {
    /* To improve interaction between layers we have to render all these components
     and will just show hide them on bases of selected type
     SO that component's state not gets lost on switch
     */
    return (
      <Fragment>
        <span className={`${type !== 'baselayers' && 'hidden-layer'}`}>
          <BaseLayers {...props} layers={baseLayers} />
        </span>
        <span className={`${type !== 'layers' && 'hidden-layer'}`}>
          <Layers
            {...props}
            onChange={onLayerChange}
            layers={layers}
            showTitleBar={hide => setTitleVisible(hide)}
          />
        </span>
        {type === 'row' && <RightOfWay {...props} />}
        {type === 'land_investment' && (
          <LandInvestment {...props} verificationMode={type} />
        )}

        {type === 'nursery_permit' && (
          <NurseryPermit {...props} verificationMode={type} />
        )}
      </Fragment>
    )
  }, [props])
  const checkAllVisible = () => {
    let allLayers = type === 'layers' ? layers : baseLayers
    if (allLayers.length > 0) {
      const hiddenLayer = allLayers.find(lyr => !lyr.visible)
      setVisibleAllLayers(!hiddenLayer)
    }
  }

  const renderShowHideBtn = () => {
    return (
      <div
        className="hide-aside"
        onClick={() => {
          onMapUpdateSize && onMapUpdateSize()
          onLayerContainerHide && onLayerContainerHide(!asideVisible)
          setAsideVisible(!asideVisible)
        }}
      >
        <SVGIcon size={24} className="hiding-icon">
          {asideVisible ? (
            <path
              fill="currentColor"
              d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"
            />
          ) : (
            <path
              fill="currentColor"
              d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"
            />
          )}
        </SVGIcon>
      </div>
    )
  }
  return (
    <div style={{ display: 'flex', position: 'relative' }}>
      {renderShowHideBtn()}
      <aside
        style={
          document.dir === 'rtl'
            ? { position: 'absolute', left: 0 }
            : { position: 'absolute', right: 0 }
        }
        className={
          `layers-aside` +
          ` ` +
          // `${asideVisible && 'visible'}` +
          `visible ` +
          `${
            type === 'row' || type === 'nursery_permit'
              ? `row ${rowInputMode ? '' : 'mode-selector'}`
              : ''
          }`
        }
      >
        {titleVisible && (
          <div className="layer-title">
            {type === 'layers'
              ? `${i18n.t(l.categories)}`
              : `${i18n.t(l.base_layers)}`}
            <div className="switch-btn">
              {`${i18n.t(l.all_visible)}`}
              <Switch
                defaultChecked
                checked={visibleAllLayers}
                size="small"
                onChange={checked => visibleAll(checked)}
              />
            </div>
          </div>
        )}

        <div
          style={{
            height: titleVisible ? 'calc(100% - 50px)' : '100%',
          }}
          className="layers-container"
        >
          {type && renderLayers}
        </div>
      </aside>
    </div>
  )
}

export default LayersContainer
