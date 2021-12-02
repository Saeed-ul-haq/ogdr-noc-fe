import React, { memo, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import ReactEcharts from 'echarts-for-react'
import { Carousel, Modal } from 'antd'
const ChartList = props => {
  const [chartComps, setChartComps] = useState([])
  useEffect(() => {
    const { index } = props
    let charts = drawCharts()
    const toShowFirst = charts[index]
    charts.splice(index, 1)
    charts.unshift(toShowFirst)
    setChartComps(charts)
  }, [])
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
        <div className="chart-carousel-container" key={i}>
          <div className="chart-title">{title}</div>
          <ReactEcharts
            className={is3D ? 'full-width' : ''}
            key={i}
            option={{
              ...chartOpt,
              grid: [{ x: '20%', bottom: '20%', top: '10%' }],
              legend: {},
              tooltip: {},
            }}
            notMerge={true}
            lazyUpdate={true}
            theme={'light'}
            onChartReady={() => {}}
            onEvents={() => {}}
            opts={{}}
          />
        </div>
      )
    })
  }
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  }
  return (
    <Modal
      width={'70%'}
      title="Charts"
      visible={true}
      footer={null}
      onCancel={props.onCancel}
      className="charts-modal"
    >
      <Carousel className="charts-carousel" {...settings}>
        {chartComps}
      </Carousel>
    </Modal>
  )
}
ChartList.propTypes = {
  index: PropTypes.number,
  charts: PropTypes.array,
  onCancel: PropTypes.func,
}
export default memo(ChartList)
