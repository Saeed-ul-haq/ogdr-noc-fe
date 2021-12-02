/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { SVGIcon } from 'react-md'
import { Table, Tag, PageHeader, message, Input, Popconfirm } from 'antd'
import { orderBy, filter } from 'lodash'

import { SPATIAL_INDEX_API } from 'components/indices/api'

import './styles.scss'

const ViewElasticSearch = props => {
  const { elasticConfig, history } = props
  const [indices, setIndices] = useState([])
  const [dataSource, setDataSource] = useState([])
  const [loading, setLoading] = useState(false)
  const handleSearch = value => {
    filterIndices((value || '').toLowerCase())
  }
  const handleIndicesList = () => {
    setLoading(true)
    SPATIAL_INDEX_API({
      api: 'indices',
      body: {
        elasticConfig,
        prefix: 'spatial',
      },
    })
      .then(INDICES_LIST_RESPONSE => {
        setIndices(orderBy(INDICES_LIST_RESPONSE || [], ['index'], ['asc']))
        setDataSource(orderBy(INDICES_LIST_RESPONSE || [], ['index'], ['asc']))
      })
      .catch(exception => {
        const { body } = exception
        if (body) {
          message.error(body.message || body.error)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }
  const handleDelete = index => {
    const splittedIndex = index.split('_')
    const prefix = splittedIndex[0] || ''
    const pureIndex = prefix === '' ? index : index.slice(prefix.length + 1)
    SPATIAL_INDEX_API({
      api: 'delete',
      body: {
        elasticConfig,
        prefix,
        tables: {
          [pureIndex]: [],
        },
      },
    })
      .then(RESPONSE => {
        console.log({
          RESPONSE,
        })
        message.success(`${pureIndex} is deleted successfully`)
        handleIndicesList()
      })
      .catch(exception => {
        const { body } = exception
        if (body) {
          message.error(body.message || body.error)
        }
      })
  }
  const getColumns = () => {
    const columns = [
      {
        title: 'INDEX',
        key: 'index',
        dataIndex: 'index',
        render: index => <b>{`${index}`}</b>,
      },
      {
        title: 'UUID',
        key: 'uuid',
        dataIndex: 'uuid',
      },
      {
        title: 'STORE SIZE',
        key: 'store.size',
        dataIndex: 'store.size',
      },
      {
        title: 'STATUS',
        key: 'status',
        dataIndex: 'status',
        render: status => {
          let color = status.length > 5 ? 'geekblue' : 'volcano'
          if (status === 'open') {
            color = 'green'
          }
          return <Tag color={color}>{status.toUpperCase()}</Tag>
        },
      },
      {
        title: 'Action',
        key: 'action',
        dataIndex: 'index',
        render: index => {
          return (
            <Popconfirm
              title="Are you sure delete this index?"
              onConfirm={() => {
                handleDelete(index)
              }}
              onCancel={() => {}}
              okText="Yes"
              cancelText="No"
            >
              <SVGIcon className="delete-index">
                <path
                  fill="#64B5F6"
                  d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
                />
              </SVGIcon>
            </Popconfirm>
          )
        },
      },
    ]
    return columns
  }
  const filterIndices = search => {
    let filteredIndices = indices
    if (search !== '') {
      filteredIndices = filter(filteredIndices, item => {
        if (item.index.toLowerCase().includes(search)) {
          return true
        }
        return false
      })
    }
    console.log({
      filteredIndices,
    })
    setDataSource(filteredIndices)
  }
  useEffect(() => {
    handleIndicesList()
  }, [elasticConfig])
  return (
    <div className="elastic-search">
      <PageHeader
        ghost={false}
        title="Elastic Search"
        extra={[
          <Input
            key="search-index-input"
            allowClear
            placeholder={`Search`}
            onChange={e => {
              handleSearch(e.target.value)
            }}
            style={{
              width: '300px',
              paddingRight: '5px',
            }}
            prefix={
              <SVGIcon>
                <path
                  fill="currentColor"
                  d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
                />
              </SVGIcon>
            }
          />,
        ]}
        onBack={() => {
          history && history.push('/indices')
        }}
      >
        <Table
          loading={loading}
          size={`small`}
          columns={getColumns()}
          dataSource={dataSource}
        />
      </PageHeader>
    </div>
  )
}
ViewElasticSearch.propTypes = {
  history: PropTypes.object,
  elasticConfig: PropTypes.object,
}
export default ViewElasticSearch
