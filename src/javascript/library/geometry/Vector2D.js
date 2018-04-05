import Vector from './Vector'

export default class Vector2D extends Vector {
  constructor (x, y) {
    super([x, y])
  }
  
  static toVector (obj) {
    if (obj.hasOwnProperty('x') && obj.hasOwnProperty('y')) {
      return new Vector2D(obj.x, obj.y)
    }
    throw Error('x and y not defined in object')
  }
  static toVector2D (v) {
    if (v.hasOwnProperty('dimensions')) {
      if (v.dimensions.length < 2) throw Error('not enough dimensions for 2D')
      return new Vector2D(v.dimensions[0], v.dimensions[1])
    }
    throw Error('dimensions not defined in object')
  }

  get x () {
    return this.dimensions[0]
  }
  get y () {
    return this.dimensions[1]
  }

  set x (value) {
    this.dimensions[0] = value
  }
  set y (value) {
    this.dimensions[1] = value
  }

  disp () {
    console.log({x: this.x, y: this.y})
  }
}