import React from 'react'
import PropTypes from 'prop-types'

import { SVGIcon } from 'react-md'

import { Card } from 'antd'

import i18n from 'i18n-js'
import l from 'libs/langs/keys'

import './styles.scss'
function LayerDetailCard({ layer }) {
  return (
    <>
      <Card className="list-card-main card-box">
        <div className="card-header">
          <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
            {`${i18n.t(l.description)}`}
          </h4>
        </div>
        <div className="pb-0">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <SVGIcon size={14} style={{ marginRight: '0.5rem' }}>
                <path
                  fill="#7a7b97"
                  d="M20.5,18L17.5,21V19H5V17H17.5V15L20.5,18M10.13,10H13.88L12,4.97L10.13,10M12.75,3L17.5,14H15.42L14.5,11.81H9.5L8.58,14H6.5L11.25,3H12.75Z"
                />
              </SVGIcon>
              <b>{`${i18n.t(l.layer_name)}`}</b>
            </div>
            <div className="item-value">{layer.displayName}</div>
          </div>
          <div className="divider my-3" />
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <SVGIcon size={14} style={{ marginRight: '0.5rem' }}>
                <path
                  fill="#7a7b97"
                  d="M8.58,17.25L9.5,13.36L6.5,10.78L10.45,10.41L12,6.8L13.55,10.45L17.5,10.78L14.5,13.36L15.42,17.25L12,15.19L8.58,17.25M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z"
                />
              </SVGIcon>
              <b>{`${i18n.t(l.feature_attribute)}`}</b>
            </div>
            <div className="item-value">{layer.featureAttribute}</div>
          </div>
          <div className="divider my-3" />
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <SVGIcon size={14} style={{ marginRight: '0.5rem' }}>
                <path
                  fill="#7a7b97"
                  d="M18.27 6C19.28 8.17 19.05 10.73 17.94 12.81C17 14.5 15.65 15.93 14.5 17.5C14 18.2 13.5 18.95 13.13 19.76C13 20.03 12.91 20.31 12.81 20.59C12.71 20.87 12.62 21.15 12.53 21.43C12.44 21.69 12.33 22 12 22H12C11.61 22 11.5 21.56 11.42 21.26C11.18 20.53 10.94 19.83 10.57 19.16C10.15 18.37 9.62 17.64 9.08 16.93L18.27 6M9.12 8.42L5.82 12.34C6.43 13.63 7.34 14.73 8.21 15.83C8.42 16.08 8.63 16.34 8.83 16.61L13 11.67L12.96 11.68C11.5 12.18 9.88 11.44 9.3 10C9.22 9.83 9.16 9.63 9.12 9.43C9.07 9.06 9.06 8.79 9.12 8.43L9.12 8.42M6.58 4.62L6.57 4.63C4.95 6.68 4.67 9.53 5.64 11.94L9.63 7.2L9.58 7.15L6.58 4.62M14.22 2.36L11 6.17L11.04 6.16C12.38 5.7 13.88 6.28 14.56 7.5C14.71 7.78 14.83 8.08 14.87 8.38C14.93 8.76 14.95 9.03 14.88 9.4L14.88 9.41L18.08 5.61C17.24 4.09 15.87 2.93 14.23 2.37L14.22 2.36M9.89 6.89L13.8 2.24L13.76 2.23C13.18 2.08 12.59 2 12 2C10.03 2 8.17 2.85 6.85 4.31L6.83 4.32L9.89 6.89Z"
                />
              </SVGIcon>
              <b>{`${i18n.t(l.map)}`}</b>
            </div>
            <div className="item-value">{layer.mapName}</div>
          </div>
          <div className="divider my-3" />
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <SVGIcon size={14} style={{ marginRight: '0.5rem' }}>
                <path
                  fill="#7a7b97"
                  d="M4,1H20A1,1 0 0,1 21,2V6A1,1 0 0,1 20,7H4A1,1 0 0,1 3,6V2A1,1 0 0,1 4,1M4,9H20A1,1 0 0,1 21,10V14A1,1 0 0,1 20,15H4A1,1 0 0,1 3,14V10A1,1 0 0,1 4,9M4,17H20A1,1 0 0,1 21,18V22A1,1 0 0,1 20,23H4A1,1 0 0,1 3,22V18A1,1 0 0,1 4,17M9,5H10V3H9V5M9,13H10V11H9V13M9,21H10V19H9V21M5,3V5H7V3H5M5,11V13H7V11H5M5,19V21H7V19H5Z"
                />
              </SVGIcon>
              <b>{`${i18n.t(l.server)}`}</b>
            </div>
            <div className="item-value">{layer.serverName}</div>
          </div>
          <div className="divider my-3" />
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <SVGIcon size={14} style={{ marginRight: '0.5rem' }}>
                <path
                  fill="#7a7b97"
                  d="M3 1C1.89 1 1 1.89 1 3V14C1 15.11 1.89 16 3 16H14C15.11 16 16 15.11 16 14V11H14V14H3V3H14V5H16V3C16 1.89 15.11 1 14 1M9 7C7.89 7 7 7.89 7 9V12H9V9H20V20H9V18H7V20C7 21.11 7.89 22 9 22H20C21.11 22 22 21.11 22 20V9C22 7.89 21.11 7 20 7H9"
                />
              </SVGIcon>
              <b>{`${i18n.t(l.wfs_name)}`}</b>
            </div>
            <div className="item-value">{layer.wfsName}</div>
          </div>
          <div className="divider my-3" />
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <SVGIcon size={14} style={{ marginRight: '0.5rem' }}>
                <path
                  fill="#7a7b97"
                  d="M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V5H19V19M13.94,10.06C14.57,10.7 14.92,11.54 14.92,12.44C14.92,13.34 14.57,14.18 13.94,14.81L11.73,17C11.08,17.67 10.22,18 9.36,18C8.5,18 7.64,17.67 7,17C5.67,15.71 5.67,13.58 7,12.26L8.35,10.9L8.34,11.5C8.33,12 8.41,12.5 8.57,12.94L8.62,13.09L8.22,13.5C7.91,13.8 7.74,14.21 7.74,14.64C7.74,15.07 7.91,15.47 8.22,15.78C8.83,16.4 9.89,16.4 10.5,15.78L12.7,13.59C13,13.28 13.18,12.87 13.18,12.44C13.18,12 13,11.61 12.7,11.3C12.53,11.14 12.44,10.92 12.44,10.68C12.44,10.45 12.53,10.23 12.7,10.06C13.03,9.73 13.61,9.74 13.94,10.06M18,9.36C18,10.26 17.65,11.1 17,11.74L15.66,13.1V12.5C15.67,12 15.59,11.5 15.43,11.06L15.38,10.92L15.78,10.5C16.09,10.2 16.26,9.79 16.26,9.36C16.26,8.93 16.09,8.53 15.78,8.22C15.17,7.6 14.1,7.61 13.5,8.22L11.3,10.42C11,10.72 10.82,11.13 10.82,11.56C10.82,12 11,12.39 11.3,12.7C11.47,12.86 11.56,13.08 11.56,13.32C11.56,13.56 11.47,13.78 11.3,13.94C11.13,14.11 10.91,14.19 10.68,14.19C10.46,14.19 10.23,14.11 10.06,13.94C8.75,12.63 8.75,10.5 10.06,9.19L12.27,7C13.58,5.67 15.71,5.68 17,7C17.65,7.62 18,8.46 18,9.36Z"
                />
              </SVGIcon>
              <b>{`${i18n.t(l.wfs_uri)}`}</b>
            </div>
            <div className="item-value">{layer.wfsUrl}</div>
          </div>
        </div>
        {/* <div className="sparkline-full-wrapper" style={{ height: 103 }}>
          <Line data={data3Success} options={data3SuccessOptions} />
        </div> */}
      </Card>
    </>
  )
}

LayerDetailCard.propTypes = {
  layer: PropTypes.object,
}
export default LayerDetailCard
