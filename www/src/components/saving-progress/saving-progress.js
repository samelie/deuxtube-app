import './saving-progress.scss';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import { connect } from 'react-redux';

import Emitter from '../../utils/emitter'

class Controls extends Component {

  static propTypes = {
    browser: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props)
    this.state = {
      progress: 0
    }
  }

  componentDidMount() {
    const { info } = this.props;
    this.setState({ progress: info.progress })
  }

  componentWillReceiveProps(props) {
    console.log(props);
    this.setState({ progress: props.info.progress })
  }

  componentWillUpdate(props){
    console.log(props);
  }

  render() {
    const { browser, info } = this.props;
    return (
      <div ref="saving" className="o-page saving-progress">
        <p>is uploading: please saty on this page</p>
        <div>{info.progress}</div>
      </div>
    );
  }
}

export default connect(({ browser }) => ({
  browser,
}), {})(Controls);
