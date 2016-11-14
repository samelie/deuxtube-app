import {
  KEYBOARD_DOWN,
  KEYBOARD_UP,
} from '../constants/action-types';

import Keys from '../utils/keys';

import { Map } from 'immutable';

const MAX_TABS = 2

const initialState = new Map()
  .set('selectionMap', {})
  .set('tabIndex', 0)

const incrementTab = (nextIndex => ((nextIndex) >= MAX_TABS ? 0 : nextIndex))

export default function keyboard(state = initialState, action) {
  switch (action.type) {
    case KEYBOARD_DOWN:
      {
        /*
        the idea is you press down
         to activate and again to deactivate
        */
        let keyCode = action.payload
        let keyCodeStr = keyCode.toString()
        let selectionMap = state.get('selectionMap') || {}
        selectionMap = Object.assign({}, selectionMap)
        let _val = !!selectionMap[keyCodeStr]
        selectionMap[keyCodeStr] = !_val
        //keycode
        /*let current = state.get('tabIndex')
        let _nextTab = (keyCode === Keys.Q) ? current + 1 : current
        incrementTab(current + 1)*/

        let tabIndex = (keyCode === Keys.Q) ? state.get('tabIndex') + 1 : state.get('tabIndex')
        return state.set(keyCode.toString(), true)
          .set('selectionMap', selectionMap)
          .set('tabIndex', tabIndex)
      }
    case KEYBOARD_UP:
      {
        let keyCode = action.payload
        return state.set(keyCode.toString(), false)
      }
    default:
      {
        return state;
      }
  }
}
