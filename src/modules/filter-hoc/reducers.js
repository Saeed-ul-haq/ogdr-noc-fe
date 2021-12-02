import { handleActions } from 'redux-actions'
import update from 'immutability-helper'
import {
  setFilteredData,
  updateFilter,
  initialModule,
  clearFilter,
} from './actions'

const initialState = {}

export default handleActions(
  {
    [initialModule] (state = initialState, { payload }) {
      const moduleName = payload
      if (moduleName in state) {
        return state
      }
      return update(state, {
        [moduleName]: {
          $set: {
            filters: {},
            filteredData: [],
          },
        },
      })
    },
    [updateFilter] (state, { payload }) {
      const { moduleName, name, data } = payload
      return update(state, {
        [moduleName]: {
          filters: {
            [name]: {
              $set: data,
            },
          },
        },
      })
    },
    [setFilteredData] (state, { payload }) {
      const { moduleName, value } = payload
      return update(state, {
        [moduleName]: {
          filteredData: { $set: value },
        },
      })
    },
    [clearFilter] (state, { payload }) {
      const { moduleName, value } = payload
      return update(state, {
        [moduleName]: {
          filters: {
            [value]: {
              $set: {},
            },
          },
        },
      })
    },
  },
  initialState,
)
