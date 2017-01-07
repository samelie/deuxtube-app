import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import { connect } from 'react-redux';

const MAX_CHAR_LIMIT = 45
class MakeStatus extends Component {

  constructor(props) {
    super(props)

    this.state = {
      status: ""
    }
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    const { makeStatus } = nextProps
    const {item, action} = makeStatus.get('makeStatus')
    if(item){
      const title = item.snippet.title.substring(0, MAX_CHAR_LIMIT)
      this.setState({
        status:`${title} ${action}`
      })
    }
  }

  render() {
    return (
      <div className = "make-status">
        {this.state.status}
       </div>
    )
  }
}

export default connect(({makeStatus}) => ({
  makeStatus,
}))(MakeStatus);
