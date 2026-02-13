import { getTile, TILE_SIZE } from './level.js';
import { gameState, characters } from './characters.js';

const keys = {};
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

// --- Character switching ---
window.addEventListener("keydown", e => {
  if (e.key.toLowerCase() === "q") {
    // Create an array of characters to cycle through
    const cycle = [characters.firey, characters.leafy];

    // Only include Pin if it exists
    if (characters.pin) cycle.push(characters.pin);

    // Find current character index
    const currentIndex = cycle.indexOf(gameState.activeCharacter);

    // Move to next character (wrap around)
    const nextIndex = (currentIndex + 1) % cycle.length;

    gameState.activeCharacter = cycle[nextIndex];
  }
});


export function updateControls() {
  const char = gameState.activeCharacter;
  char.vx = 0;

  // arrows or WASD support
  if (keys["ArrowLeft"] || keys["a"]) char.vx = -char.speed;
  if (keys["ArrowRight"] || keys["d"]) char.vx = char.speed;

  // jump
  if ((keys[" "] || keys["w"] || keys["ArrowUp"]) && char.onGround) {
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

  // vertical (gravity)
  char.vy += 1;
  let newY = char.y + char.vy;
  if (!isColliding(char, char.x, newY)) {
    char.y = newY;
    char.onGround = false;
  } else {
    if (char.vy > 0) char.onGround = true;
    char.vy = 0;
  }

  // friction on ground
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
      // water (21) and spawn (30) are fall-through
    }
  }
}

// Only solid blocks (10-13) block movement
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
