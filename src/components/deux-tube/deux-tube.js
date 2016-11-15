import './deux-tube.scss';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import raf from 'raf';
import { connect } from 'react-redux';
import { update } from '../../actions/video_record';

import Gui from './gui'
import Effects from './effects';
import Utils from '../../utils/utils';
import Socket from '../../utils/socket';
import Emitter from '../../utils/emitter'
import EaseNumbers from '../../utils/easeNumbers'

const VERBOSE = false
import {
  VIDEO_WIDTH,
  VIDEO_HEIGHT,
  RECORDING_FRAME_FMT,
  RECORDING_FRAME_Q
} from '../../constants/config';

const TRACK_EFFECT_SUFFIX = [
  'One',
  'Two',
]

class DeuxTube extends Component {

  constructor(props) {
    super(props)

    this.state = {
      saving: false,
      recording: false,
      ready: false,
      effects: {}
    }

    this._guiProps = {
      effects: {
        callback: (key, val) => {
          console.log(key, val);
          this._effects.changedValue(key, val)
        }
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    let { app, effects, videoState } = nextProps
    this.setState({
      recording: app.get('recording'),
      saving: app.get('saving')
    });
    if (app.get('saving')) {
      this._effects.pause()
    }
    this._updateEffectsUniforms(effects, videoState)
  }

  _updateEffectsUniforms(nextEffects, videoState) {
    const { keyboard } = this.props
    let updatedEffect = nextEffects.get('updatedEffect')
      //ugly
    let _value = updatedEffect.value
    if (updatedEffect.key === 'uBlendMode' &&
      !Number.isInteger(_value)) {
      _value = Math.floor(nextEffects.get('totalBlendModes') * _value)
    }
    //is an effect uniform
    if (updatedEffect.isUniform) {

      //color
      if (this._effects.sharedEffects
        .indexOf(updatedEffect.key) > -1) {
        //loop selecred
        videoState.get('selectionIndexs')
          .map(index => {
            let _suffix = TRACK_EFFECT_SUFFIX[index]
            this._effects.changedValue(
              `${updatedEffect.key}${_suffix}`,
              _value
            )
          })
      } else {
        this._effects.changedValue(
          updatedEffect.key,
          _value
        )
      }
    }
  }



  _setEffectUniforms() {
    let { effects } = this.props
    let _effects = effects.toObject()
    let _e = {}
    _.forIn(_effects, (group) => {
      _.forIn(group, (effect) => {
        if (effect.isUniform) {
          _e[effect.key] = {
            type: effect.type,
            value: effect.value
          }
        }
      })
    })
    return _e
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  componentDidMount() {
    let _self = this
    let {
      app,
      effects,
      addFrame,
      videoEls,
      videoTracks,
      update
    } = this.props
    this.setState({ ready: true })

    this._effects = new Effects(
      this.refs.gl,
      this.refs.output, {
        width: VIDEO_WIDTH,
        height: VIDEO_HEIGHT,
        fullscreen: false
      })

    //send from the videoTrack, should have passed a prop func
    Emitter.on(`videotrack:el`, (el) => {
      this._effects.addSource(el, _c)
      let _c = (this._effects._sources.length === videoTracks.tracks.length)
      if (_c) {
        this._effects.ready(this._setEffectUniforms())
      }
    })

    raf.cancel(this._rafHandle)
    let _rc = 0
    let _frameCount = 0
    this._rafHandle = raf(function tick() {
      //30fps
      if (_rc % 2 === 0 && _self.state.recording) {
        //buffer
        //addFrame(_self._effects.imageDataArrayBuffer.buffer)
        //base64
        if (process.env.IS_APP) {
          global.recorder.addFrame(
            _self._effects.getDataURL(RECORDING_FRAME_FMT, RECORDING_FRAME_Q)
          )
        } else {
          addFrame(_self._effects.getDataURL(RECORDING_FRAME_FMT, RECORDING_FRAME_Q))
        }
        _frameCount++;
        update(_frameCount)
          //global.EAPI.sendEvent('record-frame', _self._effects.getDataURL('image/png'))
          //global.recorder.addFrame(_self._effects.getDataURL('image/png'))
      }
      _rc++
      raf(tick)
    })
  }


  render() {
    const { browser } = this.props;
    if (!this.state.ready) {
      return (
        <div ref="deuxTube" className="deux-tube">
          <canvas ref="output" className="output-canvas"></canvas>
          <canvas ref="gl" className="gl-canvas"></canvas>
        </div>
      );
    }
    /*return (
      <div ref="deuxTube" className="deux-tube">
        <canvas ref="output" className="output-canvas"></canvas>
        <canvas ref="gl" className="gl-canvas"></canvas>
        <Gui effects={this._guiProps.effects}/>
      </div>
    );*/
  }
}

export default connect(({
  app,
  effects,
  browser,
  videoRecord,
  videoTracks,
  videoState,
  keyboard,
}) => ({
  app,
  effects,
  videoRecord,
  browser,
  videoTracks,
  videoState,
  keyboard,
}), {
  update
})(DeuxTube);
