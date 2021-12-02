import React from 'react'
import ReactEcharts from 'echarts-for-react'
import PropTypes from 'prop-types'
import { Empty, Col } from 'antd'
import Loader from 'components/ui-kit/loader'
const Creator = ({ params, loading, title }) => {
  if (!title) {
    return (
      <div className="creator-div ">
        <Empty description={false}>Chart Preview</Empty>
      </div>
    )
  }

  let options = {}
  if (title.toLowerCase().includes('school')) {
    options = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        align: title.toLowerCase().includes('private') ? 'left' : 'right',
        right: title.toLowerCase().includes('private') ? 200 : -15,
        data: ['Teachers', 'Office Staff', 'Servant', 'Girls', 'Boys'],
      },
      series: [
        {
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center',
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '15',
                fontWeight: 'bold',
              },
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: [
            { value: 335, name: 'Boys' },
            { value: 310, name: 'Girls' },
            { value: 150, name: 'Office Staff' },
            { value: 135, name: 'Teachers' },
            { value: 100, name: 'Servant' },
          ],
        },
      ],
    }
  } else if (title.toLowerCase().includes('population')) {
    options = {
      xAxis: {
        type: 'category',
        data: ['Male', 'Total', 'Female', 'Young', 'Omani', 'Old', 'Infant'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar',
        },
      ],
      grid: [{ x: '10%' }],
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
    }
  } else {
    options = {
      grid: [{ x: '20%', bottom: '20%' }],
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        align: 'right',
        right: 1,
        data: ['Rooms', 'Office Staff', 'Staff', 'Managers', 'Servant'],
      },
      series: [
        {
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center',
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '15',
                fontWeight: 'bold',
              },
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: [
            { value: 335, name: 'Rooms' },
            { value: 200, name: 'Staff' },
            { value: 150, name: 'Office Staff' },
            { value: 50, name: 'Managers' },
            { value: 100, name: 'Servant' },
          ],
        },
      ],
    }
  }
  return (
    <Col style={{ padding: 0, height: '100%' }}>
      {/* <header className="chart-heading">Chart Preview</header> */}
      <div className="creator-div ">
        {loading ? (
          <Loader text={'Generating Chart...'} />
        ) : (
          <Col>
            {/* <header className="chart-title">{title}</header> */}
            <ReactEcharts
              option={options}
              notMerge={true}
              lazyUpdate={true}
              theme={
                title.toLowerCase().includes('hotel') ? 'default' : 'light'
              }
              onChartReady={() => {}}
              onEvents={() => {}}
              opts={{ width: 350, height: 250 }}
            />
          </Col>
        )}
      </div>
    </Col>
  )
}
Creator.propTypes = {
  params: PropTypes.object,
  loading: PropTypes.bool,
  title: PropTypes.string,
}
export default Creator
