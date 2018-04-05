export default class Event {
  constructor (canvas) {
    this.Mouse = new MouseInput(canvas)
    this.Input = new KeyInput(canvas)
  }
}

class Mouse {
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
  }

  get click () {
    return this.right || this.left 
  }
  mousemove (e) {
    this.x = e.clientX
    this.y = e.clientY
  }
  mousepress (e) {
    e.preventDefault()
    if (e.button === 0) {
      if (this.left === 1) { 
        // for performance remove line 35-37
        for (cb of this.callbacks) {
          cb(this)
        }
      }
      this.left = !this.left
    }
    else if (e.button === 2) this.right = !this.right
    else {
      this.left = 0
      this.right = 0
    }
  }
}
class Input {
  constructor (canvas) {
    this.press = this.press.bind(this)
    this.inputs = []

    canvas.onkeydown = this.press
    canvas.onkeyup = this.press
  }
  GetKey (key) { // we want this key
    const ascii = key.charCodeAt(0)

    if (this.inputs[ascii] === undefined) // if we havent added it yet
      this.inputs[ascii] = false 
    return this.inputs[ascii] 
  }

  press (e) {
    const ascii = e.which || e.keyCode
    if (this.inputs[ascii] !== undefined) {
      // makes the current key (if it is added) true or false
      this.inputs[ascii] = !this.inputs[ascii] 
    }
  }
}