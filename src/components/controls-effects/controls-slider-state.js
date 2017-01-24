import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import { connect } from 'react-redux';
import Rcslider from 'rc-slider';

import {
  effectChanged,
} from '../../actions/effects';

import Keys from '../../utils/keys';
import Utils from '../../utils/utils';

import {
  CONTROLS_BAR_INCRE,
} from '../../constants/config';

class ControlsSlider extends Component {

  static propTypes = {};

  constructor(props) {
    super(props)
    this.state = {
      selected: false,
      active: false,
      value: 0
    }
  }

  componentDidMount() {
    const { props } = this.props
    this.setState({ value: props.slider.defaultValue })
  }

  componentWillReceiveProps(nextProps) {
    const { effects, keyboard } = nextProps
    const { props, effectChanged } = this.props
    const { key, group, onChange } = props
    let { selected } = effects.get(group)[key]
    let _shiftDown = keyboard.get(Keys.SHIFT.toString())
    if (selected) {
      this.slider.classList.add('is-selected')
    } else {
      this.slider.classList.remove('is-selected')
    }

    if (this.state.selected !== selected) {
      this.setState({
        selected: selected
      })
    }

    //only when the shift is down
    let _upDown = keyboard.get(Keys.UP.toString())
    let _downDown = keyboard.get(Keys.DOWN.toString())
    let _keyPressed = _upDown || _downDown
    let _selected = effects.get('selectedEffect')
    if (selected && !this.state.active &&
      key === _selected.key
    ) {
      //key pressed is set from app.js > effects
      if (_shiftDown || _keyPressed) {
        this.setState({
          value: _selected.value * props.slider.max
        })
      }
    }
  }

  get slider() {
    return this.refs[this.sliderRef].refs.slider
  }

  get sliderHeight(){
    return parseInt(this.slider.offsetHeight,10)
  }

  get sliderRef() {
    const { props } = this.props
    return `slider_${props.key}`
  }
  _onMouseOver(e) {
    this._startY = e.pageY
    this.startValue =  this.state.value
  }
  _onMouseMove(e) {
    const d = this._startY - e.pageY
    const { props } = this.props
    const v = d/this.sliderHeight
    this.setState({
      value: Utils.clamp(this.startValue + v,
        props.min,
        props.max)
    })
  }

  _onMouseOut(e) {

  }

  render() {
    const { props, sliderValue, vertical } = this.props
    let _clasz = (vertical ? "is-vertical" : "is-horizontal")
    return ( < div className = { `controls-slider` }
      onMouseOver = {
        (e) => {
          this._onMouseOver(e)
        }
      }
      onMouseMove = {
        (e) => {
          this._onMouseMove(e)
        }
      }
      onMouseOut = {
        (e) => {
          this._onMouseOut(e)
        }
      } >
      <Rcslider ref = { this.sliderRef }
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
      /> < /div >
    )
  }
}

export default connect(({ effects, keyboard }) => ({
  effects,
  keyboard,
}), {
  effectChanged
})(ControlsSlider);
