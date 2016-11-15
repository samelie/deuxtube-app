import {
  VIDEO_STATE_SET_SELECT,
} from '../constants/action-types';

import { Map } from 'immutable';

const initialState = new Map()
  .set('videoTracks', [])
  .set('selectionIndexs', [])

export default function videoState(state = initialState, action) {
  switch (action.type) {
    case VIDEO_STATE_SET_SELECT:
      {
        let {
          index,
          isSelected
        } = action.payload

        let _tracks = state.get('videoTracks').slice(0)
        _tracks[index] = Object.assign({},
          _tracks[index], { selected: isSelected })

        let _totalSelected = _tracks.filter(track=>{
          return track.selected
        }).length

        return state.set('videoTracks', _tracks)
        .set('selectionIndexs', [...Array(_totalSelected).keys()])
      }
    default:
      {
        return state;
      }
  }
}
