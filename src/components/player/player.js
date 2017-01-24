import './player.scss';
import { Behavior } from '@samelie/dash-player'
import DashRecorder from '@samelie/dash-player-recorder'

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import { connect } from 'react-redux';

import Socket from '../../utils/socket';
import Gui from './gui2'
import Video from './video'
import Effects from './effects'
import DeuxTubeAudio from './audio'
import Emitter from '../../utils/emitter'
import raf from 'raf'
import EaseNumbers from '../../utils/easeNumbers'

const VERBOSE = false

class Player extends Component {

  constructor(props) {
    super(props)
    this._guiProps = {
      videoOne: {
        stepForward: {
          callback: (value) => {
            this._videos[0].vjPlayer.controllers[0].stepForward(value)
          }
        },
        stepBack: {
          callback: (value) => {
            this._videos[0].vjPlayer.controllers[0].stepBack(value)
          }
        },
        nextVideo: {
          callback: (value) => {
            this._videos[0].vjPlayer.controllers[0].nextVideo()
          }
        },
        behavior: {
          callback: (key, val) => {
            console.log(key, val);
          }
        }
      },
      effects: {
        callback: (key, val) => {
          console.log(key, val);
          this._effects.changedValue(key, val)
        }
      },
      record: {
        toggle: {
          callback: () => {
            this._recording = !this._recording
            console.log(this._recording);
            if (!this._recording) {
              //this._saveVideo()
            }
          }
        },
        save: {
          callback: () => {
            this._recording = false
            this._saveVideo()
          }
        }
      }
    }

    Emitter.on('controls:record:record', (isOn) => {
      //worker
      console.log(isOn);
      this._recording = isOn
    })
    Emitter.on('controls:record:save', () => {
      this._recording = false
    })
  }

  componentDidMount() {
    const { socket, addFrame } = this.props;
    const { videoId } = this.context;
    let _self = this

    this._videos = []
    console.log("init");
    this._initPlayers()
    raf.cancel(this._rafHandle)
    let _rc = 0
    this._rafHandle = raf(function tick() {
      if (_rc % 2 === 0 && _self._recording) {
        addFrame(_self._effects.imageDataArrayBuffer.buffer)
      }
      _rc++
      raf(tick)
    })
  }

  _saveVideo() {
    //this._recorder.pipeSave({ width: 320, height: 240 })
  }

  _initPlayers() {

    this._videos.push(this._addVideo(this.refs.player, {
      noAutoStart: false,
      videoWidth: 640,
      videoHeight: 460,
      verbose: VERBOSE,
      noVideoCanvas: true,
      elAttributes: {
        muted: true
      },
      extensions: ['loop', 'musicVideo'],
      //extensions: ['shuffle'],
      video: true,
      quality: {
        resolution: '240p',
        chooseBest: false,
      },
      playlists: [
        //'PLFFC0DE5C257B32AF',
        'PLRQ2jIXShfkZcTp4rsP8uJotv6fOZas_v',
        /*'PLZRcgvIPIUuU6sJTDq7bofEBk70fg7-ec',
        'PLZRcgvIPIUuXtCtqSNSTUKMy-KfUAXYFM'*/
        'PLuTh1a1eg5vbCa-G0APvdzFqFosBpgmqi',
        //'PLuTh1a1eg5vZ4NbXHavLdiJD3xkyrT7xi',
        //'PLuTh1a1eg5vbZTFzVvH3_lpTCgPlfzaoV',
        //'PLqi-HJej8buehtiukZnuRoL9yiRJfEBRQ'
      ],
      forcePlaylistUpdate: true
    }))
    let _b = Behavior.get()
    _b.videoPlayDuration = 15
    this._videos[0].vjPlayer.controllers[0].behavior = _b


    this._videos.push(this._addVideo(this.refs.player, {
      noAutoStart: false,
      videoWidth: 640,
      videoHeight: 460,
      verbose: VERBOSE,
      noVideoCanvas: true,
      elAttributes: {
        muted: true
      },
      extensions: ['loop'],
      //extensions: ['shuffle'],
      video: true,
      quality: {
        resolution: '240p',
        chooseBest: false,
      },
      playlists: [
        'PLRQ2jIXShfkZcTp4rsP8uJotv6fOZas_v',
        //'PLZRcgvIPIUuW22caHjgZZAvTnH3QhvPNY'
        //'PLZRcgvIPIUuXpCwC7vNlO05wR8wsBakNO'
        //'PLZRcgvIPIUuVGLl0qf6-NXxIk2L4GdxaO',
        //'PLuTh1a1eg5vZ4NbXHavLdiJD3xkyrT7xi',
        //'PLqi-HJej8bufOfvfQWK6qJRhagFEJPeGk'
        //'PLBm5UHsvUTFphuF0ClFFqE7M_G0iPu4FT',
        //'PLuTh1a1eg5vY3PeMoaPs_X_0HqKgsOnDO',
        //'PLL-b-neHTAtMy8gpvq3Ld94id0Xl5KI1j',
        //'PLuTh1a1eg5vZ4NbXHavLdiJD3xkyrT7xi',
        //'PLuTh1a1eg5vbZTFzVvH3_lpTCgPlfzaoV'
      ],
      forcePlaylistUpdate: true

    }))

    this._activeVideoIndex = 0

    Emitter.on(`query:result:clicked`, (videoId) => {
      let _c = this._videos[this._activeVideoIndex].vjPlayer.controllers[0]
      _c.unshiftNewVideo(videoId)
    })

    Emitter.on(`query:playlist`, (data) => {
      let _c = this._videos[this._activeVideoIndex].vjPlayer.controllers[0]
      _c.addPlaylistItems(data)
    })

    Emitter.on(`controls:video:active`, (index) => {
      this._activeVideoIndex = index
    })

    this._effects = new Effects(
      this.refs.gl,
      this.refs.output,
      this._videos[0].vjPlayer.mediaSources[0][0].el,
      this._videos[1].vjPlayer.mediaSources[0][0].el, {
        width: 320,
        height: 240,
        fullscreen: false
      })
  }

  componentWillReceiveProps(nextProps) {
    const { browser } = this.props;
  }

  _addVideo(el, options) {
    let vjPlayer1 = new Video({ el: el, socket: Socket.localSocket })
    vjPlayer1.addSource(options)
    vjPlayer1.start()
    return vjPlayer1
  }

  render() {
    const { browser } = this.props;
    let { videoOne, effects, record } = this._guiProps
    return (
      <div ref="player" className="player">
      <canvas ref="output"></canvas>
      <canvas ref="gl"></canvas>
      <Gui videoOne={videoOne} effects={effects} record={record}/>
      </div>
    );
  }
}

export default connect(({ browser }) => ({
  browser,
}), {})(Player);
