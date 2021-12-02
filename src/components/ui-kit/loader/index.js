import React from 'react'
import { Spin } from 'antd'

import PropTypes from 'prop-types'

import './styles.scss'

const Spinner = props => {
  const { text, type } = props
  return (
    <div className="loading">
      <div className={`loading-text ${type}`}>
        <Spin tip={text} />
      </div>
    </div>
  )
}
Spinner.propTypes = {
  text: PropTypes.string,
  type: PropTypes.string,
}

export default Spinner
