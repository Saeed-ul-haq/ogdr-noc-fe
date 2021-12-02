import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import query from 'react-hoc-query/lib/reducers'
import {
  shell,
  reducers as shellReducers,
} from '@target-energysolutions/app-shell'

import {
  messenger,
  discussion,
  reducers,
} from '@target-energysolutions/messenger'

import app from 'modules/app/reducers'
import filters from 'modules/filter-hoc/reducers'
import ui from 'modules/ui/reducers'
import mutation from 'modules/mutate/reducers'
import querySearch from 'modules/query-search/reducers'

const store = createStore(
  combineReducers({
    query,
    app,
    shell,
    filters,
    ui,
    messenger,
    discussion,
    mutation,
    querySearch,
    ...reducers,
    ...shellReducers,
  }),
  compose(
    applyMiddleware(thunkMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f,
  ),
)

export const dispatch = store.dispatch.bind(store)
export const getState = store.getState.bind(store)

export default store
