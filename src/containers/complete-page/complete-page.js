import './complete-page.scss';

import React, { Component, PropTypes } from 'react';
import {push} from 'react-router-redux';

import createFragment from 'react-addons-create-fragment'

import { Link } from 'react-router';
import { connect } from 'react-redux';

import QueryInput from '../../components/query-input/query-input'
import ActionButton from '../../components/ui/action-button'

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

  onVideoTitled(str){

  }

  onVideoDesced(str){

  }

  makeAnother(){
    this.props.onNavigateTo('/')
    EAPI.sendEvent('reload')
  }

  uploadVideo(){
    const { app} = this.props;

    global.EAPI.onYoutubeUploaded = (youtube=>{
      console.log(youtube);
    })

    global.EAPI.sendEvent('youtube-upload', {
      local:app.get('finalSave').local,
      title:this.refs.title.value,
      description:this.refs.describe.value
    })
  }

  render() {
    const { browser ,app} = this.props;
    return (
      <div  className="o-page complete-page">
        <video src={app.get('finalSave').url} controls autoPlay loop></video>
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
          text={'Make another'}
          onClick={this.makeAnother.bind(this)}
        />
        <ActionButton
          text={'Share'}
          onClick={this.uploadVideo.bind(this)}
        />
      </div>
    );
  }
}


export default connect(({ browser,app }) => ({
  browser,
  app
}),mapDispatchToProps)(CompletePage);
