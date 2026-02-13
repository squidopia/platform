import { getTile, TILE_SIZE } from './level.js';
import { gameState, characters } from './characters.js';

const keys = {};
window.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

// --- Character switching ---
window.addEventListener("keydown", e => {
  if (e.key.toLowerCase() === "q") {
    const cycle = [characters.firey, characters.leafy];
    if (characters.pin) cycle.push(characters.pin);

    const currentIndex = cycle.indexOf(gameState.activeCharacter);
    const nextIndex = (currentIndex + 1) % cycle.length;
    gameState.activeCharacter = cycle[nextIndex];
  }
});

// --- Controls ---
export function updateControls() {
  const char = gameState.activeCharacter;
  char.vx = 0;

  // arrows or WASD
  if (keys["arrowleft"] || keys["a"]) char.vx = -char.speed;
  if (keys["arrowright"] || keys["d"]) char.vx = char.speed;

  // jump (only if on ground or swimming)
  if ((keys[" "] || keys["w"] || keys["arrowup"]) && (char.onGround || char.inWater || char.inLava)) {
    char.vy = -char.jumpHeight;
    char.onGround = false;
  }
}

// --- Movement and collision ---
export function moveCharacter() {
  const char = gameState.activeCharacter;

  // Apply gravity
  const GRAVITY = char.inWater || char.inLava ? 0.05 : 1; // float slower in liquid
  char.vy += GRAVITY;

  // Horizontal movement + collision
  moveAxis(char, char.vx, 0);

  // Vertical movement + collision
  moveAxis(char, 0, char.vy);

  // Friction if on ground
  if (char.onGround) char.vx *= 0.95;

  // Reset hazard flags
  char.inWater = false;
  char.inLava = false;

  // Check hazards & water/lava swimming
  handleHazards(char);
}

// --- Axis movement helper ---
function moveAxis(char, vx, vy) {
  let newX = char.x + vx;
  let newY = char.y + vy;

  const startX = Math.floor(newX / TILE_SIZE);
  const endX = Math.floor((newX + char.width - 1) / TILE_SIZE);
  const startY = Math.floor(newY / TILE_SIZE);
  const endY = Math.floor((newY + char.height - 1) / TILE_SIZE);

  let collided = false;

  for (let ty = startY; ty <= endY; ty++) {
    for (let tx = startX; tx <= endX; tx++) {
      const tile = getTile(tx*TILE_SIZE, ty*TILE_SIZE);

      if (tile >= 10 && tile <= 13) { // solid blocks
        collided = true;
      }
    }
  }

  if (!collided) {
    char.x = newX;
    char.y = newY;
    char.onGround = false;
  } else {
    // stop vertical movement if colliding
    if (vy > 0) char.onGround = true;
    if (vy !== 0) char.vy = 0;
    if (vx !== 0) char.vx = 0;
  }
}

// --- Hazard handling ---
function handleHazards(char) {
  const startX = Math.floor(char.x / TILE_SIZE);
  const endX = Math.floor((char.x + char.width - 1) / TILE_SIZE);
  const startY = Math.floor(char.y / TILE_SIZE);
  const endY = Math.floor((char.y + char.height - 1) / TILE_SIZE);

  for (let y = startY; y <= endY; y++) {
    for (let x = startX; x <= endX; x++) {
      const tile = getTile(x*TILE_SIZE, y*TILE_SIZE);

      switch (tile) {
        case 20: // lava
          if (char.name.toLowerCase() !== "firey") char.hp = 0; // lava kills non-firey
          else char.inLava = true; // firey floats in lava
          break;
        case 21: // water
          if (char.name.toLowerCase() === "firey") char.hp = 0; // firey dies in water
          else char.inWater = true;
          break;
        case 22: // spikes
          char.hp -= 1; // spikes deal 1 damage per frame touched
          break;
        // spawn tile (30) does nothing
      }
    }
  }
}
