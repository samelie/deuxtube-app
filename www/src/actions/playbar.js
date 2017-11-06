import {
  PLAYBAR_UPDATE,
  PLAYBAR_SEEK,
  PLAYBAR_SET_CURRENT_TIME,
} from '../constants/action-types';


export function playbarUpdate(payload = {}) {
  return {
    type: PLAYBAR_UPDATE,
    payload: payload
  };
}


//from playbar compooent
export function playbarSeek(payload = {}) {
  return {
    type: PLAYBAR_SEEK,
    payload: payload
  };
}

export function playbarSetCurrentTime(payload = {}) {
  return {
    type: PLAYBAR_SET_CURRENT_TIME,
    payload: payload
  };
}
