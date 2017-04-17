let Y = require('@samelie/youtube-audio').default
import GUI from './GUI';
import Signals from 'signals';


export default class DeuxTubeAudio {

  constructor(IO) {
    this._audio = new Y(IO)

    const onAmp = (v) => {
      this.onAmpSignal.dispatch(v)
    }


    /*function update() {
      //y.getAmplitude(onAmp)
      y.monitor.update()

      window.requestAnimationFrame(update)
    }


    function initGui() {
      let _guiC = {
        peakThreshold: 0.5,
        minPeakThreshold: 0.3,
        maxPeaks: 20,
        minPeaks: 20,

        dropThreshold: 0.3,
        minDropThreshold: 0.1,
        maxDrops: 20,
        minDrops: 20,
        lowPassFreq: 85,
      }

      let _uniforms = _.clone(_guiC)

      let gui = new GUI(_guiC)
      gui.addNumber('peakThreshold', 0., 1.01, (changedValue) => {
        _uniforms.peakThreshold = changedValue
        y.monitor.setPeaks(y.getPeaks(null, _uniforms))
      })
      gui.addNumber('minPeakThreshold', 0, 1, (changedValue) => {
        _uniforms.minPeakThreshold = changedValue
        y.monitor.setPeaks(y.getPeaks(null, _uniforms))
      })
      gui.addNumber('minPeaks', 10, 70, (changedValue) => {
        _uniforms.minPeaks = changedValue
        y.monitor.setPeaks(y.getPeaks(null, _uniforms))
      })
      gui.addNumber('maxPeaks', 10, 70, (changedValue) => {
        _uniforms.maxPeaks = changedValue
        y.monitor.setPeaks(y.getPeaks(null, _uniforms))
      })
      gui.addNumber('dropThreshold', 0., 1.01, (changedValue) => {
        _uniforms.dropThreshold = changedValue
        y.monitor.setPeaks(y.getPeaks(null, _uniforms))
      })
      gui.addNumber('minDropThreshold', 0., 1.01, (changedValue) => {
        _uniforms.minDropThreshold = changedValue
        y.monitor.setPeaks(y.getPeaks(null, _uniforms))
      })
      gui.addNumber('minDrops', 10, 70, (changedValue) => {
        _uniforms.minDrops = changedValue
        y.monitor.setPeaks(y.getPeaks(null, _uniforms))
      })
      gui.addNumber('maxDrops', 10, 70, (changedValue) => {
        _uniforms.maxDrops = changedValue
        y.monitor.setPeaks(y.getPeaks(null, _uniforms))
      })
      gui.addNumber('lowPassFreq', 10, 300, (changedValue) => {
        _uniforms.lowPassFreq = changedValue
        y.monitor.setPeaks(y.getPeaks(null, _uniforms))
      })
    }*/
  }

  load(videoId, segments = 999, options = {loop: true}) {
    return this._audio.load(videoId, segments, options)
      .then(sound => {
        sound.play()
        this._audio.monitor.setSound(sound)
        return sound
      })
  }

  get audio(){
    return this._audio
  }

  setPeaks(options){
    let _peaks = this.audio.getPeaks(options,null)
    this.audio.setPeaks(_peaks)
  }

  setDrops(options){
    let _peaks = this.audio.getDrops(options,null)
    this.audio.setDrops(_peaks)
  }

  get onPeakSignal(){
    return this.audio.onPeakSignal
  }

  get onDropSignal(){
    return this.audio.onDropSignal
  }

  getAmplitude(cb){
    return this.audio.getAmplitude(cb)
  }

  set audio(a){
     this._audio = a
  }
}
