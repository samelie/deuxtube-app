import './playbar.scss';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import { connect } from 'react-redux';
import Rcslider from 'rc-slider';

import { playbarSeek, playbarSetCurrentTime } from '../../actions/playbar';

import Keys from '../../utils/keys';
import Utils from '../../utils/utils';
import {
 PLAYBAR_SEEK_DISTANCE,
 PLAYBAR_SEEK_DISTANCE_LOOP,
} from '../../constants/config';

import loop from 'raf-loop'

import {
 PLAYBAR_UPDATE,
 PLAYBAR_SEEK,
 PLAYBAR_SET_CURRENT_TIME,
} from '../../constants/action-types';

class Playbar extends Component {

 constructor(props) {
  super(props)

  this.state = {
   updating: false,
   dragging: false,
   value: 0,
   seekIncrement: PLAYBAR_SEEK_DISTANCE
  }
 }

 componentDidMount() {}

 componentWillReceiveProps(nextProps) {
  const { playbar, keyboard } = nextProps;

  const _progress = playbar.get('progress')

  if (this.state.value !== _progress && !this.state.dragging) {
   this.setState({
    value: _progress,
   })
  }

  //if updating, and key goes up...
  if (this.state.updating) {
   let _rightDown = keyboard.get(Keys.RIGHT.toString())
   let _leftDown = keyboard.get(Keys.LEFT.toString())
   if (_leftDown || _rightDown) {
    this.setState({ updating: false })
   }
  }

  this._startIncreSeekTime(keyboard)

  //avoid circ recursion
  if (!this.state.updating) {
   this._processKeyboard(keyboard, playbar)
  }
 }

 _stopIncreSeek() {
  if (this._increLoop) {
   this._increLoop.stop()
  }
 }

 _startIncreSeekTime(keyboard) {
  let _shiftDown = keyboard.get(Keys.SHIFT.toString())
  let _i = PLAYBAR_SEEK_DISTANCE
  if (_shiftDown) {
   this._stopIncreSeek()
   this._increLoop = loop((dt) => {
    this.setState({
     seekIncrement: _i
    })
    _i += PLAYBAR_SEEK_DISTANCE_LOOP
   }).start()
  } else {
   this._stopIncreSeek()
   this.setState({
    seekIncrement: PLAYBAR_SEEK_DISTANCE
   })
  }
 }

 _canProcess() {
  const { videoState } = this.props;
  let _videoTracks = videoState.get('videoTracks')
   //are any selected?
  return !!_.compact(_videoTracks.filter(track => {
   return track.selected
  })).length
 }

 _processKeyboard(keyboard, playbar) {
  const { playbarSeek, videoState } = this.props;

  if (!this._canProcess()) {
   return
  }

  let _changed = false
  let _newValue = 0
  let _rightDown = keyboard.get(Keys.RIGHT.toString())
  let _leftDown = keyboard.get(Keys.LEFT.toString())
  if (_leftDown) {
   _newValue = this.state.value - this.state.seekIncrement
   _changed = true
  } else if (_rightDown) {
   _newValue = this.state.value + this.state.seekIncrement
   _changed = true
  }
  if (_changed) {
    //bugs at 1
   let val = Utils.clamp(_newValue, 0, .98)
   this._updateValue({ value: val, updating: true })
   playbarSeek(val)
  }
 }

 _updateValue(obj) {
  this.setState(obj)
 }

 render() {
  const { playbar, playbarSeek } = this.props;
  if (!this.state.ready) {
   return (
    <div ref="playbar" className="playbar">
            <Rcslider className=""
            min={0}
            max={1}
            step={0.001}
            value={this.state.value}
            onChange={(val)=>{
              this._updateValue({
               value:val,
               dragging:true
             })
              playbarSeek(val)
            }}

            onAfterChange={(val)=>{
              this._updateValue({
                value:val,
                dragging:false
              })
            }}
           />
        </div>
   );
  }
 }
}

export default connect(({
 playbar,
 keyboard,
 videoState,
}) => ({
 keyboard,
 playbar,
 videoState,
}), {
 playbarSeek,
 playbarSetCurrentTime,
})(Playbar);
