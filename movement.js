import { getTile, TILE_SIZE } from './level.js';
import { activeCharacter } from './characters.js';

const keys = {};
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

export function updateControls(char) {
  char.vx = 0;
  if (keys["ArrowLeft"]) char.vx = -char.speed;
  if (keys["ArrowRight"]) char.vx = char.speed;
  if (keys[" "] && char.onGround) {
    char.vy = -char.jumpHeight;
    char.onGround = false;
  }
}

export function moveCharacter(char) {
  // horizontal movement
  let newX = char.x + char.vx;
  if (!isColliding(char, newX, char.y)) char.x = newX;
  else char.vx = 0;

  // gravity & vertical movement
  char.vy += 1;
  let newY = char.y + char.vy;
  if (!isColliding(char, char.x, newY)) {
    char.y = newY;
    char.onGround = false;
  } else {
    if (char.vy > 0) char.onGround = true;
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

function isColliding(char, x, y) {
  const startX = Math.floor(x / TILE_SIZE);
  const endX = Math.floor((x + char.width) / TILE_SIZE);
  const startY = Math.floor(y / TILE_SIZE);
  const endY = Math.floor((y + char.height) / TILE_SIZE);
  for (let ty = startY; ty <= endY; ty++) {
    for (let tx = startX; tx <= endX; tx++) {
      if (getTile(tx*TILE_SIZE, ty*TILE_SIZE) !== 0) return true;
    }
  }
  return false;
}
