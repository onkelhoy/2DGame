export default class Spritesheet {
  constructor (image, {
    fps = 24, numx, numy,
    offsetx = 0, offsety = 0,
    sizex = 1, sizey = 1, // if a smaller boundary or something
    types = undefined, // an object with all the animation of like eg. (up: [startx, starty, endx, endy])
  } = {}) {
    this.boundary = {
      x: offsetx,
      y: offsety,
      w: image.width * sizex,
      h: image.height * sizey
    }

    this.sprite = {
      w: this.boundary.w / numx,
      h: this.boundary.h / numy,
      num: {x: numx, y: numy}
    }
    this.target = ''
    this.types = []
    this.interval = 1000 / fps
    this.image = image

    if (types === undefined)
      types = { default: [0, 0, numx, numy] }

    /**
     * Goes over the types and creates a key-data that has the information
     * And creates a function by the key to update the sprite, re-uses the updateType
     */
    for (let key in types) {
      if (this[key] !== undefined)
        throw new Error(`This property name is already in use '${key}'`)
      this.types.push(key)
      this[key+'-data'] = {
        start: { x:types[key][0], y:types[key][1] },
        end: { x:types[key][2], y:types[key][3] },
        current: { x:types[key][0], y:types[key][1] }
      }
      this[key] = () => {
        this.target = key+'-data'
        this.updateType(this[this.target])
      }
    }

    this.start = new Date().getTime()
  }

  /**
   * If the time has surpassed the time interval, shift the sprite pos,
   * this according to the given sprite type data object
   * 
   * @param {Object} type (sprite type) 
   */
  updateType (type) {
    let diff = new Date().getTime() - this.start
    
    if (diff > this.interval) { // new frame
      // console.log(type.current.x)
      type.current.x++
      if (
          type.current.x >= type.end.x && type.current.y === (type.end.y - 1) ||
          type.current.x >= this.sprite.num.x
        ) {
        type.current.x = 0
        type.current.y++

        if (type.current.y >= type.end.y) {
          this.reset(type)
        }
      }
      
      this.start = new Date().getTime()
    }
  }
  /**
   * Updates the requested sprite, if non given then the default
   * @param {String} type 
   */
  update (type = this.types[0]) {
    this[type]()
  }
  /**
   * Resets the sprite frame to the starting point
   * 
   * @param {Object} type 
   */
  reset (type) {
    type.current.x = type.start.x
    type.current.y = type.start.y
  }

  /**
   * Uses the renderFrame to render specfic frame
   * given by the target
   * 
   * @param {Game_Context} ctx 
   * @param {Number} x 
   * @param {Number} y 
   */
  render (ctx, x, y) {
    this.renderFrame(ctx, x, y, 
      this[this.target].current.x, 
      this[this.target].current.y
    )
  }
  
  // render a single frame
  renderFrame (ctx, x_pos, y_pos, x_frame, y_frame) {
    ctx.drawImage(this.image, 
      this.boundary.x + x_frame * this.sprite.w, // clip x
      this.boundary.y + y_frame * this.sprite.h, // clip y
      this.sprite.w, // clip w
      this.sprite.h, // clip h
      x_pos, // pos x
      y_pos, // pos y
      this.sprite.w, // image w
      this.sprite.h  // image h
    )
  }
}