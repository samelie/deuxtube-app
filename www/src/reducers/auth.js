import {
  AUTH_INSTA,
  AUTH_YOUTUBE,
} from '../constants/action-types';

import { Record, Map } from 'immutable';


const initialState = new Map()
  .set('instagram', {})
  .set('youtube', {})

/**
 * [projects description]
 * @param  {Record} state  =  initialState [An immutable Record defined above]
 * @param  {function} action [Redux action. Defined in '/actions/terms.js']
 * @return {Record} a new copy of the state you passed into with any changes to it
 */
export default function auth(state = initialState, action) {
  switch (action.type) {
    case AUTH_INSTA:
      {
        return state.set('instagram', action.payload)
      }
      case AUTH_YOUTUBE:
      {
        return state.set('youtube', action.payload)
      }
    default:
      {
        return state;
      }
  }
}
