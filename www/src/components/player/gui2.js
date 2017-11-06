import * as dg from 'dis-gui';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import { connect } from 'react-redux';

const VERBOSE = true

class Gui2 extends Component {
  render() {
    let { videoOne } = this.props
    let { videoTwo } = this.props
    let { effects } = this.props
    let { record } = this.props
    console.log(this.props);
    return (
      <dg.GUI>
        <dg.Folder label='VideoOne' expanded={true}>
          <dg.Number
              label='stepForward'
              value={2}
              min={0}
              max={20}
              step={1}
              onFinishChange={(value)=> {
                videoOne.stepForward.callback(value)
              }}
            />
             <dg.Number
              label='stepBack'
              value={2}
              min={0}
              max={20}
              step={1}
              onFinishChange={(value)=> {
                videoOne.stepBack.callback(value)
              }}
            />
            <dg.Button
              label='nextVideo'
              onClick={()=> {
                videoOne.nextVideo.callback()
              }}
            />
          <dg.Folder label='Behavior' expanded={true}>
            <dg.Number
              label='timeBeforeCut'
              value={5}
              min={5}
              max={20}
              step={0.1}
              onFinishChange={(value)=> {
                videoOne.behavior.callback('timeBeforeCut', value)
              }}
            />
          </dg.Folder>
        </dg.Folder>
        <dg.Folder label='Effects' expanded={true}>
        <dg.Number
              label='uMixRatio'
              value={0}
              min={0}
              max={1}
              step={0.1}
              onFinishChange={(value)=> {
                effects.callback('uMixRatio', value)
              }}
            />
          <dg.Number
              label='uKeyVideoIndex'
              value={0}
              min={0}
              max={1}
              step={1}
              onFinishChange={(value)=> {
                effects.callback('uKeyVideoIndex', value)
              }}
            />
            <dg.Number
              label='uSaturationKey'
              value={0}
              min={0}
              max={9}
              step={0.1}
              onFinishChange={(value)=> {
                effects.callback('uSaturationKey', value)
              }}
            />
            <dg.Number
              label='uSaturationMix'
              value={0}
              min={0}
              max={9}
              step={0.1}
              onFinishChange={(value)=> {
                effects.callback('uSaturationMix', value)
              }}
            />
        </dg.Folder>
        <dg.Folder label='Record' expanded={true}>
          <dg.Button
              label='record'
              onClick={()=> {
                record.toggle.callback()
              }}
            />
            <dg.Button
              label='save'
              onClick={()=> {
                record.save.callback()
              }}
            />
        </dg.Folder>
      </dg.GUI>

    )
  }
}


export default Gui2
