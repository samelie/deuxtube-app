import {
  MOUSE_OVER_VIDEO_THUMB,
} from '../constants/action-types';

import _ from 'lodash';

import { Map } from 'immutable';

const initialState = new Map()
.set('mouseOverVideoThumb', "")

export default function ui(state = initialState, action) {
  switch (action.type) {
    case MOUSE_OVER_VIDEO_THUMB:
      {
        if(!action.payload){
        return state.set('mouseOverVideoThumb', ``)
        }
        return state.set('mouseOverVideoThumb', `http://img.youtube.com/vi/${action.payload}/2.jpg`)
      }
    default:
      {
        return state;
      }
  }
}
