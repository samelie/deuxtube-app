import React, { Component } from 'react';
import ReactHtmlParser from 'react-html-parser';

const BUTTON = (props) => {
  const c = props.classes || props.className || ""
  return (
    <button tabIndex="-1" className={`button button--action button--basic ${c}`} onClick={
      ()=>{
      props.onClick(props)
    }}>{props.text}</button>
    )
}

export default BUTTON
