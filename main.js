const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

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

// --- Characters ---
let firey = {
  x: 100, y: 100, vx: 0, vy: 0,
  width: 48, height: 48,
  speed: 8, jumpHeight: 4, hp: 4,
  color: "orange", onGround: false
};

let leafy = {
  x: 150, y: 100, vx: 0, vy: 0,
  width: 48, height: 48,
  speed: 9, jumpHeight: 6, hp: 3,
  color: "green", onGround: false
};

let activeCharacter = firey;

const keys = {};
window.addEventListener("keydown", (e) => keys[e.key] = true);
window.addEventListener("keyup", (e) => keys[e.key] = false);

// --- Tile helper ---
function getTile(x, y) {
  let tx = Math.floor(x / TILE_SIZE);
  let ty = Math.floor(y / TILE_SIZE);
  if (ty < 0 || ty >= level.length || tx < 0 || tx >= level[0].length) return 0;
  return level[ty][tx];
}

// --- Collision ---
function handleCollisions(char) {
  // corners
  let left = char.x;
  let right = char.x + char.width;
  let top = char.y;
  let bottom = char.y + char.height;

  // --- Horizontal ---
  if (char.vx < 0) { // moving left
    if (getTile(left, top) === 1 || getTile(left, bottom-1) === 1) {
      char.x = Math.floor(left / TILE_SIZE + 1) * TILE_SIZE;
      char.vx = 0;
    }
  } else if (char.vx > 0) { // moving right
    if (getTile(right-1, top) === 1 || getTile(right-1, bottom-1) === 1) {
      char.x = Math.floor(right / TILE_SIZE) * TILE_SIZE - char.width;
      char.vx = 0;
    }
  }

  // --- Vertical ---
  if (char.vy > 0) { // falling
    if (getTile(left, bottom) === 1 || getTile(right-1, bottom) === 1) {
      char.y = Math.floor(bottom / TILE_SIZE) * TILE_SIZE - char.height;
      char.vy = 0;
      char.onGround = true;
    } else {
      char.onGround = false;
    }
  } else if (char.vy < 0) { // jumping up
    if (getTile(left, top) === 1 || getTile(right-1, top) === 1) {
      char.y = Math.floor(top / TILE_SIZE + 1) * TILE_SIZE;
      char.vy = 0;
    }
  }

  // --- Hazards ---
  let centerTile = getTile(char.x + char.width/2, char.y + char.height/2);
  if (centerTile === 2) { // lava
    if (char === leafy) char.hp = 0; // Leafy dies
    // Firey is immune
  }
}

// --- Update ---
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

  handleCollisions(activeCharacter);
}

// --- Draw character ---
function drawCharacter(char) {
  ctx.fillStyle = char.color;
  ctx.fillRect(char.x, char.y, char.width, char.height);
}

// --- Main loop ---
function loop() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawLevel();
  drawCharacter(activeCharacter);
  update();
  requestAnimationFrame(loop);
}

loop();
