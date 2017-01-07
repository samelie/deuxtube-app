//import './login-form.scss';

import React, { Component, PropTypes } from 'react';
import { push } from 'react-router-redux';
import { loggedIn } from '../../actions/app';
import { instaAuthed, youtubeAuth } from '../../actions/auth';

import createFragment from 'react-addons-create-fragment'

import { Link } from 'react-router';
import { connect } from 'react-redux';
import { fetchJson } from '../../utils/fetch';
import AuthService from './auth-service';
import InstagramService from '../../services/instagram-service';

import ActionButton from '../ui/action-button'
import Input from '../input/input'

class Auth extends Component {

 static propTypes = {
  browser: PropTypes.object.isRequired
 };

 constructor(props) {
  super(props)
  this.state = {
   youtubeAuth: null
  }
 }

 componentDidMount() {}

 onInstaAuth() {
  const { instaAuthed } = this.props;
  AuthService.auth(`${SOCKET_SERVER}/login/instagram`)
   .then(authData => {
    instaAuthed(authData)
   })
 }

 onGoogleAuth() {
  const { youtubeAuth } = this.props;
  AuthService.auth(`${SOCKET_SERVER}/login/youtube`)
   .then(authData => {
    youtubeAuth(authData)
   })
 }


 componentWillReceiveProps(nextProps) {
  const { auth } = nextProps
  let _iAuth = auth.get('instagram')
  if (_iAuth) {
   let {accessToken, id} = _iAuth
   InstagramService.getTimeline(accessToken, id)
    .then(results => {
     console.log(results);
    })
  }
 }

 shouldComponentUpdate() {
  return false
 }

 /*
 password stored locally
 */

 _renderYoutubeAuth() {
  if (!this.state.youtubeAuth) {
   return (
    <div className="auth__wrapper">
          <ActionButton
              text={'Authorize instagram'}
              onClick={this.onInstaAuth.bind(this)}
            />
            <ActionButton
              text={'Authorize google'}
              onClick={this.onGoogleAuth.bind(this)}
            />
      </div>
   );
  }
 }

 render() {
  const { browser } = this.props;
  return (
   <div className="auth">
      {this._renderYoutubeAuth()}
   </div>
  )
 }
}


export default connect(({ browser, auth }) => ({
 browser,
 auth,
}), {
 instaAuthed,
 youtubeAuth,
})(Auth);
