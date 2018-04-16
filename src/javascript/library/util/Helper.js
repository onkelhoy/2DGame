const Map = function (value, smin, smax, emin, emax) {
  return emin + ((value - smin) / (smax - smin)) * (emax - emin)
}
/**
 * The value from a to b given t which is a range of [0, 1]
 * 
 * @param {number} a 
 * @param {number} b 
 * @param {number} t 
 */
const Lerp = function (a, b, t) { // could also use the Map function M(t,0,1,a,b)
  return a + (b - a) * t
}

class Random {
  /**
   * random value between [0, a]
   * if b is defined then between [a, b]
   * 
   * @param {number} a 
   * @param {optional} b 
   */
  static range (a, b = 0) {
    return Math.random() * Math.abs(a - b) + a
  }

  /**
   * returns an array of shape n x m
   * can also specify the range by a & b (optimal)
   * 
   * @param {number} n 
   * @param {optional} m 
   * @param {optimal range start} m 
   * @param {optional range end} m 
   */
  static randn (n, m = 1, a = 1, b = 0) {
    if (m < 2)
      return Random.randn1(n, a, b)

    let array = []
    for (let i=0; i<n; i++)  // n -> rows, m -> columns
      array.push(Random.randn1(m, a, b))
      
    return array
  }

  /**
   * Mostly serves as helper function (creates small overhead though)
   * but can be used as randn with one dimension 
   * 
   * @param {dimension} n 
   * @param {number} a 
   * @param {number} b 
   */
  static randn1 (n, a, b) {
    let array = []
    for (let i=0; i<n; i++) 
      array.push(Random.range(a, b))
    return array 
  }
}
const Gravity = .4
const Friction = .8
export {
  Map, Lerp, Random, Gravity, Friction 
}