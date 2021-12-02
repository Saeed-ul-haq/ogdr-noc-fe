import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Transfer, PageHeader, Button, Select, message } from 'antd'
import { orderBy } from 'lodash'

import { SPATIAL_INDEX_API } from 'components/indices/api'

import './styles.scss'

const { Option } = Select

const ExportToES = props => {
  const { data, dbConfig, elasticConfig, loading } = props
  const [tableFields, setTableFields] = useState([])
  const [targetKeys, setTargetKeys] = useState([])
  const [activeSchema, setActiveSchema] = useState('')
  useEffect(() => {
    setTableFields([])
    setTargetKeys([])
  }, [data])
  const handleChange = targetKeys => {
    setTargetKeys(targetKeys)
  }
  const handleAddToES = () => {
    const selectedFields = []
    tableFields.forEach(field => {
      if (targetKeys.includes(field.name)) {
        selectedFields.push({
          name: field.name,
          type: field.type,
          searchable: field.searchable,
        })
      }
    })
    SPATIAL_INDEX_API({
      api: 'add',
      body: {
        dbConfig,
        elasticConfig,
        prefix: 'spatial',
        tables: {
          [activeSchema]: selectedFields,
        },
      },
    })
      .then(res => {
        message.success('Successfully created Indices in Elastic Search')
      })
      .catch(exception => {
        const { body } = exception
        if (body) {
          message.error(body.message || body.error)
        }
      })
      .finally(() => {
        setTargetKeys([])
        setActiveSchema('')
      })
  }
  const handleSchemaSelection = value => {
    setTargetKeys([])
    setActiveSchema(value)
    data.forEach(table => {
      if (table.key === value) {
        setTableFields(orderBy(table.fields, ['name'], ['asc']))
      }
    })
  }
  return (
    <div className="export-es">
      <PageHeader
        ghost={false}
        title="Export to Elastic Search"
        extra={[
          <Select
            key="2"
            showSearch
            placeholder="Select a Schema"
            onChange={handleSchemaSelection}
            loading={loading}
          >
            {orderBy(data, ['key'], ['asc']).map(table => {
              return (
                <Option key={table.key} value={table.key}>
                  {table.key}
                </Option>
              )
            })}
          </Select>,
          <Button
            key="1"
            type="primary"
            disabled={!(targetKeys.length > 0)}
            onClick={handleAddToES}
          >
            Add to Elastic Search
          </Button>,
        ]}
      >
        <div className="transfer-title">
          <p>Database</p>
          <p>Elastic Search</p>
        </div>
        <Transfer
          dataSource={tableFields}
          showSearch
          listStyle={{
            width: '100%',
            height: 'calc(100vh - 270px)',
          }}
          targetKeys={targetKeys}
          onChange={handleChange}
          render={item => `${item.title}-${item.type}`}
        />
      </PageHeader>
    </div>
  )
}

ExportToES.propTypes = {
  dbConfig: PropTypes.object,
  elasticConfig: PropTypes.object,
  data: PropTypes.array,
  loading: PropTypes.bool,
}
export default ExportToES
