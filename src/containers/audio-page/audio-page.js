import './home-page.scss';
import IO from 'socket.io-client';

import React, { Component, PropTypes } from 'react';
import createFragment from 'react-addons-create-fragment'

import { Link } from 'react-router';
import { connect } from 'react-redux';
import { fetchJson } from '../../utils/fetch';

import Project from './project';
import ReactHtmlParser from 'react-html-parser';

import Player from '../../components/player/player';
import Query from '../../components/query/query';
import Controls from '../../components/controls/controls';

class HomePage extends Component {

  static propTypes = {
    browser: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props)
    this.state = {
      ready:false,
      bgImageStyle: {
        //background: `url(${process.env.REMOTE_ASSETS_DIR}images/dog.jpg) no-repeat center center fixed`,
      }
    }
  }

  componentDidMount() {
    this.socketIo = IO("http://0.0.0.0:8080")
    this.socketIo.on('handshake', (data) => {
      this.setState({'ready': true})
      console.log(`Socket Handshake ${JSON.stringify(data)}`)
    });
  }

  render() {
    const { browser } = this.props;
    if(!this.state.ready){
      return (<div></div>)
    }
    return (
      <div style={this.state.bgImageStyle} className="o-page home">
        <Player socket={this.socketIo}/>
        <Controls/>
        <Query socket={this.socketIo}/>
      </div>
    );
  }
}


export default connect(({ browser }) => ({
  browser,
}))(HomePage);