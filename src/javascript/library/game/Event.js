class MouseInput {
  constructor (canvas) {
    this.right = false
    this.left = false
    this.x = 0
    this.y = 0
    this.callbacks = []

    // fix with bindings
    this.mousepress = this.mousepress.bind(this)
    // now the events
    canvas.onmousemove = this.mousemove.bind(this)
    canvas.onmousedown = this.mousepress
    canvas.onmouseup = this.mousepress
    canvas.oncontextmenu = e => false
  }

  get click () {
    return this.right || this.left 
  }
  mousemove (e) {
    this.x = e.clientX
    this.y = e.clientY
  }
  mousepress (e) {
    if (e.button === 0) {
      if (this.left === 1) { 
        // for performance remove line 35-37
        for (cb of this.callbacks) {
          cb(this)
        }
      }
      this.left = !this.left
    }
    else if (e.button === 2) {
      e.preventDefault()
      this.right = !this.right
    } else {
      this.left = 0
      this.right = 0
    }
  }
}
class KeyInput {
  constructor (canvas) {
    this.press = this.press.bind(this)
    this.inputs = []

    canvas.onkeydown = this.press
    canvas.onkeyup = this.press
  }
  GetKey (key) { // we want this key
    if (this.inputs[key] === undefined) // if we havent added it yet
      this.inputs[key] = false 
    return this.inputs[key] 
  }

  press (e) { 
    if (this.inputs[e.key] !== undefined) {
      // makes the current key (if it is added) true or false
      this.inputs[e.key] = e.type === 'keydown'
    }
  }
}


export default class Input extends KeyInput {
  constructor (canvas) {
    canvas.tabIndex = 1
    canvas.focus()
    
    super(canvas)
    this.Mouse = new MouseInput(canvas)
  }
}