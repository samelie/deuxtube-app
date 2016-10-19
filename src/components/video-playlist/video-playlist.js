import './video-playlist.scss';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Q from 'bluebird';
import _ from 'lodash';
import { connect } from 'react-redux';

import PlaylistItem from './playlistItem';
import Emitter from '../../utils/emitter';

class VideoPlaylist extends Component {

  static contextTypes = {
    videoId: React.PropTypes.string
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {}

  render() {
    const { browser, playlist, className, api  } = this.props;
    const {queueItemClicked} =api
    let _items = playlist.map(id => {
      return <PlaylistItem
      onClick={queueItemClicked}
      key = { id }
      videoId={id}
      />
    })

    return (
      <div
      ref="videoPlaylist"
      className={`video-playlist ${className}`}
      >
        {[..._items]}
      </div>
    );
  }
}

export default connect(({ browser }) => ({
  browser,
}), {})(VideoPlaylist);
