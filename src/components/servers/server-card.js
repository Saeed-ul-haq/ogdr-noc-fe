import React from 'react'
import { Tooltip, Dropdown, Menu, Popconfirm } from 'antd'
import { Icon } from '@ant-design/compatible'
import { gradients } from 'libs/utils/tempUtils'
import PropTypes from 'prop-types'
import './styles.scss'

const Cards = props => {
  const { itemsList = [], onSelectServer, menuItems } = props

  const menu = (
    <Menu>
      {menuItems.map((item, index) => (
        <Menu.Item
          key={index}
          onClick={item.primaryText === 'Delete' ? {} : item.onClick}
        >
          {item.primaryText === 'Delete' ? (
            <Popconfirm
              placement="rightTop"
              title="Are you sure to delete this server"
              onConfirm={item.onClick}
              okText="Yes"
              cancelText="No"
            >
              <div>
                {item.leftIcon}
                <span style={{ marginLeft: '5px' }}>{item.primaryText}</span>
              </div>
            </Popconfirm>
          ) : (
            <>
              {item.leftIcon}
              {item.primaryText}
            </>
          )}
        </Menu.Item>
      ))}
    </Menu>
  )
  return itemsList.map((ca, index) => {
    const count = index % gradients.length
    return (
      <div
        key={index}
        className="icons-outer-container"
        style={{ border: '1px solid #f2f2f2' }}
      >
        <div key={index} className="card-outer-container">
          <div
            className="card-image-container"
            style={{
              backgroundImage: gradients[count],
            }}
          ></div>
        </div>
        <div
          className="actions"
          onClick={e => {
            onSelectServer(ca)
            e.stopPropagation()
          }}
        >
          <Dropdown overlay={menu} trigger="click">
            <Icon type="more" />
          </Dropdown>
        </div>
        <Tooltip title={ca.label || ca.name} placement="bottom">
          <div className="card-label-container">{ca.label || ca.name}</div>
        </Tooltip>
      </div>
    )
  })
}

Cards.propTypes = {
  itemsList: PropTypes.array,
  onSelectServer: PropTypes.func,
  menuItems: PropTypes.array,
}

export default Cards
