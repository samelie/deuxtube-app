import {
  PLAYLIST_ITEM_MOVE,
  PLAYLIST_ITEM_DELETE,
} from '../constants/action-types';

import { Map, Record } from 'immutable';

/*const initialState =  Map({
});*/

const initialState = new Map()
.set('makeStatus')

const makeStatusVo = (item, action = "moved") => {
  return {
    item: item,
    action: action
  }
}

/**
 * [projects description]
 * @param  {Record} state  =  initialState [An immutable Record defined above]
 * @param  {function} action [Redux action. Defined in '/actions/terms.js']
 * @return {Record} a new copy of the state you passed into with any changes to it
 */
export default function makeStatus(state = initialState, action) {
  let _state, _action
  switch (action.type) {

    case PLAYLIST_ITEM_MOVE:
      return state.set('makeStatus', makeStatusVo(
          action.payload.item, 'moved'))
      break;
    case PLAYLIST_ITEM_DELETE:
      return state.set('makeStatus', makeStatusVo(
          action.payload.item, 'delete'))
      break;
    default:
      {
        return state;
      }
  }
}
