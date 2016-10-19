import {
  APP_MEDIA_AUDIO,
} from '../constants/action-types';

export function mediaAudioChanged(payload = {}) {
  return {
    type: APP_MEDIA_AUDIO,
    payload: payload
  };
}
