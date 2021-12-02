/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Table, Form, Tooltip, Select, InputNumber } from 'antd'
import { v4 as uuidv4 } from 'uuid'
import i18n from 'i18n-js'
import l from 'libs/langs/keys'
import { Icon } from '@ant-design/compatible'
const coordSystems = [
  { title: 'New Projection - WGS 84 Zone 40', value: 32640 },
  { title: 'EPSG:4326 WGS 84', value: 4326 },
  { title: 'EPSG:3857 WGS 84 / Pseudo-Mercator', value: 3857 },
  {
    title: 'New projection for some plots in Dhofar - WGS 84 Zone 40',
    value: 32639,
  },
  {
    title: 'Old projection - Clarke 1880 Zone 40',
    value: 3440,
  },
]
const EditableCell = ({
  editing,
  dataIndex,
  title,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = <InputNumber />
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}

export const CoordinatesTable = props => {
  const {
    points = [],
    updatePoints,
    setCoordCode,
    selectedCoordCode = 32640,
  } = props
  const [form] = Form.useForm()
  const [plotPoints, setPoints] = useState([])
  const [editingKey, setEditingKey] = useState('')
  const [deleteKey, setDeleteKey] = useState('')

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 14 },
    labelAlign: 'left',
  }

  useEffect(() => {
    setPoints(points)
  }, [points])

  const handleAddRow = () => {
    form
      .validateFields()
      .then(values => {
        form.resetFields()
        const key = uuidv4()
        const newData = [...plotPoints, { ...values, key: key }]
        setPoints(newData)
        setEditingKey(key)
      })
      .catch(info => {
        console.log('Validate Failed:', info)
      })
  }

  const isEditing = record => record.key === editingKey

  const isDeleting = record => record.key === deleteKey

  const editRecord = record => {
    form.setFieldsValue({ ...record })
    setEditingKey(record.key)
  }

  const deleteRecord = record => {
    form.setFieldsValue({ ...record })
    setDeleteKey(record.key)
  }

  const deleteConfirm = record => {
    const filteredData = plotPoints.filter(d => d.key !== record)
    setPoints(filteredData)
    updatePoints && updatePoints(filteredData)
    setDeleteKey('')
  }

  const save = async key => {
    try {
      const row = await form.validateFields()
      const newData = [...plotPoints]
      const index = newData.findIndex(item => key === item.key)

      if (index > -1) {
        const item = newData[index]
        newData.splice(index, 1, { ...item, ...row })
      } else {
        newData.push(row)
      }
      setPoints(newData)
      updatePoints && updatePoints(newData)
      setEditingKey('')
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const columns = [
    {
      title: `${i18n.t(l.northing)}`,
      dataIndex: 'northing',
      editable: true,
      key: 'key',
      ellipsis: true,
    },
    {
      title: `${i18n.t(l.easting)}`,
      dataIndex: 'easting',
      editable: true,
      key: 'key',
      ellipsis: true,
    },
    {
      title: `${i18n.t(l.actions)}`,
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record)
        const deleteAble = isDeleting(record)
        return (
          <div>
            {editable ? (
              <span>
                <a
                  onClick={() => save(record.key)}
                  style={{
                    marginRight: 8,
                  }}
                >
                  <Icon type="check" />
                </a>
              </span>
            ) : (
              <Tooltip title={`${i18n.t(l.edit)}`}>
                <a
                  disabled={deleteKey !== ''}
                  onClick={() => editRecord(record)}
                >
                  <Icon type="edit" />
                </a>
              </Tooltip>
            )}
            &nbsp;&nbsp;&nbsp;
            {deleteAble ? (
              <span>
                <a
                  onClick={() => deleteConfirm(record.key)}
                  style={{
                    marginRight: 8,
                  }}
                >
                  {`${i18n.t(l.yes)}`}
                </a>
                <a
                  onClick={() => setDeleteKey('')}
                  style={{
                    marginRight: 8,
                  }}
                >
                  {`${i18n.t(l.no)}`}
                </a>
              </span>
            ) : (
              <Tooltip title={`${i18n.t(l.delete)}`}>
                <a
                  disabled={editingKey !== ''}
                  onClick={() => deleteRecord(record)}
                >
                  <Icon type="delete" />
                </a>
              </Tooltip>
            )}
          </div>
        )
      },
    },
  ]

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col
    }

    return {
      ...col,
      onCell: record => ({
        record,
        inputType: 'number',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    }
  })

  const renderAddPointForm = () => {
    return (
      <>
        <div
          style={{
            color: 'rgba(0, 0, 0, 0.67)',
            fontSize: '13px',
            fontWeight: '400',
            padding: '5px 0',
          }}
          className="coord-title"
        >
          {`${i18n.t(l.coordinate_system)}`}
        </div>
        <Select
          value={selectedCoordCode}
          placeholder={`${i18n.t(l.select_coord_system)}`}
          className="coord-dropdown"
          suffixIcon={<Icon type="caret-down" />}
          onChange={setCoordCode}
        >
          {coordSystems.length > 0 &&
            coordSystems.map((p, index) => (
              <Select.Option key={index} value={p.value}>
                {p.title}
              </Select.Option>
            ))}
        </Select>
      </>
    )
  }

  return (
    <Form form={form} component={false} {...layout}>
      {renderAddPointForm()}
      <div>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          size="small"
          dataSource={plotPoints}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={false}
        />
        <div className="add-btn" onClick={handleAddRow}>
          {`${i18n.t(l.add_new_coordinate)}`}
        </div>
      </div>
    </Form>
  )
}

CoordinatesTable.propTypes = {
  points: PropTypes.array,
  setCoordCode: PropTypes.func,
  updatePoints: PropTypes.func,
  selectedCoordCode: PropTypes.number,
}

export default CoordinatesTable
