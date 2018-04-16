import GameObject from '../../game/GameObject'
import { Vector2 } from '../../geometry/Vector'
import { AnimationMode } from '../Animation'
import { Gravity, Friction, Map } from '../Helper'


export default class Movement extends GameObject {
  constructor (x, y, speed = 5) {
    super(x, y)

    this.speed = speed
    this.velocity = new Vector2(0, 0)
    this.jump = {
      has: false,
      vel: new Vector2(0, 0),
      start: 0
    }

    let moves = 'Left,Right,Up,Down,Jump'.split(/,/)
    for (let m of moves)
      this['move'+m] = false
  }

  MoveX (direction = 1) {
    if (this.jump.has) {
      this.velocity.x = this.speed * .6 * direction
    }
    else {
      this.velocity.x = this.speed * direction
    }
  }
  MoveY (direction = 1) {
    if (!this.jump.has)
      this.velocity.y = direction * this.speed *.85
  }

  Movement () {
    // X position
    if (this.moveLeft) 
      this.MoveX(-1)
    else if (this.moveRight)
      this.MoveX()
    else 
      if (Math.abs(this.velocity.x) > .2)
        if (this.jump.has) // we dont want too much friction effect 
          this.velocity.x *= Friction * .8
        else
          this.velocity.x *= Friction
      else 
        this.velocity.x = 0

    // Y position
    if (this.moveUp)
      this.MoveY(-1)
    else if (this.moveDown)
      this.MoveY()
    else if (!this.jump.has) {
      if (Math.abs(this.velocity.y) > .2)
        this.velocity.y *= Friction
      else 
        this.velocity.y = 0
    }
  }
  Jumping () {
    if (this.moveJump && !this.jump.has) {
      this.jump.has = true
      this.jump.start = this.y
      this.jump.vel.y = -10
      this.velocity.y = 0
      this.y -= 5
    }

    if (this.jump.has) {
      if (Math.abs(this.jump.vel.y) < 15) 
        this.jump.vel.y += Gravity + Gravity * 1.3 * Map(Math.sign(this.jump.vel.y), -1, 1, 0, 1)
      
      if (this.y >= this.jump.start) {
        this.jump.has = false
        this.jump.vel.Reset(0, 0)
        this.y = this.jump.start
      }
    }
  } 

  update () {
    this.Movement()
    this.Jumping()
    

    this.addFrom(this.velocity)
    this.addFrom(this.jump.vel)
  }

  render (ctx) {
    // draw shadow
    if (this.jump.has) {
      let d = Map(this.jump.start - this.y, 0, 100, 0, 1)
      this.renderShape(ctx, 'rgba(0, 0, 0, .2', 'fill',
        draw => draw.rect(this.x - d * 5, this.jump.start + 75, 40 + d * 10, 10)
      )
    }
  }
}