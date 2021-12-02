/* eslint-disable react/prop-types */
import React, { useMemo, Fragment } from 'react'
import { Form, Button, Select, Input } from 'antd'
import { startCase } from 'lodash'
import './filters-form.scss'

const { Option } = Select

const WelfareFiltersForm = ({
  data = [],
  selectedFilter,
  onSubmit,
  onDiscard,
  selectedLayer,
}) => {
  const nonFilterAttribs =
    selectedLayer && selectedLayer.id === 'wf-layer'
      ? ['X', 'Y', 'NAME_ENGLI', 'Salary', '__geom', 'Cumulative_Salary']
      : []

  const rangeAttribs = ['Cumulative_Salary']

  const [form] = Form.useForm()
  const handleSubmit = () => {
    form
      .validateFields()
      .then(values => {
        form.resetFields()
        onSubmit && onSubmit(values)
      })
      .catch(info => {
        // console.log('Validate Failed:', info)
      })
  }

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

  const rangeField = key => {
    return (
      <Fragment>
        <Form.Item
          name={`min_${key}`}
          style={{
            display: 'inline-block',
            width: 'calc(44% - 5px)',
            marginRight: 8,
          }}
        >
          <Input placeholder={`Min ${key}`} />
        </Form.Item>
        <Input
          className="site-input-split"
          style={{
            width: 30,
            borderLeft: 0,
            borderRight: 0,
            pointerEvents: 'none',
            marginRight: 8,
          }}
          placeholder="~"
          disabled
        />
        <Form.Item
          name={`max_${key}`}
          rules={[{ required: true }]}
          style={{ display: 'inline-block', width: 'calc(44% - 5px)' }}
        >
          <Input placeholder={`Max ${key}`} />
        </Form.Item>
      </Fragment>
    )
  }

  const getDynamicFields = useMemo(() => {
    if (data) {
      const [firstRow = {}] = data
      const dds = Object.keys(firstRow)
        .filter(k => !nonFilterAttribs.includes(k))
        .map(key => {
          const defVal = selectedFilter && selectedFilter[key]
          return (
            <Form.Item name={key} key={key}>
              {rangeAttribs.includes(key) ? (
                rangeField(key)
              ) : (
                <Select
                  key={key}
                  label={startCase(key)}
                  defaultValue={defVal}
                  placeholder={`Search ${key}`}
                >
                  {getOptions(key)}
                </Select>
              )}
            </Form.Item>
          )
        })
      return (
        dds.length > 0 && (
          <div className="dynamic-filters">
            <div className="form-layers-title">Dynamic Filters</div>
            {dds}
          </div>
        )
      )
    }
  }, [data])

  return (
    <div className="form-layers">
      <Form
        form={form}
        name="filter-form"
        className="filters-form"
        initialValues={{ remember: true }}
      >
        <div className="general-filters">
          <div className="form-layers-title">General Filters</div>

          <Form.Item name="country">
            <Select placeholder="Search Country">
              <Option value="">Oman</Option>
            </Select>
          </Form.Item>
          <Form.Item name="city">
            <Select placeholder="Search City">
              <Option value="">Muscat</Option>
            </Select>
          </Form.Item>
        </div>
        {getDynamicFields}
      </Form>

      <div className="form-layers-actions">
        <div className="actions-container">
          <Button
            type="primary"
            style={{
              marginRight: '10px',
              minWidth: '80px',
              backgroundColor: '#fff',
              color: '#398CFF',
            }}
            onClick={onDiscard}
          >
            Discard
          </Button>
          <Button
            type="primary"
            style={{ minWidth: '80px', marginRight: '5px' }}
            onClick={handleSubmit}
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  )
}

export default WelfareFiltersForm
