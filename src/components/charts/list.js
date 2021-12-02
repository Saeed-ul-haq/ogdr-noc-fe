import React, { Fragment, memo, useEffect, useState } from 'react'

import PropTypes from 'prop-types'
import ReactEcharts from 'echarts-for-react'

const ChartList = props => {
  const [chartComps, setChartComps] = useState([])
  useEffect(() => {
    let charts = drawCharts()
    setChartComps(charts)
  }, [props.charts])

  const drawCharts = () => {
    const { charts = [] } = props
    return charts.map((chartObj, i) => {
      const {
        properties: { title },
        option: chartOpt,
      } = chartObj
      const [series = {}] = (chartOpt || {}).series || [{}]
      const is3D = series.type && series.type.includes('3D')
      return (
        <div
          key={i}
          onClick={() => props.onChartClick(i)}
          className={
            is3D
              ? 'echart-container full-width md-cell md-cell--4'
              : 'echart-container md-cell md-cell--4'
          }
        >
          <div className="chart-title">{title}</div>
          <ReactEcharts
            key={i}
            option={{
              ...chartOpt,
              grid: [{ x: '20%', bottom: '20%' }],
              tooltip: {},
            }}
            notMerge={true}
            lazyUpdate={true}
            theme={'light'}
            onChartReady={() => {}}
            onEvents={() => {}}
          />
        </div>
      )
    })
  }
  return <Fragment>{chartComps}</Fragment>
}
ChartList.propTypes = {
  charts: PropTypes.array,
  onChartClick: PropTypes.func,
}
export default memo(ChartList)
