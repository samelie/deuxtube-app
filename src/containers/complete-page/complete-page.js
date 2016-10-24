//import './home-page.scss';

import React, { Component, PropTypes } from 'react';
import {push} from 'react-router-redux';

import createFragment from 'react-addons-create-fragment'

import { Link } from 'react-router';
import { connect } from 'react-redux';

class CompletePage extends Component {

  static propTypes = {
    browser: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    const { browser ,app} = this.props;
    return (
      <div  className="o-page complete-page">
        <h1>WOW</h1>
        <video src={app.finalUrl} autoPlay ></video>
      </div>
    );
  }
}


export default connect(({ browser,app }) => ({
  browser,
  app
}))(CompletePage);
