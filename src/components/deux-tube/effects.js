import _ from 'lodash'
import VideoEffects from '@samelie/video-effects'
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
  uKeyVideoIndex: {
    type: 'int',
    value: 0
  }
}

export default class DeuxEffects {

  constructor(glCanvas, targetEl, options = { width: 640, height: 360, fullscreen: false }) {
    this.glCanvas = glCanvas
    this.targetEl = targetEl
    this.options = options
    this._sources = []
  }

  addSource(el) {
    this._sources.push(el)
  }

  ready(){
    this.videoEffects = new VideoEffects(
      this.glCanvas,
      this.targetEl,
      this._sources[0],
      this._sources[1],
      this.options
    )
    let _uniforms = this.videoEffects .setUniforms(_o)
    this._uniforms = _uniforms
  }

  start() {}

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
