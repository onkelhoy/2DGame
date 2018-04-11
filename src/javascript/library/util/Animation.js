import CubicBezierCurve from './CubicBezier'
import { Map } from '../util/Helper'

class Animation {
  /**
   * 
   * @param {Object} obj 
   * @param {Object} goal 
   * @param {duration=sec, curve=animation curve} settings 
   */
  constructor (obj, goal, {
      curve = [0, 0, 1, 1], duration = 1000, not = [],
      loop = false, backwards = false, forwards = true, 
      continuous = true // if loop then instead of reset it travels back
    } = {}) { // linear
    this.goals = []
    
    
    this.duration = duration
    this.bezier = CubicBezierCurve.FromArray(curve)
    this.start = new Date().getTime()

    this.direction = !forwards ? -1 : backwards ? -1 : 1
    
    this.loop = loop 
    this.continuous = continuous
    this.finish = false 
    this.iterateObj(obj, goal, not, this.direction === -1)
  }

  iterateObj (o, g, not, backwards) {
    let current = {
      obj: o,
      ite: []
    }
    for (let k in g) {
      if (o[k] && g[k]) {
        if (typeof g[k] === 'object' && !not[k])
          this.iterateObj(o[k], g[k], not, backwards) // iterate this object
        else if (typeof o[k] === 'number') {

          current.ite.push({
            path: k,
            start: o[k],
            goal: g[k] - o[k] 
          })
        }
      }
    }
    if (current.ite.length > 0) this.goals.push(current)
  }

  update () {
    let time_progress = (new Date().getTime() - this.start) / this.duration
    if (time_progress <= 1) {
      let pogression = this.bezier.Pogression(time_progress)
      
      this.iterate(k => k.start + k.goal * (this.direction === -1) + k.goal * pogression * this.direction)
      return false
    } // maybe something with looping here later (needs more settings later)
    
    if (this.loop) {
      this.start = new Date().getTime()
      if (this.continuous) 
        this.direction *= -1
      else 
        this.direction = 1
    }

    // go back!
    if (!this.finish) {
      this.finish = !this.loop
      if (this.finish && this.continuous) this.direction = -1
      this.iterate(k => k.start + k.goal * (this.direction === -1)) // if loop & backwards then reset to start
    }
    
    return true
  }

  iterate (fn) {
    for (let x of this.goals)
        for (let k of x.ite)
          x.obj[k.path] = fn(k)
  }
}

class Animate {
  constructor ({
      index = 0, values, curve = AnimationModes.LINEAR, duration = 1000,
      loop = false, steps
    } = {}) {
    this.offset = index 
    this.values = values
    
    this.duration = duration
    this.bezier = CubicBezierCurve.FromArray(curve)
    this.loop = loop
    
    this.start = new Date().getTime()
    this.indexList = []
    this.steps = []

    let l = values.length
    if (steps) l = steps.length
    // store both index entry as well as the pogress so we can later map by the correct index
    for (let i=0; i<=l; i++) {
      let t = steps ? steps[i] : i / values.length
      let c = this.bezier.coords(t)

      this.indexList.push(c.x)
      this.steps.push(c.y)
    }
    if (this.values.length === 2) {
      this.indexList = [0, 1]
      this.steps = [0, 1]
    }
  }

  /**
   * This takes the x & y value of the bezier curve based on the input curve
   * takes the index from x and maps the current value to the next value based on y
   */
  animate () {
    const t = (new Date().getTime() - this.start) / this.duration
    const size = this.values.length - 1
    if (!this.loop && t >= 1) // we reaced the goal
      return this.values[size]

    let curve = this.bezier.coords(t)
    let index = Math.floor(curve.x * (size + 1)) + this.offset
    for (let i=0; i<this.indexList.length-1; i++) {
      if (curve.x >= this.indexList[i] && curve.x <= this.indexList[i+1])
        index = i
    }
    let next = index+1
    
    if (this.loop) { // then we loop 
      if (index >= size) {
        next = 0
        this.start = new Date().getTime()
      }
    } else if (index >= size)  // if we passed
      return this.values[size]
    
    let min = this.values[index], max = this.values[next]
    if (min instanceof Array) {
      let value = []
      // console.log(curve.y, this.steps[index], this.steps[next], min, max)
      
      for (let i=0; i<min.length; i++)
        value.push(Map(curve.y, this.steps[index], this.steps[next], min[i], max[i]))
      return value 
    }

    return Map(curve.y, this.steps[index], this.steps[next], min, max)
  }

}

const AnimationModes =  {
  LINEAR: [0, 0, 1, 1],
  EASE: [.25, 1, .25, 1],
  EASEIN: [.42, 0, 1, 1],
  EASEOUT: [0, 0, .58, 1],
  EASEINOUT: [.42, 0, .58, 1],
  BOUNCE: [.75, -.5, 0, 1.75]
}

export {
  AnimationModes, Animation, Animate
}