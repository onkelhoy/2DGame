import Event from './Event'

export default class Game {
  constructor () {
    this.canvas = document.querySelector('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.width = this.canvas.width = window.innerWidth
    this.height = this.canvas.height = window.innerHeight
  
    this.Input = new Event(this.canvas)
  }
  
  clear () {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }
}