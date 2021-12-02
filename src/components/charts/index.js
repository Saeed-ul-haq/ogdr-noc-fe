/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { message, Button } from 'antd'
import { SVGIcon } from 'react-md'
import { get } from 'lodash'
import ReactEcharts from 'echarts-for-react'
import GisMapView from 'components/gis-map'
import { fetchWFSData } from 'libs/utils/gis-apis/read-json'
import bar3DParams from './creatorUtils/3D-chart'

import {
  staticChartOptions,
  chartsConfig,
  getBarChartPopulation,
  getNbrOfWives,
  getEligibilityScore,
  getNbrOfChildren,
} from './staticChartOptions'
import { governorateWiseResident } from './chartsData'

import './chart.scss'

const Chart = props => {
  const chartMap = useSelector(({ app }) => {
    return app.chartMap
  })
  const [chartParams, setChartParams] = useState({})
  const [selectedLayerData, setSelectedLayerData] = useState([])
  const [selectedLayerName, setSelectedLayerName] = useState('')
  const [loading, setLoading] = useState(false)
  const [showRightBar, setShowRightBar] = useState(true)
  const [showSlider, setSliderDisplay] = useState(false)
  const [displayChartIndex, setDisplayChartIndex] = useState(0)
  const [maximizeChart, setMaximizeChart] = useState('')
  const [selectedGovernorat, setSelectedGovernorat] = useState([])

  const getLayerData = async lyr => {
    const {
      mapServer: { featureServerUrl: wfsUrl },
      name,
    } = lyr
    const res = await fetchWFSData({
      url: wfsUrl,
      typeName: name,
      maxFeatures: 5,
      serverType: 'GeoServer',
      geometryRequired: false,
    })
    if (res && res.status && res.status === 500) {
      message.info('Error While Fetching Chart Data')
      setSelectedLayerData([])
      return {}
    } else {
      setSelectedLayerData(res)
      return res
    }
  }
  const getBarChartData = async () => {
    const layer1 = chartMap.layers.find(
      l => l.name === 'filespace:Governate_Population_2017',
    )
    const layer2 = chartMap.layers.find(
      l => l.name === 'filespace:Governate_Population_2018',
    )
    const layer3 = chartMap.layers.find(
      l => l.name === 'filespace:Governate_Population_2019',
    )

    const layerData1 = (await getLayerData(layer1, false)).features
    const layerData2 = (await getLayerData(layer2, false)).features
    const layerData3 = (await getLayerData(layer3, false)).features

    return bar3DParams(layerData1, layerData2, layerData3)
  }

  // eslint-disable-next-line no-unused-vars
  const handleFormSubmit = async values => {
    try {
      setLoading(true)
      const { layer, x, y, type, title = `${type} Chart` } = values
      let layerData = selectedLayerData
      if (layer.name !== selectedLayerName) {
        layerData = await getLayerData(layer)
        setSelectedLayerName(layer.name)
      }
      let chartData = {
        xAxis: [],
        yAxis: [],
      }
      if (layerData && layerData.features) {
        chartData = layerData.features.reduce((sum, next) => {
          sum.xAxis.push(JSON.stringify(next.properties[x] || 0))
          sum.yAxis.push(next.properties[y])
          return sum
        }, chartData)
        let chartOptions = {}
        if (type === 'bar3D') {
          chartOptions = await getBarChartData()
        } else if (type === 'pie') {
          chartOptions = {
            legend: {
              orient: 'vertical',
              data: chartData.xAxis,
            },
            series: [
              {
                data: chartData.yAxis.map((d, i) => {
                  return {
                    value: d,
                    name: chartData.xAxis[i],
                  }
                }),
                type: type,
              },
            ],
          }
        } else {
          chartOptions = {
            xAxis: {
              type: 'category',
              data: chartData.xAxis,
            },
            yAxis: {
              type: 'value',
            },
            series: [
              {
                data: chartData.yAxis,
                type: type,
              },
            ],
          }
        }
        setChartParams({ properties: { title: title }, option: chartOptions })
      }
    } catch (e) {
      console.log('Error while drawing chart')
    } finally {
      setLoading(false)
    }
  }
  const getOption = key => {
    if (key === 'populationGovernorat') {
      return getBarChartPopulation({
        GOVERNORAT: selectedGovernorat,
      })
    }
    if (
      staticChartOptions({
        GOVERNORAT: selectedGovernorat,
      })[key]
    ) {
      return staticChartOptions({
        GOVERNORAT: selectedGovernorat,
      })[key]
    }
    return null
  }

  const handleLayerDataLoaded = (params = {}) => {
    try {
      const { layerData = { features: [] } } = params
      const { features } = layerData
      let governoratList = []
      let temp = []
      features.forEach(feature => {
        if (feature.properties.Governorat) {
          governoratList.push(feature.properties.Governorat)
        }
        temp.push({
          value: parseInt(feature.properties.Total_Popu),
          name: feature.properties.Governorat,
        })
      })
      const gvtVal = get(params, 'layerData.features[0].properties.Governorat')
      const WilVal = get(params, 'layerData.features[0].properties.Wilayat')
      if (governoratList.length > 0) {
        setSelectedGovernorat(governoratList)
      }
    } catch (e) {}
  }
  console.log({
    data: governorateWiseResident(),
    barConfig: getOption('salaryGovernorat'),
  })
  return (
    <div className="charts">
      <div className="charts--breadcrumb">
        <div className="crumbs">
          <span>
            <span
              className="crumbs-link"
              onClick={() => {
                const { history } = props
                history && history.push('/')
              }}
            >{`Dashboard`}</span>
            {` / `}
            <span>
              <b>{`Welfare Program`}</b>
            </span>
          </span>
        </div>
        <div className="actions">
          <Button
            type={'primary'}
            ghost={true}
            onClick={() => {
              const { history } = props
              history && history.goBack()
            }}
          >
            Close
          </Button>
        </div>
      </div>
      <div className="charts--container">
        <div
          style={{
            flexDirection: 'column',
            display: 'flex',
            width: '70%',
          }}
        >
          <div className="charts--section header">
            <div className="title">
              <div className="title--icon">
                <SVGIcon size={30}>
                  <path
                    fill="#fff"
                    d="M3,22V8H7V22H3M10,22V2H14V22H10M17,22V14H21V22H17Z"
                  />
                </SVGIcon>
              </div>
              <div className="title--text">
                <p className="title--text__primary">
                  Welfare Program Sultanate of Oman
                </p>
                <p className="title--text__secondary">{`Provider: Target Technologies`}</p>
              </div>
            </div>
            <div className="actions">
              <div className="btn">
                <SVGIcon size={24}>
                  <path d="M18,16.08C17.24,16.08 16.56,16.38 16.04,16.85L8.91,12.7C8.96,12.47 9,12.24 9,12C9,11.76 8.96,11.53 8.91,11.3L15.96,7.19C16.5,7.69 17.21,8 18,8A3,3 0 0,0 21,5A3,3 0 0,0 18,2A3,3 0 0,0 15,5C15,5.24 15.04,5.47 15.09,5.7L8.04,9.81C7.5,9.31 6.79,9 6,9A3,3 0 0,0 3,12A3,3 0 0,0 6,15C6.79,15 7.5,14.69 8.04,14.19L15.16,18.34C15.11,18.55 15.08,18.77 15.08,19C15.08,20.61 16.39,21.91 18,21.91C19.61,21.91 20.92,20.61 20.92,19A2.92,2.92 0 0,0 18,16.08Z" />
                </SVGIcon>
              </div>
              <div className="btn">
                <SVGIcon size={24}>
                  <path d="M3,17V19H9V17H3M3,5V7H13V5H3M13,21V19H21V17H13V15H11V21H13M7,9V11H3V13H7V15H9V9H7M21,13V11H11V13H21M15,9H17V7H21V5H17V3H15V9Z" />
                </SVGIcon>
              </div>
            </div>
          </div>
          <div className="charts--section dashboard">
            <div className="dashboard--map">
              <div className="charts--section__title">
                <p>Map</p>
              </div>
              <div className="map-container">
                <GisMapView
                  showToolbar={false}
                  showChartLayersOnly={true}
                  selectedMap={chartMap}
                  hideFooter={true}
                  isTocEnable={true}
                  showLayersTreeAside={false}
                  onLayerDataLoadedOnPolygon={handleLayerDataLoaded}
                  onClearAoi={() => {
                    setSelectedGovernorat([])
                  }}
                  hideTable={true}
                  hideSearch={true}
                />
              </div>
            </div>
            <div
              className="dashboard--charts"
              style={{
                marginLeft: '10px',
              }}
            >
              <div className="chart-container">
                <div className="charts--section__title">
                  <p>
                    {
                      chartsConfig({
                        GOVERNORAT: selectedGovernorat,
                      })['salaryGovernorat'].label
                    }
                  </p>
                  <div
                    className="maximize-btn"
                    onClick={() => {
                      setMaximizeChart('salaryGovernorat')
                    }}
                  >
                    <SVGIcon>
                      <path d="M9.5,13.09L10.91,14.5L6.41,19H10V21H3V14H5V17.59L9.5,13.09M10.91,9.5L9.5,10.91L5,6.41V10H3V3H10V5H6.41L10.91,9.5M14.5,13.09L19,17.59V14H21V21H14V19H17.59L13.09,14.5L14.5,13.09M13.09,9.5L17.59,5H14V3H21V10H19V6.41L14.5,10.91L13.09,9.5Z" />
                    </SVGIcon>
                  </div>
                </div>
                <div className="chart">
                  <ReactEcharts
                    theme={'light'}
                    option={getOption('salaryGovernorat')}
                    opts={{ renderer: 'svg' }}
                    // opts={{ width: '750px' }}
                  />
                </div>
              </div>
              <div className="chart-container">
                <div className="charts--section__title">
                  <p>
                    {
                      chartsConfig({
                        GOVERNORAT: selectedGovernorat,
                      })['salaryWilayat'].label
                    }
                  </p>
                  <div
                    className="maximize-btn"
                    onClick={() => {
                      setMaximizeChart('salaryWilayat')
                    }}
                  >
                    <SVGIcon>
                      <path d="M9.5,13.09L10.91,14.5L6.41,19H10V21H3V14H5V17.59L9.5,13.09M10.91,9.5L9.5,10.91L5,6.41V10H3V3H10V5H6.41L10.91,9.5M14.5,13.09L19,17.59V14H21V21H14V19H17.59L13.09,14.5L14.5,13.09M13.09,9.5L17.59,5H14V3H21V10H19V6.41L14.5,10.91L13.09,9.5Z" />
                    </SVGIcon>
                  </div>
                </div>
                <div className="chart">
                  <ReactEcharts
                    theme={'light'}
                    option={getOption('salaryWilayat')}
                    opts={{ renderer: 'svg' }}
                    // opts={{ width: '750px' }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            className="charts--section dashboard"
            style={{
              marginTop: '0',
              flexDirection: 'column',
            }}
          >
            <div className="dashboard--charts">
              <div className="chart-container">
                <div className="charts--section__title">
                  <p>{`Population based on Governorat${selectedGovernorat.length === 1 ? ` (${selectedGovernorat[0]})` : ''}`}</p>
                  <div
                    className="maximize-btn"
                    onClick={() => {
                      setMaximizeChart('populationGovernorat')
                    }}
                  >
                    <SVGIcon>
                      <path d="M9.5,13.09L10.91,14.5L6.41,19H10V21H3V14H5V17.59L9.5,13.09M10.91,9.5L9.5,10.91L5,6.41V10H3V3H10V5H6.41L10.91,9.5M14.5,13.09L19,17.59V14H21V21H14V19H17.59L13.09,14.5L14.5,13.09M13.09,9.5L17.59,5H14V3H21V10H19V6.41L14.5,10.91L13.09,9.5Z" />
                    </SVGIcon>
                  </div>
                </div>
                <div className="chart">
                  <ReactEcharts
                    theme={'light'}
                    option={getOption('populationGovernorat')}
                    // opts={{ width: '750px' }}
                  />
                </div>
              </div>
            </div>
            <div
              className="dashboard--charts"
              style={{
                flexDirection: 'row',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDiretion: 'column',
                  flex: '1',
                  marginRight: '5px',
                }}
              >
                <div className="chart-container">
                  <div className="charts--section__title">
                    <p>{`Number of Wives${selectedGovernorat.length === 1 ? ` (${selectedGovernorat[0]})` : ''}`}</p>
                  </div>
                  <div className="chart">
                    <ReactEcharts
                      theme={'light'}
                      option={
                        getNbrOfWives({
                          GOVERNORAT: selectedGovernorat,
                        }).pie
                      }
                    />
                    {/* <ReactEcharts
                      theme={'light'}
                      option={getNbrOfWives({
                        GOVERNORAT: selectedGovernorat,
                      }).bar}
                    /> */}
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDiretion: 'column',
                  flex: '1',
                  marginLeft: '5px',
                }}
              >
                <div className="chart-container">
                  <div className="charts--section__title">
                    <p>{`Number of Children${selectedGovernorat.length === 1 ? ` (${selectedGovernorat[0]})` : ''}`}</p>
                  </div>
                  <div className="chart">
                    <ReactEcharts
                      option={
                        getNbrOfChildren({
                          GOVERNORAT: selectedGovernorat,
                        }).pie
                      }
                    />
                    {/* <ReactEcharts
                      option={getNbrOfChildren({
                        GOVERNORAT: selectedGovernorat,
                      }).bar}
                    /> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="dashboard--charts">
              <div className="chart-container">
                <div className="charts--section__title">
                  <p>{`Average Eligibility Score${selectedGovernorat.length === 1 ? ` (${selectedGovernorat[0]})` : ''}`}</p>
                </div>
                <div className="chart">
                  <ReactEcharts
                    option={
                      getEligibilityScore({
                        GOVERNORAT: selectedGovernorat,
                      }).bar
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {maximizeChart !== '' && (
        <div
          className="maximized-chart"
          onClick={() => {
            setMaximizeChart('')
          }}
        >
          <div
            className="maximized-chart--dialog"
            onClick={e => {
              e.stopPropagation()
            }}
          >
            <div className="dialog--title">
              <p>
                {chartsConfig({
                  GOVERNORAT: selectedGovernorat,
                })[maximizeChart].label || 'Maximized Dialog'}
              </p>
              <div
                className="close-btn"
                onClick={() => {
                  setMaximizeChart('')
                }}
              >
                <SVGIcon>
                  <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </SVGIcon>
              </div>
            </div>
            <div className="dialog--body">
              <ReactEcharts
                theme={'light'}
                option={getOption(maximizeChart)}
                opts={{ renderer: 'svg' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Chart

const LineChart = props => {
  const { selectedGovernorat = [], getOption, id = '' } = props
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1)
  }, [selectedGovernorat])
  if (isLoading) {
    return <div></div>
  } else {
    return (
      <ReactEcharts
        theme={'light'}
        option={getOption('value_of_export_fish')}
        opts={{ renderer: 'svg' }}
      />
    )
  }
}
