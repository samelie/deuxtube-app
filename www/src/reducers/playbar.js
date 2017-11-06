import {
  PLAYBAR_UPDATE,
  PLAYBAR_SEEK,
  PLAYBAR_SET_CURRENT_TIME,
} from '../constants/action-types';

import { Map } from 'immutable';

const initialState = new Map()
  .set('currentAction', "")
  .set('currentTime', 0)
  .set('sourceBufferStart', 0)
  .set('sourceBufferEnd', 0)
  .set('progress', 0)
  .set('seek', 0)
  .set('seekCurrentTime', 0)

export default function playbar(state = initialState, action) {
  switch (action.type) {
    case PLAYBAR_UPDATE:
      {
        let {
          currentTime,
          sourceBufferStart,
          sourceBufferEnd
        } = action.payload
        return state.set('progress', currentTime / sourceBufferEnd)
        .set('currentTime', currentTime)
        .set('sourceBufferStart', sourceBufferStart)
        .set('sourceBufferEnd', sourceBufferEnd)
        .set('currentAction', PLAYBAR_UPDATE)
      }
    case PLAYBAR_SEEK:
      {
        return state.set('seek', action.payload)
        .set('progress', action.payload)
        .set('currentAction', PLAYBAR_SEEK)
      }
      case PLAYBAR_SET_CURRENT_TIME:
      {
        return state.set('seekCurrentTime', action.payload)
        .set('currentAction', PLAYBAR_SET_CURRENT_TIME)
      }
    default:
      {
        return state;
      }
  }
}
