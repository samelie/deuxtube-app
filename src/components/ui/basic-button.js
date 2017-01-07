import React, { Component } from 'react';
import ReactHtmlParser from 'react-html-parser';

const BUTTON = (props) => {
  return (
    <button tabIndex="-1" className="button button--basic" onClick={
      ()=>{
      props.onClick(props)
    }}>{props.text}</button>
    )
}

export default BUTTON
