import React, { useState, useEffect, useMemo } from 'react'
import Toolbar from 'components/toolbar'
import { getMapServers } from 'libs/utils/gis-apis/get-map-servers-api'
import ServerCards from './server-card'
import { message, Empty } from 'antd'
import CreateServer from 'components/create-server'
import { Icon } from '@ant-design/compatible'
import { SVGIcon } from 'react-md'
import { saveEntity } from 'libs/utils/gis-apis'
import './styles.scss'

const Servers = props => {
  const [servers, setServers] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedServer, setSelectedServer] = useState({})
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    getServers()
  }, [])

  const onAddMapServer = data => {
    message.loading({ content: 'Adding Server...', key: 'server' })
    saveEntity({ data, entityName: 'MapServer' })
      .then(async response => {
        const { message: responseMessage, success } = response
        if (success) {
          message.success({
            content: 'New Server added successfully',
            key: 'server',
          })
          getServers()
        } else {
          message.warning({
            content: responseMessage || 'Something went wrong',
            key: 'server',
          })
        }
      })
      .catch(e => {
        message.error({
          content: e.message || 'Error ocurred while adding new server',
          key: 'server',
        })
      })
  }

  const getServers = async () => {
    setLoading(true)
    try {
      const { data } = await getMapServers()
      setServers(data)
      setLoading(false)
    } catch (e) {
      setLoading(false)
    }
  }

  const onDelete = () => {
    console.log({ selectedServer })
  }

  const onSelectServer = server => {
    setSelectedServer(server)
  }

  const toolbarRightActions = useMemo(() => {
    return [
      {
        key: 'addServer',
        svg: (
          <SVGIcon size={14} className="md-icon">
            <path
              fill="#fff"
              d="M4,1H20A1,1 0 0,1 21,2V6A1,1 0 0,1 20,7H4A1,1 0 0,1 3,6V2A1,1 0 0,1 4,1M4,9H20A1,1 0 0,1 21,10V14A1,1 0 0,1 20,15H4A1,1 0 0,1 3,14V10A1,1 0 0,1 4,9M4,17H20A1,1 0 0,1 21,18V22A1,1 0 0,1 20,23H4A1,1 0 0,1 3,22V18A1,1 0 0,1 4,17M9,5H10V3H9V5M9,13H10V11H9V13M9,21H10V19H9V21M5,3V5H7V3H5M5,11V13H7V11H5M5,19V21H7V19H5Z"
            />
          </SVGIcon>
        ),
        label: 'Add Server',
        primary: true,
        swapTheming: true,
        onClick: () => setShowModal(true),
      },
    ]
  }, [])

  const menuItems = [
    {
      leftIcon: <Icon type="delete" />,
      primaryText: 'Delete',
      onClick: onDelete,
    },
  ]

  return (
    <>
      <Toolbar {...props} rightActions={toolbarRightActions} />
      <div className="server-cards-container">
        {servers.length > 0 ? (
          <div className="servers">
            <ServerCards
              itemsList={servers || []}
              menuItems={menuItems}
              onSelectServer={onSelectServer}
            />
          </div>
        ) : (
          <div className="empty">
            <Empty
              description={loading ? 'Loading Servers...' : 'No Servers Found'}
            />
          </div>
        )}
        {showModal && (
          <CreateServer
            onClose={() => setShowModal(false)}
            onCreate={onAddMapServer}
          />
        )}
      </div>
    </>
  )
}

export default Servers
