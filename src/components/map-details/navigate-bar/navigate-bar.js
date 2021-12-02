/* eslint-disable react/prop-types */
import React from 'react'
import { cls } from 'reactutils/lib/utils'
import { Button } from 'react-md'

import './styles.scss'

const NavigateBar = ({ className, dashboardName, onClickBack }) => {
  return (
    <div className={cls(className, 'navigateBar')}>
      <Button flat iconChildren="arrow_back" onClick={onClickBack}>
        Marketplace
      </Button>

      <p>{dashboardName}</p>
    </div>
  )
}

export default NavigateBar
