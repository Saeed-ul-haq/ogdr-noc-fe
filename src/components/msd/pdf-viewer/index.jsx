/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'

import './styles.scss'

const PDFViewer = ({ style = {}, className = '', src = '' }) => {
  return (
    <div
      id="pdfContainer"
      style={style || {}}
      className={`pdf-doc ${className || ''}`}
    >
      <iframe
        src={`/static/web/viewer.html?file=${encodeURIComponent(src)}`}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  )
}
PDFViewer.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  src: PropTypes.string,
}
export default PDFViewer
