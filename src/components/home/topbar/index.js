import React from 'react'
import { HashRouter, Route, Routes, Link, useLocation } from 'react-router-dom'
import { Breadcrumb, Alert } from 'antd'

import './styles.scss'
export default function index() {
  return (
    <div className="main-topbar">
      <div className="left-navbar">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/"><b>OGDR NOC</b></Link>
          </Breadcrumb.Item>
         
         
        </Breadcrumb>
        
      </div>
      <div className="right-navbar"></div>
    </div>
  )
}
