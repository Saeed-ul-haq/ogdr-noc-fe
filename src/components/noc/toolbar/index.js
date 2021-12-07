import React from 'react'
import './styles.scss'
import { Button } from 'antd'
import { Link } from 'react-router-dom'
import { DatePicker, Space } from 'antd'

const Toolbar = () => {
  const { RangePicker } = DatePicker

  const onChange = (value, dateString) => {
    console.log('Selected Time: ', value)
    console.log('Formatted Selected Time: ', dateString)
  }

  const onOk = value => {
    console.log('onOk: ', value)
  }
  return (
    <div className="toolbar-container">
      <div className="toolbar-left-container">
        <RangePicker
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          onChange={onChange}
          onOk={onOk}
        />
      </div>
      <div className="toolbar-right-container">
        <Link to="/add-noc">
          <Button>New Noc</Button>
        </Link>
      </div>
    </div>
  )
}

export default Toolbar
