import {
  SET_AWAITING_API_OVERLAY_FALSE,
  SET_AWAITING_API_OVERLAY_TRUE,
} from './constants'

const initialState = {
  is_awaiting_api_overlay_visible: false,
}

/*
 This reducer is responsible for shared UI components, such as a blocking overlay
 to disable user interactions when awaiting a response from the API
*/
export default function (state = initialState, action) {
  switch (action.type) {
    case SET_AWAITING_API_OVERLAY_FALSE:
      return { ...state, is_awaiting_api_overlay_visible: false }

    case SET_AWAITING_API_OVERLAY_TRUE:
      return { ...state, is_awaiting_api_overlay_visible: true }

    default:
      return { ...state }
  }
}
