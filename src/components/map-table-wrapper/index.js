import React, { Component, Fragment } from 'react'
import ScreenSplitter, {
  Oreintaion,
} from '@target-energysolutions/split-screen'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { SVGIcon, Button } from 'react-md'
import MhtDataTable from '@target-energysolutions/mht'
import Loader from 'components/ui-kit/loader'

import Map from '../gis-map'

import './styles.scss'
@withRouter
class GISProduct extends Component {
  state = {
    tableData: [],
    activeLayerId: null,
    isFetching: false,
    activeMap: {},
  }
  setTableData = layerData => {
    this.setState({
      tableData: layerData || [],
    })
  }
  getColumnConfig = () => {
    const { tableData } = this.state
    if (tableData.length > 0) {
      const firstDataItem = tableData[0]
      return Object.keys(firstDataItem).map(itemKey => {
        const fieldWidth = this.getMaxContentLength({
          label: itemKey.toUpperCase(),
          key: itemKey,
        })
        return {
          label: itemKey.toUpperCase(),
          key: itemKey,
          width: fieldWidth,
        }
      })
    }
    return [
      {
        label: 'Label',
        key: 'LABEL',
      },
      {
        label: 'FID',
        key: 'FID',
      },
      {
        label: 'UWI',
        key: 'UWI',
      },
      {
        label: 'Display Name',
        key: 'DISPLAY_CLASS',
      },
      {
        label: 'ID',
        key: 'id',
      },
    ]
  }
  getActiveLayerLabel = activeLayerId => {
    const { activeMap } = this.state
    let tempLayerLabel = 'Layer'
    activeMap.layers &&
      activeMap.layers.forEach(layer => {
        if (layer.id.toString() === activeLayerId.toString()) {
          tempLayerLabel = layer.label || 'Layer'
        }
      })
    return tempLayerLabel
  }
  getMaxContentLength = field => {
    const { tableData: data = [] } = this.state
    let maxContentLength = field.label.length * 12
    data.forEach(dataItem => {
      if (dataItem[field.key]) {
        const contentLength = dataItem[field.key].toString().length * 9
        if (contentLength > maxContentLength) {
          maxContentLength = contentLength
        }
      }
    })
    if (maxContentLength > 500) {
      return 500
    }
    if (maxContentLength < 50) {
      return 50
    }
    return maxContentLength
  }
  showTableData = () => {
    const { tableData } = this.state
    return tableData || []
  }

  showLoader = loading => {
    this.setState({ isFetching: loading })
  }

  render() {
    const { showToast, onMapRef } = this.props
    const { activeLayerId, isFetching, activeMap } = this.state
    return activeMap && activeMap ? (
      <div className="row-main--container">
        <ScreenSplitter
          defaultOreintation={Oreintaion.HORIZONTAL}
          components={{
            primary: {
              elementProps: {
                onResize: ({ domElement, component }) => {
                  if (this.map) {
                    setTimeout(() => {
                      this.map.updateSize()
                    }, 1000)
                  }
                },
              },
              render: (
                <div className="map--container shadow">
                  {isFetching && <Loader text="Loading Data..." />}
                  <Map
                    activeMap={activeMap}
                    onActiveMapLoaded={activeMap => {
                      this.setState({
                        activeMap,
                      })
                    }}
                    activeLayerId={activeLayerId}
                    onLayerIdChange={activeLayerId => {
                      this.setState({
                        activeLayerId,
                      })
                    }}
                    onLayerDataLoaded={data => {
                      this.setTableData(data)
                      this.showLoader(false)
                    }}
                    onMapRef={r => {
                      if (r) {
                        onMapRef && onMapRef(r)
                        this.map = r
                      }
                    }}
                    showToast={showToast}
                    showLoader={this.showLoader}
                    {...this.props}
                  />
                </div>
              ),
            },
            secondary:
              this.showTableData().length > 0
                ? {
                  elementProps: {
                    onResize: ({ domElement, component }) => {
                      if (this.map) {
                        setTimeout(() => {
                          this.map.updateSize()
                        }, 1000)
                      }
                    },
                  },
                  render:
                      this.showTableData().length > 0 ? (
                        <Fragment>
                          {isFetching && <Loader text="Loading Data..." />}
                          <div className="table-heading">
                            {this.getActiveLayerLabel(activeLayerId)}
                            <Button
                              icon
                              onClick={() => {
                                this.setState({
                                  tableData: [],
                                })
                              }}
                            >
                              <SVGIcon>
                                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                              </SVGIcon>
                            </Button>
                          </div>
                          <div
                            style={{
                              width: 'calc(100vw - 20px)',
                              flex: '1',
                              overflow: 'hidden',
                            }}
                          >
                            <MhtDataTable
                              tableData={this.showTableData()}
                              configs={this.getColumnConfig() || []}
                              withSearch
                              commonActions
                            />
                          </div>
                        </Fragment>
                      ) : (
                        <div className="empty-table--container">
                          No Data Found
                          <span>Create AOI to View Data</span>
                        </div>
                      ),
                }
                : null,
          }}
          splitterProps={{
            className: 'splitter',
          }}
          containerProps={{
            className: 'primary-container',
          }}
          onOrentationClick={() => {
            if (this.map) {
              setTimeout(() => {
                this.map.updateSize()
              }, 1000)
            }
          }}
          onSwapClick={() => {}}
        />
      </div>
    ) : (
      <div className="row-main--container">
        <div className="map--container shadow">
          <Map
            activeMap={activeMap}
            onActiveMapLoaded={activeMap => {
              this.setState({
                activeMap,
              })
            }}
            activeLayerId={activeLayerId}
            onLayerIdChange={activeLayerId => {
              this.setState({
                activeLayerId,
              })
            }}
            onLayerDataLoaded={data => {
              this.setTableData(data)
              this.showLoader(false)
            }}
            onMapRef={r => {
              if (r) {
                onMapRef && onMapRef(r)
                this.map = r
              }
            }}
            showToast={showToast}
            showLoader={this.showLoader}
            {...this.props}
          />
        </div>
      </div>
    )
  }
}

GISProduct.propTypes = {
  showToast: PropTypes.func,
  onMapRef: PropTypes.func,
}

export default GISProduct
