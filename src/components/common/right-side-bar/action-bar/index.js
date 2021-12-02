import React from 'react'
import { SVGIcon, FontIcon } from 'react-md'
import PropTypes from 'prop-types'
import './styles.scss'

import i18n from 'i18n-js'
import l from 'libs/langs/keys'

const DetailsBar = ({ mapTitle, creationDate, layersList, hideDetails }) => {
  const getIcon = () => {
    return (
      <div
        style={{
          width: '25px',
          height: '25px',
          background: '#1565c0',
          borderRadius: '4px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: '10px',
        }}
      >
        <SVGIcon size={18}>
          <path
            fill="#fff"
            d="M15,19L9,16.89V5L15,7.11M20.5,3C20.44,3 20.39,3 20.34,3L15,5.1L9,3L3.36,4.9C3.15,4.97 3,5.15 3,5.38V20.5A0.5,0.5 0 0,0 3.5,21C3.55,21 3.61,21 3.66,20.97L9,18.9L15,21L20.64,19.1C20.85,19 21,18.85 21,18.62V3.5A0.5,0.5 0 0,0 20.5,3Z"
          />
        </SVGIcon>
      </div>
    )
  }
  return (
    <div className="action-bar-container">
      <header>
        <div className="icon-name-container">
          {getIcon()}
          <div>
            <div className="text-area">
              {mapTitle}
              <br></br>
              {creationDate}
            </div>
          </div>
        </div>
        <FontIcon className="close-icon" onClick={() => hideDetails()}>
          close
        </FontIcon>
      </header>
      <div className="section-wrapper">
        {/* ------------Layers Section ------------------ */}
        <section>
          <div className="section-wrapper--img">
            <img
              className="action-bar-img"
              src="/static/images/image.png"
              alt="map"
            />
          </div>
        </section>
        {layersList.length > 0 && (
          <section>
            <div className="section--division">{`${i18n.t(l.layers)}`}</div>
            {layersList.map((lyr, index) => (
              <div key={index} className="section--div">
                {`${index + 1}. ${lyr}`}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  )
}

DetailsBar.propTypes = {
  mapTitle: PropTypes.string,
  creationDate: PropTypes.string,
  layersList: PropTypes.array,
  hideDetails: PropTypes.func,
}

export default DetailsBar
