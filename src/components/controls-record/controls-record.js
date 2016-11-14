import './controls-record.scss';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import { connect } from 'react-redux';

import Keys from '../../utils/keys';
import Socket from '../../utils/socket';
import Emitter from '../../utils/emitter'
import { record, save } from '../../actions/app';
import Config from '../../utils/config'
const VERBOSE = false

class controlsRecord extends Component {

  static contextTypes = {
    videoId: React.PropTypes.string
  }

  constructor(props) {
    super(props)
    this.state = {
      timeRecorded: 0,
      audioDuration: 0,
      recording: false,

      activeEffectName: ""
    }
  }

  componentDidMount() {
    const socket = Socket.socket
    const { videoId } = this.context;
  }

  _onRecord(v) {
    Emitter.emit('controls:record:record', v)
  }

  _onEnd() {
    Emitter.emit('controls:record:save')
  }

  componentWillReceiveProps(nextProps) {
    const { videoRecord, audio, keyboard, effects } = nextProps
    let updatedEffect = effects.get('updatedEffect')
    this.setState({
      timeRecorded: (videoRecord.frameCount / Config.FPS).toFixed(1),
      audioDuration: audio.get('duration').toFixed(1),
      activeEffectName: updatedEffect.title
    })
  }

  /*componentDidUpdate() {
    const { app, info } = this.props;
    //this._secondsRecorded = info.counter / 30
    //this._hasSurpassedDuration = ((this._secondsRecorded / app.media.audio.totalDuration) > 1)
  }*/

  render() {
    const { browser, info, record, save, videoRecord } = this.props;
    const { videoId } = this.context;
    return (
      <div ref="controlsRecord" className="controls-record">
        <div className="controls-record__info">
        </div>
        <button  onClick={()=>{
          let _r = !this.state.recording
          record(_r)
          this.setState({recording:_r})
          //this._onRecord(_r)
        }}>RECORD</button>
        <div className="controls-record__time">
          {this.state.timeRecorded} / {this.state.audioDuration}
        </div>
        <button onClick={()=>{
          save(true)
        }}>SAVE</button>
        <div ref ="sl" className="controls-effects__status">{this.state.activeEffectName}</div>
      </div>
    );
  }
}

export default connect(({ browser, audio, app, keyboard, effects,videoRecord }) => ({
  browser,
  videoRecord,
  audio,
  keyboard,
  effects,
  app,
}), { record, save })(controlsRecord);
