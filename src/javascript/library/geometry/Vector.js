export default class Vector {
  constructor (dims = []) {
    this.dimensions = dims
  }

  get mag () { // total, value, index
    return Math.sqrt(this.reduce((t, v, i) => t + v*v))
  }

  get size () {
    return this.dimensions.length
  }

  addFrom (v) {
    if (v.size !== this.size) throw Error('Not the same dimensions')
    this.map((a, i) => a + v.dimensions[i])
  }
  subtract (v) {
    if (v.size !== this.size) throw Error('Not the same dimensions')
    let vector = new Vector()
    this.map((val, i) => {
      vector.dimensions[i] = val - v.dimensions[i]
    })

    return vector
  }
  multiply (n) {
    let vector = new Vector()
    this.map((val, i) => {
      vector.dimensions[i] = val * n
    })

    return vector
  }
  

  map (fn) {
    for (let i = 0; i < this.size; i++) {
      let v = fn(this.dimensions[i], i)
      if (v !== null && v !== undefined) this.dimensions[i] = v
    }
  }
  reduce (fn) {
    let total = 0
    let index = 0
    for (let d of this.dimensions) {
      total = fn(total, d, index++)
    }
    return total
  }
  get copy () {
    return new Vector(this.dimensions.slice())
  }

  distance (v) {
    const norm = this.subtract(v)
    return norm.mag
  }
  dot (v) {
    if (v.size !== this.size) throw Error('Not the same dimensions')
    return this.reduce((total, value, index) => total + value * v.dimensions[index])
  }

  normalize () {
    let vector = this.copy
    const norm = vector.mag
    vector.map((v, i) => v / norm)

    return vector
  }
  projection (v) {
    const numerator = this.dot(v)
    const denominator = this.dot(this)

    const c = numerator / denominator
    return this.multiply(c)
  }

  print () {
    console.log(this.dimensions)
  }
  static scalerReflection (x, a, b, withPoint) {
    // line segment defined by points(a, b)
    let norm = b.subtract(a), point = x.subtract(a)
    norm = norm.normalize()
    

    const proj = norm.projection(point)
    let distance = proj.distance(point)
    proj.addFrom(a)
      
    return {distance, point: proj}
  }
  /**
   * @param {vector} x actual point
   * @param {vector} a line start
   * @param {vector} b line end
   * 
   * @returns If the vector x is in between a & b
   */
  static inBetween (x, a, b) {
    let d1 = b.subtract(a)
    let d2 = x.subtract(a)
    let d3 = x.subtract(b)

    return d2.dot(d1)>0 && d3.dot(d1)<0
  }
}