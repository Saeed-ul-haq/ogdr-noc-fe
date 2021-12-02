import React from 'react'
import { displayName } from 'reactutils'
import { connect } from 'react-redux'

import * as act from 'modules/filter-hoc/actions'
import * as appActions from 'modules/app/actions'

import { dispatch } from 'libs/store'

export function initFilter (moduleName, ...args) {
  dispatch(act.initialModule(moduleName))
  return connect(...args)
}

export function filter (moduleName) {
  return Comp => {
    @initFilter(
      moduleName,
      ({ filters, app: { toasts } }) => ({
        filters: filters[moduleName].filters,
        toasts,
      }),
      {
        updateFilter: act.updateFilterFactory(moduleName),
        setFilteredData: act.setFilteredDataFactory(moduleName),
        clearFilter: act.clearFilterFactory(moduleName),
        addToast: appActions.addToast,
        dismissToast: appActions.dismissToast,
      },
    )
    class Filter extends React.PureComponent {
      static displayName = `Filter(${displayName(Comp)}) of ${moduleName}`
      render () {
        return <Comp {...this.props} />
      }
    }
    return Filter
  }
}

export function data ({ moduleName, filterField, filteredDataField }) {
  return Comp => {
    @initFilter(moduleName, ({ filters }) => ({
      [filterField || 'filters']: filters[moduleName].filter,
      [filteredDataField || 'filteredData']: filters[moduleName].filteredData,
    }))
    class Data extends React.PureComponent {
      static displayName = `FilterData(${displayName(Comp)}) of ${moduleName}`
      render () {
        return <Comp {...this.props} />
      }
    }
    return Data
  }
}
