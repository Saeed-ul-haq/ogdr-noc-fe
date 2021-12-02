import React, { useState, useEffect, useMemo } from 'react'
import { deleteEntity } from 'libs/utils/gis-apis'
import {
  message,
  Empty,
  Input,
  Tooltip,
  Popover,
  Select,
  Button,
  Dropdown,
  Popconfirm,
  Menu,
  Avatar,
} from 'antd'
import { getAccessToken } from 'libs/utils/helpers'

import { SVGIcon } from 'react-md'
import i18n from 'i18n-js'
import l from 'libs/langs/keys'

import { getMapServers } from 'libs/utils/gis-apis/get-map-servers-api'
import { useSelector } from 'react-redux'
import { Icon } from '@ant-design/compatible'
import DataTabeWrapper from 'components/common/data-table-wrapper'
import './styles.scss'
import PropTypes from 'prop-types'

const { Search } = Input
const { Option } = Select

const LayersTableView = props => {
  const { loading = false, history, mapLayers = [] } = props
  const [servers, setServers] = useState([])
  const [slicedLayers, setSlicedLayers] = useState([])
  const [filter, setFilter] = useState({})
  const [showPopover, setShowPopover] = useState(false)

  const maps = useSelector(({ app }) => {
    return app.allMaps
  })

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

  useEffect(() => {
    setSlicedLayers(mapLayers)
  }, [mapLayers])

  const handleSearchByName = searchString => {
    const filteredLayers = mapLayers.filter(lyr =>
      lyr.label
        ? lyr.label.toLowerCase().includes(searchString.toLowerCase())
        : (lyr.name || '').toLowerCase().includes(searchString.toLowerCase()),
    )
    setSlicedLayers(filteredLayers)
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
      setSlicedLayers(filteredLayers)
    } else {
      setSlicedLayers(mapLayers)
    }
  }

  const onDeleteMapLayer = selectedLayer => {
    const delKey = 'delete'
    message.loading({ content: 'Deleting Layer...', key: delKey })
    deleteEntity({ entityName: 'entity/MapLayer', id: selectedLayer.id })
      .then(async response => {
        const { message: resMsg, success } = response
        if (success) {
          message.success({
            content: i18n.t(l.layer_deleted_successfully),
            key: delKey,
          })
          setSlicedLayers(slicedLayers.filter(l => l.id !== selectedLayer.id))
        } else {
          message.warning({ content: resMsg || i18n.t(l.layer_not_deleted) })
        }
      })
      .catch(e => {
        message.error({
          content: e.message || i18n.t(l.something_went_wrong),
          key: delKey,
        })
      })
  }

  const content = (
    <div className="layers-filter-popover">
      <div>{i18n.t(l.filter_by_server)}:</div>
      <div>
        <Select
          style={{ width: '100%', margin: '10px 0' }}
          size="large"
          showSearch={true}
          placeholder={i18n.t(l.server)}
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
      <div>{i18n.t(l.filter_by_map)}:</div>
      <div>
        <Select
          style={{ width: '100%', margin: '10px 0' }}
          size="large"
          showSearch={true}
          placeholder={i18n.t(l.map)}
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
          {i18n.t(l.reset)}
        </Button>
        <Button className="apply-btn" type="primary" onClick={applyFilter}>
          {i18n.t(l.apply)}
        </Button>
      </div>
    </div>
  )

  const renderSearchAndFilter = () => {
    return (
      <>
        <h3>{i18n.t(l.map_layers)}</h3>
        <div className="search-container">
          <Search
            className="search-box"
            placeholder={i18n.t(l.search_layers)}
            onChange={e => handleSearchByName(e.target.value)}
          />
          <Popover
            placement="topRight"
            title={i18n.t(l.filter_layers)}
            content={content}
            trigger="click"
            visible={showPopover}
          >
            <div
              className="filter-btn"
              onClick={() => setShowPopover(!showPopover)}
            >
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
            {i18n.t(l.new_layer)}
          </Button>
        </div>
      </>
    )
  }

  const menuItems = [
    {
      leftIcon: <Icon type="delete" />,
      primaryText: i18n.t(l.delete),
      onClick: onDeleteMapLayer,
    },
    {
      leftIcon: <Icon type="edit" />,
      primaryText: i18n.t(l.edit),
      onClick: selectedLayer =>
        history.push(`/layers/edit/${selectedLayer.id}`),
    },
    {
      leftIcon: <Icon type="form" />,
      primaryText: i18n.t(l.edit_and_duplicate),
      onClick: selectedLayer =>
        history.push({
          pathname: `/layers/edit/${selectedLayer.id}`,
          state: { duplicateCase: true },
        }),
    },
  ]

  const getMenu = record => (
    <Menu>
      {menuItems.map((item, index) => (
        <Menu.Item
          key={index}
          onClick={() =>
            item.primaryText === 'Delete' ? {} : item.onClick(record)
          }
        >
          {item.primaryText === 'Delete' ? (
            <Popconfirm
              placement="rightTop"
              title={i18n.t(l.delete_layer_msg)}
              onConfirm={() => item.onClick(record)}
              okText="Yes"
              cancelText="No"
            >
              <div>
                {item.leftIcon}
                <span style={{ marginLeft: '5px' }}>{item.primaryText}</span>
              </div>
            </Popconfirm>
          ) : (
            <>
              {item.leftIcon}
              {item.primaryText}
            </>
          )}
        </Menu.Item>
      ))}
    </Menu>
  )

  const getLayersColumns = useMemo(() => {
    const token = getAccessToken()
    return [
      {
        title: 'Icon',
        align: 'center',
        dataIndex: 'icon',
        key: 'actions',
        // eslint-disable-next-line react/display-name
        render: (_, record) => {
          return record.icon ? (
            <Avatar size={20} src={record.icon + `&access_token=${token}`} />
          ) : (
            <SVGIcon size={20} className="avator-icon">
              <path
                fill="#717070"
                d="M12 16.54L19.37 10.8L21 12.07L12 19.07L3 12.07L4.62 10.81L12 16.54M12 14L3 7L12 0L21 7L12 14M12 2.53L6.26 7L12 11.47L17.74 7L12 2.53M12 21.47L19.37 15.73L21 17L12 24L3 17L4.62 15.74L12 21.47"
              />
            </SVGIcon>
          )
        },
      },
      {
        title: i18n.t(l.label),
        dataIndex: 'label',
        align: 'center',
      },
      {
        title: i18n.t(l.name),
        dataIndex: 'name',
        key: 'name',
        align: 'center',
      },
      {
        title: i18n.t(l.featureType),
        dataIndex: 'featureType',
        align: 'center',
      },
      {
        title: i18n.t(l.mapName),
        dataIndex: 'mapName',
        align: 'center',
      },
      {
        title: i18n.t(l.serverName),
        dataIndex: 'serverName',
        align: 'center',
      },
      {
        title: i18n.t(l.actions),
        align: 'right',
        dataIndex: '',
        key: 'actions',
        // eslint-disable-next-line react/display-name
        render: (_, record) => (
          <Dropdown overlay={getMenu(record)} trigger="click">
            <Icon type="more" />
          </Dropdown>
        ),
      },
    ]
  }, [])
  const renderLayersList = () => {
    const LayersData = slicedLayers.map(lyr => ({
      ...lyr,
      name: lyr.name,
      label: lyr.label || '',
      mapName: (lyr.map && (lyr.map.label || lyr.map.name)) || '',
      serverName:
        (lyr.mapServer && (lyr.mapServer.label || lyr.mapServer.name)) || '',
      key: lyr.id,
    }))
    return (
      <DataTabeWrapper
        {...props}
        columns={getLayersColumns}
        data={LayersData}
        actions={menuItems}
      />
    )
  }

  return (
    <>
      <div className="layers-main layers-table-view">
        <div className="body">
          <div className="search-filter-bar flex-center-between-g">
            {renderSearchAndFilter()}
          </div>

          {mapLayers.length > 0 ? (
            <div>
              {slicedLayers.length > 0 ? (
                <div className="cards-wrapper">{renderLayersList()}</div>
              ) : (
                <div className="empty">
                  <Empty description={i18n.t(l.no_map_layers_found)} />
                </div>
              )}
            </div>
          ) : (
            <div className="empty">
              <Empty
                description={
                  loading
                    ? i18n.t(l.fetching_map_layers)
                    : i18n.t(l.no_map_layers_found)
                }
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

LayersTableView.propTypes = {
  history: PropTypes.object,
  mapLayers: PropTypes.array,
  loading: PropTypes.bool,
}

export default LayersTableView
