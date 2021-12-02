import { getWorkSpaces } from 'libs/utils/gis-apis/get-workspaces-api'

import { createAction } from 'redux-actions'

export const addToast = createAction('APP_ADD_TOAST', (text, action) => ({
  text,
  action,
}))

export const setChart = createAction('ADD_CHART', chart => ({
  chart,
}))

export const dismissToast = createAction('APP_DISMISS_TOAST')

export const setActiveTab = createAction(
  'APP_UPDATE_active_TAB',
  activeTab => ({
    activeTab,
  }),
)
export const setLoading = createAction(
  'APP_SET_LOADING',
  (loading, loadingText) => ({
    loading,
    loadingText,
  }),
)

export const resetLoading = createAction('RESET_LOADING', context => {
  return { context }
})

export const loadWorkspaces = orgId => {
  return dispatch => {
    try {
      dispatch(
        setLoading({ loading: true, loadingText: 'Loading Workspaces...' }),
      )
      getWorkSpaces(orgId)
        .then(result => {
          const workspaces = result.data.meWorkspacesByOrganization.workspaces
          dispatch(updateWSId(workspaces[0].id))
          dispatch(updateWSList(workspaces))
          dispatch(setLoading({ loading: false, loadingText: 'Loading...' }))
        })
        .catch(e => {
          dispatch(setLoading({ loading: false, loadingText: 'Loading...' }))
        })
    } catch (e) {
      console.log('workspace api error', e)
      dispatch(setLoading({ loading: false, loadingText: 'Loading...' }))
    }
  }
}

export const setActiveMode = createAction(
  'APP_UPDATE_ACTIVE_mode',
  activeMode => ({
    activeMode,
  }),
)

export const setActiveMap = createAction('SET_ACTIVE_MAP', activeMap => ({
  activeMap,
}))

export const setAllMaps = createAction('SET_ALL_MAP', maps => ({
  maps,
}))

export const setChartMap = createAction('SET_CHART_MAP', chartMap => ({
  chartMap,
}))

export const setActionBar = createAction(
  'APP_SHOW_ACTION_BAR',
  showActionBar => ({
    showActionBar,
  }),
)

export const updateWSId = createAction(
  'APP_UPDATE_WORKSPACE_ID',
  workspaceID => ({
    workspaceID,
  }),
)

export const updateWSList = createAction(
  'APP_UPDATE_WORKSPACE_LIST',
  workspaces => ({
    workspaces,
  }),
)

export const setCurrentItem = createAction(
  'APP_SELECTED_FILE',
  currentItem => ({
    currentItem,
  }),
)

export const getSelected = createAction('APP_GET_MAP', selectedEntity => ({
  selectedEntity,
}))
