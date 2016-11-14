import {
  KEYBOARD_DOWN,
  KEYBOARD_UP,
} from '../constants/action-types';


export function keyDown(payload = {}) {
  return {
    type: KEYBOARD_DOWN,
    payload: payload
  };
}

export function keyUp(payload = {}) {
  return {
    type: KEYBOARD_DOWN,
    payload: payload
  };
}
