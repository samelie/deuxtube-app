import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Q from 'bluebird';
import _ from 'lodash';
import { connect } from 'react-redux';
import { movePlaylistItem } from '../../actions/playlists';

import PlaylistItem from './playlistItem';
import Emitter from '../../utils/emitter';
import Keys from '../../utils/keys';

class QueryResults extends Component {

  static contextTypes = {
    videoId: React.PropTypes.string
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {}

  /*componentShouldUpdate() {
    return true
  }*/

  _queueItemClicked(videoId) {
    const { query, movePlaylistItem, id } = this.props;
    let item = _.find(query.get('results').items, {
      id: {
        videoId,
        videoId
      }
    })
    movePlaylistItem({
      key: query.get('results').id,
      item: item,
      value: videoId
    })
  }

  render() {
    const { keyboard, browser, playlist, className } = this.props;

    if (!playlist) {
      return <div></div>
    }

    let _items = playlist.map(id => {
      return <PlaylistItem
      onClick={this._queueItemClicked.bind(this)}
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

export default connect(({ browser, query, keyboard }) => ({
  browser,
  query,
  keyboard,
}), {
  movePlaylistItem,
})(QueryResults);
