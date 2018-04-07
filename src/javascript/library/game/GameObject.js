import { Vector2 } from '../geometry/Vector'

export default class GameObject extends Vector2 {
  constructor (x, y) {
    super(x, y)
    this.velocity = new Vector2(0, 0)
  }

  get position () { return this }

  renderShape (ctx, color = 'black', mode = 'stroke', cb, lineWidth = 1) {
    ctx.beginPath()
      cb(ctx)
      ctx.lineWidth = lineWidth
      ctx[mode+'Style'] = color
      ctx[mode]()
    ctx.closePath()
  }
}