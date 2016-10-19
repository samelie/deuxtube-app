import './query.scss';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import { connect } from 'react-redux';

import YoutubeSocket from '@samelie/dash-player-youtube-socket'
import Socket from '../../utils/socket';
import SearchResult from './searchResult'
import Emitter from '../../utils/emitter'

class Query extends Component {

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
    const socket = Socket.socket;
    this._onClickHandlerBound = this._onClickHandler.bind(this)
    this._socket = new YoutubeSocket(socket)

    this.refs.qInputSearch.addEventListener('focusin', () => {
      this._isFocused = true
    })
    this.refs.qInputSearch.addEventListener('focusout', () => {
      this._isFocused = false
    })
    window.addEventListener('keyup', (e) => {
      if (e.keyCode === 13) {
        if (this._isFocused && this.refs.qInputSearch.value.length) {
          this._onSearchClicked()
        }
      }
    })
    this.refs.qInputSearch.focus()

    this.refs.qInoutPlaylist.placeholder="paste youtube playlist"
  }

  componentWillReceiveProps(nextProps) {
    const { browser } = this.props;
  }

  _parseResultItem(item) {
    return {
      videoId: item.id.videoId,
      image: `https://img.youtube.com/vi/${item.id.videoId}/3.jpg`,
      title: item.snippet.title,
      onClickHandler: this._onClickHandlerBound,
      channelTitle: item.snippet.channelTitle,
    }
  }

  _onSearchClicked(value) {
    value = value || this.refs.qInputSearch.value
    this._makeSearchQuery(this.refs.qInputSearch.value)
      .then(results => {
        this.setState({ searchResultChildren: results })
      }).finally()
  }

  /*
  doesn not loop over playlist items
  */
  _onPlaylistClicked(value) {
    value = value || this.refs.qInoutPlaylist.value
    this._makePlaylistQuery(this.refs.qInoutPlaylist.value).finally()
  }

  _makePlaylistQuery(v) {
    return this._socket.youtube.playlistItems({
        playlistId: v,
        force: true
      })
      .then(results => {
        Emitter.emit(`query:playlist`, results)
      })
  }

  _makeSearchQuery(v) {
    return this._socket.youtube.search({ q: v })
      .then(results => {
        return results.items.map(item => {
          return new SearchResult(this._parseResultItem(item))
        })
      })
  }

  _onClickHandler(videoId) {
    Emitter.emit(`query:result:clicked`, videoId)
  }

  render() {
    const { browser } = this.props;
    return (
      <div ref="query" className="query">
        <div className="query__inputs">
          <div className="query__input">
            <input ref="qInputSearch"></input>
            <button onClick={(e)=>{
              this._onSearchClicked()
            }}>SEARCH YOUTUBE</button>
          </div>
          <div className="query__input">
            <input ref="qInoutPlaylist"></input>
            <button onClick={(e)=>{
              this._onPlaylistClicked()
            }}>SEND</button>
          </div>
        </div>
        <div className="query__results">
          {this.state.searchResultChildren}
        </div>
      </div>
    );
  }
}

export default connect(({ browser }) => ({
  browser,
}), {})(Query);
