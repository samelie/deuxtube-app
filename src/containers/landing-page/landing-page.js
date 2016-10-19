//import './home-page.scss';

import React, { Component, PropTypes } from 'react';
import {push} from 'react-router-redux';

import createFragment from 'react-addons-create-fragment'

import { Link } from 'react-router';
import { connect } from 'react-redux';
import { fetchJson } from '../../utils/fetch';

import ReactHtmlParser from 'react-html-parser';

import Player from '../../components/player/player';
import Query from '../../components/query/query';
import Controls from '../../components/controls/controls';


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
      bgImageStyle: {
        //background: `url(${process.env.REMOTE_ASSETS_DIR}images/dog.jpg) no-repeat center center fixed`,
      }
    }
  }

  componentDidMount() {
    this.refs.qInputSearch.placeholder = "paste youtube url here"
    this.refs.qInputSearch.focus()

    this._ytre = /(youtu\.be\/|youtube\.com\/(watch\?(.*&)?v=|(embed|v)\/))([^\?&"'>]+)/
  }

  _parseAndNavigate(url) {
    let _v = this._ytre.exec(url)[5]
    const path = `/make/${_v}`
    this.props.onNavigateTo(path)
  }

  render() {
    const { browser } = this.props;
    return (
      <div style={this.state.bgImageStyle} className="o-page landing">
      <h1>MAKE MUSIC VIDEOS</h1>
      <input ref="qInputSearch"></input>
      <button ref="qInputBtn" onClick={()=>{
        let v = this.refs.qInputSearch.value || "https://www.youtube.com/watch?v=oAWxGe1ks4g"
        this._parseAndNavigate(v)
      }}>GO</button>
      </div>
    );
  }
}


export default connect(({ browser }) => ({
  browser,
}), mapDispatchToProps)(LandingPage);
