import React from 'react'
import { Chip, FontIcon } from 'react-md'
import PropTypes from 'prop-types'
import './index.scss'

export const UploadProgress = ({ percent = null, onAbort, message, type }) => {
  const radius = 95
  let strokeDashoffset = 0

  if (isNaN(percent) || percent < 0) {
    percent = 0
  }

  if (percent > 100) {
    percent = 100
  }

  strokeDashoffset = ((100 - percent) / 100) * Math.PI * (radius * 2)

  return (
    <div className="upload-progress">
      <div className={`upload-progress-container ${type}`} data-pct={percent}>
        <svg
          id="upload-progress-vector"
          width="200"
          height="200"
          viewPort="0 0 100 100"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            r={radius}
            className={type || 'info'}
            cx="100"
            cy="100"
            fill="transparent"
            strokeDasharray="596.9026041820607"
            style={{ strokeDashoffset }}
          />
        </svg>
      </div>
      <div className="message">{message || 'Uploading Files'}</div>
      <div className="actions">
        {percent === 100 ? (
          <span style={{ display: 'flex', justifyContent: 'center' }}>
            <FontIcon style={{ color: '#27a499' }}>check_circle</FontIcon>
            &nbsp; Completed
          </span>
        ) : (
          onAbort && <Chip label="Abort" onClick={onAbort} />
        )}
      </div>
    </div>
  )
}

UploadProgress.propTypes = {
  percent: PropTypes.number,
  onAbort: PropTypes.func,
  message: PropTypes.string,
  style: PropTypes.object,
  type: PropTypes.string,
}

export default UploadProgress
