import './audio-track-form.scss';

import React, { Component, PropTypes } from 'react';
import { push } from 'react-router-redux';

import createFragment from 'react-addons-create-fragment'

import { Link } from 'react-router';
import { connect } from 'react-redux';
import { fetchJson } from '../../utils/fetch';

import ReactHtmlParser from 'react-html-parser';

import Player from '../../components/player/player';
import Query from '../../components/query/query';
import Controls from '../../components/controls/controls';
import ActionButton from '../../components/ui/action-button'
import Input from '../../components/input/input'

const mapDispatchToProps = dispatch => {
  return {
    onNavigateTo(dest) {
      dispatch(push(dest));
    }
  };
};

class AudioTrackForm extends Component {

  static propTypes = {
    browser: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props)
    this.state = {
      ready: false,
      bgImageStyle: {
        //background: `url(${process.env.REMOTE_ASSETS_DIR}images/dog.jpg) no-repeat center center fixed`,
      }
    }
  }

  componentDidMount() {
    this._ytre = /(youtu\.be\/|youtube\.com\/(watch\?(.*&)?v=|(embed|v)\/))([^\?&"'>]+)/
  }

  _parseAndNavigate(url) {
    let _r = this._ytre.exec(url)
    if (_r) {
      let _v = _r[5]
      const path = `/make/${_v}`
      this.props.onNavigateTo(path)
    }
  }

  onInputChanged(e) {
    this._url = e.target.value
    console.log(this._url);

  }

  onStart() {
    let v = this._url
    this._parseAndNavigate(v)
  }

  render() {
    const { browser } = this.props;
    return (
      <div className="audio-track-form">
      <div className="u-font-small">Songs only: </div>
      <Input
        className="audio-track-form--item"
        onChange={this.onInputChanged.bind(this)}
        placeholder={"paste youtube url here"}
      />
      <ActionButton
          className="audio-track-form--item"
          text={'GO'}
          onClick={this.onStart.bind(this)}
        />
      </div>
    );
  }
}


export default connect(({ browser }) => ({
  browser,
}), mapDispatchToProps)(AudioTrackForm);
