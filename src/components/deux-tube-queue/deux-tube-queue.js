import './deux-tube.scss';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import { connect } from 'react-redux';

import Socket from '../../utils/socket';
import Emitter from '../../utils/emitter'
const VERBOSE = false
class DeuxTubeQueue extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
  }

  render() {
    const { browser } = this.props;
    return (
      <div ref="deuxTubeQueue" className="deux-tube-queue">
      </div>
    );
  }
}

export default connect(({ browser }) => ({
  browser,
}), {})(DeuxTubeQueue);
