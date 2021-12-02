import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Input, Spin, Menu, Dropdown, message } from 'antd'
import { SVGIcon } from 'react-md'

import Suggestions from 'components/search/search-bar/suggestions'
import Categories from 'components/search/search-bar/categories'
import SearchResults from 'components/search/search-bar/search-results'

import { SPATIAL_INDEX_API } from 'components/indices/api'

import './styles.scss'

const SearchBar = props => {
  const {
    indices = [],
    fetchingIndices = false,
    onResultClick,
    onResults,
    currentExtent,
    onClearSearch,
    onPressEnter,
    onCategoryClick,
    onSuggestionClick,
    forcedExpanded = false,
    defaultCollapsed = true,
    liveExtentSearch = false,
    onCollapsed,
    defaultSearch = '',
    hideCategories = false,
  } = props
  const [isExpanded, setIsExpanded] = useState(forcedExpanded)
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
  const [isFocus, setFocus] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [showMoreCategories, setShowMoreCategories] = useState(false)
  const [activeRelation, setActiveRelation] = useState('global')
  const [activeCategory, setActiveCategory] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [defaultSearched, setDefaultSearched] = useState(false)
  const setSearchSuggestions = (search = '') => {
    if (search !== '') {
      let coockieSearchSuggestions = JSON.parse(
        localStorage.getItem('suggestions') || '[]',
      )
      let flag = true
      coockieSearchSuggestions.forEach(suggestion => {
        if (suggestion.text === search) {
          flag = false
        }
      })
      if (flag) {
        if (coockieSearchSuggestions.length > 4) {
          coockieSearchSuggestions = coockieSearchSuggestions.slice(1, 5)
        }
        coockieSearchSuggestions = [
          ...coockieSearchSuggestions,
          { text: search },
        ]
        localStorage.setItem(
          'suggestions',
          JSON.stringify(coockieSearchSuggestions),
        )
      }
    }
  }
  const handleSuggestionClick = (searchValue = '') => {
    handleSearchChange(searchValue)
    handleSearch({ search: searchValue, category: activeCategory })
  }
  const handleOnFocus = () => {
    setFocus(true)
  }
  const handleOnBlur = () => {
    setTimeout(() => {
      setFocus(false)
    }, 500)
  }
  const handleSearch = ({ search = '', category = '' }) => {
    setLoading(true)
    let body = {
      elasticConfig: {
        server: ELASTIC_CONFIG_DEFAULT_SERVER,
        port: ELASTIC_CONFIG_DEFAULT_PORT,
        scheme: ELASTIC_CONFIG_DEFAULT_SCHEME,
        ...(ELASTIC_CONFIG_DEFAULT_USER === '*'
          ? {}
          : {
            user: ELASTIC_CONFIG_DEFAULT_USER,
            password: ELASTIC_CONFIG_DEFAULT_PASSWORD,
          }),
      },
      prefix: `spatial${category}`,
      search: `${search}`,
    }
    if (activeRelation !== 'global') {
      body = {
        ...body,
        spatialFilter: currentExtent
          ? {
            geometryType: 'envelope',
            coordinates: `[[${currentExtent.maxx},${currentExtent.maxy}],[${currentExtent.minx},${currentExtent.miny}]]`,
            relation: `${activeRelation}`,
          }
          : {
            relation: `${activeRelation}`,
          },
      }
    }
    SPATIAL_INDEX_API({
      api: 'search',
      body,
    })
      .then(SEARCH_RESPONSE => {
        const { hits = { hits: [] } } = SEARCH_RESPONSE
        const results = hits.hits
        setSearchResults(results)
        onResults && onResults(results)
      })
      .catch(exception => {
        const { body } = exception
        if (body) {
          message.error(body.message || body.error)
        } else {
          console.error({ exception })
        }
        setSearchResults([])
      })
      .finally(() => {
        setLoading(false)
        setFocus(false)
        handleExpansion(true)
        setSearchSuggestions(search)
      })
  }
  const handleSearchChange = (search = '') => {
    setSearchText(search)
  }
  const handleExpansion = (expansion = false) => {
    if (forcedExpanded) {
      setIsExpanded(true)
    } else {
      // onExpanded && onExpanded(expansion)
      setIsExpanded(expansion)
    }
  }
  const getIndexColor = index => {
    let indexColor = ''
    indices.forEach(i => {
      if (i.index === index) {
        if (i.markerColor) {
          indexColor = i.markerColor
        }
      }
    })
    return indexColor
  }
  useEffect(() => {
    if (liveExtentSearch) {
      if (searchText !== '') {
        handleSearch({ search: searchText, category: activeCategory })
      }
    } else {
      if (defaultSearch !== '' && !defaultSearched) {
        setSearchText(defaultSearch)
        handleSearch({
          search: defaultSearch,
          category: activeCategory,
        })
        setDefaultSearched(true)
      }
    }
  }, [currentExtent])
  const suggestions = JSON.parse(localStorage.getItem('suggestions') || '[]')
  return (
    <div
      className={`search-box${isExpanded ? ' expanded' : ''}`}
      style={!isCollapsed ? { width: '0' } : {}}
    >
      {isExpanded && (
        <div
          className="expand-collapse-icon"
          onClick={() => {
            onCollapsed && onCollapsed(!isCollapsed)
            setIsCollapsed(!isCollapsed)
          }}
          style={isCollapsed ? {} : { top: '80px' }}
        >
          <SVGIcon size={24}>
            {isCollapsed ? (
              <path
                fill="currentColor"
                d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"
              />
            ) : (
              <path
                fill="currentColor"
                d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"
              />
            )}
          </SVGIcon>
        </div>
      )}
      <div
        className={`search--input-grp${isCollapsed ? '' : ' hidden'}`}
        style={isExpanded ? { position: 'absolute', zIndex: '1' } : {}}
      >
        <div className="input-grp">
          {loading && <Spin />}
          {!loading && (
            <SVGIcon
              size={30}
              onClick={() => {
                if (searchText !== '') {
                  handleSearch({ search: searchText, category: activeCategory })
                  onPressEnter && onPressEnter()
                }
              }}
            >
              <path
                fill="currentColor"
                d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
              />
            </SVGIcon>
          )}
          {/* {isExpanded && !loading && (
            <SVGIcon
              size={30}
              onClick={() => {
                onClearSearch && onClearSearch()
                setSearchResults([])
                handleExpansion(false)
                handleSearchChange('')
              }}
            >
              <path
                fill="currentColor"
                d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"
              />
            </SVGIcon>
          )} */}
          <Input
            className={`search-bar`}
            size="large"
            placeholder="Search Fluxble Maps"
            value={searchText}
            onPressEnter={e => {
              handleSearch({ search: e.target.value, category: activeCategory })
              onPressEnter && onPressEnter()
            }}
            onBlur={handleOnBlur}
            onFocus={handleOnFocus}
            onChange={e => {
              handleSearchChange(e.target.value)
            }}
          />
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="0">
                  <div
                    className="relation-item"
                    onClick={() => {
                      setActiveRelation('disjoint')
                    }}
                  >
                    <SVGIcon>
                      <path
                        fill="currentColor"
                        d="M9,5C10.04,5 11.06,5.24 12,5.68C12.94,5.24 13.96,5 15,5A7,7 0 0,1 22,12A7,7 0 0,1 15,19C13.96,19 12.94,18.76 12,18.32C11.06,18.76 10.04,19 9,19A7,7 0 0,1 2,12A7,7 0 0,1 9,5M9,12C9,14.22 10.21,16.16 12,17.2C13.79,16.16 15,14.22 15,12C15,9.78 13.79,7.84 12,6.8C10.21,7.84 9,9.78 9,12Z"
                      />
                    </SVGIcon>
                    {`Disjoint`}
                  </div>
                </Menu.Item>
                <Menu.Item key="1">
                  <div
                    className="relation-item"
                    onClick={() => {
                      setActiveRelation('intersects')
                    }}
                  >
                    <SVGIcon>
                      <path
                        fill="currentColor"
                        d="M9,5A7,7 0 0,0 2,12A7,7 0 0,0 9,19C10.04,19 11.06,18.76 12,18.32C12.94,18.76 13.96,19 15,19A7,7 0 0,0 22,12A7,7 0 0,0 15,5C13.96,5 12.94,5.24 12,5.68C11.06,5.24 10.04,5 9,5M9,7C9.34,7 9.67,7.03 10,7.1C8.72,8.41 8,10.17 8,12C8,13.83 8.72,15.59 10,16.89C9.67,16.96 9.34,17 9,17A5,5 0 0,1 4,12A5,5 0 0,1 9,7M15,7A5,5 0 0,1 20,12A5,5 0 0,1 15,17C14.66,17 14.33,16.97 14,16.9C15.28,15.59 16,13.83 16,12C16,10.17 15.28,8.41 14,7.11C14.33,7.04 14.66,7 15,7Z"
                      />
                    </SVGIcon>
                    {`Intersects`}
                  </div>
                </Menu.Item>
                <Menu.Item key="2">
                  <div
                    className="relation-item"
                    onClick={() => {
                      setActiveRelation('within')
                    }}
                  >
                    <SVGIcon>
                      <path
                        fill="currentColor"
                        d="M9,5C10.04,5 11.06,5.24 12,5.68C12.94,5.24 13.96,5 15,5A7,7 0 0,1 22,12A7,7 0 0,1 15,19C13.96,19 12.94,18.76 12,18.32C11.06,18.76 10.04,19 9,19A7,7 0 0,1 2,12A7,7 0 0,1 9,5M8.5,12C8.5,13.87 9.29,15.56 10.56,16.75L11.56,16.29C10.31,15.29 9.5,13.74 9.5,12C9.5,10.26 10.31,8.71 11.56,7.71L10.56,7.25C9.29,8.44 8.5,10.13 8.5,12M15.5,12C15.5,10.13 14.71,8.44 13.44,7.25L12.44,7.71C13.69,8.71 14.5,10.26 14.5,12C14.5,13.74 13.69,15.29 12.44,16.29L13.44,16.75C14.71,15.56 15.5,13.87 15.5,12Z"
                      />
                    </SVGIcon>
                    {`Within`}
                  </div>
                </Menu.Item>
                <Menu.Item key="3">
                  <div
                    className="relation-item"
                    onClick={() => {
                      setActiveRelation('contains')
                    }}
                  >
                    <SVGIcon>
                      <path
                        fill="currentColor"
                        d="M9,5A7,7 0 0,0 2,12A7,7 0 0,0 9,19C10.04,19 11.06,18.76 12,18.32C12.94,18.76 13.96,19 15,19A7,7 0 0,0 22,12A7,7 0 0,0 15,5C13.96,5 12.94,5.24 12,5.68C11.06,5.24 10.04,5 9,5M15,7A5,5 0 0,1 20,12A5,5 0 0,1 15,17C14.66,17 14.33,16.97 14,16.9C15.28,15.59 16,13.83 16,12C16,10.17 15.28,8.41 14,7.11C14.33,7.04 14.66,7 15,7M12,8C13.26,8.95 14,10.43 14,12C14,13.57 13.26,15.05 12,16C10.74,15.05 10,13.57 10,12C10,10.43 10.74,8.95 12,8Z"
                      />
                    </SVGIcon>
                    {`Contains`}
                  </div>
                </Menu.Item>
                <Menu.Item key="4">
                  <div
                    className="relation-item"
                    onClick={() => {
                      setActiveRelation('global')
                    }}
                  >
                    <SVGIcon>
                      <path
                        fill="currentColor"
                        d="M17.9,17.39C17.64,16.59 16.89,16 16,16H15V13A1,1 0 0,0 14,12H8V10H10A1,1 0 0,0 11,9V7H13A2,2 0 0,0 15,5V4.59C17.93,5.77 20,8.64 20,12C20,14.08 19.2,15.97 17.9,17.39M11,19.93C7.05,19.44 4,16.08 4,12C4,11.38 4.08,10.78 4.21,10.21L9,15V16A2,2 0 0,0 11,18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
                      />
                    </SVGIcon>
                    {`Global`}
                  </div>
                </Menu.Item>
              </Menu>
            }
            trigger={['click']}
          >
            <SVGIcon size={30}>
              {
                {
                  disjoint: (
                    <path
                      fill="currentColor"
                      d="M9,5C10.04,5 11.06,5.24 12,5.68C12.94,5.24 13.96,5 15,5A7,7 0 0,1 22,12A7,7 0 0,1 15,19C13.96,19 12.94,18.76 12,18.32C11.06,18.76 10.04,19 9,19A7,7 0 0,1 2,12A7,7 0 0,1 9,5M9,12C9,14.22 10.21,16.16 12,17.2C13.79,16.16 15,14.22 15,12C15,9.78 13.79,7.84 12,6.8C10.21,7.84 9,9.78 9,12Z"
                    />
                  ),
                  intersects: (
                    <path
                      fill="currentColor"
                      d="M9,5A7,7 0 0,0 2,12A7,7 0 0,0 9,19C10.04,19 11.06,18.76 12,18.32C12.94,18.76 13.96,19 15,19A7,7 0 0,0 22,12A7,7 0 0,0 15,5C13.96,5 12.94,5.24 12,5.68C11.06,5.24 10.04,5 9,5M9,7C9.34,7 9.67,7.03 10,7.1C8.72,8.41 8,10.17 8,12C8,13.83 8.72,15.59 10,16.89C9.67,16.96 9.34,17 9,17A5,5 0 0,1 4,12A5,5 0 0,1 9,7M15,7A5,5 0 0,1 20,12A5,5 0 0,1 15,17C14.66,17 14.33,16.97 14,16.9C15.28,15.59 16,13.83 16,12C16,10.17 15.28,8.41 14,7.11C14.33,7.04 14.66,7 15,7Z"
                    />
                  ),
                  within: (
                    <path
                      fill="currentColor"
                      d="M9,5C10.04,5 11.06,5.24 12,5.68C12.94,5.24 13.96,5 15,5A7,7 0 0,1 22,12A7,7 0 0,1 15,19C13.96,19 12.94,18.76 12,18.32C11.06,18.76 10.04,19 9,19A7,7 0 0,1 2,12A7,7 0 0,1 9,5M8.5,12C8.5,13.87 9.29,15.56 10.56,16.75L11.56,16.29C10.31,15.29 9.5,13.74 9.5,12C9.5,10.26 10.31,8.71 11.56,7.71L10.56,7.25C9.29,8.44 8.5,10.13 8.5,12M15.5,12C15.5,10.13 14.71,8.44 13.44,7.25L12.44,7.71C13.69,8.71 14.5,10.26 14.5,12C14.5,13.74 13.69,15.29 12.44,16.29L13.44,16.75C14.71,15.56 15.5,13.87 15.5,12Z"
                    />
                  ),
                  contains: (
                    <path
                      fill="currentColor"
                      d="M9,5A7,7 0 0,0 2,12A7,7 0 0,0 9,19C10.04,19 11.06,18.76 12,18.32C12.94,18.76 13.96,19 15,19A7,7 0 0,0 22,12A7,7 0 0,0 15,5C13.96,5 12.94,5.24 12,5.68C11.06,5.24 10.04,5 9,5M15,7A5,5 0 0,1 20,12A5,5 0 0,1 15,17C14.66,17 14.33,16.97 14,16.9C15.28,15.59 16,13.83 16,12C16,10.17 15.28,8.41 14,7.11C14.33,7.04 14.66,7 15,7M12,8C13.26,8.95 14,10.43 14,12C14,13.57 13.26,15.05 12,16C10.74,15.05 10,13.57 10,12C10,10.43 10.74,8.95 12,8Z"
                    />
                  ),
                  global: (
                    <path
                      fill="currentColor"
                      d="M17.9,17.39C17.64,16.59 16.89,16 16,16H15V13A1,1 0 0,0 14,12H8V10H10A1,1 0 0,0 11,9V7H13A2,2 0 0,0 15,5V4.59C17.93,5.77 20,8.64 20,12C20,14.08 19.2,15.97 17.9,17.39M11,19.93C7.05,19.44 4,16.08 4,12C4,11.38 4.08,10.78 4.21,10.21L9,15V16A2,2 0 0,0 11,18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
                    />
                  ),
                }[activeRelation]
              }
            </SVGIcon>
          </Dropdown>
          <div className="divider" />
          <SVGIcon
            size={30}
            onClick={() => {
              onClearSearch && onClearSearch()
              setActiveCategory('')
              setSearchResults([])
              handleExpansion(false)
              handleSearchChange('')
            }}
          >
            <path
              fill="currentColor"
              d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
            />
          </SVGIcon>
        </div>
        {isFocus && suggestions.length > 0 && (
          <Suggestions
            suggestions={suggestions.reverse()}
            onSuggestionClick={({ text }) => {
              handleSuggestionClick(text)
              onSuggestionClick && onSuggestionClick(text)
            }}
          />
        )}
      </div>
      {!isExpanded && isFocus && !hideCategories && (
        <div
          className="category-section"
          // style={isExpanded ? {} : { width: '393px' }}
          style={isExpanded ? {} : { width: '410px' }}
        >
          {fetchingIndices && (
            <div className="spin-loader">
              <Spin size={'large'} />
              <p>{`LOADING CATEGORIES`}</p>
            </div>
          )}
          {!fetchingIndices && (
            <Categories
              indices={indices}
              showMore={false}
              onMoreClick={() => {
                setShowMoreCategories(true)
                handleExpansion(true)
              }}
              onLessClick={() => {
                setShowMoreCategories(false)
              }}
              onCategoryClick={cat => {
                setActiveCategory(`_${cat}`)
                handleSearch({ search: searchText, category: `_${cat}` })
                onCategoryClick && onCategoryClick()
              }}
              activeCategory={activeCategory}
            />
          )}
        </div>
      )}
      {isExpanded && (
        <div className={`search-container section-layout-inset-shadow`}>
          <div
            className="category-section"
            style={isExpanded ? {} : { width: '393px' }}
          >
            {fetchingIndices && (
              <div className="spin-loader">
                <Spin size={'large'} />
                <p>{`LOADING CATEGORIES`}</p>
              </div>
            )}
            {!fetchingIndices && !hideCategories && (
              <Categories
                indices={indices}
                showMore={showMoreCategories}
                onMoreClick={() => {
                  setShowMoreCategories(true)
                }}
                onLessClick={() => {
                  setShowMoreCategories(false)
                }}
                onCategoryClick={cat => {
                  setActiveCategory(`_${cat}`)
                  handleSearch({ search: searchText, category: `_${cat}` })
                  onCategoryClick && onCategoryClick()
                }}
                activeCategory={activeCategory}
              />
            )}
            {searchResults.length > 0 && (
              <SearchResults
                results={searchResults.map(result => {
                  return {
                    ...result,
                    legend: getIndexColor(result._index),
                  }
                })}
                onResultClick={result => {
                  onResultClick && onResultClick(result)
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBar

SearchBar.propTypes = {
  location: PropTypes.object,
  indices: PropTypes.array,
  fetchingIndices: PropTypes.bool,
  onResultClick: PropTypes.func,
  onResults: PropTypes.func,
  currentExtent: PropTypes.object,
  onClearSearch: PropTypes.func,
  onPressEnter: PropTypes.func,
  onCategoryClick: PropTypes.func,
  onSuggestionClick: PropTypes.func,
  forcedExpanded: PropTypes.bool,
  defaultCollapsed: PropTypes.bool,
  liveExtentSearch: PropTypes.bool,
  onCollapsed: PropTypes.func,
  onDefaultSearched: PropTypes.func,
  defaultSearch: PropTypes.string,
  hideCategories: PropTypes.bool,
}
