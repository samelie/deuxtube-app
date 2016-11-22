import {
  APP_LOGGED_IN,
  APP_EXPORT_URL,
  APP_RECORD,
  APP_SAVE,
} from '../constants/action-types';

import { Record, Map } from 'immutable';


const initialState = new Map()
  .set('loggedIn', false)
  .set('saving', false)
  .set('recording', false)
  .set('saved', false)
  .set('saveResults', false)
  .set('media', null)

/**
 * [projects description]
 * @param  {Record} state  =  initialState [An immutable Record defined above]
 * @param  {function} action [Redux action. Defined in '/actions/terms.js']
 * @return {Record} a new copy of the state you passed into with any changes to it
 */
export default function app(state = initialState, action) {
  switch (action.type) {
    case APP_LOGGED_IN:
      {
        return state.set('loggedIn', action.payload)
      }
    case APP_EXPORT_URL:
      {
        return state.set('finalSave', action.payload).set('saved', true)
      }
    case APP_RECORD:
      {
        return state.set('recording', action.payload)
      }
    case APP_SAVE:
      {
        return state.set('saving', action.payload)
          .set('recording', false)
      }
    default:
      {
        return state;
      }
  }
}
