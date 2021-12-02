import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Select, Button, Input } from 'antd'
import './styles.scss'
const { Option } = Select

var ChartForm = props => {
  const { selectedLayer, setSelectedLayer } = useState({})
  const [form] = Form.useForm()

  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        props.onSubmit({ ...values, layer: selectedLayer })
      }
    })
  }

  const getLayerOptions = () => {
    try {
      const { layers } = props
      const options = layers.map(layer => {
        const { name, label } = layer
        return (
          <Option key={name} value={name}>
            {label}
          </Option>
        )
      })
      return options
    } catch (e) {
      return []
    }
  }

  const handleLayerChange = layerName => {
    try {
      const { layers } = props
      const selLayer = layers.find(l => l.name === layerName)
      setSelectedLayer(selLayer)
    } catch (e) {}
  }

  const getAxisOptions = () => {
    try {
      const options = ((selectedLayer && selectedLayer.attributes) || []).map(
        ({ id, name }) => {
          return (
            <Option key={id} value={name}>
              {name}
            </Option>
          )
        },
      )
      return options
    } catch (e) {
      return []
    }
  }

  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  }
  const layerNames = getLayerOptions()
  return (
    <Form
      {...formItemLayout}
      onSubmit={handleSubmit}
      className="chart-creator-form"
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[
          {
            required: true,
            message: 'Please enter chart title!',
          },
        ]}
      >
        <Input placeholder="title..." />
      </Form.Item>

      <Form.Item label="Source" name="source">
        <Select onChange={handleLayerChange}>{layerNames}</Select>
      </Form.Item>

      <Form.Item label="Type" name="type">
        <Select>
          <Option value="line">Line</Option>
          <Option value="bar">Bar</Option>
          <Option value="pie">Pie</Option>
          <Option value="scatter">Scatter</Option>
          {/* <Option value="bar3D">3D Bar</Option> */}
        </Select>
      </Form.Item>
      <Form.Item label="X" name="x">
        <Select placeholder="X">{getAxisOptions()}</Select>
      </Form.Item>
      <Form.Item label="Y" name="y">
        <Select placeholder="Y">{getAxisOptions()}</Select>
      </Form.Item>
      <Form.Item className="btn-container" wrapperCol={{ span: 24 }}>
        <Form.Item
          style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
        >
          <Button block type="primary" htmlType="submit" ghost>
            Preview Chart
          </Button>
        </Form.Item>
        <Form.Item
          style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
        >
          <Button block type="primary" ghost onClick={props.addToList}>
            Add To List
          </Button>
        </Form.Item>
      </Form.Item>
    </Form>
  )
}

ChartForm.propTypes = {
  onSubmit: PropTypes.func,
  addToList: PropTypes.func,
  onCancel: PropTypes.func,
  form: PropTypes.shape(),
  layers: PropTypes.array,
}
export default ChartForm
