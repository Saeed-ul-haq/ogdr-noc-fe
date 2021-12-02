import React from 'react'
import { Card, Avatar, Dropdown, Menu, Popconfirm } from 'antd'
import { Icon } from '@ant-design/compatible'
import { SVGIcon } from 'react-md'
import PropTypes from 'prop-types'
import { getAccessToken } from 'libs/utils/helpers'

import './styles.scss'

const Cards = props => {
  const { Meta } = Card
  const { menuItems } = props

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
              title="Are you sure to delete this layer"
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

  const { itemsList = [], getSelected } = props
  return itemsList.map((lyr, index) => {
    return (
      <Card
        key={index}
        extra={
          <Dropdown overlay={menu} trigger="click">
            <Icon type="more" />
          </Dropdown>
        }
        title={lyr.label || lyr.name}
        size="small"
        onClick={() => getSelected(lyr)}
        className="layer-card"
      >
        <div className="avator">
          {lyr.icon ? (
            <Avatar
              size={46}
              src={lyr.icon + `&access_token=${getAccessToken()}`}
            />
          ) : (
            <SVGIcon
              size={46}
              style={{
                background: '#eee',
                borderRadius: '50%',
                padding: '10px',
              }}
              className="avator-icon"
            >
              <path
                fill="#717070"
                d="M12 16.54L19.37 10.8L21 12.07L12 19.07L3 12.07L4.62 10.81L12 16.54M12 14L3 7L12 0L21 7L12 14M12 2.53L6.26 7L12 11.47L17.74 7L12 2.53M12 21.47L19.37 15.73L21 17L12 24L3 17L4.62 15.74L12 21.47"
              />
            </SVGIcon>
          )}
        </div>
        <Meta
          description={
            <div>
              <p style={{ marginBottom: 0 }}>
                <b>Map name:</b> {lyr.map && lyr.map.name}
              </p>
              <p style={{ marginBottom: 0 }}>
                <b>Server name:</b> {lyr.mapServer && lyr.mapServer.name}
              </p>
            </div>
          }
        />
      </Card>
    )
  })
}

Cards.propTypes = {
  itemsList: PropTypes.array,
  getSelected: PropTypes.func,
  menuItems: PropTypes.array,
}

export default Cards
