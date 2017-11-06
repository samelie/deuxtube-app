import {
  EFFECTS_SET,
  EFFECT_CHANGED,
  EFFECT_SELECTED,
  EFFECTS_UPDATE_SELECTED,
} from '../constants/action-types';


export function effectChanged(payload = {}) {
  return {
    type: EFFECT_CHANGED,
    payload: payload
  };
}

export function effectSelected(payload = {}) {
  return {
    type: EFFECT_SELECTED,
    payload: payload
  };
}

export function effectUpdateSelected(payload = {}) {
  return {
    type: EFFECTS_UPDATE_SELECTED,
    payload: payload
  };
}
