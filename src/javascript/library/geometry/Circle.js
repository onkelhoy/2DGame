import GameObject from '../game/GameObject'

export default class Circle extends GameObject {
  constructor (x, y, r) {
    super(x, y)
    this.r = r
  }

  render (ctx, color) {
    this.renderShape(ctx, color, 
      draw => draw.arc(this.x, this.y, this.r, 0, Math.PI * 2)
    )
  }
}