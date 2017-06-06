import { Player, Controller } from 'chewb-dash-player'
import _ from 'lodash'
export default class DeuxPlayer {

  constructor(options) {
    this.controller = new Controller({
      socket: options.socket,
      el: options.el
    })
  }

  addSource(options) {
    this.controller.addSource(options)
  }

  start() {
    this.vjPlayer = new Player(this.controller)
    return this.vjPlayer
  }

  get mediaSources() {
    return this.vjPlayer.mediaSources
  }

  get controllers() {
    return this.vjPlayer.controllers
  }

}
