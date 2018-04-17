// Imports
import Game from './library/game/Game'
import EventInput from './library/game/Event'
import Camera from './library/game/Camera'
import { AnimationModes } from './library/util/Animation'
import ParticleSystem from './library/physics/ParticleSystem'
import { Vector2 } from './library/geometry/Vector'
import Spritesheet from './library/util/Spritesheet'
import Rectangle from './library/geometry/Rectangle'
import Player from './library/util/Character/Player'

// content import
const ContentPath = require.context('../content/', true)

// initilize
let game
let Input
let camera

let spritesheet, boxes = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
let player


// ### GAME INIT ###
function init () {
  game = new Game()
  Input = new EventInput(game.canvas)
  camera = new Camera(0, 0)

  load() 
}

// ### GAME LOAD ###
async function load () {
  const content = await LoadContent()
  spritesheet = new Spritesheet(content[0], {
    numx: 14, numy: 5, fps: 8,
    types: {
      walk: [0, 2, 7, 3],
      WalkShootPistol: [[1, 3, 7, 3], [8, 1, 12, 1]]
    }
  })

  boxes = boxes.map(x => new Rectangle(x * 100, game.center.y - 25, 50, 50)) 
  player = new Player(game.center.x, game.center.y, 'ActionMan')
  camera.Follow(player)

  gameLoop()
}

async function LoadContent () {
  let links = ['action-man.spritesheet.png']
  let images = []
  for (let link of links) {
    images.push(game.loadImage(ContentPath('./'+link)))
  }

  return await Promise.all(images)
}

// ### GAME LOGIC ### 
function update () {
  spritesheet.WalkShootPistol()
  
  player.update(Input)
}
// ### GAME RENDER ###
function render () {
  game.clear()
  camera.render(game.ctx)

  for (let b of boxes) {
    b.render(game.ctx, 'tomato', 'fill')
  }
  
  spritesheet.render(game.ctx, player.x, player.y)
  // player.render(game.ctx)
}

// ### GAME HEART ###
function gameLoop () {
  update()
  render()
  camera.restore(game.ctx)
  requestAnimationFrame(gameLoop)
}

export default init