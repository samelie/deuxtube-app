import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import { connect } from 'react-redux';
import Rcslider from 'rc-slider';

import {
  playlistNextVideo,
  playlistPreviousVideo
} from '../../actions/playlist_controls';

import Keys from '../../utils/keys';
import Utils from '../../utils/utils';
import {
  PLAYBAR_SEEK_DISTANCE,
  PLAYBAR_SEEK_DISTANCE_LOOP,
} from '../../constants/config';

import loop from 'raf-loop'

import BasicButton from '../ui/basic-button';

import {
  PLAYBAR_UPDATE,
  PLAYBAR_SEEK,
  PLAYBAR_SET_CURRENT_TIME,
} from '../../constants/action-types';

class Social extends Component {

  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  render() {
    const {
      playbar,
      playbarSeek,
      playlistNextVideo,
      playlistPreviousVideo
    } = this.props;
    if (!this.state.ready) {
      return (
        <div ref="social" className="social">
          <BasicButton
            onClick={()=>{
              playlistPreviousVideo()
            }}
            text={'PREVIOUS VIDEO'}
          />
          <BasicButton
            onClick={()=>{
              playlistNextVideo()
            }}
            text={'NEXT VIDEO'}
          />
      </div>
      );
    }
  }
}

export default connect(({
}) => ({
}), {
})(Social);
