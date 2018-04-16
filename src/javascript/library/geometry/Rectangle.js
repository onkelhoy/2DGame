import GameObject from '../game/GameObject'

export default class Rectangle extends GameObject {
  constructor (x, y, w, h) {
    super(x, y)
    this.w = w
    this.h = h 
  }

  render (ctx, color, mode) {
    this.renderShape(ctx, color, mode, 
      draw => draw.rect(this.x, this.y, this.w, this.h)
    )
  }

  renderCorners (ctx) {
    let corners = [
      {x: this.x, y: this.y}, 
      {x: this.x+this.w, y: this.y}, 
      {x: this.x, y: this.y+this.h}, 
      {x: this.x+this.w, y: this.y+this.h}
    ]

    for (let c of corners) {
      this.renderShape(ctx, undefined, 
        draw => draw.arc(c.x, c.y, 3, 0, Math.PI * 2)
      )
    }
  }
}