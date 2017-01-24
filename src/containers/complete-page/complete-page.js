import './complete-page.scss';

import React, { Component, PropTypes } from 'react';
import { push } from 'react-router-redux';

import createFragment from 'react-addons-create-fragment'

import { Link } from 'react-router';
import { connect } from 'react-redux';

import UserSocket from '../../services/user-service';

import QueryInput from '../../components/query-input/query-input'
import ActionButton from '../../components/ui/action-button'

import {
  VIDEO_WIDTH,
  VIDEO_HEIGHT,
} from '../../constants/config';

const mapDispatchToProps = dispatch => {
  return {
    onNavigateTo(dest) {
      dispatch(push(dest));
    }
  };
};

class CompletePage extends Component {

  static propTypes = {
    browser: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props)
    this.state = {

    }
  }

  componentDidMount() {
    const { app,audio } = this.props
    const finalUrl = app.get('finalSave').url
    console.log(`componentDidMount() ${finalUrl}`);
    this._fieldStamp = Date.now().toString()
    this._storeVideo({
      rawUrl: finalUrl,
      info: audio.get('info')
    })
  }

  _storeVideo(value) {
    const { app } = this.props
    const _user = app.get('user')
    if (!_user) {
      throw new Error('No user')
      return
    }
    UserSocket.storeVideo(
        _user.username, //field
        this._fieldStamp, //field
        value //value
      )
      .then(success => {
        console.log('Stored Video');
      })
      .catch(err => {
        console.log(err);
      })
      .finally()
  }

  onVideoTitled(str) {

  }

  onVideoDesced(str) {

  }

  makeAnother() {
    this.props.onNavigateTo('/')
    EAPI.sendEvent('reload')
  }

  showInFinder() {
    const { app } = this.props;
    EAPI.showItemInFolder(app.get('finalSave').local)
  }

  uploadVideo() {
    const { app, audio } = this.props;
    window.EAPI.onYoutubeUploadProgress = (progress => {})

    window.EAPI.onYoutubeUploaded = (youtube => {
      const _v = youtube[0]
      this.setState({ youtubeObj: _v })
      this._storeVideo({
        youtube: _v
      })
    })

    window.EAPI.sendEvent('youtube-upload', {
      local: app.get('finalSave').local,
      title: this.refs.title.value,
      description: this.refs.describe.value
    })
  }


  _renderYoutubeEmbed() {
    if (this.state.youtubeObj) {
      const { id } = this.state.youtubeObj
      return (
        <iframe id="ytplayer" type="text/html"
        autoplay="1"
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        src={`https://www.youtube.com/embed/${id}?autoplay=1`}
        frameborder="0"
        modestbranding="1"></iframe>
      )
    }
    return <div></div>
  }

  render() {
    const { browser, app } = this.props;
    return (
      <div  className="o-page complete-page">
      {this._renderYoutubeEmbed()}
        <input
          ref="title"
          placeholder={`title your video`}
          className="input"
        ></input>
        <input
          ref="describe"
          placeholder={`description for your video`}
          className="input"
        ></input>
        <ActionButton
          text={'Show in finder'}
          onClick={this.showInFinder.bind(this)}
        />
        <ActionButton
          text={'Share on youtube'}
          onClick={this.uploadVideo.bind(this)}
        />
        <ActionButton
          text={'Make another'}
          onClick={this.makeAnother.bind(this)}
        />
      </div>
    );
  }
}


export default connect(({ browser, app, audio }) => ({
  browser,
  app,
  audio
}), mapDispatchToProps)(CompletePage);
