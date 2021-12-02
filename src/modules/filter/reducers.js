import {
  UPDATE_WELL_DATA,
  UPDATE_WELL_SELECTED_DATA,
  UPDATE_SEISMIC_DATA,
  UPDATE_SEISMIC_SELECTED_DATA,
} from './constants'

const initialState = {
  wellData: [],
  wellSelectedData: [],
  seismicData: [],
  seismicSelectedData: [],
}

/*
   This reducer is responsible for shared UI components, such as a blocking overlay
   to disable user interactions when awaiting a response from the API
  */
export default function (state = initialState, action) {
  switch (action.type) {
    case UPDATE_WELL_DATA:
      return { ...state, wellData: action.payload }
    case UPDATE_WELL_SELECTED_DATA:
      return { ...state, wellSelectedData: action.payload }
    case UPDATE_SEISMIC_DATA:
      return { ...state, seismicData: action.payload }
    case UPDATE_SEISMIC_SELECTED_DATA:
      return { ...state, seismicSelectedData: action.payload }

    default:
      return { ...state }
  }
}
