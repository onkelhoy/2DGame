import Vector2D from '../geometry/Vector2D'

export default class GameObject extends Vector2D {
  constructor (x, y) {
    super(x, y)
  }

  renderShape (ctx, color, cb) {
    ctx.beginPath()
    ctx.lineWidth = 1
    ctx.strokeStyle = 'black'

    cb(ctx)
    if (color) {
      ctx.lineWidth = 4
      ctx.strokeStyle = color
    } 
    ctx.stroke()
    ctx.closePath()
  }
}