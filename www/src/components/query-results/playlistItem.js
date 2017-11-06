import React, { Component } from 'react';
import ReactHtmlParser from 'react-html-parser';

const smallImageUrl = (id) => (`https://img.youtube.com/vi/${id}/3.jpg`)

const ITEM = (props) => {
  return (
    <img className="video-playlist__image"

    onClick={
      ()=>{
      props.onClick(props.videoId)
    }}

    onMouseOver={
      ()=>{
        if(props.onOver){
          props.onOver(props.videoId)
        }
    }}

    src={smallImageUrl(props.videoId)}></img>
    )
}

export default ITEM
