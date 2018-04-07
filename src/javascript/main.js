import Game from './library/game/Game'
import EventInput from './library/game/Event'
import { Vector2 } from './library/geometry/Vector'
import Bezier from './library/util/CubicBezier'

// initilize
let game
let Input

let b, point, goal, time = 0, a, d, v

// ### GAME INIT ###
function init () {
  game = new Game()
  Input = new EventInput(game.canvas)

  load() 
}

// ### GAME LOAD ###
function load () {
  goal = new Vector2(600, 200)
  point = new Vector2(100, 400)
  b = new Bezier(0.45,-0.02, 0, 0.73)
  a = Vector2.AngleBetween(point, goal)
  d = point.distance(goal)
  v = new Vector2(0,0)
  
  gameLoop()
}


// ### GAME LOGIC ### 
function update () {
  time += 0.01

  
  if (point.distance(goal) > .5) {
    v.mag = d * b.Pogression(time)
    v.Angle = a
    point.addFrom(v)
  }
}
// ### GAME RENDER ###
function render () {
  game.clear()
  point.render(game.ctx, 3)
  goal.render(game.ctx, 5, 'tomato')
}

// ### GAME HEART ###
function gameLoop () {
  update()
  render()
  requestAnimationFrame(gameLoop)
}

export default init