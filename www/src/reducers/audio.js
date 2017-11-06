import {
  AUDIO_SET,
  AUDIO_INFO,
  AUDIO_SETTINGS_CHANGED,
} from '../constants/action-types';

import { Record, Map } from 'immutable';

const initialState = new Map()
  .set('duration', 0)
  //youtube
  .set('info', null)
  //setting
  .set('track', null)

export default function audio(state = initialState, action) {
  switch (action.type) {
    case AUDIO_SET:
      {
        let { duration } = action.payload
        return state.set('duration', duration)
      }
    case AUDIO_SETTINGS_CHANGED:
      {
        /*let _media = state.get('media')
        _media.audio = Object.assign({},
          _media.audio,
          action.payload)
        console.log(action.payload);
        console.log(_media.audio);
        let _mergedMedia = Object.assign({},
          state.get('media').audio,
          action.payload)
        state.set('media', _media)*/
        return state.set('track', action.payload)
      }
    case AUDIO_INFO:{
        return state.set('info', action.payload)
    }
    default:
      {
        return state;
      }
  }
}
