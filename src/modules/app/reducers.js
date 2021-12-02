import { handleActions } from 'redux-actions'
import update from 'immutability-helper'
import defaultCharts from './defaultCharts'
import {
  addToast,
  dismissToast,
  updateWSId,
  updateWSList,
  setCurrentItem,
  getSelected,
  setLoading,
  setActionBar,
  setActiveTab,
  setActiveMode,
  setActiveMap,
  setChartMap,
  setChart,
  setAllMaps,
} from 'modules/app/actions'

const initialState = {
  toasts: [],
  workspaceID: '',
  workspaces: [],
  activeTab: 'maps',
  activeMode: 'grid-view',
  activeMap: {},
  chartMap: {},
  charts: defaultCharts(),
  allMaps: [],
}

update.extend('$auto', (value, object) => {
  return object ? update(object, value) : update({}, value)
})

export default handleActions(
  {
    [addToast](state, { payload }) {
      return update(state, {
        toasts: { $push: [payload] },
      })
    },
    [dismissToast](state) {
      return update(state, {
        toasts: { $splice: [[0, 1]] },
      })
    },
    [setActiveTab](state, { payload }) {
      return update(state, {
        activeTab: { $set: payload.activeTab },
      })
    },
    [setActiveMode](state, { payload }) {
      return update(state, {
        activeMode: { $set: payload.activeMode },
      })
    },
    [setActionBar](state, { payload }) {
      return update(state, {
        showActionBar: { $set: payload.showActionBar },
      })
    },
    [updateWSId](state, { payload }) {
      return update(state, {
        workspaceID: { $set: payload.workspaceID },
      })
    },
    [updateWSList](state, { payload }) {
      return update(state, {
        workspaces: { $set: payload.workspaces },
      })
    },
    [setCurrentItem](state, { payload }) {
      return update(state, {
        currentItem: { $set: payload.currentItem },
      })
    },
    [getSelected](state, { payload }) {
      return update(state, {
        selectedEntity: { $set: payload.selectedEntity },
      })
    },
    [setLoading](state, { payload }) {
      return update(state, {
        loading: {
          $set: {
            ...payload.loading,
          },
        },
      })
    },
    [setActiveMap](state, { payload }) {
      return update(state, {
        activeMap: { $set: payload.activeMap },
      })
    },
    [setAllMaps](state, { payload }) {
      return update(state, {
        allMaps: { $set: payload.maps },
      })
    },
    [setChartMap](state, { payload }) {
      return update(state, {
        chartMap: { $set: payload.chartMap },
      })
    },
    [setChart](state, { payload }) {
      return update(state, {
        charts: { $push: [payload.chart] },
      })
    },
  },
  initialState,
)
