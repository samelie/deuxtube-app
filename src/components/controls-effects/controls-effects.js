import './controls-effects.scss';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import { SketchPicker } from 'react-color';

import { connect } from 'react-redux';
import {
  effectChanged,
  effectSelected
} from '../../actions/effects';
import {
  keyUp,
} from '../../actions/keyboard';

import Keys from '../../utils/keys';
import Socket from '../../utils/socket';
import Emitter from '../../utils/emitter'
import Rcslider from 'rc-slider';
import ControlsSlider from './controls-slider'
import ControlsSliderState from './controls-slider-state'
import ControlsEffectsBlend from './controls-effects-blend'
import ControlsPresets from '../controls-presets/controls-presets'

const VERBOSE = false

//reducers/effects.js
const EFFECT_GROUPS = {
  BLEND_EFFECTS: 'blend',
  MIX_EFFECTS: 'mix',
  TRACK_EFFECTS: 'trackEffects'
}

class ControlsEffects extends Component {

  static contextTypes = {
    videoId: React.PropTypes.string
  }

  constructor(props) {
    super(props)
    this._dispatchEffectChangedBound = this._dispatchEffectChanged.bind(this)
    this._groups = []
    this.state = {
      activeEffectGroupIndex: NaN,
      activeEffectIndex: NaN,
      tabIndex: 0,
      effectIndex: 0,

      activeEffectGroupIndex: NaN,
      groupEffectIndex: NaN,
    }
  }

  /*
    map over all effects
  */

  _createEffectController() {
    const { effects } = this.props;
    this._effectsControl = [
        ..._.values(
          effects.get(EFFECT_GROUPS.TRACK_EFFECTS)
        )
        .map(effect => {
          return {
            key: effect.key,
            value: effect.value
          }
        }),
        ..._.values(
          effects.get(EFFECT_GROUPS.MIX_EFFECTS)
        )
        .map(effect => {
          return {
            key: effect.key,
            value: effect.value
          }
        })
      ]
      //this.setState({'effects':_effects})
  }

  componentDidMount() {
    const socket = Socket.socket
    const { videoId } = this.context;
    const { effects } = this.props;

    /*let _groups = []
    this.refs.controlsEffects
      .querySelectorAll('.controls-effects__group')
      .forEach(el => _groups.push(el))

    _groups = _groups
      .map(el => {
        let effects = el.querySelectorAll('.effects-slider')
        return {
          el: el,
          effects: effects
        }
      })
    console.log(_groups);*/
    //console.log(this.state.effects);
    //this._groups = [...]*/

    this._groupTitleEls = this.refs.controlsEffects
      .querySelectorAll('.controls-effects__title');
    this._groupSliderEls = this.refs.controlsEffects
      .querySelectorAll('.controls-effects__sliders');
    const pickerEl = this.refs.controlsEffects.querySelector('.sketch-picker');
    pickerEl.removeChild(pickerEl.children[2])
    pickerEl.removeChild(pickerEl.children[2])
  }

  componentWillReceiveProps(nextProps) {
    const { keyboard, mouse } = nextProps
    //this._processKeyboard(keyboard)
    //this._processMouse(mouse)
  }

  shouldComponentUpdate(props, state) {
    return false
  }

  _processMouse(mouse) {
    let { groupEffectIndex, effectIndex } = this.state
    if (!isNaN(groupEffectIndex) && !isNaN(effectIndex)) {
      let { groupEffects, groupId } = this._groups[groupEffectIndex]
      let _effectKey = groupEffects[effectIndex]
      let _sliderValue = _.find(this._effectsControl, {
        key: _effectKey
      })
      let position = mouse.get('position')

      console.log({
        group: groupId,
        key: _effectKey,
        val: position.yp
      });
      /*this._dispatchEffectChanged({
        group:groupId,
        key:_effectKey,
        val:position.yp
      })*/
    }
  }

  _processKeyboard(keyboard) {
    const { effects, effectSelected } = this.props
    let tabIndex = keyboard.get('tabIndex')

    let spaceKeyDown = keyboard.get(Keys.SPACE.toString())
    if (spaceKeyDown) {
      this._setGroupSelection(keyboard, this.state.tabIndex)
        //has selected
    }

    if (this.state.tabIndex === tabIndex) {
      return
    }

    /*Group mode*/
    let _effectTabIndexWrapped
    if (isNaN(this.state.activeEffectGroupIndex)) {
      _effectTabIndexWrapped = tabIndex % this._groupTitleEls.length
      this._groupTitleEls.forEach((el, index) => {
        if (index === _effectTabIndexWrapped) {
          el.classList.add('is-selected')
        } else {
          el.classList.remove('is-selected')
        }
      })

      this.setState({
        groupEffectIndex: _effectTabIndexWrapped
      })
    } else if (!isNaN(this.state.groupEffectIndex)) {
      /*group effects, set new effect with tabs*/
      let { groupEffects, groupId } = this._groups[this.state.groupEffectIndex]
      _effectTabIndexWrapped = tabIndex % groupEffects.length
      this._updateEffectSelection(
        groupEffects,
        _effectTabIndexWrapped,
        groupId
      )
      this.setState({
        effectIndex: _effectTabIndexWrapped,
        activeEffectName: groupEffects[_effectTabIndexWrapped].key
      })
    }

    /*let _upDown = keyboard.get(Keys.UP.toString())
    let _downDown = keyboard.get(Keys.DOWN.toString())
    */


    this.setState({ tabIndex: tabIndex })
  }

  onColorChange(c) {
    const { effectChanged } = this.props;
    effectChanged({
      key: "uKeyColor",
      group: "mix",
      val: [
        c.rgb.r / 255,
        c.rgb.g / 255,
        c.rgb.b / 255,
      ]
    })
  }

  /*
  SPACE
    Select / un slected the main group
  */
  _setGroupSelection(keyboard, tabIndex) {
    const { keyUp } = this.props
    let spaceKey = keyboard.get('selectionMap')[Keys.SPACE]
    if (spaceKey) {
      let _notSet = isNaN(this.state.activeEffectGroupIndex)
      if (_notSet) {
        this.setState({
          activeEffectGroupIndex: tabIndex
        })
      } else {
        this.setState({
          activeEffectGroupIndex: NaN
        })
      }
      //need to reset else stackoverflow, is selectect
      if (!isNaN(this.state.groupEffectIndex)) {
        keyUp(Keys.SPACE)
        let { groupEffects, groupId } = this._groups[this.state.groupEffectIndex]
        this._updateEffectSelection(
          groupEffects,
          (_notSet ? (this.state.effectIndex || 0) : NaN),
          groupId
        )
      }
    }
  }

  /*
  highlighting
  */
  _setSliderClasses(active, index) {
    this._groupSliderEls.forEach((el, i) => {
      el.classList.remove('is-selected')
    })
    if (active) {
      this._groupSliderEls[index].classList.add('is-selected')
    }
  }

  /*
  The effect has been selected or unselected
  */
  _updateEffectSelection(groupEffects, selectedIndex, groupId) {
    const { effectSelected } = this.props
    groupEffects.forEach((effectKey, index) => {
      effectSelected({
        group: groupId,
        key: effectKey,
        val: (index === selectedIndex)
      })
    })
  }

  _dispatchEffectChanged(props, val) {
    const { effectChanged } = this.props;
    const { group, key } = props
    effectChanged({
      key,
      group,
      val
    })
  }

  _sliderProps(props) {
    return Object.assign({},
      props, {
        onChange: this._dispatchEffectChangedBound
      });
  }


  _renderControlGroup(groupId) {
    const { browser, info, effects } = this.props;
    let _effectKeys = []
    this._groups.push({
      groupId: groupId,
      groupEffects: _effectKeys
    })
    let _els = _.values(effects.get(groupId))
      .map(effect => {
        if (effect.slider) {
          let props = Object.assign({},
            this._sliderProps(effect), {
              group: groupId
            }
          )
          _effectKeys.push(effect.key)

          /*
          onMouseOver={(e)=>{
               console.log(e);
             }}
          */
          return (
            <div className="slider"

       >
         <ControlsSliderState
         ref = { effect.key }
         key = { effect.key }
         vertical = { effect.vertical }

         sliderValue = { _.find(this._effectsControl, { key: effect.key }) }
         props = {
          props
         }
         />
       </div>
          )
        }
        return false
      })
    return _.compact(_els)
  }

  render() {
    const { browser, info, effects } = this.props;
    this._createEffectController()
    return (
      <div ref="controlsEffects" className="controls-effects">
        <ControlsPresets/>
        <div className="controls-effects__group">
          <div className="controls-effects__title u-underline">Key</div>
            <div className="controls-effects__sliders u-flex-justify--space">
             {this._renderControlGroup(EFFECT_GROUPS.MIX_EFFECTS)}
             <SketchPicker
             className="sketch-colour"
             color="#000"
             onChange={this.onColorChange.bind(this)}
             ref="picker"/>
          </div>
        </div>

        <div className="controls-effects__group">
          <div className="controls-effects__title u-underline">Blend</div>
            <div className="controls-effects__sliders u-flex-justify--space">
             {this._renderControlGroup(EFFECT_GROUPS.BLEND_EFFECTS)}
          </div>
          <ControlsEffectsBlend
           modes={effects.get(EFFECT_GROUPS.BLEND_EFFECTS).modes}
          />
        </div>

        <div className="controls-effects__group">
            <div className="controls-effects__title u-underline">Color</div>
            <div className="controls-effects__sliders u-flex-justify--space">
             {this._renderControlGroup(EFFECT_GROUPS.TRACK_EFFECTS)}
            </div>
       </div>
      </div>
    );
  }
}

export default connect(({ browser, app, keyboard, mouse, effects }) => ({
  browser,
  app,
  keyboard,
  mouse,
  effects,
}), {
  effectChanged,
  effectSelected,
  keyUp,
})(ControlsEffects);
