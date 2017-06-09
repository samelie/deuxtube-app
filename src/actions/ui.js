import {
   MOUSE_OVER_VIDEO_THUMB,
} from '../constants/action-types';


export function mouseOverVideoThumb(payload = {}) {
  return {
    type: MOUSE_OVER_VIDEO_THUMB,
    payload: payload
  };
}
