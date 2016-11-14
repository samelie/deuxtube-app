import {
  APP_EXPORT_URL,
  APP_RECORD,
  APP_SAVE,
} from '../constants/action-types';

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
