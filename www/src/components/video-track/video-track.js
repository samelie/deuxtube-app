import './video-track.scss';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Q from 'bluebird';
import CheckTypes from 'check-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { mediaAudioChanged } from '../../actions/app';
import { createPlaylist, setPlaylist } from '../../actions/playlists';
import { playbarUpdate } from '../../actions/playbar';
import { videoSelect } from '../../actions/video_state';

import Video from './video'
import Keys from '../../utils/keys';
import Keyboard from '../../utils/keyboard';
import { NUMBERS } from '../../utils/keys';
import Socket from '../../utils/socket';
import Emitter from '../../utils/emitter';
import MediaControls from '../media-controls/media-controls'
import QueryInput from '../query-input/query-input'
import Instruction from '../ui/instruction'
import Input from '../../components/input/input'
import VideoPlaylist from '../video-playlist/video-playlist'

import {
  PLAYBAR_UPDATE,
  PLAYBAR_SEEK,
  PLAYBAR_SET_CURRENT_TIME,
} from '../../constants/action-types';

const smallImageUrl = (id) => (`https://img.youtube.com/vi/${id}/3.jpg`)

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
        visible:true,
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
        instructionAccessed: false,
        seek: {
          sliderValue: this.sliderData[0].value
        },
        currentVideo: {
          title: "",
          videoId: "",
          progress: 0
        },
        isSelected: false,
        playbarSeek: 0,
        playbarCurrentTime: 0,
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
    const { el, config, createPlaylist, setPlaylist, playbarUpdate } = this.props;
    const { id } = config
    this._player = new Video({ el: el, socket: Socket.localSocket })
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
      setPlaylist({ key: id, value: [...items] })
        //this.setState({ 'playlist': [...items] })
    })

    this._player.on('VO_ADDED', (vo, msVo) => {
      let {
        currentTime,
        sourceBufferStart,
        sourceBufferEnd
      } = this.mediasource
      let _current = this.state.currentVideo
      let _lastref = vo.currentRefIndexs[vo.currentRefIndexs.length - 1]
      playbarUpdate({
        currentTime,
        sourceBufferStart,
        sourceBufferEnd,
      })
      this.setState({
        currentVideo: Object.assign({},
          _current, {
            progress: `${_lastref}/${vo.referencesLength}`
          }
        )
      })
      this._onVideoProgress(_lastref / vo.referencesLength)
    })

    this._player.on('VIDEO_FINISHED', (item) => {
      this._onVideoProgress(0)
      if (item) {
        this.setState({
          currentVideo: {
            title: item.snippet.title,
            videoId: item.snippet.resourceId.videoId
          }
        })
      }
    })

    Emitter.emit(`videotrack:el`, this._player.vjPlayer.mediaSources[0][0].el)

    Emitter.on('controls:record:save', () => {
      this.controller.pause()
    })

    createPlaylist(id)
  }

  componentWillReceiveProps(nextProps) {
    let {
      id,
      app,
      index,
      keyboard,
      playbar,
      playlists,
      playlistControls
    } = nextProps
    let _isSelected = Keyboard.selectedVideoTrack(
      keyboard.get('selectionMap'),
      index
    )
    let _playlistNow = playlists.get(id)
    if(_isSelected){
      const activeId = playlists.get('activeId')
      _playlistNow = playlists.get(activeId)
    }
    if (_playlistNow) {
      let action = _playlistNow.get('playlistAction')
        //fires twice?
      if (action) {
        let { type, videoId, item } = action
        switch (action.type) {
          case 'move':
            if (CheckTypes.array(item)) {
              /*item.forEach((itm, index)=>{
                const vId = videoId[index]
                this._moveVideoToFrontQueue(vId, itm)
              })*/
            } else {
              this._moveVideoToFrontQueue(videoId, item)
            }
            break;
          case 'delete':
            this._removeVideoFromQueue(videoId)
            break;
        }
      }
    }
    if (app.get('saving')) {
      this.controller.pause()
    }

    this._processKeyboard(keyboard)
    this._processPlaybar(playbar)
    this._processPlaylistControls(playlistControls)
  }

  /*
   loop over the numbers and match the video index
    with the state of that key
  */
  _processKeyboard(keyboard) {
    let { index, videoSelect } = this.props
    let _isSelected = Keyboard.selectedVideoTrack(
      keyboard.get('selectionMap'),
      index
    )
    if (this.state.isSelected !== _isSelected) {
      this.setState({
        isSelected: _isSelected,
        instructionAccessed: true,
      })
      this._setSelectedClass(_isSelected)
      videoSelect({ index, isSelected: _isSelected })
    }
  }

  _setSelectedClass(isSelected) {
    let _clazz = "is-selected"
    if (isSelected) {
      this.refs.videoTrackWrapper.classList.add(_clazz)
    } else {
      this.refs.videoTrackWrapper.classList.remove(_clazz)
    }
  }

  _processPlaybar(playbar) {
    if (!this.state.isSelected) {
      return
    }
    switch (playbar.get('currentAction')) {
      case PLAYBAR_SET_CURRENT_TIME:
        {
          this.mediasource.currentTime = playbar.get('seekCurrentTime')
        }
      case PLAYBAR_SEEK:
        {
          this.mediasource.seek(playbar.get('seek'))
          this.mediasource.play()
        }
    }
  }

  _processPlaylistControls(playlistControls) {
    if (!this.state.isSelected) {
      return
    }
    const p = this.props.playlistControls.get('counter')
    const c = playlistControls.get('counter')
    if (p !== c) {
      if (c > p) {
        this.controller.nextVideo()
      } else {
        this.controller.previousVideo()
      }
    }
  }

  _removeKeys() {

  }

  get controller() {
    return this._player.vjPlayer.controllers[0]
  }

  get mediasource() {
    return this._player.vjPlayer.mediaSources[0][0]
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

  _moveVideoToFrontQueue(videoId, item) {
    this.controller.moveToFrontPlaylist(videoId, item)
  }


  render() {
    const { browser, config, index } = this.props;
    const { id } = config

    let _sliders = this.sliderData.map(slider => {
      return <MediaControls ref = { slider.key }
      key = { slider.key }
      {...slider }
      {...this.state[slider.key] }
      />
    })

    //<div>{this.state.currentVideo.title}</div>
    return (
      <div ref="videoTrack" className="video-track">
        <img className="video-track--bg"></img>
        <div className="video-track__playing">
          <div ref="videoTrackWrapper" className="playing__wrapper">
            <img src={smallImageUrl(this.state.currentVideo.videoId)}></img>
            <div className="playing__info">
              <div>{this.state.mediaSourceState}</div>
              <div>{this.state.currentVideo.progress}</div>
            </div>
          </div>
        </div>
        {[..._sliders]}
        <QueryInput
          id={id}
          rows="2"
          tabIndex="-1"
          className="input-query"
          placeholder={`Search, video/playlist url`}
          onQueryResponse={this.onInputQuery.bind(this)}
        />
        <Instruction
          text={`Select video layer with key ${(index+1)}.`}
          instructionAccessed={this.state.instructionAccessed}
          className={'video-track'}
        />
      </div>
    );
  }
}
/*
<VideoPlaylist
          api={this._playlistApi}
          className="video-playlist--query"
          playlist={this.state.playlist}
         />
*/
export default connect(({ app, browser, playlists, playlistControls, playbar, keyboard }) => ({
  app,
  browser,
  playlists,
  playlistControls,
  keyboard,
  playbar,
}), {
  createPlaylist,
  setPlaylist,
  playbarUpdate,
  videoSelect,
})(AudioTrack);
