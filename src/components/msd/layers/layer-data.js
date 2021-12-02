/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { Icon } from '@ant-design/compatible'
import FiltersForm from './filters-form'
import { SVGIcon } from 'react-md'
import { Tooltip, Popover, Slider, Empty, message, Divider, Card } from 'antd'
import PropTypes from 'prop-types'
import { isEqual, pick } from 'lodash-es'

import i18n from 'i18n-js'
import l from 'libs/langs/keys'

// import { Tooltip, Popover, Radio } from 'antd'
import './styles.scss'
// import Loader from 'components/ui-kit/loader'
import ContrastSVG from './images/contrast_enable.svg'
import VisibleSVG from './images/view_enable.svg'
import InVisibleSVG from './images/view_disabled.svg'
import LayerDetailCard from './layer-detail-card'
// const radioStyle = {
//   display: 'block',
//   height: '30px',
//   lineHeight: '30px',
// }
const LayerData = props => {
  const {
    selectedLayerData,
    onBack,
    selectedLayer = {},
    loadingData,
    onZoomToLayer,
    onTransparencyChange,
    onVisibleClick,
  } = props
  const selectedLayerLabel = selectedLayer.displayName || selectedLayer.label
  // const featureAttrib = selectedLayer.featureAttribute || ''
  const [showForm, setShowForm] = useState(false)
  // const [sortBy, setSortBy] = useState(false)
  const [filters, setFilters] = useState([])
  // const [popVisible, setPopVisible] = useState(false)

  const toggleFilterForm = () => {
    setShowForm(!showForm)
  }
  useEffect(() => {
    if (loadingData) {
      message.loading({
        content: `${i18n.t(l.loading_layer_data)}`,
        key: 'dataLoader',
      })
    }
    //  else {
    //   message.success({
    //     content: 'Data Loaded...',
    //     key: 'dataLoader',
    //     duration: 2,
    //   })
    // }
  }, [loadingData])

  const renderLayerActions = ({ layer, mode = 'default' }) => {
    const singleStyles = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
    }

    const rightStyle = mode === 'single' ? singleStyles : {}

    const singleIconStyle = {
      width: '20px',
      height: '20px',
      margin: '0',
      opacity: '0.97',
      cursor: 'pointer',
    }

    return (
      <Card className="actions-card">
        <div className="card-header">
          <h4 className="font-size-lg mb-0 py-2 font-weight-bold">{`${i18n.t(
            l.actions,
          )}`}</h4>
        </div>
        <div
          className="right pb-0"
          style={rightStyle}
          onClick={e => e.stopPropagation()}
        >
          <div className="pb-row">
            <div className="pb-icon">
              {' '}
              <Tooltip title={`${i18n.t(l.zoom_to_layer)}`} placement="bottom">
                <SVGIcon
                  size={mode === 'single' ? 20 : 17}
                  style={mode === 'single' ? { cursor: 'pointer' } : {}}
                  onClick={() => {
                    onZoomToLayer && onZoomToLayer(layer)
                  }}
                >
                  <path
                    fill="rgba(0, 0, 0, 0.54)"
                    d="M9.5,13.09L10.91,14.5L6.41,19H10V21H3V14H5V17.59L9.5,13.09M10.91,9.5L9.5,10.91L5,6.41V10H3V3H10V5H6.41L10.91,9.5M14.5,13.09L19,17.59V14H21V21H14V19H17.59L13.09,14.5L14.5,13.09M13.09,9.5L17.59,5H14V3H21V10H19V6.41L14.5,10.91L13.09,9.5Z"
                  />
                </SVGIcon>
              </Tooltip>
            </div>
            <div className="pb-label">
              <div className="font-weight-bold d-block opacity-8">
                {`${i18n.t(l.zoom_to_layer)}`}
              </div>
              <div className="text-dark opacity-5">
                {`${i18n.t(l.see_layer_on_map)}`}
              </div>
            </div>
          </div>
          <div className="pb-row">
            <div className="pb-icon">
              {' '}
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
                        onTransparencyChange &&
                          onTransparencyChange([
                            { id: layer.id, value: val / 100 },
                          ])
                      }}
                    />
                  </div>
                }
                trigger="click"
              >
                <Tooltip title={`${i18n.t(l.set_opacity)}`} placement="bottom">
                  <img src={ContrastSVG} style={singleIconStyle} />
                </Tooltip>
              </Popover>
            </div>
            <div className="pb-label">
              <div className="font-weight-bold d-block opacity-8">{`${i18n.t(
                l.opacity,
              )}`}</div>
              <div className="text-dark opacity-5">
                {Math.round(layer.opacity * 100) + '%'}
              </div>
            </div>
          </div>
          <div className="pb-row">
            <div className="pb-icon">
              {' '}
              <Tooltip title={`${i18n.t(l.set_visible)}`} placement="bottom">
                <img
                  src={layer.visible ? VisibleSVG : InVisibleSVG}
                  style={singleIconStyle}
                  className="visibility-icon"
                  onClick={() => {
                    onVisibleClick &&
                      onVisibleClick([{ id: layer.id, value: !layer.visible }])
                  }}
                />
              </Tooltip>
            </div>
            <div className="pb-label">
              <div className="font-weight-bold d-block opacity-8">
                {`${i18n.t(l.visibility)}`}
              </div>
              <div className="text-dark opacity-5">
                {`Visible: ${layer.visible}`}
              </div>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  // const toggleSortBy = () => {
  //   setSortBy(!sortBy)
  // }

  // const btnStyle = {
  //   border: 'none',
  //   background: '#e8f1ff',
  //   color: '#398cff',
  // }

  // const isDataFound = selectedLayerData.length > 0

  // const renderTopBar = () => {
  //   return (
  //     <>
  //       <div className="layers-toolbar">
  //         <Button
  //           style={sortBy ? btnStyle : null}
  //           iconEl={
  //             <SVGIcon size={18}>
  //               <path
  //                 fill={sortBy ? '#398cff' : 'rgba(0, 0, 0, 0.54)'}
  //                 d="M7,10L12,15L17,10H7Z"
  //               />
  //             </SVGIcon>
  //           }
  //           iconBefore={false}
  //           className="filter-btn"
  //           onClick={toggleSortBy}
  //           disabled={!isDataFound}
  //         >
  //           Sort By
  //         </Button>
  //         <Button
  //           style={showForm ? btnStyle : null}
  //           iconEl={
  //             <SVGIcon size={16}>
  //               <path
  //                 fill={showForm ? '#398cff' : 'rgba(0, 0, 0, 0.54)'}
  //                 d="M3,17V19H9V17H3M3,5V7H13V5H3M13,21V19H21V17H13V15H11V21H13M7,9V11H3V13H7V15H9V9H7M21,13V11H11V13H21M15,9H17V7H21V5H17V3H15V9Z"
  //               />
  //             </SVGIcon>
  //           }
  //           className="filter-btn"
  //           onClick={toggleFilterForm}
  //           disabled={!isDataFound}
  //         >
  //           Filters
  //         </Button>
  //       </div>
  //     </>
  //   )
  // }
  // const renderAttribs = lyrItem => {
  //   let attribs = Object.keys(lyrItem || {}).filter(k => k !== '__geom')
  //   if (attribs.indexOf('Phone') > -1) {
  //     attribs.unshift('Phone')
  //   }
  //   if (attribs.indexOf('phone') > -1) {
  //     attribs.unshift('phone')
  //   }
  //   if (attribs.indexOf('Address') > -1) {
  //     attribs.unshift('Address')
  //   }
  //   if (attribs.indexOf('address') > -1) {
  //     attribs.unshift('address')
  //   }

  //   const layerAttribs = attribs
  //     .slice(0, 3)
  //     .filter(lName => lName !== featureAttrib)

  //   return (layerAttribs || []).map((atr, i) => {
  //     return (
  //       <div key={i} className="middle-section">
  //         {atr}:
  //         <Tooltip title={lyrItem[atr]}>
  //           <h6>{lyrItem[atr]}</h6>
  //         </Tooltip>
  //       </div>
  //     )
  //   })
  // }

  const getFilteredLayerData = () => {
    const filterKeys = Object.keys(filters).filter(k => !!filters[k])
    const nonEmptyFilters = pick(filters, filterKeys)
    return selectedLayerData.filter(layer => {
      const filterValLayerItem = pick(layer, filterKeys)
      const _equal = isEqual(filterValLayerItem, nonEmptyFilters)
      return _equal
    })
  }

  const renderBasicInfo = selectedLayer => {
    return <LayerDetailCard layer={selectedLayer} />
  }

  const renderLagend = selectedLayer => {
    console.log({
      selectedLayer,
    })
    return (
      <section className="lagend-section">
        <div>
          {selectedLayer.legendUrl !== '' ? (
            <>
              <img src={selectedLayer.legendUrl} />
            </>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={`${i18n.t(l.no_legend_found)}`}
            />
          )}
        </div>
      </section>
    )
  }

  const renderLayerDetails = selectedLayer => {
    return (
      <main className="layer-info-main">
        <section>{renderBasicInfo(selectedLayer)}</section>
        <section>
          {renderLayerActions({
            layer: selectedLayer,
            mode: 'single',
          })}
        </section>
        <Divider orientation="left">{`${i18n.t(l.legend)}`}</Divider>
        <section>{renderLagend(selectedLayer)}</section>
      </main>
    )
  }

  const renderLayerCards = () => {
    // const {
    //   panMapToItems,
    //   zoomMapToItem,
    //   directMapToItem,
    //   directMapFromItem,
    //   directMapFromCurrentLocation,
    //   // setFocusedItems,
    // } = props
    const filteredData = getFilteredLayerData()
    if (props.showWelfareLayer && props.setWelfareFilteredData) {
      props.setWelfareFilteredData(filteredData)
    }
    // const handleDirections = (lyrItem, direct, fromCurrent) => {
    //   try {
    //     let latlon = {}
    //     const coordinatesArr =
    //       lyrItem['__geom'] && lyrItem['__geom']['coordinates']

    //     if (lyrItem['__geom'] && lyrItem['__geom'].type === 'Point') {
    //       latlon = {
    //         lat: coordinatesArr[0],
    //         lon: coordinatesArr[1],
    //       }
    //     } else {
    //       const [coords] = coordinatesArr
    //       const [point] = coords
    //       latlon = { lat: point[0], lon: point[1] }
    //     }
    //     if (fromCurrent) {
    //       directMapFromCurrentLocation(latlon)
    //     } else {
    //       if (direct === 'source') {
    //         directMapFromItem(latlon)
    //       } else {
    //         directMapToItem(latlon)
    //       }
    //     }
    //   } catch (e) {}
    // }
    console.log({
      selectedLayer,
    })
    // return //filteredData.length > 0 ? (
    return (
      <>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            border: '1px solid #eee',
            marginTop: '10px',
          }}
        >
          {renderLayerDetails(selectedLayer)}
        </div>
      </>
    )
    // ) : (
    // filteredData.map(lyrItem => {
    //   return (
    //     <div
    //       key={lyrItem.id}
    //       className="layer-data-card-div"
    //       onMouseEnter={() => {
    //         // setFocusedItems([lyrItem[featureAttrib]])
    //       }}
    //     >
    //       <h3>
    //         {lyrItem[featureAttrib] || lyrItem.NAMEEN || lyrItem.Governorat}
    //       </h3>
    //       {renderAttribs(lyrItem)}
    //       <div className="footer-actions">
    //         <Tooltip
    //           title={'Show Direction From Current Location'}
    //           placement="bottom"
    //         >
    //           <div
    //             className="primary-btn md-cell md-cell--3"
    //             onClick={() => handleDirections(lyrItem, 'target', true)}
    //           >
    //             Directions
    //           </div>
    //         </Tooltip>
    //         <div className="primary-btn  md-cell md-cell--1 driving-icon">
    //           <Popover
    //             title="Directions"
    //             placement="bottomRight"
    //             // visible={popVisible}
    //             content={
    //               <div style={{ width: '150px' }}>
    //                 <Radio.Group
    //                   onChange={e => {
    //                     handleDirections(lyrItem, e.target.value)
    //                   }}
    //                 >
    //                   <Radio style={radioStyle} value={'source'}>
    //                     From
    //                   </Radio>
    //                   <Radio style={radioStyle} value={'target'}>
    //                     To
    //                   </Radio>
    //                 </Radio.Group>
    //               </div>
    //             }
    //             trigger="hover"
    //           >
    //             <Button
    //               icon
    //               id={'directions-pop-trigger'}
    //               onClick={() => setPopVisible(!popVisible)}
    //               className="map-content-btn"
    //               iconEl={
    //                 <SVGIcon size={16}>
    //                   <path
    //                     fill="#398cff"
    //                     d="M8,11L9.5,6.5H18.5L20,11M18.5,16A1.5,1.5 0 0,1 17,14.5A1.5,1.5 0 0,1 18.5,13A1.5,1.5 0 0,1 20,14.5A1.5,1.5 0 0,1 18.5,16M9.5,16A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 9.5,13A1.5,1.5 0 0,1 11,14.5A1.5,1.5 0 0,1 9.5,16M19.92,6C19.71,5.4 19.14,5 18.5,5H9.5C8.86,5 8.29,5.4 8.08,6L6,12V20A1,1 0 0,0 7,21H8A1,1 0 0,0 9,20V19H19V20A1,1 0 0,0 20,21H21A1,1 0 0,0 22,20V12L19.92,6M14.92,3C14.71,2.4 14.14,2 13.5,2H4.5C3.86,2 3.29,2.4 3.08,3L1,9V17A1,1 0 0,0 2,18H3A1,1 0 0,0 4,17V12.91C3.22,12.63 2.82,11.77 3.1,11C3.32,10.4 3.87,10 4.5,10H4.57L5.27,8H3L4.5,3.5H15.09L14.92,3Z"
    //                   />
    //                 </SVGIcon>
    //               }
    //             ></Button>
    //           </Popover>
    //         </div>
    //         <div
    //           className="primary-btn bordered  md-cell md-cell--4"
    //           onClick={() => {
    //             zoomMapToItem && zoomMapToItem(lyrItem[featureAttrib])
    //           }}
    //         >
    //           Zoom to
    //         </div>
    //         <div
    //           className="primary-btn  md-cell md-cell--4"
    //           onClick={() => {
    //             panMapToItems && panMapToItems([lyrItem[featureAttrib]])
    //           }}
    //         >
    //           Pan To
    //         </div>
    //       </div>
    //     </div>
    //   )
    // })
    //   <div className="no-data-msg">
    //     {loadingData ? 'Fetching Data...' : 'No Data Found'}
    //   </div>
    // )
  }

  const onSubmitFilters = _filters => {
    setFilters({ ..._filters })
    toggleFilterForm()
  }

  return (
    <>
      <div className="layers-title md-cell md-cell--12">
        <Icon
          onClick={() => {
            if (showForm) {
              toggleFilterForm()
            } else {
              onBack()
            }
          }}
          type="arrow-left"
        />
        {`${selectedLayerLabel}`}
      </div>
      <div style={{ position: 'relative', height: '100%' }}>
        {/* {renderTopBar()} */}
        {showForm ? (
          <FiltersForm
            data={selectedLayerData}
            onSubmit={onSubmitFilters}
            onDiscard={toggleFilterForm}
            selectedFilter={filters}
            selectedLayer={selectedLayer}
          />
        ) : (
          renderLayerCards()
        )}
      </div>
    </>
  )
}

LayerData.propTypes = {
  selectedLayerData: PropTypes.array,
  onBack: PropTypes.func,
  selectedLayerLabel: PropTypes.string,
}

export default LayerData
