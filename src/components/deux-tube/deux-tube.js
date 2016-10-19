import './deux-tube.scss';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import { connect } from 'react-redux';

import Effects from './effects';
import Socket from '../../utils/socket';
import Emitter from '../../utils/emitter'
import EaseNumbers from '../../utils/easeNumbers'

import VideoTrack from '../video-track/video-track'
const VERBOSE = false
class DeuxTube extends Component {

  constructor(props) {
    super(props)

    this._videoData = [{
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
        //'PLRQ2jIXShfkZcTp4rsP8uJotv6fOZas_v',
        /*'PLZRcgvIPIUuU6sJTDq7bofEBk70fg7-ec',
        'PLZRcgvIPIUuXtCtqSNSTUKMy-KfUAXYFM'*/
        //'PLuTh1a1eg5vbCa-G0APvdzFqFosBpgmqi',
        'PLuTh1a1eg5vZ4NbXHavLdiJD3xkyrT7xi',
        //'PLuTh1a1eg5vbZTFzVvH3_lpTCgPlfzaoV',
        //'PLqi-HJej8buehtiukZnuRoL9yiRJfEBRQ'
      ],
      forcePlaylistUpdate: true
    }]

    /*
    , {
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

    }
    */

    this.state = {
      ready: false
    }

  }

  componentDidMount() {

    this.setState({ ready: true })

    this._effects = new Effects(
      this.refs.gl,
      this.refs.output, {
        width: 320,
        height: 240,
        fullscreen: false
      })

    Emitter.on(`videotrack:el`, (el) => {
      this._effects.addSource(el, _c)
      let _c = (this._effects._sources.length === this._videoData.length)
      if(_c){
        this._effects.ready()
      }
    })
  }

  _initPlayers() {

    this._videos.push(this._addVideo(this.refs.player, ))
    let _b = Behavior.get()
    _b.videoPlayDuration = 15
    this._videos[0].vjPlayer.controllers[0].behavior = _b


    this._videos.push(this._addVideo(this.refs.player, ))

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

  }

  _addVideo(el, options) {
    let vjPlayer1 = new Video({ el: el, socket: Socket.socket })
    vjPlayer1.addSource(options)
    vjPlayer1.start()
    return vjPlayer1
  }

  render() {
    const { browser } = this.props;
    if (!this.state.ready) {
      return (
        <div ref="deuxTube" className="deux-tube">
        <canvas ref="output"></canvas>
        <canvas ref="gl"></canvas>
        </div>
      );
    }
    let _videos = this._videoData.map((config, i) => {
      let _id = `video${i}`
      return <VideoTrack id={_id} key={_id} el={this.refs.deuxTube} config={config}/>
    })
    return (
      <div ref="deuxTube" className="deux-tube">
        <canvas ref="output" className="output-canvas"></canvas>
        <canvas ref="gl" className="gl-canvas"></canvas>
        <div className="deux-tube__videos">
          {[..._videos]}
        </div>
      </div>
    );
  }
}

export default connect(({ browser }) => ({
  browser,
}), {})(DeuxTube);
