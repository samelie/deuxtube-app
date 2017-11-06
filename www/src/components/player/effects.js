import GUI from './GUI';
import _ from 'lodash'
import VideoEffects from 'chewb-video-effects'
import EaseNumbers from '../../utils/easeNumbers'
let _o = {
  texture: {
    type: 'uniform1i',
    value: 0
  },
  texture2: {
    type: 'uniform1i',
    value: 1
  },
  uMixRatio: {
    type: 'float',
    value: 0.01
  },
  uBrightness: {
    type: 'float',
    value: 0.01
  },
  uSaturationKey: {
    type: 'float',
    value: 1.01
  },
  uSaturationMix: {
    type: 'float',
    value: 1.01
  },
  uContrast: {
    type: 'float',
    value: 0.01
  },
  uHue: {
    type: 'float',
    value: 0.0
  },
  uKeyVideoIndex: {
    type: 'int',
    value: 0
  }
}


export default class DeuxEffects {

  constructor(glCanvas, targetEl, source1, source2, options = { width: 640, height: 360, fullscreen: false }) {
    this.videoEffects = new VideoEffects(
      glCanvas,
      targetEl,
      source1,
      source2,
      options
    )
    let _uniforms = this.videoEffects .setUniforms(_o)
    this._uniforms = _uniforms

    let _guiC = {
      uMixRatio: _o.uMixRatio.value,
      uBrightness: _o.uBrightness.value,
      uSaturationKey: _o.uSaturationKey.value,
      uSaturationMix: _o.uSaturationMix.value,
      uContrast: _o.uContrast.value,
      uKeyVideoIndex: _o.uKeyVideoIndex.value,
    }

   /* let gui = new GUI(_guiC)
    gui.addNumber('uMixRatio', 0., 1.01, (changedValue) => {
      _uniforms.uMixRatio = changedValue
    })
    gui.addNumber('uKeyVideoIndex', 0, 1, (changedValue) => {
      _uniforms.uKeyVideoIndex = changedValue
    })
     gui.addNumber('uBrightness',  0., 3.01, (changedValue) => {
      _uniforms.uBrightness = changedValue
    })
     gui.addNumber('uSaturationKey',  0., 8.01, (changedValue) => {
      _uniforms.uSaturationKey = changedValue
    })
     gui.addNumber('uSaturationMix',  0., 8.01, (changedValue) => {
      _uniforms.uSaturationMix = changedValue
    })
      gui.addNumber('uContrast',  0., 3.01, (changedValue) => {
      _uniforms.uContrast = changedValue
    })*/

    this._satKey = EaseNumbers.addNew(_guiC.uSaturationKey.value, 0.3)
  }

  addSource(options) {}

  start() {}

  burst(){
    this._satKey.target = 9
  }

  update(){
    this._uniforms.uSaturationKey = this._satKey.value
  }

  changedValue(key, val){
    this._uniforms[key] = val
  }

  changeKey(){
    let _c = this._uniforms.uKeyVideoIndex || 0
    _c++
    if(_c > 1){
      _c = 0
    }
    this._uniforms.uKeyVideoIndex = _c
    console.log(this._uniforms.uKeyVideoIndex );
  }

  get imageDataArrayBuffer(){
    return this.videoEffects.imageDataArrayBuffer
  }



}
