export default class Game {
  constructor () {
    this.canvas = document.querySelector('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.width = this.canvas.width = window.innerWidth
    this.height = this.canvas.height = window.innerHeight
    this.center = {
      x: this.width / 2,
      y: this.height / 2
    }
  }
  
  loadImage (src) {
    return new Promise((resolve, reject) => {
      let img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src 
    })
  }
  clear () {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }
}