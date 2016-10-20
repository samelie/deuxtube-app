import './make-page.scss';

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
import ControlsRecord from '../../components/controls-record/controls-record';

import DeuxTube from '../../components/deux-tube/deux-tube';

import Query from '../../components/query/query';
import Controls from '../../components/controls/controls';

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
  }

  getChildContext() {
    return {
      videoId: this.props.params.id
    }
  }

  componentDidMount() {
    const { browser, app, params } = this.props;
    //pipe too heavy i think
    this._recorder = new DashRecorder(Socket.socket, {
      pipe:false
    })

    Emitter.on('controls:record:save', () => {
      let _dur = app.media.audio.totalDuration
      let _s = app.media.audio.range.sliderValue[0]
      let _e = app.media.audio.range.sliderValue[1]
      let _diff = _e - _s
      //this._recorder.concatFrames()
      this._recorder.save({
        width: 320,
        height: 240,
        inputOptions: [
          `-ss ${_dur * _s} `
        ],
        outputOptions: [
          `-t ${_dur * _diff} `
        ]
      })


    })

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
  render() {
    const { browser, params } = this.props;
    return (
      <div style={this.state.bgImageStyle} className="o-page make">

        <div className="u-page--col--half">
          <div className="make__media">
              <Audio addAudio={this._addAudio.bind(this)}ref="audioTrack"/>
          </div>
          <div className="make__effects">
            <ControlsRecord ref="controlsRecord"/>
          </div>
        </div>

        <div className="u-page--col--half">
          <div className="make__player">
              <DeuxTube addFrame={this._addFrame.bind(this)}/>
          </div>
        </div>


      </div>
    );
  }
}


export default connect(({ browser, app }) => ({
  browser,
  app
}))(MakePage);
