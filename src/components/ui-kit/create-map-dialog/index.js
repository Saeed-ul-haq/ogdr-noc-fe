import React from 'react'
import { Modal, Form, Input, Radio, InputNumber, Row, Col } from 'antd'

import PropTypes from 'prop-types'

const CreateMap = props => {
  const [form] = Form.useForm()

  const handleCreate = () => {
    form
      .validateFields()
      .then(values => {
        form.resetFields()
        props.onCreate && props.onCreate(values)
      })
      .catch(info => {
        console.log('Validate Failed:', info)
      })
  }

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
    labelAlign: 'left',
  }

  const itemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 14 },
  }
  const initValues = props.values || {
    isPublic: false,
    crs: 3857,
    minZoom: 2,
    maxZoom: 22,
  }
  return (
    <Modal
      visible={true}
      title={`${props.values ? 'Update' : 'Create'} Map`}
      okText={props.values ? 'Update' : 'Create'}
      cancelText="Cancel"
      onCancel={() => {
        props.onClose && props.onClose()
      }}
      onOk={handleCreate}
    >
      <Form
        form={form}
        {...layout}
        name="create-map-form"
        initialValues={initValues}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: 'Please input the name of map!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="crs" label="CRS">
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input type="textarea" />
        </Form.Item>

        <Row gutter={10}>
          <Col span={12}>
            <Form.Item
              {...itemLayout}
              name="minZoom"
              label="Min Zoom"
              rules={[{ type: 'number', min: 2, max: 28 }]}
            >
              <InputNumber style={{ width: '120px' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              {...itemLayout}
              name="maxZoom"
              label="Max Zoom"
              rules={[{ type: 'number', min: 2, max: 28 }]}
            >
              <InputNumber style={{ width: '120px' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={12}>
            <Form.Item {...itemLayout} name="minLon" label="Min Lon">
              <InputNumber style={{ width: '120px' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...itemLayout} name="maxLon" label="Max Lon">
              <InputNumber style={{ width: '120px' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={10}>
          <Col span={12}>
            <Form.Item {...itemLayout} name="minLat" label="Min Lat">
              <InputNumber style={{ width: '120px' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...itemLayout} name="maxLat" label="Max Lat">
              <InputNumber style={{ width: '120px' }} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="isPublic"
          className="collection-create-form_last-form-item"
        >
          <Radio.Group>
            <Radio value={true}>Public</Radio>
            <Radio value={false}>Private</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  )
}

CreateMap.propTypes = {
  onClose: PropTypes.func,
  onCreate: PropTypes.func,
  history: PropTypes.object,
  values: PropTypes.object,
}
export default CreateMap
