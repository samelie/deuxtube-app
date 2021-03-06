import './landing-page.scss';

import React, { Component, PropTypes } from 'react';
import { push } from 'react-router-redux';
import { isEmpty } from 'lodash';

import createFragment from 'react-addons-create-fragment'

import { Link } from 'react-router';
import { connect } from 'react-redux';
import { fetchJson } from '../../utils/fetch';

import ReactHtmlParser from 'react-html-parser';

import AudioTrackForm from '../../components/audio-track-form/audio-track-form';
import LoginForm from '../../components/login-form/login-form';
import Auth from '../../components/auth/auth';

import Analytics from '../../utils/analytics';

const mapDispatchToProps = dispatch => {
  return {
    onNavigateTo(dest) {
      dispatch(push(dest));
    }
  };
};

class LandingPage extends Component {

  static propTypes = {
    browser: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props)
    this.state = {
      ready: false,
      youtube: false,
      bgImageStyle: {
        //background: `url(${process.env.REMOTE_ASSETS_DIR}images/dog.jpg) no-repeat center center fixed`,
      }
    }
  }

  componentDidMount() {
    this._ytre = /(youtu\.be\/|youtube\.com\/(watch\?(.*&)?v=|(embed|v)\/))([^\?&"'>]+)/

    let i;
    window.EAPI.onIsReady = (isReady => {
      this.setState({ ready: isReady })
      if (isReady) {
        clearInterval(i)
      }
    })

    i = setInterval(() => {
      window.EAPI.sendEvent('is-ready')
    }, 100)

    Analytics.pageview(window.location.pathname);

  }

  componentWillReceiveProps(nextProps) {
    const { auth } = nextProps
    let youtube = auth.get('youtube')
    if (!isEmpty(youtube)) {
      this.setState({ youtube: youtube })
    }
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
  }

  onStart() {
    let v = this._url || "https://www.youtube.com/watch?v=DNWS6QoYR1Q"
    this._parseAndNavigate(v)
  }

  _renderTrackForm() {
    if (this.state.youtube && this.state.ready) {
      return (<AudioTrackForm/>)
    }else if(this.state.youtube && !this.state.ready){
      return <div className="">Updating capabilities</div>
    }
    return null
  }

  _renderAuth() {
    if (!this.state.youtube) {
      return (<Auth />)
    }
    return <div></div>
  }
  render() {
    const { browser } = this.props;
    return (
      <div className="o-page landing">
      {this._renderAuth()}
      {this._renderTrackForm()}
      </div>
    );
  }
}


export default connect(({ browser, auth, app }) => ({
  browser,
  auth,
  app,
}), mapDispatchToProps)(LandingPage);
