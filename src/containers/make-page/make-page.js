import './make-page.scss';

import { bindActionCreators } from 'redux'
import { exportUrl } from '../../actions/app';
import { push } from 'react-router-redux';

import React, { Component, PropTypes } from 'react';
import createFragment from 'react-addons-create-fragment'
import DashRecorder from 'chewb-dash-player-recorder'

import Q from 'bluebird';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { fetchJson } from '../../utils/fetch';

import Project from './project';
import ReactHtmlParser from 'react-html-parser';


import Socket from '../../utils/socket';
import Emitter from '../../utils/emitter';
import Audio from '../../components/audio-track/audio-track';
import VideoTrack from '../../components/video-track/video-track'
import Image from '../../components/image/image'
import QueryResults from '../../components/query-results/query-results'
import ControlsRecord from '../../components/controls-record/controls-record';
import ControlsEffects from '../../components/controls-effects/controls-effects';
import VideoPlaylist from '../../components/video-playlist/video-playlist'

import DeuxTube from '../../components/deux-tube/deux-tube';
import Playbar from '../../components/playbar/playbar';
import PlaylistControls from '../../components/playlist-controls/playlist-controls';
import Social from '../../components/social/social';
import ErrorComp from '../../components/error/error';
import MakeStatus from '../../components/make-status/make-status';
import Instruction from '../../components/ui/instruction'

import Analytics from '../../utils/analytics';

import {
  VIDEO_WIDTH,
  VIDEO_HEIGHT,
  RECORDING_FRAME_EXT
} from '../../constants/config';

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
      },
      playlistInstructionAccessed: false
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

  componentWillReceiveProps(nextProps) {
    let { app, audio, query } = nextProps
    const { dispatch } = this.props;
    if(app.get('recording')){
      this.setState({ hasRecorded: true })
    }
    if (app.get('saving') && !this.state.saving && this.state.hasRecorded) {
      this.setState({ saving: true })
      let _media = audio.get('track')
      let _dur = _media.totalDuration
      let _s = _media.range.sliderValue[0]
      let _e = _media.range.sliderValue[1]
      let _diff = _e - _s

      if (process.env.IS_APP) {

        Q.map(this._recorder.frameBuffers, (buffer) => {
            return global.recorder.addFrame(buffer)
          }, { concurrency: 1 })
          .then(r => {

            this._recorder.frameBuffers.length = 0

            global.recorder.save({
                google: false,
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
              .then(obj => {
                //???? dunno
                let { local, url, name } = obj

                EAPI.videoSaved(local)

                window.EAPI.onVideoSaved = (newSave) => {
                  dispatch(exportUrl({
                    url: url,
                    local: newSave,
                    metadata: obj.metadata
                  }))
                  const path = `/wow/${name}`
                  dispatch(push(path));
                }
              })
          }).finally()

      } else {
        this._recorder.save({
          width: VIDEO_WIDTH,
          height: VIDEO_HEIGHT,
          frameExt: RECORDING_FRAME_EXT,
          withBuffers: false,
          inputOptions: [
            `-ss ${(_dur * _s).toFixed()} `
          ],
          outputOptions: [
            `-t ${(_dur * _diff).toFixed(0)} `
          ]
        })
      }
    }
    this._renderVideoQueryResults(nextProps)
  }

  componentDidMount() {
    const { browser, app, params, dispatch } = this.props;
    //pipe too heavy i think
    this._recorder = new DashRecorder(Socket.localSocket, {
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
      /* let _dur = app.media.audio.totalDuration
       let _s = app.media.audio.range.sliderValue[0]
       let _e = app.media.audio.range.sliderValue[1]
       let _diff = _e - _s*/
      //this._recorder.concatFrames()


      //this._saving()
    })

    Analytics.pageview(window.location.pathname);
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
    this._recorder.addFrame(buffer)
  }

  _renderVideoPlaylist() {
    const { playlists,mouseOverVideoThumb } = this.props;
    let i = -1
    return playlists.map((playlistObj) => {
      i++
      return (
        <div className="make--media--cell">
          <VideoPlaylist
            index={i}
            id={playlistObj.get('id')}
            className="video-playlist--query"
            playlist={playlistObj.get('playlist')}
           />
         </div>
      )
    })
  }

  _renderVideoQueryResults(props) {
    const { query } = props || this.props;
    const results = query.get('results')
    if (!results) {
      return (<div></div>)
    }
    return (
      <div className="make--media--cell">
          <QueryResults
            id={results.id}
            className="video-playlist--query"
            playlist={results.videoIds}
        />
      </div>
    )
  }

  _renderMakeStatus() {
    return <MakeStatus/>
  }

  _renderVideoTracks() {
    const { videoTracks } = this.props;
    return videoTracks.tracks.map((config, index) => {
      let _id = config.id
      return <VideoTrack
        index={index}
        id={_id}
        key={_id}
        el={this.refs.make}
        config={config}
        />
    })
  }

  _renderInstrcutions(){
    const { query } = this.props;
    const results = query.get('results')
    if(!results) return null
    return (<Instruction
                text={`Click to reorder. \n Shift-click to remove.`}
                instructionAccessed={this.state.playlistInstructionAccessed}
                className={'playlist-track'}
              />)
  }

  render() {
    const { browser, params, ui } = this.props;
    return (
      <div ref="make" style={this.state.bgImageStyle} className="o-page make make--interactive">
        <div className="u-page--col--big">
          <div className="make--playerblock">
            <div className="make--video">
              <DeuxTube addFrame={this._addFrame.bind(this)}/>
              <Playbar addFrame={this._addFrame.bind(this)}/>
              <PlaylistControls/>
              {this._renderVideoQueryResults()}
              {this._renderMakeStatus()}
            </div>
            <div className="make--media">
              {this._renderVideoPlaylist()}
              {this._renderInstrcutions()}
            </div>
          </div>
          <div className="make--effectsblock">
            <ControlsRecord/>
            <ControlsEffects/>
          </div>
        </div>
        <div className="u-page--col--small">
          <div className="make--youtubeblock">
              <div className="make--youtubeblock--cell">
                <Audio addAudio={this._addAudio.bind(this)}ref="audioTrack"/>
              </div>
              <div className="make--youtubeblock--cell">
                {this._renderVideoTracks()}
                <Image className="make-page--thumb--over" src={ui.get("mouseOverVideoThumb")} />
              </div>
          </div>
        </div>
        <ErrorComp/>
      </div>
    );
  }
}

export default connect(({ browser, app, ui,audio, query, videoTracks, playlists }) => ({
  browser,
  app,
  ui,
  audio,
  query,
  videoTracks,
  playlists,
}))(MakePage);
