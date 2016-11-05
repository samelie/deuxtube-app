import {
  APP_MEDIA_AUDIO,
  APP_EXPORT_URL,
} from '../constants/action-types';

import { Record } from 'immutable';

/**
 * Record is like a class, but immutable and with default values.
 * https://facebook.github.io/immutable-js/docs/#/Record
 */
/*const InitialState = Record({
  media: Record({
    audio: Record({

    })
  })
});*/

const InitialState = Record({
  finalSave:{},
  media: {
    audio: {

    }
  }
});

const initialState = new InitialState;

/**
 * [projects description]
 * @param  {Record} state  =  initialState [An immutable Record defined above]
 * @param  {function} action [Redux action. Defined in '/actions/terms.js']
 * @return {Record} a new copy of the state you passed into with any changes to it
 */
export default function app(state = initialState, action) {
  switch (action.type) {
    case APP_MEDIA_AUDIO:
      {
        let _media = state.get('media')
        _media.audio = Object.assign({}, _media.audio, action.payload)
        let _mergedMedia = Object.assign({}, state.get('media').audio, action.payload)
        state.set('media', _media)
        return state
      }
    case APP_EXPORT_URL:
      {
        return state.set('finalSave', action.payload)
      }
    default:
      {
        return state;
      }
  }
}
