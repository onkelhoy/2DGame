import MinChain from '../util/NodeChain'
import Vector2D from '../geometry/Vector2D'

export default class Collision {
  static AABB (a, b) {
    // rectangle mot rectangle collision AABB
    return a.x < b.x + b.w && 
      a.x + a.w > b.x &&
      a.y < b.y + b.h && 
      a.y + a.h > b.y
  }

  static AABBpoint (p, b) {
    return Collision.AABB({x: p.x, y: p.y, w: 1, h: 1}, b)
  }

  static CircleCircle (a, b) {
    let dis = Collision.PointPointDistance(a, b)
    return dis < a.r + b.r
  }
  
  static CirclePoint (c, p) {
    let dis = Collision.PointPointDistance(c, p)
    return dis < c.r
  }

  static PointPointDistance (a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
  }

  static PointLineDistance (p, a, b) { // line => {a: {x,y}, b: {x,y}}
    let numerator = Math.abs((b.y - a.y)*p.x - (b.x - a.x)*p.y + b.x*a.y - b.y*a.x)
    let denominator = Collision.PointPointDistance(b, a)

    return numerator / denominator
  }

  static CircleLineDistance (c, a, b) {
    return Collision.PointLineDistance(c, a, b) < c.r
  }

  static CircleBoxCollision (c, b) {
    // first we simple check AABB collision
    if (Collision.AABB({x:c.x-c.r,y:c.y-c.r,w:c.r*2,h:c.r*2}, b)) {
      let corners = {
        tl: {x: b.x, y: b.y},
        tr: {x: b.x+b.w, y: b.y},
        bl: {x: b.x, y: b.y+b.h},
        br: {x: b.x+b.w, y: b.y+b.h}
      }

      // now check the corners (and get the three closest one on the way)
      let minList = new MinChain(null, (n1, n2) => n1.value.dis - n2.value.dis)
      for (let i in corners) {
        let dis = Collision.PointPointDistance(c, corners[i])
        if (dis < c.r) {
          
          return {point: Vector2D.toVector(corners[i]), distance: dis}
        } 

        minList.insert({dis, index: i})
      }
      
      // get the three closest corners
      let closest = minList.mink(3) 
      for (let i = 0; i < closest.length; i++) {
        let last = i + 1
        if (last === closest.length) last = 0

        let a = Vector2D.toVector(corners[closest[i].index])
        let b = Vector2D.toVector(corners[closest[last].index])
        const reflect = Vector2D.scalerReflection(c, a, b, true)
        
        reflect.point = Vector2D.toVector2D(reflect.point)

        if (reflect.distance < c.r && Vector2D.inBetween(c, a, b)) {
          return reflect
        }
      }
    }
    
    return false
  }
}