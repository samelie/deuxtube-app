import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import { connect } from 'react-redux';

import Socket from '../../utils/socket';
import Emitter from '../../utils/emitter'
const VERBOSE = false


class ControlsRecord extends Component {

  static contextTypes = {
    videoId: React.PropTypes.string
  }

  constructor(props) {
    super(props)
    this.state = {
      recording:false
    }
  }

  componentDidMount() {
    const socket = Socket.socket
    const { videoId } = this.context;
  }

  _onRecord(v){
    Emitter.emit('controls:record:record', v)
  }

  _onEnd() {
    Emitter.emit('controls:record:save')
  }

  render() {
    const { browser } = this.props;
    const { videoId } = this.context;
    return (
      <div ref="controlsRecord" className="controls-record">
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

export default connect(({ browser }) => ({
  browser,
}), {})(ControlsRecord);
