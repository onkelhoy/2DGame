import Game from './library/game/Game'
import EventInput from './library/game/Event'
import { Vector2 } from './library/geometry/Vector'
import { Animation, AnimationModes } from './library/util/Animation'

// initilize
let game
let Input


// ### GAME INIT ###
function init () {
  game = new Game()
  Input = new EventInput(game.canvas)

  load() 
}

// ### GAME LOAD ###
function load () {

  gameLoop()
}


// ### GAME LOGIC ### 
function update () {
  
}
// ### GAME RENDER ###
function render () {
  game.clear()
  
}

// ### GAME HEART ###
function gameLoop () {
  update()
  render()
  requestAnimationFrame(gameLoop)
}

export default init