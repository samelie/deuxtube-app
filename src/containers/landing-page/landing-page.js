import './landing-page.scss';

import React, { Component, PropTypes } from 'react';
import { push } from 'react-router-redux';

import createFragment from 'react-addons-create-fragment'

import { Link } from 'react-router';
import { connect } from 'react-redux';
import { fetchJson } from '../../utils/fetch';

import ReactHtmlParser from 'react-html-parser';

import AudioTrackForm from '../../components/audio-track-form/audio-track-form';
import LoginForm from '../../components/login-form/login-form';
import Auth from '../../components/auth/auth';

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
      user:false,
      bgImageStyle: {
        //background: `url(${process.env.REMOTE_ASSETS_DIR}images/dog.jpg) no-repeat center center fixed`,
      }
    }
  }

  componentDidMount() {
    this._ytre = /(youtu\.be\/|youtube\.com\/(watch\?(.*&)?v=|(embed|v)\/))([^\?&"'>]+)/
  }

  componentWillReceiveProps(nextProps) {
    const {app} = nextProps
    let user = app.get('user')
    if(user){
      this.setState({user:user})
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
    let v = this._url || "https://www.youtube.com/watch?v=jbGTggv8IEI"
    this._parseAndNavigate(v)
  }

  _renderTrackForm(){
    if(this.state.user){
      return (<AudioTrackForm/>)
    }
    return <div></div>
  }

  render() {
    const { browser } = this.props;
    return (
      <div className="o-page landing">
        <Auth />
        <LoginForm />
        {this._renderTrackForm()}
      </div>
    );
  }
}


export default connect(({ browser,app }) => ({
  browser,
  app,
}), mapDispatchToProps)(LandingPage);
