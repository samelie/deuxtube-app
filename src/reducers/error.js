import {
  SET_ERROR,
} from '../constants/action-types';

import { Map } from 'immutable';

const initialState = new Map()
initialState.set('text', null)

export default function error(state = initialState, action) {
  switch (action.type) {
    case SET_ERROR:
      {
        return state.set('text', action.payload)
      }
    default:
      {
        return state;
      }
  }
}
