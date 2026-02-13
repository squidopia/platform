import { getTile, TILE_SIZE } from './level.js';
import { gameState } from './characters.js';

const keys = {};
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

export function updateControls() {
  const char = gameState.activeCharacter;
  char.vx = 0;
  if (keys["ArrowLeft"]) char.vx = -char.speed;
  if (keys["ArrowRight"]) char.vx = char.speed;
  if (keys[" "] && char.onGround) {
    char.vy = -char.jumpHeight;
    char.onGround = false;
  }
}

export function moveCharacter() {
  const char = gameState.activeCharacter;

  // horizontal
  let newX = char.x + char.vx;
  if (!isColliding(char, newX, char.y)) char.x = newX;
  else char.vx = 0;

  // vertical
  char.vy += 1; // gravity
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
      const tile = getTile(x*TILE_SIZE, y*TILE_SIZE);
      if (tile === 20) char.hp = 0; // lava kills
      // water (21) and spawn (30) are fall-through, so no collision effect
    }
  }
}

// Only solid tiles block movement
function isColliding(char, x, y) {
  const startX = Math.floor(x / TILE_SIZE);
  const endX = Math.floor((x + char.width) / TILE_SIZE);
  const startY = Math.floor(y / TILE_SIZE);
  const endY = Math.floor((y + char.height) / TILE_SIZE);

  for (let ty = startY; ty <= endY; ty++) {
    for (let tx = startX; tx <= endX; tx++) {
      const tile = getTile(tx*TILE_SIZE, ty*TILE_SIZE);
      if (tile >= 10 && tile <= 13) return true; // solid blocks
      // tiles 20 (lava), 21 (water), 30 (spawn) do NOT block
    }
  }
  return false;
}
