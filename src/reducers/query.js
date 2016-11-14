import {
  QUERY_SET,
} from '../constants/action-types';

import { Map } from 'immutable';

const initialState = new Map();

export default function query(state = initialState, action) {
  switch (action.type) {
    case QUERY_SET:
      {
        //keycode
        let rawResults = action.payload.results
        let ids = rawResults.items.map(item => {
          return item.id.videoId
        })
        return state.set('results', {
          id: action.payload.id,
          items: [...rawResults.items],
          videoIds: ids
        })
      }
    default:
      {
        return state;
      }
  }
}
