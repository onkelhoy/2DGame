import { Vector2 } from '../geometry/Vector'

// https://en.wikipedia.org/wiki/B%C3%A9zier_curve
export default class CubicBezier {
  constructor (x1, y1, x2, y2) {
    this.p = [
      new Vector2(0, 0), new Vector2(x1, y1),
      new Vector2(x2, y2), new Vector2(1, 1)
    ]
  }

  // (a+b)^2 = sum[0, k=n] := c(n, k)a^k*b^(n-k)
  PointAt (t) {
    return Vector2.toVector(this.coords(t))
  }
  coords (t) {
    let v = {x:0, y:0}, m, b = [1, 3, 3, 1] // precalculated c(n,k)
    for (let i=0; i<4; i++) {
      m = Math.pow(1-t, 3-i)*Math.pow(t, i)*b[i]
      v.x += m*this.p[i].x
      v.y += m*this.p[i].y
    }
    return v
  }
  Pogression (t) {
    return this.coords(t).y    
  }
  SlopeAt (x) {
    let v = new Vector2(0, 0)
    for (let i=1; i<4; i++) {
      let sub = this.p[i].subtract(this.p[i-1])
      v.addFrom(sub.multiply(Math.pow(1-x, 3-i)*3*i*Math.pow(x, i-1)))
    }
    return v
  }

  static FromArray (arr) {
    return new CubicBezier(arr[0], arr[1], arr[2], arr[3])
  }
}