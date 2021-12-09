import { Breadcrumb } from 'antd'
import 'antd/dist/antd.css'
import React from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import './index.css'

const breadcrumbNameMap = {
  '/apps': 'Application List',
  '/apps/1': 'Application1',
  '/apps/2': 'Application2',
  '/apps/1/detail': 'Detail',
  '/apps/2/detail': 'Detail',
}
const Index = props => {
  const location = useLocation()
  console.log(location)

  const pathSnippets = location.pathname.split('/').filter(i => i)
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`
    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>{breadcrumbNameMap[url]}</Link>
      </Breadcrumb.Item>
    )
  })
  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <Link to="/">Home</Link>
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumbItems)
  return (
    <div className="demo">
      <div className="demo-nav">
        <Link to="/">Home</Link>
        <Link to="/apps">Application List</Link>
      </div>
      <Routes>
        <Route path="/apps" component={Apps} />
        <Route render={() => <span>Home Page</span>} />
      </Routes>
      <Breadcrumb>{breadcrumbItems}</Breadcrumb>
    </div>
  )
}
