import './audio-track.scss';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Q from 'bluebird';
import _ from 'lodash';
import { connect } from 'react-redux';
import { audioSettingsChanged } from '../../actions/audio';
import { audioLoaded } from '../../actions/audio';

import loop from 'raf-loop'
import raf from 'raf';
import Workers from '../../utils/workers';
import Emitter from '../../utils/emitter';
import Socket from '../../utils/socket';
import DeuxTubeAudio from './audio'
import MediaControls from '../media-controls/media-controls'

import {
 AUDIO_CHUNKS_TO_LOAD,
} from '../../constants/config';

const VERBOSE = false

const ARRAY_SLICE = 'onmessage=function(e){var data=e.data;var start=data.start;var end=data.end;var f=new Uint8Array(data.b);postMessage(f.slice(start,end))};'

class AudioTrack extends Component {

 static contextTypes = {
  videoId: React.PropTypes.string
 }

 constructor(props) {
  super(props)
  const { addAudio } = this.props
  this.sliderData = [{
   key: 'seek',
   title: 'Seek',
   value: 0,
   slider: {
    min: 0,
    max: 1,
    step: 0.01,
    onChange: (val) => {
     this._updateSeekState({
      paused: true,
      sliderValue: val
     })
     this._seekSound(val)
    },
    onAfterChange: (val) => {
     this._updateSeekState({
      paused: false,
     })
    }
   },
  }, {
   key: 'range',
   title: 'Range',
   type: 'range',
   value: [0, 1],
   slider: {
    min: 0,
    max: 1,
    step: 0.01,
    defaultValue: [0, 1],
    onChange: (val) => {
     this._updateRangeState({ sliderValue: val })
     let _dur = val[1] - val[0]
     this.setState({
      duration: this.audio.sound.duration * _dur
     })
    }
   },
  }]
  this.state = {
   totalDuration: 0,
   duration: 0,
   recording: false,
   seek: {
    paused: false,
    sliderValue: this.sliderData[0].value
   },
   range: {
    sliderValue: this.sliderData[1].value
   }
  }
 }

 _updateSeekState(obj) {
  if (this.state.recording || obj.paused) {
   let _v = Object.assign({}, this.state.seek, obj)
   this.setState({
    seek: _v
   })
  }
 }

 _updateRangeState(obj) {
  let _v = Object.assign({}, this.state.range, obj)
  this.setState({
   range: _v
  })
 }

 _seekSound(p) {
  this.audio.sound.seek(p)
 }

 componentDidMount() {
  const socket = Socket.socket
  const { videoId } = this.context;
  const { addAudio, audioLoaded } = this.props;
  let _self = this
  this.audio = new DeuxTubeAudio(socket)
   //dont use emitter
  this.audio.audio.on('ON_BUFFER_CHUNK', (chunk, progress) => {
   //addAudio(chunk)
   //global.EAPI.sendEvent('record-audio', chunk)
   if (process.env.IS_APP) {
    global.recorder.addAudio(chunk)
   } else {
    addAudio(chunk)
   }
  }, false)

  this.audio.load(videoId, AUDIO_CHUNKS_TO_LOAD)
   .then((sound) => {
    this.setState({
     totalDuration: sound.duration.toFixed(1),
     duration: sound.duration
    })
    this._startUpdate()
    audioLoaded({ duration: sound.duration })
   })

  this.audio.onPeakSignal.add(peak => {
   //_self._effects.changeKey()
   /*let _r = Math.random() * 6
   if (_c % 2 === 0) {
     _r += 5
     _self._videos[0].vjPlayer.controllers[0].stepForward(_r)
     _self._videos[1].vjPlayer.controllers[0].stepBack(_r - 3)
   } else {
     _r += 2
     _self._videos[1].vjPlayer.controllers[0].stepForward(_r + 3)
     _self._videos[0].vjPlayer.controllers[0].stepBack(_r)
   }
   _c++*/
  })

  this.audio.onDropSignal.add(drop => {
   //_self._effects.changeKey()
  })

 }

 componentWillUnmount() {}

 componentWillReceiveProps(nextProps) {
  const { app } = nextProps;
  const { sound } = this.audio
  const _recording = app.get('recording')
  if (sound) {
   if (_recording) {
    if (!sound.playing) {
     sound.play()
    }
   } else {
    if (sound.playing) {
     sound.pause()
    }
   }
   if (app.get('saving') && !this.state.saving) {
    this.setState({
     saving: true
    })
    this._destroySound()
   }
  }
  if (this.state.recording !== _recording) {
   this.setState({
    recording: _recording
   })
  }
 }

 /*shouldComponentUpdate(state){
   return false
 }*/

 componentWillUpdate(props, state) {
  const { audioSettingsChanged } = this.props;
  audioSettingsChanged(state)
 }

 _destroySound() {
  this.audio.sound.stop()
  this._rafHandle.stop()
  this.audio.sound.destroy()
 }

 _startUpdate() {
  let _self = this
  this._rafHandle = loop(function(dt) {
   _self.onSoundProgress()
  }).start()
 }

 onSoundProgress() {
  let p = this.audio.sound.progress
  if (!this.state.seek.paused) {
   this._updateSeekState({ sliderValue: p })
  }
  if (p > this.state.range.sliderValue[1]) {
   this._seekSound(this.state.range.sliderValue[0])
  }
 }

 render() {
  const { browser } = this.props;
  const { videoId } = this.context;
  const thumbImage = `https://img.youtube.com/vi/${videoId}/3.jpg`
  let _sliders = this.sliderData.map(slider => {
   return <MediaControls ref = { slider.key }
      key = { slider.key }
      {...slider }
      {...this.state[slider.key] }
      />
  })
  return (
   <div ref="audioTrack" className="audio-track">
        <img className="result__image" src={thumbImage}></img>
        <div className="audio-track__info">
          <div>{this.state.duration}</div>
        </div>
        {[..._sliders]}
      </div>
  );
 }

 //**************
 //API

 /*
 THERE IS NO API :(

 */
 //**************


 /*
 Too bad we cant trim a dash audio with bytes
 pass start and end instead
 */

 getRecordStartEndTimes() {
  let _dur = this.audio.sound.duration
  let _s = this.state.range.sliderValue[0]
  let _e = this.state.range.sliderValue[1]
  let _diff = _e - _s
  return [_dur * _s, _diff * _dur]
 }

 getSaveBuffer() {
  return new Q((yes, no) => {
   let _self = this
   let _dur = this.audio.sound.duration
   let sampleRate = this.audio.sound.sourceNode.buffer.sampleRate
   let _s = this.state.range.sliderValue[0]
   let _e = this.state.range.sliderValue[1]

   let _sbyte = Math.floor(_s * _dur * sampleRate)
   let _ebyte = Math.floor(_e * _dur * sampleRate)
   let rawBuffer = this.audio.audio.rawBuffer.slice(0)

   this._sliceWorker.onmessage = function(e) {
    if (e.data.buffer.byteLength === 0) {
     no(new Error('Too small of range'))
    } else {
     let indexBuffer = _self.audio.audio.indexBuffer
     let _trimmedBuffer = new Uint8Array(indexBuffer.byteLength + e.data.buffer.byteLength);
     _trimmedBuffer.set(indexBuffer, 0);
     _trimmedBuffer.set(new Uint8Array(e.data.buffer), indexBuffer.byteLength);
     yes(_trimmedBuffer.buffer)
    }
   };

   this._sliceWorker.postMessage({
    start: _sbyte,
    end: _ebyte,
    b: rawBuffer.buffer
   }, [rawBuffer.buffer]);

   /*
     //we could get the decoded buffer
     return this.audio.getBufferSliceFromPercent(_s, _e)
   */
  })
 }
}

export default connect(({ browser, app }) => ({
 browser,
 app,
}), {
 audioSettingsChanged,
 audioLoaded,
})(AudioTrack);
