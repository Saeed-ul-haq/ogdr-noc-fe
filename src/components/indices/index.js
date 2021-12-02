import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router-dom'
import { SVGIcon } from 'react-md'
import { Input, Button, message } from 'antd'

import Toolbar from 'components/toolbar'
import ExportToES from 'components/indices/export-to-es'
import ViewElasticSearch from 'components/indices/view-elastic-search'

import { SPATIAL_INDEX_API } from 'components/indices/api'
import './styles.scss'

import { defaultDbConfig, defaultElasticConfig } from './constant'

const Indices = props => {
  const { history } = props

  const [dbConfig, setDbConfig] = useState(defaultDbConfig)
  const [elasticConfig, setElasticConfig] = useState(defaultElasticConfig)
  const [databaseTables, setDatabaseTables] = useState([])
  const [loading, setLoading] = useState(false)

  const handleDBList = () => {
    setLoading(true)
    SPATIAL_INDEX_API({
      api: 'list',
      body: {
        dbConfig,
      },
    })
      .then(LIST_RESPONSE => {
        if (LIST_RESPONSE) {
          let tempDatabaseTables = []
          Object.keys(LIST_RESPONSE).forEach(databaseTableKey => {
            tempDatabaseTables.push({
              key: databaseTableKey,
              title: databaseTableKey,
              fields: (LIST_RESPONSE[databaseTableKey] || []).map(field => {
                return { ...field, key: field.name, title: field.name }
              }),
            })
          })
          setDatabaseTables(tempDatabaseTables)
        }
      })
      .catch(exception => {
        const { body } = exception
        if (body) {
          message.error(body.message || body.error)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }
  useEffect(() => {
    handleDBList()
  }, [dbConfig])
  const toolbarRightActions = useMemo(() => {
    return [
      {
        key: 'addToES',
        label: 'View Elastic Search',
        primary: true,
        swapTheming: true,
        onClick: () => {
          history && history.push('/indices/elastic-search')
        },
      },
    ]
  }, [])
  const EditIcon = ({ config = '' }) => {
    const [showEditModal, setShowEditModal] = useState(false)
    const EditModal = () => {
      const [formValue, setFormValue] = useState(
        config === 'dbConfig' ? dbConfig : elasticConfig,
      )
      const fieldsConfig = {
        dbConfig: [
          {
            key: 'dbType',
            label: 'DB Type',
          },
          {
            key: 'server',
            label: 'Server',
          },
          {
            key: 'port',
            label: 'Port',
          },
          {
            key: 'database',
            label: 'Database',
          },
          {
            key: 'user',
            label: 'User',
          },
          {
            key: 'password',
            label: 'Password',
          },
        ],
        elasticConfig: [
          {
            key: 'server',
            label: 'Server',
          },
          {
            key: 'port',
            label: 'Port',
          },
          {
            key: 'scheme',
            label: 'Scheme',
          },
          {
            key: 'user',
            label: 'User',
          },
          {
            key: 'password',
            label: 'Password',
          },
        ],
      }
      return (
        <div className="edit-modal">
          <div className="modal-container">
            <p className="edit-modal--heading">
              {config === 'dbConfig'
                ? 'Database Configuration'
                : 'Elastic Search Configuration'}
            </p>
            {fieldsConfig[config].map(field => {
              return (
                <div key={field.key} className="edit-control--group">
                  <label>{field.label}</label>
                  <Input
                    value={formValue[field.key] || ''}
                    onChange={e => {
                      setFormValue({
                        ...formValue,
                        [field.key]: e.target.value || '',
                      })
                    }}
                  />
                </div>
              )
            })}
            <div className="edit-actions">
              <Button
                type="primary"
                style={{ marginRight: '10px' }}
                onClick={() => {
                  if (config === 'dbConfig') {
                    setDatabaseTables([])
                    setDbConfig(formValue)
                  } else {
                    setElasticConfig(formValue)
                  }
                  setShowEditModal(false)
                }}
              >
                Save
              </Button>
              <Button
                onClick={() => {
                  setShowEditModal(false)
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )
    }
    return (
      <>
        <SVGIcon
          className="edit-info"
          size={16}
          onClick={() => {
            setShowEditModal(true)
          }}
        >
          <path
            fill="currentColor"
            d="M5,3C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19H5V5H12V3H5M17.78,4C17.61,4 17.43,4.07 17.3,4.2L16.08,5.41L18.58,7.91L19.8,6.7C20.06,6.44 20.06,6 19.8,5.75L18.25,4.2C18.12,4.07 17.95,4 17.78,4M15.37,6.12L8,13.5V16H10.5L17.87,8.62L15.37,6.12Z"
          />
        </SVGIcon>
        {showEditModal && <EditModal />}
      </>
    )
  }
  EditIcon.propTypes = {
    config: PropTypes.string,
  }
  return (
    <div className="indices">
      <Toolbar {...props} rightActions={toolbarRightActions} />
      <div className="indices-container">
        <div className="indices-container--main">
          <Switch>
            <Route
              path="/indices/elastic-search"
              exact
              render={renderProps => {
                return (
                  <ViewElasticSearch
                    elasticConfig={elasticConfig}
                    history={history}
                  />
                )
              }}
            />
            <Route
              path="/indices"
              exact
              render={renderProps => {
                return (
                  <ExportToES
                    dbConfig={dbConfig}
                    elasticConfig={elasticConfig}
                    data={databaseTables}
                    history={history}
                    loading={loading}
                  />
                )
              }}
            />
          </Switch>
        </div>
        <div className="indices-container--sidebar">
          <div className="config">
            <div className="config-grp db">
              <p className="grp-heading">
                {`Database Config`}
                <EditIcon config="dbConfig" />
              </p>
              <div className="grp-content">
                <p>{`DB Type: `}</p>
                <pre>{dbConfig.dbType}</pre>
                <p>{`Server: `}</p>
                <pre>{dbConfig.server}</pre>
                <p>{`Port: `}</p>
                <pre>{dbConfig.port}</pre>
                <p>{`Database: `}</p>
                <pre>{dbConfig.database}</pre>
                <p>{`User: `}</p>
                <pre>{dbConfig.user}</pre>
                <p>{`Password: `}</p>
                <pre>{dbConfig.password}</pre>
              </div>
            </div>
            <div className="config-grp elastic">
              <p className="grp-heading">
                {`Elastic Search Config`}
                <EditIcon config="elasticConfig" />
              </p>
              <div className="grp-content">
                <p>{`Server: `}</p>
                <pre>{elasticConfig.server}</pre>
                <p>{`Port: `}</p>
                <pre>{elasticConfig.port}</pre>
                <p>{`Scheme: `}</p>
                <pre>{elasticConfig.scheme}</pre>
                <p>{`User: `}</p>
                <pre>{elasticConfig.user}</pre>
                <p>{`Password: `}</p>
                <pre>{elasticConfig.password}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Indices.propTypes = {
  history: PropTypes.object,
}
export default Indices
