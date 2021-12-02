import React from 'react'
import PropTypes from 'prop-types'
import { Avatar, Tooltip } from 'antd'
import { SVGIcon } from 'react-md'

// import materialColorGenerator from 'libs/utils/material-color-generator'

import './styles.scss'

const Categories = props => {
  const {
    indices = [],
    onCategoryClick,
    showMore = false,
    onLessClick,
    onMoreClick,
    activeCategory = '',
  } = props
  return (
    <div className="categories">
      <div className="category-list--primary">
        {indices.slice(0, 4).map(item => {
          return (
            <div
              key={item.index}
              className="avatar-group"
              onClick={() => {
                onCategoryClick &&
                  onCategoryClick(item.index.slice(8, item.index.length))
              }}
              style={
                item.index === `spatial${activeCategory}`
                  ? { background: 'aliceblue' }
                  : {}
              }
            >
              <Avatar
                style={
                  item.index === `spatial${activeCategory}`
                    ? { color: '#fff', backgroundColor: 'rgb(126, 178, 255)' }
                    : { color: '#f56a00', backgroundColor: '#fde3cf' }
                }
                size="large"
              >
                {item.index.slice(8, item.index.length)[0]}
              </Avatar>
              <Tooltip
                title={item.index
                  .slice(8, item.index.length)
                  .replace(/_/g, ' ')
                  .toUpperCase()}
              >
                <p
                  className="avatar-title"
                  style={
                    item.index === `spatial${activeCategory}`
                      ? { fontWeight: '600' }
                      : {}
                  }
                >
                  {item.index.slice(8, item.index.length).replace(/_/g, ' ')}
                </p>
              </Tooltip>
            </div>
          )
        })}
        {indices.length > 4 && (
          <div
            className="avatar-group"
            onClick={() => {
              if (showMore) {
                onLessClick && onLessClick()
              } else {
                onMoreClick && onMoreClick()
              }
            }}
          >
            <Avatar
              style={{ backgroundColor: '#6C8492' }}
              size="large"
              icon={
                <SVGIcon>
                  {showMore ? (
                    <path
                      fill="#fff"
                      d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"
                    />
                  ) : (
                    <path
                      fill="#fff"
                      d="M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z"
                    />
                  )}
                </SVGIcon>
              }
            />
            <p className="avatar-title">{showMore ? 'Less' : 'More'}</p>
          </div>
        )}
      </div>
      {showMore && (
        <div className="category-list--secondary">
          {indices.slice(4, indices.length).map(item => {
            return (
              <div
                key={item.index}
                className="avatar-group--container"
                onClick={() => {
                  onCategoryClick &&
                    onCategoryClick(item.index.slice(8, item.index.length))
                }}
              >
                <div
                  className="avatar-group"
                  style={
                    item.index === `spatial${activeCategory}`
                      ? { background: 'aliceblue' }
                      : {}
                  }
                >
                  <Avatar
                    style={
                      item.index === `spatial${activeCategory}`
                        ? {
                          color: '#fff',
                          backgroundColor: 'rgb(126, 178, 255)',
                        }
                        : { backgroundColor: '#6C8492' }
                    }
                    size="large"
                  >
                    {item.index.slice(8, item.index.length)[0]}
                  </Avatar>
                  <Tooltip
                    title={item.index
                      .slice(8, item.index.length)
                      .replace(/_/g, ' ')
                      .toUpperCase()}
                  >
                    <p
                      className="avatar-title"
                      style={
                        item.index === `spatial${activeCategory}`
                          ? { fontWeight: '600' }
                          : {}
                      }
                    >
                      {item.index
                        .slice(8, item.index.length)
                        .replace(/_/g, ' ')}
                    </p>
                  </Tooltip>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Categories
Categories.propTypes = {
  onCategoryClick: PropTypes.func,
  indices: PropTypes.array,
  showMore: PropTypes.bool,
  onLessClick: PropTypes.func,
  onMoreClick: PropTypes.func,
  activeCategory: PropTypes.string,
}
