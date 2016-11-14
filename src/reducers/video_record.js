import {
  VIDEO_RECORD_UPDATE,
} from '../constants/action-types';

import { Record } from 'immutable';

const InitialState = Record({
  frameCount: 0
});

const initialState = new InitialState;

export default function videoRecord(state = initialState, action) {
  switch (action.type) {
    case VIDEO_RECORD_UPDATE:
      {
        return state.set('frameCount', action.payload)
      }
    default:
      {
        return state;
      }
  }
}
