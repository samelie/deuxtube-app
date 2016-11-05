import './action-button.scss';
import React, { Component } from 'react';
import ReactHtmlParser from 'react-html-parser';

const BUTTON = (props) => {
  return (
    <button className="button button--action" onClick={
      ()=>{
      props.onClick(props.videoId)
    }}>{props.text}</button>
    )
}

export default BUTTON
