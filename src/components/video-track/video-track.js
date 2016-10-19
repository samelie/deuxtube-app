import './video-track.scss';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Q from 'bluebird';
import _ from 'lodash';
import { connect } from 'react-redux';
import { mediaAudioChanged } from '../../actions/app';

import Video from './video'
import Keys from '../../utils/keys';
import Socket from '../../utils/socket';
import Emitter from '../../utils/emitter';
import MediaControls from '../media-controls/media-controls'
import QueryInput from '../query-input/query-input'
import VideoPlaylist from '../video-playlist/video-playlist'

const smallImageUrl = (id) => (`https://img.youtube.com/vi/${id}/3.jpg`, )

class AudioTrack extends Component {

  static contextTypes = {
    videoId: React.PropTypes.string
  }

  constructor(props) {
      super(props)
      const { addAudio } = this.props
      this.sliderData = [{
        key: 'seek',
        title: 'Seek',
        value: 0,
        slider: {
          min: 0,
          max: 1,
          step: 0.01,
          onChange: (val) => {
            this._updateSeekState({
              paused: true,
              sliderValue: val
            })
          },
          onAfterChange: (val) => {
            this._updateSeekState({
              paused: false,
            })
            this._seekCurrentVideo(val)
          }
        },
      }]
      this.state = {
        totalDuration: 0,
        duration: 0,
        seek: {
          sliderValue: this.sliderData[0].value
        },
        currentVideo: {
          title: "",
          videoId: "",
          progress: 0
        },
        mediaSourceState: "",
        playlist: []
      }

      this._playlistApi = {
        queueItemClicked: this._queueItemClicked.bind(this),
        moveVideoToFrontQueue: this._moveVideoToFrontQueue.bind(this),
        removeVideoFromQueue: this._removeVideoFromQueue.bind(this),
      }
    }
    //********
    //SEEK
    //********

  _updateSeekState(obj) {
    let _v = Object.assign({}, this.state.seek, obj)
    this.setState({
      seek: _v
    })
  }

  _seekCurrentVideo(val) {
    console.log(val);
    this.controller.seek(val)
  }


  _onVideoProgress(p) {
    if (!this.state.seek.paused) {
      this._updateSeekState({ sliderValue: p })
    }
  }

  componentDidMount() {
    const { el, config } = this.props;
    this._player = new Video({ el: el, socket: Socket.socket })
    this._player.addSource(config)
    this._player.start()

    /*this._player.on('VO_PLAYBACK_PROGRESS', (p) => {
      this._onVideoProgress(p)
    })*/

    this._player.on('MEDIASOURCE_STATE', (state) => {
      this.setState({ 'mediaSourceState': state })
    })

    this._player.on('PLAYLIST', (items) => {
      //we dont show the currrent video here??
      this.setState({ 'playlist': [...items] })
    })

    this._player.on('VO_ADDED', (vo, msVo) => {
      let _current = this.state.currentVideo
      let _lastref = vo.currentRefIndexs[vo.currentRefIndexs.length-1]
      this.setState({
        currentVideo: Object.assign({},
          _current, {
            progress: `${_lastref}/${vo.referencesLength}`
          }
        )
      })
    })

    this._player.on('VIDEO_FINISHED', (item) => {
      this._onVideoProgress(0)
      this.setState({
        currentVideo: {
          title: item.snippet.title,
          videoId: item.snippet.resourceId.videoId
        }
      })
    })

    this._addKeys()

    Emitter.emit(`videotrack:el`, this._player.vjPlayer.mediaSources[0][0].el)
  }

  _addKeys() {
    window.addEventListener('keydown', (e) => {
      if (e.keyCode === Keys.SHIFT) {
        this._shiftDown = true
      }
    })
    window.addEventListener('keyup', (e) => {
      if (e.keyCode === Keys.SHIFT) {
        this._shiftDown = false
      }
    })
  }

  _removeKeys() {

  }

  get controller() {
    return this._player.vjPlayer.controllers[0]
  }


  onInputQuery(results) {
    this.controller.addPlaylistItems(results)
  }

  //***********
  //UI API
  //***********

  _queueItemClicked(videoId) {
    if (this._shiftDown) {
      this._removeVideoFromQueue(videoId)
    } else {
      this._moveVideoToFrontQueue(videoId)
    }
  }

  _removeVideoFromQueue(videoId) {
    this.controller.removeIdFromPlaylist(videoId)
  }

  _moveVideoToFrontQueue(videoId) {
    this.controller.moveToFrontPlaylist(videoId)
  }


  render() {
    const { browser } = this.props;

    let _sliders = this.sliderData.map(slider => {
      return <MediaControls ref = { slider.key }
      key = { slider.key }
      {...slider }
      {...this.state[slider.key] }
      />
    })

    return (
      <div ref="videoTrack" className="video-track">
        {[..._sliders]}
        <div className="video-track__playing">
          <div>{this.state.currentVideo.title}</div>
          <div className="playing__wrapper">
            <img src={smallImageUrl(this.state.currentVideo.videoId)}></img>
            <div className="playing__info">
              <div>{this.state.mediaSourceState}</div>
              <div>{this.state.currentVideo.progress}</div>
            </div>
          </div>
        </div>
        <QueryInput
        placeholder={`Paste video or playlist url`}
        onQueryResponse={this.onInputQuery.bind(this)}
        />
        <VideoPlaylist
          api={this._playlistApi}
          className="video-playlist--query"
          playlist={this.state.playlist}
         />
      </div>
    );
  }
}

export default connect(({ browser }) => ({
  browser,
}), {})(AudioTrack);
