import React, { useState, useEffect } from 'react'
import { Tabs, Row, Col, message } from 'antd'
import { useSelector } from 'react-redux'
import Table from './table'
import Chart from './chart'
import Filter from './filter'
import { fetchWFSData } from 'libs/utils/gis-apis/read-json'
import GisMapView from 'components/gis-map'
import { getIcon } from './utils'
import { get } from 'lodash'
import './styles.scss'
const { TabPane } = Tabs

const Analysis = props => {
  const defaultFilters = {
    Governorat: '',
    Wilayat: '',
  }
  const [selectedLayerData, setSelectedLayerData] = useState([])
  const [filter, setFilter] = useState(defaultFilters)
  const [loading, setLoading] = useState(false)
  const [tableData, setTableData] = useState([])
  const [filtersData, setFiltersData] = useState([])
  const [layerName, setLayerName] = useState('')
  const chartMap = useSelector(({ app }) => {
    return app.chartMap || {}
  })

  const onFilterChange = (key, value) => {
    const newFilter = { ...filter, [key]: value }
    setFilter(newFilter)
  }

  const getLayerData = async lyrName => {
    setLoading(true)
    try {
      const layer = chartMap.layers.find(layer => layer.name === lyrName)

      if (layer) {
        setLayerName(layer.label)
        setFilter(defaultFilters)
        const {
          mapServer: { featureServerUrl: wfsUrl },
          name,
        } = layer
        const res = await fetchWFSData({
          url: wfsUrl,
          typeName: name,
          maxFeatures: 10,
          serverType: 'GeoServer',
          geometryRequired: false,
        })
        if (res && res.status && res.status === 500) {
          message.info('Error While Fetching Data')
          setSelectedLayerData([])
        } else {
          setSelectedLayerData(res)
        }
      }
    } catch (e) {
      setSelectedLayerData([])
      setLayerName('')
      message.info('Error while fetching layer data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (chartMap.layers) {
      const [firstLayer] = chartMap.layers
      getLayerData(firstLayer.name)
    }
  }, [])

  useEffect(() => {
    const { features } = selectedLayerData
    if (features) {
      const tableData = features.reduce((sum, next) => {
        const { properties } = next
        const { bbox, ...restOfProps } = properties
        sum.push(restOfProps)
        return sum
      }, [])
      setTableData(tableData)
      setFiltersData(tableData)
    } else {
      setTableData([])
      setFiltersData([])
    }
  }, [selectedLayerData])

  const handleLayerDataLoaded = (params = {}) => {
    try {
      const gvtVal = get(params, 'layerData.features[0].properties.Governorat')
      const WilVal = get(params, 'layerData.features[0].properties.Wilayat')

      setFilter({ Governorat: gvtVal || '', Wilayat: WilVal || '' })
    } catch (e) {}
  }
  return (
    <main className="analysis-main">
      <section>
        <header>
          <Filter
            data={filtersData}
            onFilterChange={onFilterChange}
            selectedFilter={filter}
          />
        </header>
        <section>
          <div style={{ height: 'calc(100vh - 170px)' }}>
            <Row gutter={24} style={{ height: '100%' }}>
              <Col span={16}>
                <Tabs
                  onChange={getLayerData}
                  tabPosition={'left'}
                  type={'card'}
                >
                  {(chartMap.layers || []).map(layer => (
                    <TabPane
                      tab={
                        <img
                          title={layer.label && layer.label.replace('_', ' ')}
                          src={getIcon(layer.label)}
                          width={35}
                          height={35}
                        />
                      }
                      key={layer.name}
                    >
                      <Table
                        data={tableData}
                        loading={loading}
                        filter={filter}
                      />
                    </TabPane>
                  ))}
                </Tabs>
              </Col>
              <Col span={8} style={{ height: '100%', paddingLeft: '0' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <GisMapView
                      showToolbar={false}
                      selectedMap={chartMap}
                      showChartLayersOnly={true}
                      filterData={handleLayerDataLoaded}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <Chart
                      params={tableData}
                      loading={loading}
                      title={layerName}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </section>
      </section>
    </main>
  )
}

export default Analysis
