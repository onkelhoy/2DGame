import GameObject from '../game/GameObject'
import { Animate } from '../util/Animation'
import { Vector2 } from '../geometry/Vector'

export default class ParticleSystem extends GameObject {
  /**
   * x = 0, y = 0, duration = 1000, spawn = [], // array of obj for new particle systems [[x, y, []], [x, y, []], ..]
    interval = 100, intervalRandomFactor = .1, particleBurst = 1,
    particleDuration = 1000, particleDurationFactor = .3, particleSpawnRadius = 0, // how far from emitter point 
    spread = Math.PI / 3, tilt = Math.PI / 2, startAngle = undefined, endAngle = undefined,
    loop = true, intesity = 1, particleDistance, particleDistanceFactor = .1,
    speed = 3, speedFactor = .1, size = 5, sizeFactor = .1, sizeCurve, 
    color = [[100, 149, 237, 0], [100, 149, 237, 1]], colorFactor = .1, colorCurve 
   * @param {Number} x 
   * @param {Number} y 
   * @param {Array} emitterSettings 
   */
  constructor (x, y, ...emitterSettings) {
    super(x, y)

    this.emitters = []
    for (let es of emitterSettings) {
      if (es.x === undefined) {
        es.x = this.x 
        es.y = this.y
      }
      this.emitters.push(new ParticleEmitter(this, es))
    }
  }

  set Tilt (value) {
    for (let e of this.emitters)
      e.Tilt = value
  }

  move (x, y) {
    // move all emitters also (with respect to offset)
  }
  updateE (emitter) {
    emitter.update()
  }
  render (ctx) {
    for (let i=0; i<this.emitters.length; i++) {
      let e = this.emitters[i]
      if (e.duration && new Date().getTime() - e.start >= e.duration) {
        if (e.waitForParticles && e.particles.length > 0) {
          e.render(ctx) // keep render till all particles are gone.. 
          e.dead = true
        } else {
          this.emitters.splice(i, 1)
          i--
        }
      } else {
        this.updateE(e)
        e.render(ctx)
      }
    }
  }
}

class ParticleEmitter extends GameObject {
  constructor (parentsystem, {
    x = 0, y = 0, duration = 1000, trail, spawn, interval = 100, sizeFactor = .1, speedFactor = .1, 
    intervalRandomFactor = .1, particleBurst = 1, particleDuration = 1000,  size = 5, speed = 3, 
    particleDurationFactor = .3, particleSpawnRadius = 0, // how far from emitter point 
    spread = Math.PI / 3, tilt = Math.PI / 2, startAngle = undefined, endAngle = undefined,
    loop = true, intesity = 1, particleDistance, particleDistanceFactor = .1, sizeCurve, 
    color = [[100, 149, 237, 0], [100, 149, 237, 1]], colorFactor = .1, colorCurve,
    gravity = 0, waitForParticles = true, colorDuration = 1000, sizeDuration = 1000,
    accerelation = 1, accerelationCurve, accerelationFactor = 0, accerelationDuration = 1000
  } = {}) {
    super(x, y)

    this.waitForParticles = waitForParticles
    this.dead = false
    this.offset = Vector2.Delta(this.position, parentsystem.position)
    this.particles = []
    this.duration = loop ? undefined : duration
    this.spawn = spawn
    this.it = interval // fixed timestamp for interval
    this.itf = intervalRandomFactor // % of interval that should be random
    this.particleBurst = particleBurst // the number of particles spawn at one time

    // particle settings
    this.pd = Math.min(particleDuration, duration) // cant exceed the lifetime of system
    this.pdf = particleDurationFactor
    this.mode = 'time'
    this.speed = speed 
    this.gravity = gravity
    this.speedFactor = speedFactor
    this.spawn_data = spawn
    this.trail_data = trail
    if (particleDistance) {
      this.mode = 'distance'
      this.pd = particleDistance
      this.pdf = particleDistanceFactor
    }
    this.radius = particleSpawnRadius
    this.psize = {
      value: size,
      factor: sizeFactor,
      curve: sizeCurve,
      duration: sizeDuration
    }
    this.pcolor = {
      value: color,
      curve: colorCurve,
      factor: colorFactor,
      duration: colorDuration
    }
    this.pacc = {
      value: accerelation,
      curve: accerelationCurve,
      factor: accerelationFactor,
      duration: accerelationDuration
    }

    // radius settings
    this.tilt = tilt
    this.spread = spread
    if (startAngle !== undefined) {
      this.tilt = (startAngle + endAngle) / 2
      this.spread = (endAngle - startAngle) / 2
    }

    this.tilt -= this.spread
    this.spread *= 2
    this.start = new Date().getTime()
    this.spawns = []

    this.nextSpawn()
  }

  // Getters & Setters
  // particle helper functions
  get ParticlePos () {
    let angle = -(this.tilt + this.spread * Math.random())// + Math.random() * this.spread) // angle based on tilt & spread
    return {
      x: this.x + Math.cos(angle) * Math.random() * this.radius,
      y: this.y + Math.sin(angle) * Math.random() * this.radius,
      angle
    }
  }
  get ParticleLimit () {
    if (this.mode === 'time')
      return 
  }
  get NewParticle () {
    let data = this.ParticlePos // use Object.assign(data, otherdata)
    data.speed = this.speed - this.speed * this.speedFactor + this.speed * this.speedFactor * 2 * Math.random()
    data.duration = this.pd - this.pd * this.pdf * Math.random()
    data.animations = {}

    this.setParticleSize(data)
    this.setParticleColor(data)
    this.setParticleAccerelation(data)
    data.spawn_data = this.spawn_data
    data.trail_data = this.trail_data
    
    return new Particle(data)
  }

  set Tilt (value) {
    
    this.tilt = value - this.spread / 2
  }
  // particle animations (if any..)
  setParticleSize (data) {
    let s = this.psize
    if (s.curve) {
      data.animations['_size'] = new Animate({
        values: s.value, index: Math.floor(s.value.length * s.factor * Math.random()),
        curve: s.curve, duration: s.duration
      })

      return
    } 

    data._size = s.value - s.value * s.factor + s.value * 2 * s.factor * Math.random()
  }
  setParticleColor (data) {
    let c = this.pcolor
    if (c.curve) {
      data.animations['color'] = new Animate({
        values: c.value, index: Math.floor(c.value.length * c.factor * Math.random()),
        curve: c.curve, duration: c.duration
      })

      return
    } 
    if (c.value instanceof Array)
    {
      let index = Math.round(Math.random() * (c.value.length-1) * c.factor)
      data.color = c.value[index]
      return 
    }

    data.color = c.value
  }
  setParticleAccerelation (data) {
    if (this.pacc.curve) {
      let a = this.pacc
      data.animations['accerelation'] = new Animate({
        values: a.value, index: Math.floor(a.value.length * a.factor * Math.random()),
        curve: a.curve, duration: a.duration
      })

      return
    }

    data.accerelation = this.pacc.value
  }

  // emitter methods
  nextSpawn () {
    this.istart = new Date().getTime()
    this.next = this.it - this.it * this.itf + Math.random() * this.itf * 2 * this.it
  }
  update () {
    let difference = new Date().getTime() - this.istart
    if (difference >= this.next) {
      this.nextSpawn()

      for (let i = 0; i < this.particleBurst; i++) {
        this.particles.push(this.NewParticle)
      }
    }
  }
  updateP (p) {
    p.velocity.y += this.gravity
    p.update()
    if (p.color instanceof Array)
      p.color = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${p.color[3] !== undefined ? p.color[3] : 1})`
  }
  
  render (ctx) {
    for (let i=0; i<this.particles.length; i++) {
      let p = this.particles[i]
      if (
          this.mode === 'time' && new Date().getTime() - p.start >= p.duration ||
          this.mode === 'distance' && this.distance(p) >= p.duration
        ) {
        if (this.particles[i].spawn_data)
          this.spawns.push(this.particles[i].spawn())
        this.particles.splice(i, 1)
        i--
      } else {
        this.updateP(p) // to separete it abit 
        p.render(ctx)
      }
    }

    for (let s of this.spawns)
      s.render(ctx)
  }
}

class Particle extends GameObject {
  constructor ({
      x, y, speed, angle, duration = 1000, accerelation = 0,
      color = 'cornflowerblue', size = 3, animations, trail_data, spawn_data
    } = {}) {
    super(x, y)

    this.velocity = new Vector2(speed, 0)
    this.velocity.Angle = angle
    this.duration = duration
    this.start = new Date().getTime()

    this.color = color
    this._size = size
    this.animations = animations
    this.accerelation = accerelation
    
    // Particle Systems
    if (trail_data) this.trail_obj = new ParticleEmitter(this, trail_data)

    this.spawn_data = spawn_data
  }

  update () {
    this.addFrom(this.velocity)
    for (let key in this.animations) {
      this[key] = this.animations[key].animate()
    }
    
    this.velocity.scale(this.accerelation)
  }

  spawn () {
    this.spawn_data.x = this.x 
    this.spawn_data.y = this.y
    return new ParticleSystem(this.x, this.y, this.spawn_data)
  }
  trail (ctx) {
    this.trail_obj.x = this.x
    this.trail_obj.y = this.y
    
    this.trail_obj.Tilt = -this.velocity.Angle + Math.PI
    this.trail_obj.update()
    this.trail_obj.render(ctx)
  }

  render (ctx) {
    if (this.trail_obj) 
      this.trail(ctx) 

    // super.render(ctx, this._size, this.color)
    super.renderShape(ctx, this.color, 'fill', 
      draw => draw.rect(this.x - this._size, this.y - this._size, this._size*2, this._size*2)
    )
  }
}