import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import { connect } from 'react-redux';

import Socket from '../../utils/socket';
import Emitter from '../../utils/emitter'
const VERBOSE = false


class ControlsEffects extends Component {

  static contextTypes = {
    videoId: React.PropTypes.string
  }

  constructor(props) {
    super(props)
    this.state = {
      recording: false,
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

  componentDidUpdate(){
    const { app,info } = this.props;
    this._secondsRecorded = info.counter / 30
    this._hasSurpassedDuration = ((this._secondsRecorded / app.media.audio.totalDuration) > 1)
  }

  render() {
    const { browser, info } = this.props;
    const { videoId } = this.context;
    return (
      <div ref="controlsRecord" className="controls-record">
        <div className="controls-record__info">
          <span>{info.counter}</span>
        </div>
        <button  onClick={()=>{
          let _r = !this.state.recording
          this.setState({recording:_r})
          this._onRecord(_r)
        }}>RECORD</button>
        <button onClick={()=>{
          this._onEnd()
        }}>SAVE</button>
      </div>
    );
  }
}

export default connect(({ browser, app }) => ({
  browser,
  app,
}), {})(ControlsEffects);
