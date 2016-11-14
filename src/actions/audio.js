import {
  AUDIO_SET,
  AUDIO_SETTINGS_CHANGED,
} from '../constants/action-types';


export function audioLoaded(payload = {}) {
  return {
    type: AUDIO_SET,
    payload: payload
  };
}

export function audioSettingsChanged(payload = {}) {
  return {
    type: AUDIO_SETTINGS_CHANGED,
    payload: payload
  };
}
