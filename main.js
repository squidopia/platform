const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = 800; // screen width
canvas.height = 600; // screen height


const TILE_SIZE = 64;

const level = [
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,2,0,0,0,0,0],
  [1,1,1,1,1,1,1,1,1,1]
];
// 0 = empty, 1 = ground, 2 = lava

function drawLevel() {
  for (let y = 0; y < level.length; y++) {
    for (let x = 0; x < level[y].length; x++) {
      let tile = level[y][x];
      if (tile === 1) {
        ctx.fillStyle = "#8B4513"; // ground brown
        ctx.fillRect(x*TILE_SIZE, y*TILE_SIZE, TILE_SIZE, TILE_SIZE);
      } else if (tile === 2) {
        ctx.fillStyle = "#FF4500"; // lava red
        ctx.fillRect(x*TILE_SIZE, y*TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }
}


let firey = {
  x: 100,
  y: 100,
  vx: 0,
  vy: 0,
  width: 48,
  height: 48,
  speed: 8,
  jumpHeight: 4,
  hp: 4,
  color: "orange"
};

let leafy = {
  x: 150,
  y: 100,
  vx: 0,
  vy: 0,
  width: 48,
  height: 48,
  speed: 9,
  jumpHeight: 6,
  hp: 3,
  color: "green"
};

let activeCharacter = firey; // start controlling Firey


const keys = {};

window.addEventListener("keydown", (e) => keys[e.key] = true);
window.addEventListener("keyup", (e) => keys[e.key] = false);

function update() {
  // movement
  if (keys["ArrowLeft"]) activeCharacter.vx = -activeCharacter.speed;
  else if (keys["ArrowRight"]) activeCharacter.vx = activeCharacter.speed;
  else activeCharacter.vx = 0;

  // jump
  if (keys[" "] && activeCharacter.onGround) {
    activeCharacter.vy = -activeCharacter.jumpHeight*10;
    activeCharacter.onGround = false;
  }

  // gravity
  activeCharacter.vy += 1; // gravity
  activeCharacter.x += activeCharacter.vx;
  activeCharacter.y += activeCharacter.vy;

  // TODO: collision with tiles
}

function drawCharacter(char) {
  ctx.fillStyle = char.color;
  ctx.fillRect(char.x, char.y, char.width, char.height);
}


function loop() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawLevel();
  drawCharacter(activeCharacter);
  update();
  requestAnimationFrame(loop);
}

loop();
