import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import { connect } from 'react-redux';
import Rcslider from 'rc-slider';

import {
  effectChanged,
} from '../../actions/effects';

class ControlsSlider extends Component {

  static propTypes = {};

  constructor(props) {
    super(props)
    this.state = {
      active: false,
      value: 0
    }
  }

  componentDidMount() {
    const { props } = this.props
    this.setState({ value: props.defaultValue })
  }

  componentWillReceiveProps(nextProps) {
    const { effects } = nextProps
    const { props, effectChanged } = this.props
    const { key, group } = props
    let { selected } = effects.get(group)[key]
    if (selected) {
      this.slider.classList.add('is-selected')
    } else {
      this.slider.classList.remove('is-selected')
    }

    let _selected = effects.get('selectedEffect')
    if (selected && !this.state.active &&
      key === _selected.key
    ) {
      this.setState({
        value: _selected.value * props.slider.max
      })
    }
  }

  get slider() {
    return this.refs[this.sliderRef].refs.slider
  }

  get sliderRef() {
    const { props } = this.props
    return `slider_${props.key}`
  }

  render() {
    const { props, sliderValue, vertical } = this.props
    let _clasz = (vertical ? "is-vertical" : "is-horizontal")
    return ( < Rcslider ref = { this.sliderRef }
      className = { `effects-slider ${_clasz}` }
      onChange = {
        (val) => {
          this.setState({
            active: true,
            value: val
          })
          props.onChange(props, val)
        }
      }
      value = { this.state.value }
      onAfterChange = {
        (val) => {
          this.setState({
            active: false,
            value: val
          })
        }
      }
      vertical = { vertical } {...Object.assign({}, props.slider) }
      />
    )
  }
}

export default connect(({ effects }) => ({
  effects,
}), {
  effectChanged
})(ControlsSlider);
