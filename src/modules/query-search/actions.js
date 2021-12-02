import { createAction } from 'redux-actions'

export const updateMutation = createAction(
  'MUTATE_UPDATE_SEARCH',
  ({ moduleName, mutationName, key, value, dataTypeCount, ids }) => ({
    moduleName,
    mutationName,
    key,
    value,
    dataTypeCount,
    ids,
  }),
)

export const updateSelectedRows = createAction(
  'MUTATE_UPDATE_SEARCH_SELECTED',
  ({ selected, moduleName, mutationName, ids, value }) => ({
    selected,
    moduleName,
    mutationName,
    ids,
    value,
  }),
)

export const updateSelectedOnEdit = createAction(
  'MUTATE_UPDATE_SEARCH_SELECTED_ON_EDIT',
  ({ selected, moduleName, mutationName, ids, value }) => ({
    selected,
    moduleName,
    mutationName,
    ids,
    value,
  }),
)

export const initSelectedRows = createAction('INIT_UPDATE_SEARCH_SELECTED')
