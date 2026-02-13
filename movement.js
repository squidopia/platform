import { getTile, TILE_SIZE } from './level.js';
import { gameState, characters } from './characters.js';

// ===============================
// === PHYSICS SETTINGS (TWEAK) ===
// ===============================

const PHYSICS = {
  gravityNormal: 0.7,
  gravityLiquid: 0.08,
  maxFallSpeed: 10,

  groundFriction: 0.85,
  airFriction: 0.98,
  liquidDrag: 0.92,

  coyoteTime: 6,        // frames allowed to jump after leaving ground
  jumpBufferTime: 6     // frames jump input is remembered
};

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

// ===============================
// === CONTROLS ==================
// ===============================

export function updateControls() {
  const char = gameState.activeCharacter;

  // Init timers if missing
  char.coyoteTimer ??= 0;
  char.jumpBufferTimer ??= 0;

  // Horizontal movement
  if (keys["arrowleft"] || keys["a"]) {
    char.vx = -char.speed;
  } else if (keys["arrowright"] || keys["d"]) {
    char.vx = char.speed;
  }

  // Jump buffering
  if (keys[" "] || keys["w"] || keys["arrowup"]) {
    char.jumpBufferTimer = PHYSICS.jumpBufferTime;
  }
}

// ===============================
// === MOVEMENT ==================
// ===============================

export function moveCharacter() {
  const char = gameState.activeCharacter;

  char.inWater = false;
  char.inLava = false;

  // Apply gravity
  const gravity = (char.inWater || char.inLava)
    ? PHYSICS.gravityLiquid
    : PHYSICS.gravityNormal;

  char.vy += gravity;

  if (char.vy > PHYSICS.maxFallSpeed) {
    char.vy = PHYSICS.maxFallSpeed;
  }

  // Coyote timer
  if (char.onGround) {
    char.coyoteTimer = PHYSICS.coyoteTime;
  } else {
    char.coyoteTimer--;
  }

  // Jump execution
  if (char.jumpBufferTimer > 0 && char.coyoteTimer > 0) {
    char.vy = -char.jumpHeight;
    char.onGround = false;
    char.jumpBufferTimer = 0;
    char.coyoteTimer = 0;
  }

  if (char.jumpBufferTimer > 0) {
    char.jumpBufferTimer--;
  }

  // Horizontal move
  moveAxis(char, char.vx, 0);

  // Vertical move
  moveAxis(char, 0, char.vy);

  // Friction
  if (char.onGround) {
    char.vx *= PHYSICS.groundFriction;
  } else {
    char.vx *= PHYSICS.airFriction;
  }

  // Liquid drag
  if (char.inWater || char.inLava) {
    char.vx *= PHYSICS.liquidDrag;
    char.vy *= PHYSICS.liquidDrag;
  }

  handleHazards(char);
}

// ===============================
// === COLLISION =================
// ===============================

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
      const tile = getTile(tx * TILE_SIZE, ty * TILE_SIZE);
      if (tile >= 10 && tile <= 13) {
        collided = true;
      }
    }
  }

  if (!collided) {
    char.x = newX;
    char.y = newY;
    char.onGround = false;
  } else {
    if (vy > 0) char.onGround = true;
    if (vy !== 0) char.vy = 0;
    if (vx !== 0) char.vx = 0;
  }
}

// ===============================
// === HAZARDS ===================
// ===============================

function handleHazards(char) {
  const startX = Math.floor(char.x / TILE_SIZE);
  const endX = Math.floor((char.x + char.width - 1) / TILE_SIZE);
  const startY = Math.floor(char.y / TILE_SIZE);
  const endY = Math.floor((char.y + char.height - 1) / TILE_SIZE);

  for (let y = startY; y <= endY; y++) {
    for (let x = startX; x <= endX; x++) {
      const tile = getTile(x * TILE_SIZE, y * TILE_SIZE);

      switch (tile) {
        case 20: // lava
          if (char.name.toLowerCase() !== "firey") {
            char.hp = 0;
          } else {
            char.inLava = true;
          }
          break;

        case 21: // water
          if (char.name.toLowerCase() === "firey") {
            char.hp = 0;
          } else {
            char.inWater = true;
          }
          break;

        case 22: // spikes
          char.hp -= 1;
          break;
      }
    }
  }
}
