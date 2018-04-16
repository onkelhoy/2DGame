const Input

export default class MoveController {
  constructor (Event) {
    Input = Event
  }

  update (movable) {
    /**
     * move movable to direction of mouse
     * (if right or left then the norm of mouse 90deg from..)
     * use friction to slow down
     */
    if (Input.GetKey('w') || Input.GetKey('ArrowUp')) {
      movable.moveTo()
    } else if (Input.GetKey('s') || Input.GetKey('ArrowDown')) {

    } else {

    }

    if (Input.GetKey('a') || Input.GetKey('ArrowLeft')) {

    } else if (Input.GetKey('d') || Input.GetKey('ArrowRight')) {

    }
  }
}