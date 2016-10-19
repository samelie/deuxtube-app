import React, { Component } from 'react';
import ReactHtmlParser from 'react-html-parser';

const SEARCH_RESULT = (props) => {
	return (
			<div key={props.videoId} className="query__result">
        	<img onClick={()=>{
							props.onClickHandler(props.videoId)
							}} className="result__image" src={props.image}></img>
		      <div className="result__desc">{props.title}</div>
		      <div className="result__desc"><i>{props.channelTitle}</i></div>
			</div>
		)
}

export default SEARCH_RESULT