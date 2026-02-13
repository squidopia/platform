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
const characters = {
  firey: { x:100, y:100, vx:0, vy:0, width:48, height:48, speed:8, jumpHeight:18, hp:4, color:"orange", onGround:false },
  leafy: { x:150, y:100, vx:0, vy:0, width:48, height:48, speed:9, jumpHeight:22, hp:3, color:"green", onGround:false }
};
let activeCharacter = characters.firey;

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

// --- COLLISION HANDLER ---
function handleCollisions(char) {
  char.onGround = false;

  const startX = Math.floor(char.x / TILE_SIZE);
  const endX = Math.floor((char.x + char.width) / TILE_SIZE);
  const startY = Math.floor(char.y / TILE_SIZE);
  const endY = Math.floor((char.y + char.height) / TILE_SIZE);

  for (let y = startY; y <= endY; y++) {
    for (let x = startX; x <= endX; x++) {
      let tile = getTile(x*TILE_SIZE, y*TILE_SIZE);
      if (tile === 0) continue;

      const tileLeft = x * TILE_SIZE;
      const tileRight = tileLeft + TILE_SIZE;
      const tileTop = y * TILE_SIZE;
      const tileBottom = tileTop + TILE_SIZE;

      // --- VERTICAL COLLISIONS ---
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

      // --- HORIZONTAL COLLISIONS ---
      if (char.y + char.height > tileTop && char.y < tileBottom) {
        if (char.vx > 0 && char.x + char.width > tileLeft && char.x + char.width - char.vx <= tileLeft) {
          char.x = tileLeft - char.width;
          char.vx = 0;
        } else if (char.vx < 0 && char.x < tileRight && char.x - char.vx >= tileRight) {
          char.x = tileRight;
          char.vx = 0;
        }
      }

      // --- HAZARDS ---
      if (tile === 2) char.hp = 0; // any character dies in lava
    }
  }
}

// --- DRAW LEVEL ---
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

// --- DRAW CHARACTERS ---
function drawCharacter(char, cameraX, cameraY) {
  ctx.fillStyle = char.color;
  ctx.fillRect(char.x - cameraX, char.y - cameraY, char.width, char.height);

  // draw HP bar
  ctx.fillStyle = "red";
  ctx.fillRect(char.x - cameraX, char.y - 10 - cameraY, char.width * (char.hp/4), 5);
}

// --- UPDATE PHYSICS ---
function updateCharacter(char) {
  // horizontal movement
  char.vx = 0;
  if (keys["ArrowLeft"]) char.vx = -char.speed;
  if (keys["ArrowRight"]) char.vx = char.speed;

  // jump
  if (keys[" "] && char.onGround) {
    char.vy = -char.jumpHeight;
    char.onGround = false;
  }

  // gravity
  char.vy += 1; // gravity

  // friction
  if (char.onGround) char.vx *= 0.8;

  // move
  char.x += char.vx;
  char.y += char.vy;

  handleCollisions(char);
}

// --- SWITCH CHARACTER ---
function switchCharacter(name) {
  if (characters[name]) activeCharacter = characters[name];
}

// --- CAMERA ---
function getCamera() {
  const lerp = 0.1; // smooth camera
  if (!getCamera.x) getCamera.x = activeCharacter.x - canvas.width/2;
  if (!getCamera.y) getCamera.y = activeCharacter.y - canvas.height/2;

  getCamera.x += ((activeCharacter.x - canvas.width/2) - getCamera.x) * lerp;
  getCamera.y += ((activeCharacter.y - canvas.height/2) - getCamera.y) * lerp;
  return {x: getCamera.x, y: getCamera.y};
}

// --- MAIN LOOP ---
function loop() {
  updateCharacter(activeCharacter);

  const camera = getCamera();
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawLevel(camera.x, camera.y);
  for (let charKey in characters) drawCharacter(characters[charKey], camera.x, camera.y);

  requestAnimationFrame(loop);
}

loop();
