import {
  VIDEO_STATE_SET_SELECT,
} from '../constants/action-types';


export function videoSelect(payload = {}) {
  return {
    type: VIDEO_STATE_SET_SELECT,
    payload: payload
  };
}
