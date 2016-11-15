import {
  QUERY_SET,
} from '../constants/action-types';

import _ from 'lodash';

import { Map } from 'immutable';

const initialState = new Map();

const getIdFromItem = (item) => {
  if (!item) {
    return
  }
  if (item.videoId) {
    return item.videoId
  }
  if (_.isObject(item.id)) {
    return item.id.videoId;
  } else if (_.isObject(item.snippet.resourceId)) {
    return item.snippet.resourceId.videoId;
  } else {
    return;
  }
};


export default function query(state = initialState, action) {
  switch (action.type) {
    case QUERY_SET:
      {
        //keycode
        let rawResults = action.payload.results
        let ids = rawResults.items.map(item => {
          return getIdFromItem(item)
        })
        let items = rawResults.items.map(item => {
          item.videoId = getIdFromItem(item)
          item.snippet.resourceId = item.snippet.resourceId || {
            videoId:item.videoId
          }
          return item
        })
        return state.set('results', {
          id: action.payload.id,
          items: [...items],
          videoIds: ids
        })
      }
    default:
      {
        return state;
      }
  }
}
