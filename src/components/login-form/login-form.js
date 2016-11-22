import './login-form.scss';

import React, { Component, PropTypes } from 'react';
import { push } from 'react-router-redux';
import { loggedIn } from '../../actions/app';

import createFragment from 'react-addons-create-fragment'

import { Link } from 'react-router';
import { connect } from 'react-redux';
import { fetchJson } from '../../utils/fetch';
import Socket from '../../utils/socket';

import LoginFormService from './login-form-service'

import ActionButton from '../ui/action-button'
import Input from '../input/input'

import {
 USERNAME,
 PASSWORD,
} from '../../constants/config';

const mapDispatchToProps = dispatch => {
  return {
    loggedIn(user){
      dispatch(loggedIn(user))
    },
    onNavigateTo(dest) {
      dispatch(push(dest));
    }
  };
};

class LoginForm extends Component {

  static propTypes = {
    browser: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props)
    this.state = {
      user:false
    }
    this._username = USERNAME
    this._password = PASSWORD
  }

  componentDidMount() {
    LoginFormService.init(Socket.socket)
  }

  onUsernameChanged(e) {
    this._username = e.target.value
  }

  onPasswordChanged(e) {
    this._password = e.target.value
  }

  onStart() {
    const { loggedIn } = this.props;
    return LoginFormService
    .login(this._username, this._password)
    .then(user=>{
      this.setState({user:user})
      loggedIn(user)
    })
    .catch(err=>{
      console.log(err);
    })
  }

  /*
  password stored locally
  */

  _renderForm(){
    if(!this.state.user){
      return (
      <div className="login-form__wrapper">
          <h1>Login</h1>
          <Input
            onChange={this.onUsernameChanged.bind(this)}
            placeholder={"username..."}
          />

          <Input
            onChange={this.onPasswordChanged.bind(this)}
            placeholder={"password"}
          />
          <ActionButton
              text={'GO'}
              onClick={this.onStart.bind(this)}
            />
      </div>
      );
    }else{
      return (
      <div className="login-form__wrapper">
          <h1>{`Logged in as ${this.state.user.username}`}</h1>
      </div>
      )
    }
  }

  render() {
    const { browser } = this.props;
    return (
      <div className="login-form">
          {this._renderForm()}
      </div>
      )
  }
}


export default connect(({ browser }) => ({
  browser,
}), mapDispatchToProps)(LoginForm);
