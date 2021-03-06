import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Q from 'bluebird';
import _ from 'lodash';
import { connect } from 'react-redux';
import { movePlaylistItem } from '../../actions/playlists';

import PlaylistItem from './playlistItem';
import Emitter from '../../utils/emitter';
import Keys from '../../utils/keys';

import {
  mouseOverVideoThumb,
} from '../../actions/ui';


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
      videoId: videoId
    })
    movePlaylistItem({
      key: query.get('results').id,
      item: item,
      value: videoId
    })
  }

  _onAddAll() {
    const { query, movePlaylistItem, id } = this.props;
    const { playlist } = this.props
    const items = query.get('results').items
    const key = query.get('results').id
    let _reverse = [...playlist].reverse()

    let _playload = {
      key: key,
      value: [],
      item: []
    }
    _reverse.forEach(videoId => {
      let item = _.find(items, {
        videoId: videoId
      })
      _playload.item.push(videoId)
      _playload.item.push(item)
    })
    _reverse.length = 0;
    movePlaylistItem(_playload)
  }


  _renderAddAll() {
    const { playlist } = this.props
    if (!playlist.length) {
      return (<div></div>)
    }

    return ( <div onClick = {
        () => {
          this._onAddAll()
        }
      }
      className = "video-playlist__text">
      Add all </div>)
    }

    render() {
      const { keyboard, browser, playlist, className,mouseOverVideoThumb } = this.props;

      if (!playlist) {
        return <div></div>
      }
      let _timeout;
      let _items = playlist.map(id => {
        return <PlaylistItem
      onClick={this._queueItemClicked.bind(this)}
      onOver={(videoId)=>{
              clearTimeout(_timeout)
              mouseOverVideoThumb(videoId)
              _timeout = setTimeout(()=>{
                mouseOverVideoThumb(null)
              }, 4000)
            }}
      key = { id }
      videoId={id}
      />
      })

      return (
        <div
      ref="videoPlaylist"
      className={`video-playlist ${className}`}
      >
        <div className="video-playlist__results">
          {[..._items]}
        </div>
      </div>
        //{this._renderAddAll()}
      );
    }
  }

  export default connect(({ browser, query, keyboard }) => ({
    browser,
    query,
    keyboard,
  }), {
    movePlaylistItem,
    mouseOverVideoThumb,
  })(QueryResults);
