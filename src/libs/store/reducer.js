import { combineReducers } from 'redux'
import { reducer as query } from '@target-energysolutions/react-hoc-query'
import { shell, reducers } from '@target-energysolutions/app-shell'
import app from 'modules/app/reducers'

const reducer = combineReducers({
  shell,
  query,
  app,
  ...reducers,
})

export default reducer
