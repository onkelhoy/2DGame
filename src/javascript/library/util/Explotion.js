import ParticleSystem from '../physics/ParticleSystem'
import { AnimationModes } from './Animation'

/**
 * TO DO
 * 
 * 1. make spritesheet animatable (so time & curve can determin the current frame)
 * 2. have the shockwave explotion spritesheet
 * 3. add 2 particle systems, 
 *  - one for smaller particles flying from middle going from yellow to darkblue
 *  - second for larger  
 * 
 */


class Explotion {
  constructor (x, y, blast_radius = 100) {
    this.pos = {x, y}
    this.blast = radius
    
    this.fire = 4
    this.smoke = 4
    this.particles = 4 
  }


}