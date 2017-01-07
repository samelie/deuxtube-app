import {
  PLAYLIST_NEXT,
  PLAYLIST_PREVIOUS,
} from '../constants/action-types';

import { Map } from 'immutable';

const initialState = new Map()
  .set('counter', 1)

export default function playlistControls(state = initialState, action) {
  switch (action.type) {
    case PLAYLIST_NEXT:
        return state.set('counter',
          (state.get('counter') || 1) + 1)
      break;
    case PLAYLIST_PREVIOUS:
      return state.set('counter',
        (state.get('counter') || 1) - 1)
      break;
    default:
      {
        return state;
      }
  }
}
