import './media-controls.scss';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import { connect } from 'react-redux';
import Rcslider from 'rc-slider';

import Emitter from '../../utils/emitter'

class MediaControls extends Component {

  static propTypes = {
    browser: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const {slider, value} = this.props
  }

  /*shouldComponentUpdate(nextProps, nextState){
    console.log(nextProps.paused);
    if(nextProps.paused){
      return false
    }
    return true
  }*/

  componentWillUpdate(nextProps, nextState){
    this.refs.slider.value = nextProps.sliderValue
  }

  render() {
    const { browser } = this.props;
    const {slider} = this.props
    const {type, sliderValue, paused} = this.props
    let _comp
    switch(type){
      case 'range':
      _comp = <Rcslider ref="slider" range {...slider} />
      break
      default:
      _comp = <Rcslider ref="slider"  {...slider} value={sliderValue}/>
    }
    return (
      <div ref="mediaControls" className="media-controls u-text-small u-underline">
        <div>{this.props.title}</div>
        {_comp}
      </div>
    );
  }
}

export default connect(({ browser }) => ({
  browser,
}), {})(MediaControls);
