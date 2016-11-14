import React, { Component, PropTypes } from 'react';
import Rcslider from 'rc-slider';

const CONTROLS_SLIDER = (props) => {
  return (
    <Rcslider className="effects-slider"
     ref={props.key}
     key={props.key}
     onChange={(val)=>{
        props.onChange(props,val)
     }}
     vertical
        {...Object.assign({},props.slider)}
   />
  )
}

export default CONTROLS_SLIDER
