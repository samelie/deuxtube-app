import {
  VIDEO_RECORD_UPDATE,
} from '../constants/action-types';

export function update(payload = {}) {
  return {
    type: VIDEO_RECORD_UPDATE,
    payload: payload
  };
}
