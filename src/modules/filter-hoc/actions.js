import { createAction } from 'redux-actions'

export const updateFilter = createAction(
  'FILTER_HOC_UPDATE_FILTER',
  (moduleName, name, data) => ({ moduleName, name, data }),
)

export const setFilteredData = createAction(
  'FILTER_HOC_SET_FILTERED_DATA',
  (moduleName, value) => ({ moduleName, value }),
)

export const clearFilter = createAction(
  'FILTER_HOC_CLEAR_FILTER',
  (moduleName, value) => ({ moduleName, value }),
)

export const initialModule = createAction('FILTER_HOC_INIT_FILTER')

export const updateFilterFactory = moduleName => (name, data) =>
  updateFilter(moduleName, name, data)

export const setFilteredDataFactory = moduleName => value =>
  setFilteredData(moduleName, value)

export const clearFilterFactory = moduleName => name =>
  clearFilter(moduleName, name)
