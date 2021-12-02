/* eslint-disable react/prop-types */
import React from 'react'
import { Tooltip } from 'antd'
import { orderBy } from 'lodash'

const BaseLayers = ({ layers = [], setLayersVisibility }) => {
  return (
    <main className="base-maps">
      <div className="base-cards-container md-grid">
        {orderBy(layers || [], 'displayOrder')
          .filter(l => l.layerType !== 'BingTraffic')
          .map((layer, i) => {
            return (
              <Tooltip
                title={layer.displayName || layer.label}
                key={i}
                placement="bottom"
              >
                <section
                  className={
                    layer.visible
                      ? 'base-layer-card selected'
                      : 'base-layer-card'
                  }
                  onClick={() => {
                    setLayersVisibility &&
                      setLayersVisibility([
                        { id: layer.id, value: !layer.visible },
                      ])
                  }}
                >
                  {layer.displayName || layer.label}
                </section>
              </Tooltip>
            )
          })}
      </div>
    </main>
  )
}

export default BaseLayers
