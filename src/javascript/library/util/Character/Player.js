import Movement from './Movement'
import SpriteSheet from '../Spritesheet'
import { Vector2 } from '../../geometry/Vector'
import { AnimationMode } from '../Animation'
import { Gravity, Friction, Map } from '../Helper'


export default class Player extends Movement {
  constructor (x, y, spritedata) {
    super(x, y, 5)
    
    // this.sprite = new SpriteSheet(spritedata.image, spritedata.data)
  }
  
  KeyCombo (Input, keys) {
    let any = false
    for (let k of keys)
      if (Input.GetKey(k)) any = true
    
    return any
  }
  KeyCheck (Input, keyArray, dir) {
    if (this.KeyCombo(Input, keyArray)) 
      this['move'+dir] = true
    else 
      this['move'+dir] = false
  }

  KeyPress (Input) {
    this.KeyCheck(Input, ['A','a','ArrowLeft'], 'Left')
    this.KeyCheck(Input, ['D','d','ArrowRight'], 'Right')
    this.KeyCheck(Input, ['W','w','ArrowUp'], 'Up')
    this.KeyCheck(Input, ['S','s','ArrowDown'], 'Down')

    if (Input.GetKey(' ')) this.moveJump = true
    else this.moveJump = false
  }

  update (Input) {
    this.KeyPress(Input)
    super.update()
  }

  render (ctx) {
    this.renderShape(ctx, 'cornflowerblue', 'fill', 
      draw => draw.rect(this.x, this.y, 40, 80)
    )

    super.render(ctx)
  }
}