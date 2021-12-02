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
const MapThemes = props => {
  const { history } = props
  const [loading, setLoading] = useState(false)
  const [searchString, setSearchString] = useState('')
  const [mapThemes, setMapThemes] = useState([])

  const loadAllThemes = async () => {
    try {
      setLoading(true)
      const { data, success } = await getEntity({
        entityName: 'entity/GroupOfMapLayerGroup',
      })
      if (success && data) {
        const sortedThemes = sortBy(data || [], 'createdDate').reverse()
        setLoading(false)
        setMapThemes(sortedThemes)
      } else {
        setLoading(false)
        setMapThemes([])
      }
    } catch (e) {
      setMapThemes([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAllThemes()
  }, [])

  const renderTopBar = useMemo(() => {
    return (
      <>
        <h3>{i18n.t(l.map_themes)}</h3>
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
              history && history.push('/themes/add')
            }}
          >
            {i18n.t(l.new_theme)}
          </Button>
        </div>
      </>
    )
  }, [])

  const onDeleteTheme = id => {
    const delKey = 'delete'
    message.loading({ content: 'Deleting Theme...', key: delKey })
    deleteEntity({ entityName: 'entity/GroupOfMapLayerGroup', id: id })
      .then(async response => {
        const { message: resMsg, success } = response
        if (success) {
          message.success({
            content: i18n.t(l.theme_deleted_succesfully),
            key: delKey,
          })
          loadAllThemes()
        } else {
          message.warning({ content: resMsg || i18n.t(l.theme_not_deleted) })
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
      onClick: onDeleteTheme,
    },
    {
      leftIcon: <Icon type="edit" />,
      primaryText: i18n.t(l.edit),
      key: 'edit',
      onClick: id => history.push(`/themes/edit/${id}`),
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
              title={i18n.t(l.delete_theme_msg)}
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
        title: i18n.t(l.label),
        dataIndex: 'label',
      },
      {
        title: i18n.t(l.name),
        dataIndex: 'name',
      },
      {
        title: i18n.t(l.description),
        dataIndex: 'description',
      },
      {
        title: i18n.t(l.actions),
        key: 'actions',
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
  const renderThemes = useMemo(() => {
    const filteredThemes = mapThemes.filter(lyr =>
      lyr.label
        ? lyr.label.toLowerCase().includes(searchString.toLowerCase())
        : (lyr.name || '').toLowerCase().includes(searchString.toLowerCase()),
    )
    return <DataTabeWrapper columns={getTableColumns()} data={filteredThemes} />
  }, [mapThemes, searchString])

  return (
    <>
      <div className="themes-main">
        <div className="body">
          <div className="search-filter-bar flex-center-between-g">
            {renderTopBar}
          </div>
          {mapThemes.length > 0 ? (
            <div>{renderThemes}</div>
          ) : (
            <div className="empty">
              <Empty
                description={
                  loading
                    ? i18n.t(l.fetching_map_themes)
                    : i18n.t(l.no_map_themes_found)
                }
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

MapThemes.propTypes = {
  history: PropTypes.object,
}
export default MapThemes
