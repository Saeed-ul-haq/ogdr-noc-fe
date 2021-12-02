import React, { useState } from 'react'
import { Input, Empty } from 'antd'
import { BarChartOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'
import './styles.scss'

import i18n from 'i18n-js'
import l from 'libs/langs/keys'

const AreaList = props => {
  const { Search } = Input

  const { areasDetails = [], handleValidate } = props

  const [searchString, setSearchString] = useState('')

  const getchipbackground = index => {
    const colors = ['#FD2A27', '#02B7D0', '#02A943', '#3B50B3', '#FDB600']
    return colors[index % colors.length]
  }

  const renderAreaItem = (item = {}, index) => {
    return (
      <div
        key={item.id}
        className="area-item"
        onClick={() => handleValidate(item)}
      >
        <div
          className="area-icon"
          style={{
            backgroundColor: `${getchipbackground(index)}`,
          }}
        >
          <BarChartOutlined />
        </div>
        {item.title}
      </div>
    )
  }

  return (
    <div className="land-list-wrapper">
      <section className="search-section">
        <Search
          className="area--search-box"
          placeholder={`${i18n.t(l.search_area)}`}
          onChange={e => {
            setSearchString(e.target.value)
          }}
          // prefix={<SearchOutlined />}
        />
      </section>
      <section className="area-list-section">
        {areasDetails.length > 0 ? (
          areasDetails
            .filter(area =>
              area.title.toLowerCase().includes(searchString.toLowerCase()),
            )
            .map((area, index) => {
              return renderAreaItem(area, index)
            })
        ) : (
          <Empty description={`${i18n.t(l.no_area_found)}`} />
        )}
      </section>
    </div>
  )
}

AreaList.propTypes = {
  areasDetails: PropTypes.array,
  handleValidate: PropTypes.func,
}

export default AreaList
