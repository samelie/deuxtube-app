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
import Player from '../../components/player/player';
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
    this._recorder = new DashRecorder(Socket.socket)

    Emitter.on('controls:record:save', ()=>{
      //console.log(this.refs.audioTrack);
      //console.log(this.refs.audioTrack.getSaveBuffer);
      //let _soundBuffer = this.refs.audioTrack.getSaveBuffer()
      //console.log(_soundBuffer);
    })

  }

  _addAudio(buffer){
    console.log(buffer);
  }

        //<Controls/>
        //<Player/>
        //<Query/>
  render() {
    const { browser, params } = this.props;
    return (
      <div style={this.state.bgImageStyle} className="o-page make">
      <div className="make__player">
      </div>
      <div className="make__media">
        <Audio onSave={this._addAudio.bind(this)}ref="audioTrack"/>
      </div>
      <div className="make__effects">
        <ControlsRecord ref="controlsRecord"/>
      </div>
      <div className="make__query">
      </div>
      </div>
    );
  }
}


export default connect(({ browser }) => ({
  browser,
}))(MakePage);
