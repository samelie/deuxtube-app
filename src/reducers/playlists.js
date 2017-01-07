import {
  PLAYLIST_CREATE,
  PLAYLIST_SET,
  PLAYLIST_ITEM_MOVE,
  PLAYLIST_ITEM_DELETE,
} from '../constants/action-types';

import { Map, Record } from 'immutable';

const initialState = new Map()
  //the one which is being searched


/**
 * [projects description]
 * @param  {Record} state  =  initialState [An immutable Record defined above]
 * @param  {function} action [Redux action. Defined in '/actions/terms.js']
 * @return {Record} a new copy of the state you passed into with any changes to it
 */
export default function playlists(state = initialState, action) {
  let _state, _action
  switch (action.type) {

    case PLAYLIST_CREATE:
      //payload = id from video_track
      return state.set(action.payload, new Map({
        id: null,
        playlist: [],
        playlistAction: {
          videoId: null,
          move: false,
          delete: false,
        }
      }))
      break;

    case PLAYLIST_SET:
      return state.set(action.payload.key, new Map({
        id: action.payload.key,
        playlist: action.payload.value
      }))
      break;
    case PLAYLIST_ITEM_MOVE:
      _state = state.get(action.payload.key)
      _action = _state.set('playlistAction', {
        videoId: action.payload.value,
        item: action.payload.item,
        type: 'move'
      })
      return state.set(action.payload.key, _action)
      break;
    case PLAYLIST_ITEM_DELETE:
      _state = state.get(action.payload.key)
      _action = _state.set('playlistAction', {
        videoId: action.payload.value,
        type: 'delete'
      })
      return state.set(action.payload.key, _action)
      break;
    default:
      {
        return state;
      }
  }
}
