import React from 'react'
import PropTypes from 'prop-types'
import { Card, Select, Row } from 'antd'

const { Option } = Select

const Filter = ({ data, onFilterChange, selectedFilter = {} }) => {
  const getOptions = key => {
    const opts = (data || [])
      .map(obj => obj[key])
      .filter((key, index, self) => self.indexOf(key) === index)
      .map(k => {
        return (
          <Option key={k} value={k}>
            {k}
          </Option>
        )
      })
    opts.unshift(
      <Option key="all" value={''}>
        All
      </Option>,
    )
    return opts
  }

  const getSelects = () => {
    if (data) {
      const [firstRow = {}] = data
      const dds = Object.keys(firstRow)
        .filter(key => {
          return ['Governorat', 'Wilayat'].includes(key)
        })
        .map(key => {
          const defVal = selectedFilter && selectedFilter[key]
          return (
            <div className="select-cnt" key={key} span={6}>
              <h4>{key}: </h4>
              <Select
                key={key}
                label={key}
                value={defVal}
                placeholder={`Search ${key}`}
                style={{ minWidth: 300, marginRight: '5px' }}
                onChange={val => {
                  onFilterChange(key, val)
                }}
              >
                {getOptions(key)}
              </Select>
            </div>
          )
        })
      return dds
    }
  }
  return (
    <div>
      <Card bodyStyle={{ padding: '14px' }}>
        <Row className="filter-select-container">{getSelects()}</Row>
      </Card>
    </div>
  )
}

Filter.propTypes = {
  data: PropTypes.object,
  onFilterChange: PropTypes.func,
  selectedFilter: PropTypes.object,
}
export default Filter
