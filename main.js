// --- CANVAS SETUP ---
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// --- TILE & LEVEL ---
const TILE_SIZE = 64;
const level = [
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,2,0,0,0,0,0],
  [1,1,1,1,1,1,1,1,1,1]
]; // 0 empty, 1 ground, 2 lava

// --- CHARACTERS ---
let firey = { x:100, y:100, vx:0, vy:0, width:48, height:48, speed:8, jumpHeight:4, hp:4, color:"orange", onGround:false };
let leafy = { x:150, y:100, vx:0, vy:0, width:48, height:48, speed:9, jumpHeight:6, hp:3, color:"green", onGround:false };
let activeCharacter = firey;

const keys = {};
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

// --- TILE HELPER ---
function getTile(x, y) {
  let tx = Math.floor(x / TILE_SIZE);
  let ty = Math.floor(y / TILE_SIZE);
  if (ty < 0 || ty >= level.length || tx < 0 || tx >= level[0].length) return 0;
  return level[ty][tx];
}

// --- COLLISION (smooth free movement) ---
function handleCollisions(char) {
  char.onGround = false;
  
  // check all tiles overlapping character
  const startX = Math.floor(char.x / TILE_SIZE);
  const endX = Math.floor((char.x + char.width) / TILE_SIZE);
  const startY = Math.floor(char.y / TILE_SIZE);
  const endY = Math.floor((char.y + char.height) / TILE_SIZE);

  for (let y = startY; y <= endY; y++) {
    for (let x = startX; x <= endX; x++) {
      let tile = 0;
      if (y >= 0 && y < level.length && x >= 0 && x < level[0].length) tile = level[y][x];
      if (tile === 0) continue;

      const tileLeft = x * TILE_SIZE;
      const tileRight = tileLeft + TILE_SIZE;
      const tileTop = y * TILE_SIZE;
      const tileBottom = tileTop + TILE_SIZE;

      // check vertical collision first
      if (char.x + char.width > tileLeft && char.x < tileRight) {
        if (char.vy > 0 && char.y + char.height > tileTop && char.y + char.height - char.vy <= tileTop) {
          char.y = tileTop - char.height;
          char.vy = 0;
          char.onGround = true;
        } else if (char.vy < 0 && char.y < tileBottom && char.y - char.vy >= tileBottom) {
          char.y = tileBottom;
          char.vy = 0;
        }
      }

      // then horizontal collision
      if (char.y + char.height > tileTop && char.y < tileBottom) {
        if (char.vx > 0 && char.x + char.width > tileLeft && char.x + char.width - char.vx <= tileLeft) {
          char.x = tileLeft - char.width;
          char.vx = 0;
        } else if (char.vx < 0 && char.x < tileRight && char.x - char.vx >= tileRight) {
          char.x = tileRight;
          char.vx = 0;
        }
      }

      // hazards
      if (tile === 2 && char === leafy) char.hp = 0; // Leafy dies in lava
    }
  }
}

// --- DRAW ---
function drawLevel(cameraX, cameraY) {
  for (let y = 0; y < level.length; y++) {
    for (let x = 0; x < level[y].length; x++) {
      const tile = level[y][x];
      if (tile === 0) continue;
      ctx.fillStyle = tile === 1 ? "#8B4513" : "#FF4500";
      ctx.fillRect(x*TILE_SIZE - cameraX, y*TILE_SIZE - cameraY, TILE_SIZE, TILE_SIZE);
    }
  }
}

function drawCharacter(char, cameraX, cameraY) {
  ctx.fillStyle = char.color;
  ctx.fillRect(char.x - cameraX, char.y - cameraY, char.width, char.height);
}

// --- UPDATE ---
function update() {
  // horizontal movement
  activeCharacter.vx = 0;
  if (keys["ArrowLeft"]) activeCharacter.vx = -activeCharacter.speed;
  if (keys["ArrowRight"]) activeCharacter.vx = activeCharacter.speed;

  // jump
  if (keys[" "] && activeCharacter.onGround) {
    activeCharacter.vy = -activeCharacter.jumpHeight*10;
    activeCharacter.onGround = false;
  }

  // gravity
  activeCharacter.vy += 1; // gravity

  // move
  activeCharacter.x += activeCharacter.vx;
  activeCharacter.y += activeCharacter.vy;

  handleCollisions(activeCharacter);
}

// --- MAIN LOOP + CAMERA SCROLLING ---
function loop() {
  update();

  const cameraX = activeCharacter.x - canvas.width/2 + activeCharacter.width/2;
  const cameraY = activeCharacter.y - canvas.height/2 + activeCharacter.height/2;

  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawLevel(cameraX, cameraY);
  drawCharacter(activeCharacter, cameraX, cameraY);

  requestAnimationFrame(loop);
}

loop();
