import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import { connect } from 'react-redux';

import Socket from '../../utils/socket';
import Emitter from '../../utils/emitter'
const VERBOSE = false


class ControlsRecord extends Component {

  static contextTypes = {
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const socket = Socket.socket
  }

  componentDidUpdate(){
    const { app,info } = this.props;
  }

  render() {
    const { browser, info } = this.props;
    return (
      <div ref="controlsEffects" className="controls-effects">
      </div>
    );
  }
}

export default connect(({ browser, app }) => ({
  browser,
  app,
}), {})(ControlsRecord);
