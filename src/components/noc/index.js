import '@target-energysolutions/gis-map/styles.css'
import React from 'react'
import NocHistory from './noc-history'
import './styles.scss'
import NocToolbar from '../toolbar'
import { Button } from 'antd'
import { Link } from 'react-router-dom'
import { DatePicker, Space } from 'antd'

const Index = () => {
  const { RangePicker } = DatePicker
  const onChange = (value, dateString) => {
    console.log('Selected Time: ', value)
    console.log('Formatted Selected Time: ', dateString)
  }

  const onOk = value => {
    console.log('onOk: ', value)
  }
  const leftToolbar = (
    <RangePicker
      showTime={{ format: 'HH:mm' }}
      format="YYYY-MM-DD HH:mm"
      onChange={onChange}
      onOk={onOk}
    />
  )
  const rightToolbar = (
    <Link to="/add-noc">
      <Button>New Noc</Button>
    </Link>
  )

  return (
    <div className={`noc-main-container `}>
      <NocToolbar leftToolbar={leftToolbar} rightToolbar={rightToolbar} />
      <NocHistory />
    </div>
  )
}

export default Index
