import React from 'react'
import ReactEcharts from 'echarts-for-react'
import PropTypes from 'prop-types'
import { Empty } from 'antd'
import Loader from 'components/ui-kit/loader'
const Creator = ({ params, loading }) => {
  if (!params) {
    return (
      <div className="creator-div ">
        <Empty description={false}>Chart Preview</Empty>
      </div>
    )
  }

  return (
    <div className="creator-div ">
      {loading ? (
        <Loader text={'Generating Preview...'} />
      ) : (
        <ReactEcharts
          option={{
            ...params,
            grid: [{ x: '20%' }],
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)',
            },
          }}
          notMerge={true}
          lazyUpdate={true}
          theme={'light'}
          onChartReady={() => {}}
          onEvents={() => {}}
          opts={{ width: 300 }}
        />
      )}
    </div>
  )
}
Creator.propTypes = {
  params: PropTypes.object,
  loading: PropTypes.bool,
}
export default Creator
