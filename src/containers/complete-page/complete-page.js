import './complete-page.scss';

import React, { Component, PropTypes } from 'react';
import { push } from 'react-router-redux';

import createFragment from 'react-addons-create-fragment'

import { Link } from 'react-router';
import { connect } from 'react-redux';

import UserSocket from '../../services/user-service';

import QueryInput from '../../components/query-input/query-input'
import ActionButton from '../../components/ui/action-button'
import Config from '../../utils/config'
import {
  VIDEO_WIDTH,
  VIDEO_HEIGHT,
} from '../../constants/config';

import Analytics from '../../utils/analytics';

const DESCCLIAMER = "Made with Deux-tube app with youtube content. http://rad.wtf"

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
      youtubeUploadProgress: 0
    }
  }

  componentDidMount() {
    const { app, audio } = this.props
    const finalUrl = app.get('finalSave').url

    if (finalUrl) {
      console.log(`componentDidMount() ${finalUrl}`);
      this._fieldStamp = Date.now().toString()
      this._storeVideo({
        rawUrl: finalUrl,
        info: audio.get('info')
      })
    }

    Analytics.pageview(window.location.pathname);

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
    const { app, videoRecord, auth, audio } = this.props;
    console.log(audio.get('info'));
    const totalByteSize = parseInt(app.get('finalSave').metadata.format.size, 10)
    console.log("totalByteSize", totalByteSize);

    window.EAPI.onYoutubeUploadProgress = (uploadBytes => {
      console.log(uploadBytes, totalByteSize);
      this.setState({ youtubeUploadProgress: Math.round(uploadBytes / totalByteSize * 100) })
    })

    window.EAPI.onYoutubeUploaded = (youtube => {
      const _v = youtube[0]
      this.setState({ youtubeObj: _v })
      this._storeVideo({
        youtube: _v
      })


      Analytics.event({
        category: 'Deux-tube',
        action: 'uploaded',
        label: _v.id,
        nonInteraction: true
      });

    })

    console.log(audio.get('track'));
    console.log(audio.get('duration'));
    const userTitle = this.refs.title.value
    const userDesc = this.refs.describe.value
    let title = userTitle === "" ? audio.get('info').snippet.title : userTitle
    const recordedTime = (videoRecord.frameCount / Config.FPS)

    if (recordedTime < parseInt(audio.get('track').totalDuration, 10) - 4) {
      title = "(incomplete) " + title
    }


    window.EAPI.sendEvent('youtube-upload', {
      local: app.get('finalSave').local,
      title: title,
      //privacy: this.refs.privacy.value ? "private" : "public",
      description: `
      ${userDesc}
      ${DESCCLIAMER}.
      Using the audio track from http://youtube.com/watch?v=${audio.get('info').id}
      `,
      credentials: {
        access_token: auth.get('youtube').accessToken
      },
      totalByteSize
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

  _renderUploadProgress() {
    if (this.state.youtubeUploadProgress && !this.state.youtubeObj) {
      return (<div className="complete--upload">{this.state.youtubeUploadProgress}%</div>)
    }
    return (<div></div>)
  }

  render() {
    const { browser, audio, app } = this.props;
    const videoDuration = parseInt(app.get('finalSave').metadata.streams[0].duration, 10)
    const title = (Math.abs(audio.get('duration') - videoDuration)) < 10 ? audio.get('info').snippet.title : "Title your video"
    return (
      <div  className="o-page complete-page">
      {this._renderUploadProgress()}
      {this._renderYoutubeEmbed()}
        <div className="complete--text u-text-small u-underline">Title</div>
        <input
          ref="title"
          placeholder={title}
          className="input u-bottom-margin"
        ></input>
        <div className="complete--text u-text-small u-underline">Description</div>
        <input
          ref="describe"
          placeholder={`description for your video`}
          className="input u-bottom-margin"
        ></input>
        <ActionButton
          text={'Share on youtube'}
          onClick={this.uploadVideo.bind(this)}
        />
        <ActionButton
          text={'Show in finder'}
          onClick={this.showInFinder.bind(this)}
        />
        <ActionButton
          text={'Make another'}
          onClick={this.makeAnother.bind(this)}
        />
      </div>
    );
  }
}


export default connect(({ browser, videoRecord, app, auth, audio }) => ({
  browser,
  videoRecord,
  app,
  auth,
  audio
}), mapDispatchToProps)(CompletePage);
