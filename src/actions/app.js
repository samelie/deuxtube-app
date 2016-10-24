import {
  APP_MEDIA_AUDIO,
  APP_EXPORT_URL,
} from '../constants/action-types';

export function mediaAudioChanged(payload = {}) {
  return {
    type: APP_MEDIA_AUDIO,
    payload: payload
  };
}

export function exportUrl(payload = {}) {
  return {
    type: APP_EXPORT_URL,
    payload: payload
  };
}
