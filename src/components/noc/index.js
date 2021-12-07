import '@target-energysolutions/gis-map/styles.css'
import React from 'react'
import NocHistory from './noc-history'
import './styles.scss'
import NocToolbar from './toolbar'

const Index = () => {
  return (
    <div className={`noc-main-container `}>
      <NocToolbar />
      <NocHistory />
    </div>
  )
}

export default Index
