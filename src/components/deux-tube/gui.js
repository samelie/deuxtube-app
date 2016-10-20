import * as dg from 'dis-gui';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import { connect } from 'react-redux';

const VERBOSE = true

class Gui extends Component {
  render() {
    let { effects } = this.props
    return (
      <dg.GUI>
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
      </dg.GUI>

    )
  }
}


export default Gui
