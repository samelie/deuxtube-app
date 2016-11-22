import './playback-controls.scss';

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

class PlayBack extends Component {

 constructor(props) {
  super(props)

  this.state = {
  }
 }

 componentDidMount() {}

 componentWillReceiveProps(nextProps) {
 }

 _processKeyboard(keyboard, playbar) {
 }

 render() {
  const { playbar, playbarSeek } = this.props;
  if (!this.state.ready) {
   return (
    <div className="playback-controls">
    <div className="playback-controls__text"></div>
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
})(PlayBack);
