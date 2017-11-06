import {
  SET_ERROR,
} from '../constants/action-types';


export function setError(payload = {}) {
  return {
    type: SET_ERROR,
    payload: payload
  };
}
