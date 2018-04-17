export default class Spritesheet {
  /**
   * types is defined using non-zero based array
   * 
   * @param {Image for spritesheet} image 
   * @param {Object} spritesheetData 
   */
  constructor (image, {
    fps = 24, numx, numy,
    offsetx = 0, offsety = 0,
    sizex = 1, sizey = 1, // if a smaller boundary or something
    types = undefined, // an object with all the animation of like eg. (up: [startx, starty, endx, endy]) (should be able to have two or more at same time)
  } = {}) { //                                                            ..so up: [[sx,sy,ex,ey],[sx,sy,ex,ey], ...]
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

      /**
       * Minus one since we start at 0
       */
      if (types[key][0] instanceof Array) // multiple images at once
        this[key+'-data'] = types[key].map(a => { return {start:{x:a[0]-1,y:a[1]-1}, end:{x:a[2]-1,y:a[3]-1}, current:{x:a[0]-1,y:a[1]-1}, stop:a[6], min:a[4]-1, max:a[5]-1} })
      else
        this[key+'-data'] = { // one image
          start: { x:types[key][0]-1, y:types[key][1]-1 },
          end: { x:types[key][2]-1, y:types[key][3]-1 },
          current: { x:types[key][0]-1, y:types[key][1]-1 },
          stop: types[key][6], // just a true or false if we stay on last frame
          min: types[key][4]-1,
          max: types[key][5]-1 // how far we can go
        }


      this[key] = () => {
        this.target = key+'-data'
        this.updateTypes(this[this.target])
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
    type.current.x ++
    if (!isNaN(type.max))
      if (type.current.x > type.max) {
        type.current.x = type.min 
        type.current.y ++
      }
    else if (type.current.x > this.sprite.num.x - 1) {
      type.current.x = 0
      type.current.y ++
    }

    if (type.current.y > type.end.y || type.current.x > type.end.x && type.current.y === type.end.y)
      if (!type.stop) 
        this.reset(type)
      else {
        type.current.x = type.end.x
        type.current.y = type.end.y
      }
  }
  /**
   * This method checks if the type is object or array, and updates them accordingly
   *  - reuses the updateType
   * @param {Object Or Array} types 
   */
  updateTypes (types) {
    let diff = new Date().getTime() - this.start
    
    if (diff > this.interval) { // new frame
      if (types instanceof Array)
        for (let type of types) 
          this.updateType(type)      
      else
        this.updateType(types)

      this.start = new Date().getTime()
    }
  }

  /**
   * This methods syncs the wished sprite type to be synched with the current 
   * - if the current is an array it will sync it with the first element in that array
   * - if the wished sprite type is an array, all elements will then be synced with the current
   * 
   * @param {string} typename 
   */
  syncCombination (typename) {
    let type = this[typename + '-data']
    let ctype = this[this.target] // current type

    if (ctype instanceof Array) // sync it with the first then
      ctype = this[this.target][0]

    let xdiff = ctype.current.x - ctype.start.x // how far the current has gone
    let ydiff = ctype.current.y - ctype.start.y
    
    if (type instanceof Array) // sync all
      for (let t of type) {
        t.current.x = t.start.x + xdiff
        t.current.y = t.start.y + ydiff
      }
    else {
      type.current.x = type.start.x + xdiff
      type.current.y = type.start.y + ydiff
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
    if (this[this.target] instanceof Array)
      this[this.target].forEach(type => this.renderFrame(ctx, x, y, type.current.x, type.current.y))
    else 
      this.renderFrame(ctx, x, y, 
        this[this.target].current.x, 
        this[this.target].current.y
      )
  }
  
  // render a single frame
  renderFrame (ctx, x_pos, y_pos, x_frame, y_frame) {
    
    ctx.drawImage(this.image, 
      Math.floor(this.boundary.x + x_frame * this.sprite.w)+1, // clip x
      Math.floor(this.boundary.y + y_frame * this.sprite.h)+1, // clip y
      this.sprite.w-2, // clip w
      this.sprite.h-2, // clip h
      x_pos, // pos x
      y_pos, // pos y
      this.sprite.w-2, // image w
      this.sprite.h-2  // image h
    )
  }
}