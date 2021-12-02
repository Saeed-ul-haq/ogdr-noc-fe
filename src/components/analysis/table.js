import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'

const TableView = ({ data, loading, filter }) => {
  const [columns, setColumns] = useState([])
  const [tableData, setTableData] = useState([])

  useEffect(() => {
    if (data) {
      const [firstRow = {}] = data
      const cols = Object.keys(firstRow).map(key => {
        return {
          title: key,
          dataIndex: key,
          key: key,
        }
      })
      setColumns(cols.slice(0, 5))
      setTableData(data)
    }
  }, [data])

  useEffect(() => {
    // TODO: have to make it dynamic
    const { Governorat, Wilayat } = filter
    let _tableData = data.filter(d => {
      return (
        (d.Governorat ? d.Governorat.includes(Governorat) : true) &&
        (d.Wilayat ? d.Wilayat.includes(Wilayat) : true)
      )
    })

    setTableData(_tableData)
  }, [filter])

  const getTableData = () => {
    let data = tableData
    let extraRows = []
    if (data.length < 12) {
      const rowstoAdd = 12 - data.length
      extraRows = new Array(rowstoAdd).fill(0).map(r => {
        return columns.reduce((sum, next) => {
          sum[next.dataIndex] = ' - '
          return sum
        }, {})
      })
    }
    data = [...data, ...extraRows]
    return data
  }
  return (
    <Table
      pagination={{ pageSize: 15 }}
      scroll={{ y: 'calc(100vh - 300px)' }}
      dataSource={getTableData()}
      loading={{ spinning: loading, tip: 'Fetching Data..' }}
      columns={columns}
    />
  )
}

TableView.propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool,
  filter: PropTypes.object,
}
export default TableView
