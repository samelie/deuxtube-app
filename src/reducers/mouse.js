import {
  MOUSE_MOVE,
} from '../constants/action-types';

import { Map } from 'immutable';

const initialState = new Map()
  .set('position', {})

export default function mouse(state = initialState, action) {
  switch (action.type) {
    case MOUSE_MOVE:
      {
        return state.set('position', action.payload)
      }
    default:
      {
        return state;
      }
  }
}
