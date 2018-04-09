import CubicBezierCurve from './CubicBezier'

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
    this.bezier = new CubicBezierCurve(curve[0], curve[1], curve[2], curve[3])
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

const AnimationModes =  {
  LINEAR: [0, 0, 1, 1],
  EASE: [.25, 1, .25, 1],
  EASEIN: [.42, 0, 1, 1],
  EASEOUT: [0, 0, .58, 1],
  EASEINOUT: [.42, 0, .58, 1],
  BOUNCE: [.75, -.5, 0, 1.75]
}

export {
  AnimationModes, Animation
}