import './controls-presets.scss';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Dropdown from 'react-dropdown';
import _ from 'lodash';
import {options, presets} from './presets';
import { connect } from 'react-redux';

import Keys from '../../utils/keys';
import Socket from '../../utils/socket';
import Emitter from '../../utils/emitter'

import {
  effectChanged,
} from '../../actions/effects';

import {
  keyUp,
  keyDown,
} from '../../actions/keyboard';

import BasicButton from '../ui/basic-button';

import Config from '../../utils/config'

const VERBOSE = false
const KEY_CODES = [49,50]
class ControlsPresets extends Component {

  static contextTypes = {
    videoId: React.PropTypes.string
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {}

  componentWillReceiveProps() {
    return false
  }

  _onSelect(choice) {
    const preset = presets[parseInt(choice.value,10)]
    const { effectChanged,keyUp, keyDown } = this.props
    preset.selection.forEach((val, index)=>{
      if(!val){
        keyUp(KEY_CODES[index])
      }else{
        keyDown(KEY_CODES[index])
      }
    })
    _.forIn(preset, (val, key) => {
      if(val.group){
        effectChanged({
          group: val.group,
          key,
          val: val.value
        })
      }
    })
  }

  render() {
    return (
      <Dropdown
        className="controls-presets"
        options={options}
        onChange={this._onSelect.bind(this)}
        placeholder="Presets"
      />
    );
  }
}

export default connect(({ browser, audio, app, keyboard, effects, videoRecord }) => ({
  browser,
  videoRecord,
  audio,
  keyboard,
  effects,
  app,
}), {
  effectChanged,
  keyUp,
  keyDown,
})(ControlsPresets);
