import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import { connect } from 'react-redux';
import Rcslider from 'rc-slider';

class ControlsEffectsBlend extends Component {

  static propTypes = {};

  constructor(props) {
    super(props)
    this.state = {
      modes: [],
      active: {
        name: ""
      }
    }
  }

  componentDidMount() {
    const { modes } = this.props
    let _m = []
    _.forIn(modes, (val, key) => {
      _m.push(
        Object.assign({}, val, { name: key })
      )
    })
    this.setState({
      modes: _m,
      //first
      active: {
        name: _m[0].name
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    let { effects } = nextProps
    let updatedEffect = effects.get('updatedEffect')
    if (updatedEffect.key === 'uBlendMode') {
      //from the mousepad
      let _index = updatedEffect.value;
      if(!Number.isInteger(_index)) {
        _index = Math.floor(this.state.modes.length * updatedEffect.value)
      }
      let _e = this.state.modes[_index]
      this.setState({
        active: {
          name: _e.name
        }
      })
    }
  }

  render() {
    const { modes, modeChanged } = this.props

    return (
      <div className="controls-effects__blend">
          <div>{this.state.active.name}</div>
      </div>
    )
  }

}

export default connect(({ effects }) => ({
  effects
}), {})(ControlsEffectsBlend);
