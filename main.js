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
  firey: { name:"Firey", width:48, height:48, speed:8, jumpHeight:18, hp:4, color:"orange", vx:0, vy:0, x:0, y:0, onGround:false },
  leafy: { name:"Leafy", width:48, height:48, speed:9, jumpHeight:22, hp:3, color:"green", vx:0, vy:0, x:0, y:0, onGround:false }
};
let activeCharacter = characters.firey;

// --- INPUT HANDLING ---
const keys = {};
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

// --- SAFE SPAWN ---
function spawnCharacter(char, startX = 0) {
  for (let y = 0; y < level.length; y++) {
    if (level[y][startX] === 0 && level[y + 1] && level[y + 1][startX] === 1) {
      char.x = startX * TILE_SIZE + (TILE_SIZE - char.width)/2;
      char.y = y * TILE_SIZE;
      return;
    }
  }
  char.x = startX * TILE_SIZE;
  char.y = 0;
}

// spawn characters safely
spawnCharacter(characters.firey, 0);
spawnCharacter(characters.leafy, 1);

// --- TILE HELPER ---
function getTile(x, y) {
  const tx = Math.floor(x / TILE_SIZE);
  const ty = Math.floor(y / TILE_SIZE);
  if (ty < 0 || ty >= level.length || tx < 0 || tx >= level[0].length) return 0;
  return level[ty][tx];
}

// --- COLLISION & MOVEMENT ---
function isColliding(char, x, y) {
  const startX = Math.floor(x / TILE_SIZE);
  const endX = Math.floor((x + char.width) / TILE_SIZE);
  const startY = Math.floor(y / TILE_SIZE);
  const endY = Math.floor((y + char.height) / TILE_SIZE);

  for (let ty = startY; ty <= endY; ty++) {
    for (let tx = startX; tx <= endX; tx++) {
      const tile = getTile(tx*TILE_SIZE, ty*TILE_SIZE);
      if (tile !== 0) return true;
    }
  }
  return false;
}

function moveCharacter(char) {
  // horizontal
  let newX = char.x + char.vx;
  if (!isColliding(char, newX, char.y)) {
    char.x = newX;
  } else {
    char.vx = 0;
  }

  // vertical
  char.vy += 1; // gravity
  let newY = char.y + char.vy;
  if (!isColliding(char, char.x, newY)) {
    char.y = newY;
    char.onGround = false;
  } else {
    if (char.vy > 0) char.onGround = true; // landed
    char.vy = 0;
  }

  // friction
  if (char.onGround) char.vx *= 0.8;

  // hazards
  const startX = Math.floor(char.x / TILE_SIZE);
  const endX = Math.floor((char.x + char.width) / TILE_SIZE);
  const startY = Math.floor(char.y / TILE_SIZE);
  const endY = Math.floor((char.y + char.height) / TILE_SIZE);
  for (let y = startY; y <= endY; y++) {
    for (let x = startX; x <= endX; x++) {
      if (getTile(x*TILE_SIZE, y*TILE_SIZE) === 2) char.hp = 0;
    }
  }
}

// --- CHARACTER CONTROLS ---
function updateControls(char) {
  char.vx = 0;
  if (keys["ArrowLeft"]) char.vx = -char.speed;
  if (keys["ArrowRight"]) char.vx = char.speed;
  if (keys[" "] && char.onGround) {
    char.vy = -char.jumpHeight;
    char.onGround = false;
  }
}

// --- CAMERA ---
function getCamera() {
  const lerp = 0.1;
  if (!getCamera.x) getCamera.x = activeCharacter.x - canvas.width/2;
  if (!getCamera.y) getCamera.y = activeCharacter.y - canvas.height/2;

  getCamera.x += ((activeCharacter.x - canvas.width/2) - getCamera.x) * lerp;
  getCamera.y += ((activeCharacter.y - canvas.height/2) - getCamera.y) * lerp;
  return {x:getCamera.x, y:getCamera.y};
}

// --- DRAWING ---
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

  // HP bar
  ctx.fillStyle = "red";
  ctx.fillRect(char.x - cameraX, char.y - 10 - cameraY, char.width * (char.hp/4), 5);
}

// --- SWITCH CHARACTER ---
function switchCharacter(name) {
  if (characters[name]) activeCharacter = characters[name];
}

// --- MAIN LOOP ---
function loop() {
  updateControls(activeCharacter);
  moveCharacter(activeCharacter);

  const camera = getCamera();
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawLevel(camera.x, camera.y);

  for (let charKey in characters) drawCharacter(characters[charKey], camera.x, camera.y);

  requestAnimationFrame(loop);
}

loop();
