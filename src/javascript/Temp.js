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

let PS, spritesheet, boxes = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], position
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

  const trail = {
    particleDistance: 100, interval: 200, size: [3, 7], particleSpawnRadius: 2,
    speed: .6, speedFactor: 0, sizeCurve: AnimationModes.EASE,
    particleDistanceFactor: 0.9, color: [[100, 149, 237, .5], [100, 149, 237, 1], [100, 149, 237, 1]],
    colorCurve: AnimationModes.EASEINOUT
  }
  const spawn = {
    loop: false, startAngle: 0, endAngle: Math.PI * 2, speed: 5, speedFactor: .3,
    size: [2, 3], sizeCurve: AnimationModes.EASEINOUT, color: 'cornflowerblue', particleDistance: 80,
    interval: 10, duration: 40, particleBurst: 10
  }
  PS = new ParticleSystem(game.center.x, game.height - 10, {
    particleDistance: 300, particleDistanceFactor: 0, interval: 600,
    size: 9, size: [6, 10], sizeCurve: [1, 0, 1, 0], particleSpawnRadius: 0,
    gravity: .0, colorCurve: AnimationModes.EASEOUT, loop: true, speed: 1,
    color: [[100, 149, 237, 0], [100, 149, 237, 1], [100, 149, 237, 1]], colorDuration: 2000,
    trail, spawn, accerelation: [1, 1.1, 1], accerelationCurve: AnimationModes.EASEINOUT, accerelationDuration: 500
  })

  boxes = boxes.map(x => new Rectangle(x * 100, game.center.y - 25, 50, 50)) 
  spritesheet = new Spritesheet(content[1], {
    numx: 4, numy: 2, fps: 8,
    types: {
      walk: [0, 0, 4, 1],
      idle: [0, 1, 1, 2]
    }
  })
  player = new Player(game.center.x, game.center.y, null)
  camera.Follow(player)

  gameLoop()
}

async function LoadContent () {
  let links = ['player_walk_MP.png', 'character_walk.png']
  let images = []
  for (let link of links) {
    images.push(game.loadImage(ContentPath('./'+link)))
  }

  return await Promise.all(images)
}

let k = 0
// ### GAME LOGIC ### 
function update () {
  // let before = position.reduce((total, value, index) => (total+index+1) * value)

  // if (Input.GetKey('ArrowRight')) 
  //   position.x += 5
  // if (Input.GetKey('ArrowLeft')) 
  //   position.x -= 5
  // if (Input.GetKey('ArrowDown')) 
  //   position.y += 5
  // if (Input.GetKey('ArrowUp')) 
  //   position.y -= 5
  // if (Input.GetKey('s') && k === 0)
  // {
  //   k++
  //   camera.Shake(80, 4)
  // }
  //   let now = position.reduce((total, value, index) => (total+index+1) * value)
  // if (now !== before)
  //   spritesheet.walk(-1)
  // else 
  //   spritesheet.idle()

  player.update(Input)
}
// ### GAME RENDER ###
function render () {
  game.clear()
  camera.render(game.ctx)
  
  for (let b of boxes) {
    b.render(game.ctx, 'tomato', 'fill')
  }

  // spritesheet.render(game.ctx, position.x, position.y)
  // PS.render(game.ctx)

  player.render(game.ctx)
}

// ### GAME HEART ###
function gameLoop () {
  update()
  render()
  camera.restore(game.ctx)
  requestAnimationFrame(gameLoop)
}

export default init