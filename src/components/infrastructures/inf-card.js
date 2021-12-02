/* eslint-disable react/prop-types */
import React from 'react'

import './styles.scss'

const InfCard = ({
  infTitle,
  creationDate,
  infImage,
  className,
  onClick,
  infId,
}) => {
  return (
    <div
      className={`infCard ${className || ''}`}
      onClick={() => onClick(infId)}
    >
      <div className="infCard-imageWrapper">
        <img src={infImage} />
      </div>
      <div className="infCard-container">
        <div className="infCard-title">{infTitle}</div>
        <div className="infCard-content">
          <i className="mdi mdi-calendar" />
          Created:
          <span className="date">{creationDate}</span>
        </div>
      </div>
    </div>
  )
}
export default InfCard
