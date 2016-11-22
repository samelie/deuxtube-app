import {
 EFFECTS_SET,
 EFFECT_CHANGED,
 EFFECT_SELECTED,
 EFFECTS_UPDATE_SELECTED,

 KEYBOARD_DOWN,
} from '../constants/action-types';

import Keys from '../utils/keys';
import {
 CONTROLS_BAR_INCRE,
} from '../constants/config';

import { Record, Map } from 'immutable';


const initialState = new Map()
 .set('videoTrackIds', null)
 .set('updatedEffect', {})
 .set('selectedEffect', null)
 .set('totalBlendModes', 24)
 .set('mix', {
  'uMixRatio': {
   key: 'uMixRatio',
   title: 'uMixRatio',
   selected: false,
   isUniform: true,
   vertical: true,
   type: 'float',
   value: 0,
   slider: {
    defaultValue: 0,
    min: 0,
    max: 1,
    step: 0.0001,
   },
  },
  'uThreshold': {
   key: 'uThreshold',
   title: 'uThreshold',
   selected: false,
   isUniform: true,
   vertical: true,
   type: 'float',
   value: 0,
   slider: {
    defaultValue: 0.8,
    min: 0,
    max: 1,
    step: 0.0001,
   },
  },
  'uKeyVideoIndex': {
   key: 'uKeyVideoIndex',
   title: 'uKeyVideoIndex',
   selected: false,
   isUniform: true,
   vertical: true,
   type: 'int',
   value: 0,
   slider: {
    defaultValue: 0,
    min: 0,
    max: 1,
    step: 1,
   },
  }
 })
 .set('blend', {
  'uBlendOpacity': {
   key: 'uBlendOpacity',
   title: 'uBlendOpacity',
   selected: false,
   isUniform: true,
   vertical: true,
   type: 'float',
   value: 1.,
   slider: {
    defaultValue: 1.,
    min: 0,
    max: 1,
    step: 0.0001,
   },
  },
  'uBlendMix': {
   key: 'uBlendMix',
   title: 'uBlendMix',
   selected: false,
   isUniform: true,
   vertical: true,
   type: 'float',
   value: 1.,
   slider: {
    defaultValue: 1.,
    min: 0,
    max: 1,
    step: 0.0001,
   },
  },
  'uBlendMode': {
   key: 'uBlendMode',
   title: 'uBlendMode',
   selected: false,
   isUniform: true,
   vertical: true,
   type: 'int',
   value: 0,
   slider: {
    defaultValue: 0,
    min: 0,
    max: 24,
    step: 1,
   },
  },
  modes: {
   ADD: {
    mode: 1,
    uBlendOpacity: 1.,
    uBlendMix: 1
   },
   AVERAGE: {
    mode: 2,
    uBlendOpacity: 1.,
    uBlendMix: 1
   },
   COLOR_BURN: {
    mode: 3,
    uBlendOpacity: 1.,
    uBlendMix: 1
   },
   COLOR_DODGE: {
    mode: 4,
    uBlendOpacity: 1.,
    uBlendMix: 1
   },
   DARKEN: {
    mode: 5,
    uBlendOpacity: 1.,
    uBlendMix: 1
   },
   DIFFERENCE: {
    mode: 6,
    uBlendOpacity: 1.,
    uBlendMix: 1
   },
   EXCLUSION: {
    mode: 7,
    uBlendOpacity: 1.,
    uBlendMix: 1
   },
   GLOW: {
    mode: 8,
    uBlendOpacity: 1.,
    uBlendMix: 1
   },
   HARD_LIGHT: {
    mode: 9,
    uBlendOpacity: 1.,
    uBlendMix: 1
   },
   HARD_MIX: {
    mode: 10,
    uBlendOpacity: 1.,
    uBlendMix: 1
   },
   LIGHTEN: {
    mode: 11,
    uBlendOpacity: 1.,
    uBlendMix: 1
   },
   LINEAR_BURN: {
    mode: 12,
    uBlendOpacity: 1.,
    uBlendMix: 1
   },
   LINEAR_DODGE: {
    mode: 13,
    uBlendOpacity: 1.,
    uBlendMix: 1
   },
   LINEAR_LIGHT: {
    mode: 14,
    uBlendOpacity: 1.,
    uBlendMix: 1
   },
   MULTIPLY: {
    mode: 15,
    uBlendOpacity: 1.,
    uBlendMix: 1
   },
   NEGATION: {
    mode: 16,
    uBlendOpacity: 1.,
    uBlendMix: 1
   },
   NORMAL: {
    mode: 17,
    uBlendOpacity: 1.,
    uBlendMix: 1
   },
   OVERLAY: {
    mode: 18,
    uBlendOpacity: 1.,
    uBlendMix: 1
   },
   PHOENIX: {
    mode: 19,
    uBlendOpacity: 1.,
    uBlendMix: 1
   },
   PIN_LIGHT: {
    mode: 20,
    uBlendOpacity: 1.,
    uBlendMix: 1
   },
   REFLECT: {
    mode: 21,
    uBlendOpacity: 1.,
    uBlendMix: 1
   },
   SCREEN: {
    mode: 22,
    uBlendOpacity: 1.,
    uBlendMix: 1
   },
   SOFT_LIGHT: {
    mode: 23,
    uBlendOpacity: 1.,
    uBlendMix: 1
   },
   SUBTRACT: {
    mode: 24,
    uBlendOpacity: 1.,
    uBlendMix: 1
   },
   VIVID_LIGHT: {
    mode: 2,
    uBlendOpacity: 1.,
    uBlendMix: 1
   },
  }
 })
 .set('trackEffects', {
  'uColorEffectsOne': {
   key: 'uColorEffectsOne',
   title: 'uColorEffectsOne',
   selected: false,
   isUniform: true,
   vertical: true,
   type: 'float',
   value: 1,
   slider: {
    defaultValue: 1,
    min: 0,
    max: 1,
    step: 0.0001,
   },
  },
  'uColorEffectsTwo': {
   key: 'uColorEffectsTwo',
   title: 'uColorEffectsTwo',
   selected: false,
   isUniform: true,
   vertical: true,
   type: 'float',
   value: 1,
   slider: {
    defaultValue: 1,
    min: 0,
    max: 1,
    step: 0.0001,
   },
  },
  'uSaturation': {
   key: 'uSaturation',
   title: 'uSaturation',
   selected: false,
   isUniform: true,
   vertical: true,
   type: 'float',
   value: 0,
   slider: {
    defaultValue: 0,
    min: 0,
    max: 4,
    step: 0.0001,
   },
  },
  'uBrightness': {
   key: 'uBrightness',
   title: 'uBrightness',
   selected: false,
   isUniform: true,
   vertical: true,
   type: 'float',
   value: 0,
   slider: {
    defaultValue: 0,
    min: 0,
    max: 1,
    step: 0.0001,
   },
  },
  'uContrast': {
   key: 'uContrast',
   title: 'uContrast',
   selected: false,
   isUniform: true,
   vertical: true,
   type: 'float',
   value: 0,
   slider: {
    defaultValue: 0,
    min: 0,
    max: 1,
    step: 0.0001,
   },
  },
  'uHue': {
   key: 'uHue',
   title: 'uHue',
   selected: false,
   isUniform: true,
   vertical: true,
   type: 'float',
   value: 0,
   slider: {
    defaultValue: 0.5,
    min: 0,
    max: 1,
    step: 0.0001,
   },
  }
 })

export default function effects(state = initialState, action) {
 switch (action.type) {
  case EFFECTS_SET:
   {
    //keycode
    return state.set(action.payload.key, action.payload.value)
   }
  case EFFECT_CHANGED:
   {
    const { group, key, val } = action.payload
    let _group = state.get(group)
    _group[key].value = val
    return state.set(group, Object.assign({}, _group))
     .set('updatedEffect', Object.assign({}, _group[key]))
   }
  case EFFECTS_UPDATE_SELECTED:
   {
    let _current = state.get('selectedEffect')
    if (!_current) {
     return state
    }
    _current.value = action.payload
    return state.set('selectedEffect', Object.assign({}, _current))
     .set('updatedEffect', Object.assign({}, _current))
   }
  case EFFECT_SELECTED:
   {
    const { group, key, val } = action.payload
    let _group = state.get(group)
    _group[key].selected = val
    const _newState = state.set(group, Object.assign({}, _group))
    if (_group[key].selected) {
     return state.set(group, Object.assign({}, _group))
      .set('selectedEffect', Object.assign({}, _group[key]))
    }
    return _newState
   }
  case KEYBOARD_DOWN:
   {
    let _current = state.get('selectedEffect')
    if (!_current) {
     return state
    }
    //key
    switch (action.payload) {
     case Keys.UP:
      _current.value += CONTROLS_BAR_INCRE
      _current.value = Math.min(_current.value, 1)
      break;
     case Keys.DOWN:
      _current.value -= CONTROLS_BAR_INCRE
      _current.value = Math.max(_current.value, 0)
      break;
    }
    return state.set('selectedEffect', Object.assign({}, _current))
     .set('updatedEffect', Object.assign({}, _current))
   }
  default:
   {
    return state;
   }
 }
}
