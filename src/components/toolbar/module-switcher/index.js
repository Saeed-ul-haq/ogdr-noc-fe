import React, { useState } from 'react'
import {
  DropdownMenu,
  IconSeparator,
  FontIcon,
  AccessibleFakeButton,
  ListItem,
} from 'react-md'
import PropTypes from 'prop-types'

import i18n from 'i18n-js'
import l from 'libs/langs/keys'

import './styles.scss'

const BarModules = props => {
  const [module, setModule] = useState(`${i18n.t(l.gis_product)}`)

  const onModuleClick = path => {
    const { history } = props
    history && history.push && history.push(path)
  }

  const modules = [
    {
      label: `${i18n.t(l.gis_product)}`,
      id: 'gis_product',
      icon: '',
      path: '',
    },
    {
      label: `${i18n.t(l.studio)}`,
      id: 'compose',
      icon: '',
      // eslint-disable-next-line no-undef
      redirect: (PRODUCT_APP_URL_STUDIO && PRODUCT_APP_URL_STUDIO) || '',
    },
  ]

  return (
    <div className="primarybar-modules-container">
      <DropdownMenu
        closeOnOutsideClick
        id="modules-dropdown-menu"
        className="modules-dropdown-menu"
        menuItems={modules.map(
          ({ label, path = '/', redirect = '' }, index) => {
            return (
              <ListItem
                key={index}
                onClick={e => {
                  if (redirect !== '') {
                    window.open(redirect, '_self')
                  } else {
                    setModule(label)
                    onModuleClick(path)
                  }
                }}
                className="module_item"
                primaryText={label}
              />
            )
          },
        )}
        anchor={{
          x: DropdownMenu.HorizontalAnchors.CENTER,
          y: DropdownMenu.VerticalAnchors.BOTTOM,
        }}
        position={DropdownMenu.Positions.INNER_RIGHT}
        animationPosition="below"
        sameWidth
      >
        <AccessibleFakeButton
          className="accessible-fake-btn"
          component={IconSeparator}
          iconAfter
          label={
            <div className="fake-btn-label-container">
              <div className="icon-container">
                <img
                  className="module-icon"
                  // width="16px"
                  height="24px"
                  src="/static/images/icn_consume.svg"
                  alt="abc"
                />
              </div>
              <div className="module-title">{module}</div>
              <div className="icon-container">
                <FontIcon>arrow_drop_down</FontIcon>
              </div>
            </div>
          }
        />
      </DropdownMenu>
    </div>
  )
}
BarModules.propTypes = {
  history: PropTypes.object,
}
export default BarModules
