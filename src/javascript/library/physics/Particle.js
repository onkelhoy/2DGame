import { Vector2 } from '../geometry/Vector'
import GameObject from '../game/GameObject'
import Noise from '../util/Noise'

export default class ParticleSystem extends GameObject {
  /**
   * 
   * @param {Number} x 
   * @param {Number} y 
   * @param {ParticleEmmiter} emitters 
   */
  constructor (x, y, ...emitters) {
    super(x, y)
    // emiters is a  
  }

  update () {

  }
  render (ctx) {
    for (let p of this.particles) {
      p.render(ctx)
    }
  }
}

class ParticleEmitter extends GameObject {
  /**
   * 
   * @param {Number} x 
   * @param {Number} y 
   * @param {lifetime=sec, spawn=ParticleSystem, particleLife=sec, count=Number, color=Array|String, deform=Array|Number} Emitter 
   */
  constructor (x, y, {
    tilt = Math.PI / 2, spread = Math.PI / 3, offsetRadius = 5,
    startAngle = undefined, endAngle = undefined, lifetime = Infinity, 
    intensity = .3, count = 100, maxCount = 1000, particleLife = 1, spawn = null, 
    color = [{R:39, G:58, B:93, A:0}, {R:39, G:58, B:93, A:1}],
    spriteSheet = null, spriteType = 'time', gravity = 0, noise = 0, 
    deform = [.5, 1], size = 5, sizeRandom = .3, speed = 5, speedRandom = .2,
    startRotation = 0, endRotation = 0
  } = {}) {
    super(x, y)
    
    this.tilt = tilt
    this.spread = spread
    this.color = color
    this.speed = speed 
    this.speedRandom = speedRandom
    this.size = size
    this.deform = deform
    this.sizeRandom = sizeRandom
    this.gravity = gravity
    this.noise = noise
    this.spawn = spawn 
    this.lifetime = lifetime
    this.intensity = intensity
    this.offsetRadius = offsetRadius

    this.start = new Date().getTime()
    this.setInterval()
    
    this.particles = []
    if (startAngle !== undefined) {
      this.tilt = (startAngle + endAngle) / 2
      this.spread = (endAngle - startAngle) / 2
    }

    this.tilt -= this.spread
    this.spread *= 2
  }

  setInterval () {

  }

  update () {
    let delta = new Date().getTime() - this.start 
    for (let i=0; i<this.particles.length; i++) {

    }

    if (delta > this.interval) {
      let p = this.SpawnParticle()
      this.particles.push(p)
      this.setInterval()
      if (this.particles.length > this.maxCount)
        this.particles.splice(0, this.maxCount - this.particles.length)
    }
  }

  get ColorP () {

  }
  get PositionP () {
    let pos = new Vector2(this.offsetRadius * Math.random(), 0)
    pos.Angle = Math.random() * this.spread + this.tilt
    return pos
  }
  SpawnParticle () {
    let pos = this.PositionP
    let size = 2
    let rotation = 2
    let color = this.ColorP

    return new Particle(pos.x, pos.y, {angle: pos.Angle, size:size})
  }
}
class Particle extends GameObject {
  constructor (x, y, angle, speed, size = 5, color = 'cornflowerblue', image = null) {
    super(x, y)
    this.velocity.x = speed
    this.velocity.Angle = angle

    this.size = size
    this.image = image
    this.color = color
    this.start = new Date().getTime()
  }

  set force (force) {
    this.velocity.addFrom(force)
  }
  update () {
    this.addFrom(this.velocity)
  }
  render (ctx) {
    this.renderShape(ctx, this.color, mode = 'fill',
      draw => ctx.arc(this.x, this.y, this.size, 0, Math.PI*2)
    )
  }
}