import React, { useState, useEffect } from 'react'
import LayersCards from '../layer-card'
import { deleteEntity } from 'libs/utils/gis-apis'
import {
  message,
  Empty,
  Pagination,
  Input,
  Tooltip,
  Popover,
  Select,
  Button,
} from 'antd'
import { SVGIcon } from 'react-md'
import i18n from 'i18n-js'
import l from 'libs/langs/keys'
import { getMapServers } from 'libs/utils/gis-apis/get-map-servers-api'
import { useSelector } from 'react-redux'
import { Icon } from '@ant-design/compatible'

import Loader from 'components/ui-kit/loader'

import './styles.scss'

import PropTypes from 'prop-types'

const { Search } = Input
const { Option } = Select

const LayersIconView = props => {
  const { loading = false, history, mapLayers = [] } = props
  const [servers, setServers] = useState([])
  const [slicedLayers, setSlicedLayers] = useState([])
  const [selectedLayer, setSelectedLayer] = useState({})
  const [filter, setFilter] = useState({})
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [showPopover, setShowPopover] = useState(false)

  const maps = useSelector(({ app }) => {
    return app.allMaps
  })

  useEffect(() => {
    setSlicedLayers(mapLayers)
  }, [mapLayers])

  const loadServers = async () => {
    try {
      const { data } = await getMapServers()
      setServers(data)
    } catch {
      setServers([])
    }
  }

  useEffect(() => {
    loadServers()
  }, [])

  const handleSearchByName = searchString => {
    const filteredLayers = mapLayers.filter(lyr =>
      lyr.label
        ? lyr.label.toLowerCase().includes(searchString.toLowerCase())
        : (lyr.name || '').toLowerCase().includes(searchString.toLowerCase()),
    )
    setSlicedLayers(filteredLayers)
    setPageNumber(1)
  }

  const resetFilter = () => {
    setFilter({})
    setShowPopover(false)
    setSlicedLayers(mapLayers)
  }

  const applyFilter = () => {
    setShowPopover(false)
    let filteredLayers = []
    if (filter.map || filter.mapServer) {
      Object.keys(filter).forEach((key, index) => {
        filteredLayers =
          index > 0
            ? filteredLayers.filter(
              lyr => lyr[key] && lyr[key].name === filter[key],
            )
            : mapLayers.filter(lyr => lyr[key] && lyr[key].name === filter[key])
      })
      setPageNumber(1)
      setSlicedLayers(filteredLayers)
    } else {
      setSlicedLayers(mapLayers)
      setPageNumber(1)
    }
  }

  const getSelectedLayer = layer => {
    setSelectedLayer(layer)
  }

  const onDeleteMapLayer = () => {
    const delKey = 'delete'
    message.loading({ content: 'Deleting Layer...', key: delKey })
    deleteEntity({ entityName: 'entity/MapLayer', id: selectedLayer.id })
      .then(async response => {
        const { message: resMsg, success } = response
        if (success) {
          message.success({
            content: 'Layer Deleted Sucessfully',
            key: delKey,
          })
          setSlicedLayers(slicedLayers.filter(l => l.id !== selectedLayer.id))
        } else {
          message.warning({ content: resMsg || 'Layer Not Deleted' })
        }
      })
      .catch(e => {
        message.error({
          content: e.message || 'Something Went Wrong',
          key: delKey,
        })
      })
  }

  const content = (
    <div className="layers-filter-popover">
      <div>Filter By Server:</div>
      <div>
        <Select
          style={{ width: '100%', margin: '10px 0' }}
          size="large"
          showSearch={true}
          placeholder="Server"
          onChange={value => setFilter({ ...filter, mapServer: value })}
          value={filter.mapServer}
        >
          {servers &&
            servers.length > 0 &&
            servers.map(server => (
              <Option key={server.id} value={server.name}>
                {server.name}
              </Option>
            ))}
        </Select>
      </div>
      <div>Filter By Map:</div>
      <div>
        <Select
          style={{ width: '100%', margin: '10px 0' }}
          size="large"
          showSearch={true}
          placeholder="Map"
          onChange={value => setFilter({ ...filter, map: value })}
          value={filter.map}
        >
          {maps &&
            maps.length > 0 &&
            maps.map(map => (
              <Option key={map.id} value={map.name}>
                {map.name || map.label}
              </Option>
            ))}
        </Select>
      </div>
      <div className="actions">
        <Button className="reset-btn" type="primary" onClick={resetFilter}>
          Reset
        </Button>
        <Button className="apply-btn" type="primary" onClick={applyFilter}>
          Apply
        </Button>
      </div>
    </div>
  )

  const renderSearchAndFilter = () => {
    return (
      <>
        <h3>Map Layers</h3>
        <div className="search-container">
          <Search
            className="search-box"
            placeholder="Search Layers"
            onChange={e => handleSearchByName(e.target.value)}
          />
          <Popover
            placement="topRight"
            title={i18n.t(l.filter_layers)}
            content={content}
            trigger="click"
            visible={showPopover}
          >
            <div className="filter-btn" onClick={() => setShowPopover(true)}>
              <Tooltip placement="left">
                <SVGIcon size={24}>
                  <path
                    fill={filter.map || filter.mapServer ? '#398cff' : '#bbb'}
                    d="M3,17V19H9V17H3M3,5V7H13V5H3M13,21V19H21V17H13V15H11V21H13M7,9V11H3V13H7V15H9V9H7M21,13V11H11V13H21M15,9H17V7H21V5H17V3H15V9Z"
                  />
                </SVGIcon>
              </Tooltip>
            </div>
          </Popover>
          <Button
            style={{ width: '100px' }}
            type="primary"
            onClick={() => {
              props.history && props.history.push('/layers/add')
            }}
          >
            Add Layer
          </Button>
        </div>
      </>
    )
  }

  const menuItems = [
    {
      leftIcon: <Icon type="delete" />,
      primaryText: 'Delete',
      onClick: onDeleteMapLayer,
    },
    {
      leftIcon: <Icon type="edit" />,
      primaryText: 'Edit',
      onClick: () =>
        history.push({
          pathname: `/layers/edit/${selectedLayer.id}`,
          state: { duplicateCase: false },
        }),
    },
    {
      leftIcon: <Icon type="form" />,
      primaryText: 'Edit & Duplicate',
      onClick: () =>
        history.push({
          pathname: `/layers/edit/${selectedLayer.id}`,
          state: { duplicateCase: true },
        }),
    },
  ]
  const renderLayersList = () => {
    const minValue = (pageNumber - 1) * pageSize
    const maxValue = pageNumber * pageSize
    return (
      <LayersCards
        itemsList={slicedLayers.slice(minValue, maxValue) || []}
        menuItems={menuItems}
        getSelected={getSelectedLayer}
      />
    )
  }

  // const toolbarRightActions = useMemo(() => {
  //   return [
  //     {
  //       key: 'createMap',
  //       svg: (
  //         <SVGIcon>
  //           <path
  //             fill="#fff"
  //             d="M12 16.54L19.37 10.8L21 12.07L12 19.07L3 12.07L4.62 10.81L12 16.54M12 14L3 7L12 0L21 7L12 14M12 2.53L6.26 7L12 11.47L17.74 7L12 2.53M12 21.47L19.37 15.73L21 17L12 24L3 17L4.62 15.74L12 21.47"
  //           />
  //         </SVGIcon>
  //       ),
  //       label: 'Create Layer',
  //       primary: true,
  //       swapTheming: true,
  //       onClick: () => {
  //         props.history && props.history.push('/layers/add')
  //       },
  //     },
  //   ]
  // }, [])

  return (
    <>
      <div className="layers-main">
        {mapLayers.length > 0 ? (
          <div className="body">
            <div className="search-filter-bar flex-center-between-g">
              {renderSearchAndFilter()}
            </div>
            {slicedLayers.length > 0 ? (
              <div className="cards-wrapper">{renderLayersList()}</div>
            ) : (
              <div className="empty">
                <Empty description={'No Map Layers Found'} />
              </div>
            )}
            <Pagination
              onChange={page => {
                setPageNumber(page)
              }}
              pageSize={pageSize}
              total={slicedLayers.length || 0}
              className="layers-pagination"
              hideOnSinglePage={true}
              current={pageNumber}
              onShowSizeChange={(page, pageSize) => {
                setPageNumber(page)
                setPageSize(pageSize)
              }}
              pageSizeOptions={['10', '20', '30', '50']}
            />
          </div>
        ) : (
          <div className="empty">
            <Empty
              description={
                loading ? 'Fetching Map Layers...' : 'No Map Layers Found'
              }
            />
          </div>
        )}
      </div>
      {loading.status && <Loader text="loading layers..." />}
    </>
  )
}

LayersIconView.propTypes = {
  history: PropTypes.object,
  mapLayers: PropTypes.array,
  loading: PropTypes.bool,
}

export default LayersIconView
