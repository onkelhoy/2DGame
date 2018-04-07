import { Vector2 } from '../../geometry/Vector'

export default class Movement extends Vector2 {
  constructor (x, y, speed = 5) {
    super(x, y)
    this.velocity = new Vector2(speed, 0)
  }

  // getters
  get position () { return this }

  moveTo (pos) {
    // get the angle, set it to the velocity & add to position
    this.velocity.Angle = Vector2.AngleBetween(this, pos) // checks if it is Vector2
    this.move()
  }
  move () {
    this.addFrom(this.velocity)
  }
}