import { handleActions } from 'redux-actions'
import update from 'immutability-helper'

import {
  updateMutation,
  updateSelectedRows,
  initSelectedRows,
  updateSelectedOnEdit,
} from 'modules/query-search/actions'

import { getCurrentSelected } from 'libs/hoc/sharedFunction'

const initialState = {}

update.extend('$auto', (value, object) => {
  return object ? update(object, value) : update({}, value)
})

export default handleActions(
  {
    [updateMutation] (state, { payload }) {
      const {
        moduleName,
        mutationName,
        key,
        value,
        dataTypeCount,
        ids,
      } = payload

      if (!(moduleName in state)) {
        state[moduleName] = {
          [mutationName]: {},
        }
      }
      if (!(mutationName in state[moduleName])) {
        state[moduleName][mutationName] = {}
      }
      return update(state, {
        [moduleName]: {
          [mutationName]: {
            [key]: {
              $set: value,
            },
            count: {
              $set: dataTypeCount,
            },
            selected: {
              $set: getCurrentSelected(ids, value, {
                moduleName,
                mutationName,
                data: state,
              }),
            },
          },
        },
      })
    },
    [updateSelectedRows] (state, { payload }) {
      const { moduleName, mutationName, ids, selected } = payload
      return update(state, {
        [moduleName]: {
          [mutationName]: {
            ids: {
              $set: ids,
            },
            selected: {
              $set: ids[selected].map(elem => {
                return elem.index
              }),
            },
          },
        },
      })
    },
    [updateSelectedOnEdit] (state, { payload }) {
      const { moduleName, mutationName, ids, value } = payload
      return update(state, {
        [moduleName]: {
          [mutationName]: {
            selected: {
              $set: getCurrentSelected(ids, value, {
                moduleName,
                mutationName,
                data: state,
              }),
            },
          },
        },
      })
    },
    [initSelectedRows] (state, { payload }) {
      return update(state, { $set: {} })
    },
  },
  initialState,
)
