import React from 'react'
import PropTypes from 'prop-types'

export function Toc({ layers }) {
  return (
    <div>
      <h3>Table of Contents</h3>
      {layers.map(layer => (
        <input key={layer.id} id={layer.id} type="checkbox">
          {layers.title}
        </input>
      ))}
    </div>
  )
}

Toc.propTypes = {
  layers: PropTypes.array.isRequired,
}
