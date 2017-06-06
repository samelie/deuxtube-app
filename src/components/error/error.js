import './error.scss';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import { connect } from 'react-redux';



class ErrorComp extends Component {

  static propTypes = {
  error: PropTypes.object.isRequired
 };

  constructor(props) {
    super(props)

    this.state = {
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      error
    } = nextProps;
    this.setState({text:error.get('text')})
  }

  render() {
    if(!this.state.text) return null
      return (
        <div ref="error" className="chewb-error">
          <span>{this.state.text}</span>
        </div>
      );
  }
}

export default connect(({ error }) => ({
  error,
}),{})(ErrorComp);
