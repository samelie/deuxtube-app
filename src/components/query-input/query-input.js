import './query-input.scss';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import { connect } from 'react-redux';

import YoutubeSocket from '@samelie/dash-player-youtube-socket'
import Socket from '../../utils/socket';
import Emitter from '../../utils/emitter'

import { setQuery } from '../../actions/query';

//first
const YOUTUBE_VIDEO_RE = /(youtu\.be\/|youtube\.com\/(watch\?(.*&)?v=|(embed|v)\/))([^\?&"'>]+)/
  //second
const YOUTUBE_PLAYLIST_RE = /(?:youtube\.com.*(?:\?|&)(?:v|list)=|youtube\.com.*embed\/|youtube\.com.*v\/|youtu\.be\/)((?!videoseries)[a-zA-Z0-9_-]*)/

class QueryInput extends Component {

  static propTypes = {
    browser: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props)
    this.state = {
      searchResultChildren: []
    }
  }

  componentDidMount() {
    const { placeholder } = this.props;
    const socket = Socket.socket;
    this._socket = new YoutubeSocket(socket)

    this.refs.input.addEventListener('focusin', () => {
      this._isFocused = true
    })

    this.refs.input.addEventListener('focusout', () => {
      this._isFocused = false
    })

    this.refs.input.addEventListener('keyup', (e) => {
      if (e.keyCode === 13) {
        if (this._isFocused && this.refs.input.value.length) {
          this._onSearchClicked()
        }
      }
    })

    this.refs.input.placeholder = placeholder
      //this.refs.input.focus()
  }

  _onSearchClicked(value) {
    const { onQueryResponse,setQuery,id } = this.props;
    value = value || this.refs.input.value
    let _videoId = YOUTUBE_VIDEO_RE.exec(value)
    if (_videoId) {
      _videoId = _videoId[5]
    }
    let _playlistId = YOUTUBE_PLAYLIST_RE.exec(value)
    if (_playlistId) {
      _playlistId = _playlistId[1]
    }
    console.log(_videoId);
    console.log(_playlistId);

    if (_playlistId) {
      this._makePlaylistQuery(_playlistId)
        .then(results => {
          //goes to playliat
          setQuery({id, results})
          //onQueryResponse(results)
        }).finally()
    } else if (_videoId) {
      this._makeVideoQuery(_videoId)
        .then(results => {
          setQuery({id, results})
          //onQueryResponse(results)
        }).finally()
    }else{
      this._search(value)
        .then(results => {
          setQuery({id, results})
        }).finally()
    }

    this.refs.input.value = ""
    this.refs.input.focus()
      /*this._makeSearchQuery(this.refs.input.value)
        .then(results => {
          onQueryResponse(results)
        }).finally()*/
  }

  _search(v) {
    return this._socket.youtube.search({
      q: v,
      force: true
    })
  }

  _makePlaylistQuery(v) {
    return this._socket.youtube.playlistItems({
      playlistId: v,
      force: true
    })
  }

  _makeVideoQuery(v) {
    return this._socket.youtube.video({ id: v })
  }

  componentWillReceiveProps(nextProps) {
    const { browser } = this.props;
  }

  render() {
    const { browser } = this.props;
    return (
      <input
       ref="input"
       className="input"
      ></input>
    );
  }
}

export default connect(({ browser }) => ({
  browser,
}), {
  setQuery
})(QueryInput);
