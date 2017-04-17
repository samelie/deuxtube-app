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
  uThreshold: {
    type: 'float',
    value: 0.7
  },
  uKeyVideoIndex: {
    type: 'int',
    value: 0
  },

  uColorEffectsOne: {
    type: 'float',
    value: 1.
  },
  uColorEffectsTwo: {
    type: 'float',
    value: 1.
  },
  uBrightness: {
    type: 'float',
    value: 0.01
  },
  uSaturation: {
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
  uBrightnessOne: {
    type: 'float',
    value: 0.01
  },
  uSaturationOne: {
    type: 'float',
    value: 1.01
  },
  uContrastOne: {
    type: 'float',
    value: 0.01
  },
  uHueOne: {
    type: 'float',
    value: 0.0
  },
  uBrightnessTwo: {
    type: 'float',
    value: 0.01
  },
  uSaturationTwo: {
    type: 'float',
    value: 1.01
  },
  uContrastTwo: {
    type: 'float',
    value: 0.01
  },
  uHueTwo: {
    type: 'float',
    value: 0.0
  },

  uBlendMode: {
    type: 'int',
    value: 0
  },
  uBlendOpacity: {
    type: 'float',
    value: 1.0
  },
  uBlendMix: {
    type: 'float',
    value: 1.0
  },

}

export default class DeuxEffects {

  constructor(glCanvas, targetEl, options = { width: 640, height: 360, fullscreen: false }) {
    this.glCanvas = glCanvas
    this.targetEl = targetEl
    this.options = options
    this._sources = []

    this._sharedEffects = [
      "uBrightness", "uSaturation", "uContrast", "uHue",
    ]
  }

  addSource(el) {
    this._sources.push(el)
  }

  ready(obj) {
    this.videoEffects = new window.VideoEffects(
      this.glCanvas,
      this.targetEl,
      this._sources[0],
      this._sources[1],
      this.options
    )
    let _uniforms = this.videoEffects
      .setUniforms(
        Object.assign({}, obj, _o)
      )
    this._uniforms = _uniforms
  }

  setUniforms(obj) {
    console.log(obj);
  }

  start() {}

  update() {
    this._uniforms.uSaturationKey = this._satKey.value
  }

  changedValue(key, val) {
    if (key) {
      this._uniforms[key] = val
    }
  }

  changeKey() {
    let _c = this._uniforms.uKeyVideoIndex || 0
    _c++
    if (_c > 1) {
      _c = 0
    }
    this._uniforms.uKeyVideoIndex = _c
  }

  pause() {
    this.videoEffects.pause()
  }

  resume() {
    this.videoEffects.resume()
  }

  get imageDataArrayBuffer() {
    return this.videoEffects.imageDataArrayBuffer
  }

  getDataURL(enc, q) {
    return this.videoEffects.getDataURL(enc, q)
  }

  get pixels(){
    return this.videoEffects.pixels
  }


  get sharedEffects(){
    return this._sharedEffects
  }


}
