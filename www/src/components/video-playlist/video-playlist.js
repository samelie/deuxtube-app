import './video-playlist.scss';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Q from 'bluebird';
import _ from 'lodash';
import { connect } from 'react-redux';
import {
  setPlaylist,
  movePlaylistItem,
  deletePlaylistItem
} from '../../actions/playlists';

import PlaylistItem from './playlistItem';
import Emitter from '../../utils/emitter';
import Keys from '../../utils/keys';
import Keyboard from '../../utils/keyboard';


class VideoPlaylist extends Component {

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

  componentWillReceiveProps(nextProps){
    const {keyboard, index} = this.props
    let _isSelected = Keyboard.selectedVideoTrack(
    keyboard.get('selectionMap'),
    index
    )
  }

  _queueItemClicked(videoId) {
    const {
      playlist,
      keyboard,
      movePlaylistItem,
      deletePlaylistItem,
      id
    } = this.props;
    let _shiftDown = keyboard.get(Keys.SHIFT.toString())
    let indexOf = playlist.indexOf(videoId)
    if (_shiftDown) {
      playlist.splice(indexOf, 1)
      deletePlaylistItem({ key: id, value: videoId })
        //setPlaylist({ key: id, value: playlist })
    } else {
      let _clicked = playlist.splice(indexOf, 1)[0]
      playlist.unshift(_clicked)
      movePlaylistItem({ key: id, value: videoId })
        //setPlaylist({ key: id, value: playlist })
    }
  }

  _queueItemOver(videoId){
    console.log(videoId);
    const {onOver} = this.props
    if(onOver){
      onOver(videoId)
    }
  }

  render() {
    const { keyboard, browser, playlist, className } = this.props;

    if (!playlist) {
      return <div></div>
    }
    let _items = playlist.map(id => {
      return <PlaylistItem
      onClick={this._queueItemClicked.bind(this)}
      onOver={this.props.onOver}
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

export default connect(({ browser, keyboard }) => ({
  browser,
  keyboard,
}), {
  movePlaylistItem,
  deletePlaylistItem,
  setPlaylist,
})(VideoPlaylist);
