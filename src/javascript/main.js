import Game from './library/game/Game'
import Event from './library/game/Event'
import Rectangle from './library/geometry/Rectangle'
import Circle from './library/geometry/Circle'
import Collision from './library/game/Collision'

// initilize
const walls = {
  left: null,
  bottom: null,
  right: null
}
let player, game


function init () {
  game = new Game()
  game.event = new Event(game.canvas)

  load() 
}

// content loads
function load () {
  walls.left = new Rectangle(100, 100, 100, game.height - 200)
  walls.right = new Rectangle(game.width - 200, 100, 100, game.height - 200)
  walls.bottom = new Rectangle(100, game.height - 200, game.width - 200, 100)
  
  /**
   * later so we can drag and use different collision methods 
   * for (let i = 0; i < 3; i++) {
      circles.push(new Circle())
    }
   */
  player = new Circle(0, 0, 46)
  
  gameLoop()
}


// GAME LOGIC
function update () {
  player.x = game.event.mouse.x
  player.y = game.event.mouse.y 
  
}
function render () {
  game.clear()
  let color = 'cornflowerblue'
  let col = null 
  for (let w in walls) {
    walls[w].render(game.ctx)
    walls[w].renderCorners(game.ctx)
    
    let t = Collision.CircleBoxCollision(player, walls[w])
    if (t) {
      color = 'tomato'
      col = t
    }
  }

  if (col) {
    game.ctx.beginPath()
    game.ctx.arc(col.point.x, col.point.y, 6, 0, Math.PI * 2)
    game.ctx.fillStyle = 'cornflowerblue'
    game.ctx.fill()
    game.ctx.closePath()
  }
  player.render(game.ctx, color)
}

// GAME HEART
function gameLoop () {
  update()
  render()
  requestAnimationFrame(gameLoop)
}

export default init