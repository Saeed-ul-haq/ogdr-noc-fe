import React from 'react'
import PropTypes from 'prop-types'
// import { Avatar, Tooltip } from 'antd'
import { SVGIcon } from 'react-md'

import './styles.scss'

const SearchResults = props => {
  const { results = [], onResultClick } = props
  return (
    <div className="search-result">
      <div className="search-result-list">
        {results.map(item => {
          let itemSource = {}
          Object.keys(item._source).forEach(itemKey => {
            if (itemKey !== 'location') {
              itemSource = {
                ...itemSource,
                [itemKey]: item._source[itemKey],
              }
            }
          })
          const { nameen, namear } = itemSource
          let palleteColor = item.legend || ''
          if (item._source.location) {
            if (item._source.location.includes('POLYGON')) {
              // palleteColor = 'rgba(78,148,80,0.2)'
              palleteColor = 'rgba(207,0,15,0.3)'
            }
            if (item._source.location.includes('LINESTRING')) {
              palleteColor = 'rgba(225,89,137,1)'
            }
          }
          return (
            <div
              key={item._id}
              className="result-list--item"
              onClick={() => {
                onResultClick && onResultClick(item)
              }}
            >
              <div
                className="marker-icon"
                style={{
                  background: palleteColor,
                }}
              >
                <SVGIcon size={32}>
                  <path
                    fill="#fff"
                    d="M12 4C14.2 4 16 5.8 16 8C16 10.1 13.9 13.5 12 15.9C10.1 13.4 8 10.1 8 8C8 5.8 9.8 4 12 4M12 2C8.7 2 6 4.7 6 8C6 12.5 12 19 12 19S18 12.4 18 8C18 4.7 15.3 2 12 2M12 6C10.9 6 10 6.9 10 8S10.9 10 12 10 14 9.1 14 8 13.1 6 12 6M20 19C20 21.2 16.4 23 12 23S4 21.2 4 19C4 17.7 5.2 16.6 7.1 15.8L7.7 16.7C6.7 17.2 6 17.8 6 18.5C6 19.9 8.7 21 12 21S18 19.9 18 18.5C18 17.8 17.3 17.2 16.2 16.7L16.8 15.8C18.8 16.6 20 17.7 20 19Z"
                  />
                </SVGIcon>
              </div>
              <div className="meta-info-1">
                <p className="info--category">
                  {item._index.slice(8, item._index.length).replace(/_/g, ' ')}
                </p>
                <p className="info--primary">
                  {namear ||
                    nameen ||
                    itemSource.nameenglish ||
                    itemSource[Object.keys(itemSource)[0] || '-1'] ||
                    ''}
                </p>
                <p className="info--secondary">
                  <b>{Object.keys(itemSource)[1] || ''}: </b>
                  {itemSource[Object.keys(itemSource)[1] || '-1'] || ''}
                </p>
              </div>
              {/* <div className="meta-info">
                <p className="namear">
                  {palleteColor !== '' && (
                    <div
                      className="pallete"
                      style={{ background: palleteColor }}
                    ></div>
                  )}
                  {namear ||
                    itemSource[Object.keys(itemSource)[0] || '-1'] ||
                    ''}
                </p>
                <p className="nameen">
                  {nameen ||
                    itemSource.nameenglish ||
                    itemSource[Object.keys(itemSource)[1] || '-1'] ||
                    ''}
                </p>
                <p className="nameen">
                  {Object.keys(itemSource)[4] ? (
                    <b>{`${Object.keys(itemSource)[2]}: `}</b>
                  ) : null}
                  {itemSource[Object.keys(itemSource)[2] || '-1'] || ''}
                </p>
                <p className="nameen">
                  {Object.keys(itemSource)[4] ? (
                    <b>{`${Object.keys(itemSource)[3]}: `}</b>
                  ) : null}
                  {itemSource[Object.keys(itemSource)[3] || '-1'] || ''}
                </p>
                <p className="nameen">
                  {Object.keys(itemSource)[4] ? (
                    <b>{`${Object.keys(itemSource)[4]}: `}</b>
                  ) : null}
                  {itemSource[Object.keys(itemSource)[4] || '-1'] || ''}
                </p>
              </div> */}
              {/* <div className="index-info">
                <div className="avatar-group">
                  <Avatar
                    style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
                    size="large"
                  >
                    {item._index.slice(8, item._index.length)[0]}
                  </Avatar>
                  <Tooltip
                    title={item._index
                      .slice(8, item._index.length)
                      .replace(/_/g, ' ')
                      .toUpperCase()}
                  >
                    <p className="avatar-title">
                      {item._index
                        .slice(8, item._index.length)
                        .replace(/_/g, ' ')}
                    </p>
                  </Tooltip>
                </div>
              </div> */}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SearchResults
SearchResults.propTypes = {
  onResultClick: PropTypes.func,
  results: PropTypes.array,
}
