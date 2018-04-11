import Game from './library/game/Game'
import EventInput from './library/game/Event'
import { AnimationModes } from './library/util/Animation'
import ParticleSystem from './library/physics/ParticleSystem'
import { Vector2 } from './library/geometry/Vector'

// initilize
let game
let Input

let PS

// ### GAME INIT ###
function init () {
  game = new Game()
  Input = new EventInput(game.canvas)

  load() 
}

// ### GAME LOAD ###
function load () {
  PS = new ParticleSystem(game.center.x, game.height - 10, {
    particleDistance: 200, particleDistanceFactor: .5, interval: 10,
    size: 9, size: [1, 10], sizeCurve: [1, 0, 1, 0], particleSpawnRadius: 30,
    gravity: .1
  })

  gameLoop()
}


// ### GAME LOGIC ### 
function update () {
  
}
// ### GAME RENDER ###
function render () {
  game.clear()

  PS.render(game.ctx)
}

// ### GAME HEART ###
function gameLoop () {
  update()
  render()
  requestAnimationFrame(gameLoop)
}

export default init