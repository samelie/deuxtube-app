import {
  AUDIO_SET,
  AUDIO_INFO,
  AUDIO_SETTINGS_CHANGED,
} from '../constants/action-types';


export function audioInfo(payload = {}) {
  return {
    type: AUDIO_INFO,
    payload: payload
  };
}

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
