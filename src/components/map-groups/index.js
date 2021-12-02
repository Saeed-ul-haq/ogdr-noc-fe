import React, { useState, useEffect, useMemo } from 'react'
import { sortBy } from 'lodash'
import { getEntity, deleteEntity } from 'libs/utils/gis-apis'
import { Empty, Input, Button, message, Dropdown, Menu, Popconfirm } from 'antd'
import DataTabeWrapper from 'components/common/data-table-wrapper'
import i18n from 'i18n-js'
import l from 'libs/langs/keys'
import PropTypes from 'prop-types'
import { Icon } from '@ant-design/compatible'

import './styles.scss'

const { Search } = Input
const MapGroups = props => {
  const { history } = props
  const [loading, setLoading] = useState(false)
  const [searchString, setSearchString] = useState('')
  const [mapGroups, setMapGroups] = useState([])

  const loadAllGroups = async () => {
    try {
      setLoading(true)
      const { data, success } = await getEntity({
        entityName: 'entity/MapLayerGroup',
      })
      if (success && data) {
        const sortedGroups = sortBy(data || [], 'createdDate').reverse()
        setLoading(false)
        setMapGroups(sortedGroups)
      } else {
        setLoading(false)
        setMapGroups([])
      }
    } catch (e) {
      setMapGroups([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAllGroups()
  }, [])

  const renderTopBar = useMemo(() => {
    return (
      <>
        <h3>{i18n.t(l.map_layer_groups)}</h3>
        <div className="search-container">
          <Search
            className="search-box"
            placeholder={i18n.t(l.search_layers)}
            onChange={e => setSearchString(e.target.value)}
          />
          <Button
            style={{ width: '100px' }}
            type="primary"
            onClick={() => {
              history && history.push('/groups/add')
            }}
          >
            {i18n.t(l.new_group)}
          </Button>
        </div>
      </>
    )
  }, [])

  const onDeleteLayersGroup = id => {
    const delKey = 'delete'
    message.loading({ content: i18n.t(l.deleting_group), key: delKey })
    deleteEntity({ entityName: 'entity/MapLayerGroup', id: id })
      .then(async response => {
        const { message: resMsg, success } = response
        if (success) {
          message.success({
            content: i18n.t(l.group_deleted_succesfully),
            key: delKey,
          })
          loadAllGroups()
        } else {
          message.warning({ content: resMsg || i18n.t(l.group_not_deleted) })
        }
      })
      .catch(e => {
        message.error({
          content: e.message || i18n.t(l.something_went_wrong),
          key: delKey,
        })
      })
  }

  const menuItems = [
    {
      leftIcon: <Icon type="delete" />,
      primaryText: i18n.t(l.delete),
      key: 'delete',
      onClick: onDeleteLayersGroup,
    },
    {
      leftIcon: <Icon type="edit" />,
      primaryText: i18n.t(l.edit),
      key: 'edit',
      onClick: id => history.push(`/groups/edit/${id}`),
    },
  ]

  const getActions = record => (
    <Menu>
      {menuItems.map((item, index) => (
        <Menu.Item
          key={index}
          onClick={() => (item.key === 'delete' ? {} : item.onClick(record.id))}
        >
          {item.key === 'delete' ? (
            <Popconfirm
              placement="rightTop"
              title={i18n.t(l.delete_group_msg)}
              onConfirm={() => item.onClick(record.id)}
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

  const getTableColumns = () => {
    return [
      {
        title: i18n.t(l.name),
        dataIndex: 'name',
      },
      {
        title: i18n.t(l.label),
        dataIndex: 'label',
      },
      {
        title: i18n.t(l.description),
        dataIndex: 'description',
      },
      {
        title: i18n.t(l.actions),
        key: 'action',
        fixed: 'right',
        width: 100,
        // eslint-disable-next-line react/display-name
        render: (text, record) => (
          <Dropdown overlay={getActions(record)} trigger="click">
            <Icon type="more" />
          </Dropdown>
        ),
      },
    ]
  }
  const renderGroups = useMemo(() => {
    const filteredGroups = mapGroups.filter(lyr =>
      lyr.label
        ? lyr.label.toLowerCase().includes(searchString.toLowerCase())
        : (lyr.name || '').toLowerCase().includes(searchString.toLowerCase()),
    )
    return <DataTabeWrapper columns={getTableColumns()} data={filteredGroups} />
  }, [mapGroups, searchString])

  return (
    <>
      <div className="groups-main">
        <div className="body">
          <div className="search-filter-bar flex-center-between-g">
            {renderTopBar}
          </div>
          {mapGroups.length > 0 ? (
            <div>{renderGroups}</div>
          ) : (
            <div className="empty">
              <Empty
                description={
                  loading
                    ? i18n.t(l.fetching_map_layer_groups)
                    : i18n.t(l.no_map_layer_groups_found)
                }
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

MapGroups.propTypes = {
  history: PropTypes.object,
}
export default MapGroups
