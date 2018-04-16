import GameObject from './GameObject'
import { Vector2 } from '../geometry/Vector'
import { Random } from '../util/Helper'

export default class Camera extends GameObject {
  /**
   * smoothness is in range of [0, 1]
   * 
   * @param {Number} x 
   * @param {Number} y 
   * @param {Object} settings 
   */
  constructor (x, y, {
    width = window.innerWidth, height = window.innerHeight
  } = {}) {
    super(x, y)

    this.w = width
    this.h = height
    this.renderDistance = Math.max(width, height)
    this.ratio = width / height // in case of dynamic window size changes
    this.smoothSpeed = 0
    this.desired = undefined
    this.offset = null
    this.shake = {x: 0, y: 0, shaking: false}
  }

  // Getters & Setters
  get Viewport () {
    return { x: this.x, y: this.y, w: this.w, h: this.h }
  }
  set Transform (pos) {
    this.x = pos.x
    this.y = pos.y
  }

  /**
   * screenOffset is often offset from corner to center
   * boundaryOffset is player offset to it's own center
   * 
   * @param {Coordinate2D} position 
   * @param {Object} settings 
   */
  Follow (position, {
      screenOffset = {x: this.w/2, y: this.h/2},
      boundaryOffset = {x: 0, y: 0}, smoothSpeed = .1
    } = {}) {
    this.smoothSpeed = smoothSpeed
    this.desired = position
    this.offset = Vector2.toVector({ x: screenOffset.x - boundaryOffset.x, y: screenOffset.y - boundaryOffset.x })
  }

  Shake (duration = 10, magnitude = 4) {
    this.shake.shaking = true 
    this.shake.start = new Date().getTime()
    this.shake.duration = duration
    this.shake.magnitude = magnitude
  }

  render (ctx) {
    // we want to update the follow object first then camera!, so we put this here
    if (this.desired) 
      this.Transform = Vector2.Lerp(this, this.desired.subtract(this.offset), this.smoothSpeed)
    
    if (this.shake.shaking) {
      this.shake.x = Random.range(-1, 1) * this.shake.magnitude
      this.shake.y = Random.range(-1, 1) * this.shake.magnitude

      let difference = new Date().getTime() - this.shake.start 
      if (difference >= this.shake.duration) {
        this.shake.shaking = false 
        this.shake.x = 0
        this.shake.y = 0 
      } else {
        console.log(difference, this.shake.duration);
        
      }
    }

    ctx.beginPath()
    ctx.save()
    ctx.translate(-this.x + this.shake.x, -this.y + this.shake.y)
  }
  restore (ctx) {
    ctx.restore()
  }
}