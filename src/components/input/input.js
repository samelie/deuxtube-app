import './input.scss';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import { connect } from 'react-redux';

import Emitter from '../../utils/emitter'

//first
const YOUTUBE_VIDEO_RE = /(youtu\.be\/|youtube\.com\/(watch\?(.*&)?v=|(embed|v)\/))([^\?&"'>]+)/
  //second
const YOUTUBE_PLAYLIST_RE = /(?:youtube\.com.*(?:\?|&)(?:v|list)=|youtube\.com.*embed\/|youtube\.com.*v\/|youtu\.be\/)((?!videoseries)[a-zA-Z0-9_-]*)/

class Input extends Component {

  static propTypes = {
    browser: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props)
    this.state = {

    }
  }

  componentDidMount() {
    this.refs.input.addEventListener('focusin', () => {
      this._isFocused = true
    })

    this.refs.input.addEventListener('focusout', () => {
      this._isFocused = false
    })

    if(this.props.onChange){
      this.refs.input.addEventListener('keyup', this.props.onChange)
    }

    this.refs.input.placeholder = this.props.placeholder
  }

  render() {
    const { browser } = this.props;
    const c = this.props.className || ""
    return (
      <input
       ref="input"
       className={`input ${c}`}
      ></input>
    );
  }
}

export default connect(({ browser }) => ({
  browser,
}), {})(Input);
