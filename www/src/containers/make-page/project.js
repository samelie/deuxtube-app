import React, { Component } from 'react';
import ReactHtmlParser from 'react-html-parser';

const PROJECT = (props) => {
	return (
		<div key={props.projectId} className="project" >
            <a className="project__title project__link"href={`${props.href}`} target="_blank">
            {props.projectName}
            </a>
            <div className="project__desc">{props.projectDesc}</div>
          </div>
		)
}

export default PROJECT