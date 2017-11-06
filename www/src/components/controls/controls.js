//import './query.scss';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import { connect } from 'react-redux';

import Emitter from '../../utils/emitter'

class Controls extends Component {

  static propTypes = {
    browser: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
  }

  render() {
    const { browser } = this.props;
    return (
      <div ref="controls" className="controls">
        <p>Choose the video to affect with the searches below:</p>
        <button onClick={()=>{
          Emitter.emit('controls:video:active', 0)
        }}ref="videoOne">Select video 1</button>
        <button onClick={()=>{
          Emitter.emit('controls:video:active', 1)
        }} ref="videoTwo">Select video 1</button>
      </div>
    );
  }
}

export default connect(({ browser }) => ({
  browser,
}), {})(Controls);