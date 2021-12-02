import React, { useState } from 'react'
import { Input, Empty, Col, Row } from 'antd'
import PropTypes from 'prop-types'
import './styles.scss'

import i18n from 'i18n-js'
import l from 'libs/langs/keys'

const AreaList = props => {
  const { areasDetails = [], handleValidate } = props

  const [searchString, setSearchString] = useState('')

  const getIcon = landUse => {
    try {
      return <img src={require(`../../images/${landUse}.svg`)} width={31} />
    } catch (error) {
      return <img src={require(`../../images/Government.svg`)} width={31} />
    }
  }

  const renderAreaItem = (item = {}) => {
    return (
      <div
        key={item.id}
        className="area-item"
        onClick={() => handleValidate(item)}
      >
        <div className="area-icon">{getIcon(item.landUse)}</div>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <span style={{ marginRight: '10px' }}>{item.wilayat}</span>
            <span>({item.title})</span>
          </Col>
          <Col span={24}>
            <span className="area-subTitle">{item.landUse}</span>⦿
            <span className="area-desc">{item.city}</span>
          </Col>
        </Row>
      </div>
    )
  }

  return (
    <div className="land-list-wrapper">
      <section className="search-section">
        <Input
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
            .filter(
              area =>
                area.title.toLowerCase().includes(searchString.toLowerCase()) ||
                (area.landUse || '')
                  .toLowerCase()
                  .match(searchString.toLowerCase()) ||
                (area.wilayat || '')
                  .toLowerCase()
                  .match(searchString.toLowerCase()) ||
                (area.city || '')
                  .toLowerCase()
                  .match(searchString.toLowerCase()),
            )
            .map(area => {
              return renderAreaItem(area)
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
