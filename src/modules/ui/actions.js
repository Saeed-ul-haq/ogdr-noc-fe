import {
  SET_AWAITING_API_OVERLAY_FALSE,
  SET_AWAITING_API_OVERLAY_TRUE,
} from './constants'

export function displayAPIWorkingOverlay () {
  return { type: SET_AWAITING_API_OVERLAY_TRUE }
}

export function hideAPIWorkingOverlay () {
  return { type: SET_AWAITING_API_OVERLAY_FALSE }
}
