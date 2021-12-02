import {
  UPDATE_WELL_DATA,
  UPDATE_WELL_SELECTED_DATA,
  UPDATE_SEISMIC_DATA,
  UPDATE_SEISMIC_SELECTED_DATA,
} from './constants'

export function updateWellData (data) {
  return { type: UPDATE_WELL_DATA, payload: data }
}

export function updateWellSelectedData (data) {
  return { type: UPDATE_WELL_SELECTED_DATA, payload: data }
}

export function updateSeismicData (data) {
  return { type: UPDATE_SEISMIC_DATA, payload: data }
}

export function updateSeismicSelectedData (data) {
  return { type: UPDATE_SEISMIC_SELECTED_DATA, payload: data }
}
