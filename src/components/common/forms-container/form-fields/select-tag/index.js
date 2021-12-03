import React, { Component } from 'react'
import SearchDropdown from 'components/common/ui-toolkit/search-dropdown'

import PropTypes from 'prop-types'
import { SelectField } from 'react-md'
import Select from 'react-select'
// import i18n from 'i18n-js'
import { orderBy } from 'lodash'

import { cleanArray } from 'libs/utils/cleanArray'

// import l from 'libs/langs/keys'

import './styles.scss'

export default class SelectTag extends Component {
  prepareMenuItems = menuItems => {
    if (typeof menuItems[0] === 'object') {
      return menuItems
    } else {
      const orderedMenuItems = orderBy(
        cleanArray(
          menuItems.map(item => {
            if (typeof item === 'string' || typeof item === 'number') {
              return {
                label: item,
                value: item,
              }
            }
          }),
        ),
        ['label'],
        ['asc'],
      )
      return orderedMenuItems
    }
  }
  renderSwitch = params => {
    const {
      multiple,
      value,
      label,
      items,
      placeholder,
      onChange,
      defaultValue,
      disabled,
      position,
      ...rest
    } = params
    switch (multiple) {
      case 'multiple':
        return (
          <Select
            id={placeholder || ''}
            placeholder={placeholder || ''}
            value={value || ''}
            onChange={value => {
              onChange(value || '')
            }}
            isMulti={true}
            options={items || []}
            {...rest}
            visible={true}
            isDisabled={disabled}
            isClearable={!disabled}
            menuPlacement={position || 'bottom'}
          />
        )
      default:
        return (
          <SearchDropdown
            id={label || ''}
            fullWidth
            placeholder={placeholder || label || ''}
            value={value || ''}
            defaultValue={defaultValue || value}
            // menuItems={items || []}
            menuItems={this.prepareMenuItems(items || [])}
            onChange={value => {
              onChange(value || '')
            }}
            position={SelectField.Positions.BELOW}
            disabled={disabled}
            {...rest}
          />
        )
    }
  }
  render() {
    const { error = false } = this.props
    return (
      <div className={error ? 'select-tag error-tag' : 'select-tag'}>
        {this.renderSwitch(this.props)}
        {error ? (
          <p className="error">{`${i18n.t(l.required_field)}`}</p>
        ) : null}
      </div>
    )
  }
}

SelectTag.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  items: PropTypes.array,
  placeholder: PropTypes.string,
  multiple: PropTypes.bool,
  error: PropTypes.bool,
  disabled: PropTypes.bool,
}
