import {
  APP_LOGGED_IN,
  APP_EXPORT_URL,
  APP_RECORD,
  APP_SAVE,
} from '../constants/action-types';

export function loggedIn(payload = {}) {
  return {
    type: APP_LOGGED_IN,
    payload: payload
  };
}

export function exportUrl(payload = {}) {
  return {
    type: APP_EXPORT_URL,
    payload: payload
  };
}

export function record(payload = {}) {
  return {
    type: APP_RECORD,
    payload: payload
  };
}

export function save(payload = {}) {
  return {
    type: APP_SAVE,
    payload: payload
  };
}
