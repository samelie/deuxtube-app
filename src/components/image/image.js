import React, { Component } from 'react';
import ReactHtmlParser from 'react-html-parser';

export default (props) => {
  console.log(props);
  return (
    <img src={props.src}></img>
    )
}
