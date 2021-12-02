/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useState, useMemo } from 'react'
import { Table, Input, Button } from 'antd'
import Highlighter from 'react-highlight-words'
import { Icon } from '@ant-design/compatible'
import PropTypes from 'prop-types'
import './styles.scss'

const DataTableWrapper = props => {
  const { data = [], columns = [] } = props
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleReset = clearFilters => {
    clearFilters()
    setSearchText('')
  }
  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<Icon type="search" />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) => {
      try {
        return (record[dataIndex] || '')
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase())
      } catch {
        return ''
      }
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={(text || '').toString()}
        />
      ) : (
        text
      ),
  })

  const columnsConfig = useMemo(() => {
    let cols = columns.map(column => {
      if (column.key === 'actions') {
        return {
          ...column,
        }
      } else {
        return {
          ...column,
          ...getColumnSearchProps(column.dataIndex),
        }
      }
    })
    return cols
  }, [columns, searchText, searchedColumn])

  return (
    <div className="gis-fe-table-wrapper">
      <Table
        pagination={{ pageSize: 25 }} // default pagination could be overridded by props.
        {...props}
        columns={columnsConfig}
        dataSource={data}
      />
    </div>
  )
}
DataTableWrapper.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
}
export default DataTableWrapper
