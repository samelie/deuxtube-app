import './make-page.scss';

import { bindActionCreators } from 'redux'
import { exportUrl } from '../../actions/app';
import { push } from 'react-router-redux';

import React, { Component, PropTypes } from 'react';
import createFragment from 'react-addons-create-fragment'
import DashRecorder from '@samelie/dash-player-recorder'

import { Link } from 'react-router';
import { connect } from 'react-redux';
import { fetchJson } from '../../utils/fetch';

import Project from './project';
import ReactHtmlParser from 'react-html-parser';

import Socket from '../../utils/socket';
import Emitter from '../../utils/emitter';
import Audio from '../../components/audio-track/audio-track';
import VideoTrack from '../../components/video-track/video-track'
import ControlsRecord from '../../components/controls-record/controls-record';
import ControlsEffects from '../../components/controls-effects/controls-effects';

import DeuxTube from '../../components/deux-tube/deux-tube';

import { VIDEO_WIDTH, VIDEO_HEIGHT } from '../../constants/config';

import Query from '../../components/query/query';
import Controls from '../../components/controls/controls';
import SavingProgress from '../../components/saving-progress/saving-progress';

class MakePage extends Component {

  static propTypes = {
    browser: PropTypes.object.isRequired
  };

  static childContextTypes = {
    videoId: React.PropTypes.string
  }

  constructor(props) {
    super(props)
    this.state = {
      bgImageStyle: {
        //background: `url(${process.env.REMOTE_ASSETS_DIR}images/dog.jpg) no-repeat center center fixed`,
      }
    }

    this._recorderProp = {
      counter: 0
    }
    this._savingProgressProp = {
      progress: 0
    }
  }

  getChildContext() {
    return {
      videoId: this.props.params.id
    }
  }

  componentDidMount() {
    const { browser, app, params, dispatch } = this.props;
    //pipe too heavy i think
    this._recorder = new DashRecorder(Socket.socket, {
      pipe: false
    })

    this._recorder.on('saved', (obj) => {
      //???? dunno
      let { url, name } = obj.url
      let { local } = obj
      dispatch(exportUrl({ url: url, local: local }))
      const path = `/wow/${name}`
      dispatch(push(path));
    })

    this._recorder.on('progress', (percent) => {
      console.log(percent);
      this._savingProgressProp.progress = percent
    })

    Emitter.on('controls:record:save', () => {
      let _dur = app.media.audio.totalDuration
      let _s = app.media.audio.range.sliderValue[0]
      let _e = app.media.audio.range.sliderValue[1]
      let _diff = _e - _s
        //this._recorder.concatFrames()
      this._recorder.save({
        width: VIDEO_WIDTH,
        height: VIDEO_HEIGHT,
        withBuffers: false,
        inputOptions: [
          `-ss ${(_dur * _s).toFixed()} `
        ],
        outputOptions: [
          `-t ${(_dur * _diff).toFixed(0)} `
        ]
      })

      this._saving()
    })

  }

  _saving() {
    this.refs.make.classList.add('saving')
  }


  /*
  This is async, so we know the audio is last to be added

  NEED TO PREFIX THE INDEX RANGE!!!!

  */
  _addAudio(buffer) {
    this._recorder.addAudio(buffer)
  }

  _addFrame(buffer) {
    this._recorderProp.counter++
      this._recorder.addFrame(buffer)
  }

  //<Controls/>
  //<Player/>
  //<Query/>
  /*
  <div className="make__tube">
          <div className="youtube__query">

          </div>
          <div className="deuxtube__playlist">
          </div>
        </div>
  */

  _renderVideoTracks() {
    const { videoTracks } = this.props;
    return videoTracks.tracks.map((config, i) => {
      let _id = i//`${i}`
      return <VideoTrack id={_id} key={_id} el={this.refs.make} config={config}/>
    })
  }

  render() {
    const { browser, params } = this.props;
    return (
      <div ref="make" style={this.state.bgImageStyle} className="o-page make make--interactive">

        <div className="u-page--col--big">
          <div className="make--playerblock">
            <div className="make--video">
            </div>
            <div className="make--media">
              <div className="make--media--cell">
              </div>
              <div className="make--media--cell">
              </div>
              <div className="make--media--cell">
              </div>
            </div>
          </div>
          <div className="make--effectsblock">
          </div>
        </div>
        <div className="u-page--col--small">
          <div className="make--youtubeblock">
              <div className="make--youtubeblock--cell">
                <Audio addAudio={this._addAudio.bind(this)}ref="audioTrack"/>
              </div>
              <div className="make--youtubeblock--cell">
                {this._renderVideoTracks()}
              </div>
          </div>
        </div>
      </div>
    );
  }
}


/*
<div className="make--interactive u-page--col--small">
          <div className="make__media">
              <Audio addAudio={this._addAudio.bind(this)}ref="audioTrack"/>
          </div>
          <div className="make__effects">
            <ControlsRecord
            info={this._recorderProp}
            ref="controlsRecord"
            />
          </div>
        </div>


        <div className="make--interactive u-page--col--big">
          <div className="make__player">
              <DeuxTube addFrame={this._addFrame.bind(this)}/>
          </div>
        </div>

        <SavingProgress
          info={this._savingProgressProp}
        />
*/

export default connect(({ browser, app, videoTracks }) => ({
  browser,
  app,
  videoTracks
}))(MakePage);
