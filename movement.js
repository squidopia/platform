import { getTile, TILE_SIZE } from './level.js';
import { gameState, characters } from './characters.js';

// ===============================
// === PHYSICS SETTINGS (TWEAK) ===
// ===============================

const PHYSICS = {
  gravityNormal: 0.85,
  gravityLiquid: 0.03,
  maxFallSpeed: 15,

  groundFriction: 0.5,
  airFriction: 0.6,
  liquidDrag: 0.8,

  coyoteTime: 6,        
  jumpBufferTime: 6     
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
  // ONLY apply keyboard inputs to the character you are currently playing
  const char = gameState.activeCharacter;
  if (!char || char.hp <= 0) return;

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
// === MOVEMENT & PHYSICS ========
// ===============================

export function moveCharacter() {
  // We loop through EVERY character in the game so they all fall/collide
  Object.values(characters).forEach(char => {
    if (!char || char.hp <= 0) return;

    // Reset environment flags for this frame
    char.inWater = false;
    char.inLava = false;

    // 1. Calculate Environment (Check tiles before moving to set gravity)
    updateEnvironmentFlags(char);

    // 2. Apply Gravity
    const gravity = (char.inWater || char.inLava)
      ? PHYSICS.gravityLiquid
      : PHYSICS.gravityNormal;

    char.vy += gravity;

    if (char.vy > PHYSICS.maxFallSpeed) {
      char.vy = PHYSICS.maxFallSpeed;
    }

    // 3. Coyote timer logic
    if (char.onGround) {
      char.coyoteTimer = PHYSICS.coyoteTime;
    } else {
      char.coyoteTimer--;
    }

    // 4. Jump execution (If this char has a jump buffered)
    if (char.jumpBufferTimer > 0 && char.coyoteTimer > 0) {
      char.vy = -char.jumpHeight;
      char.onGround = false;
      char.jumpBufferTimer = 0;
      char.coyoteTimer = 0;
    }

    if (char.jumpBufferTimer > 0) {
      char.jumpBufferTimer--;
    }

    // 5. Perform actual movement & collision
    moveAxis(char, char.vx, 0); // X-axis
    moveAxis(char, 0, char.vy); // Y-axis

    // 6. Apply Friction
    if (char.onGround) {
      char.vx *= PHYSICS.groundFriction;
    } else {
      char.vx *= PHYSICS.airFriction;
    }

    // 7. Liquid drag
    if (char.inWater || char.inLava) {
      char.vx *= PHYSICS.liquidDrag;
      char.vy *= PHYSICS.liquidDrag;
    }

    // 8. Final Hazard Check (Spikes, Lava death, etc)
    handleHazards(char);
  });
}

// ===============================
// === COLLISION ENGINE ==========
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
      // Logic for solid blocks (ID 10-13)
      if (tile >= 10 && tile <= 13) {
        collided = true;
      }
    }
  }

  if (!collided) {
    char.x = newX;
    char.y = newY;
    if (vy !== 0) char.onGround = false; // If moving vertically and no collision, we aren't on ground
  } else {
    // Collision response
    if (vy > 0) char.onGround = true;
    if (vy !== 0) char.vy = 0;
    if (vx !== 0) char.vx = 0;
  }
}

// ===============================
// === HAZARDS & ENVIRONMENT =====
// ===============================

function updateEnvironmentFlags(char) {
  const startX = Math.floor(char.x / TILE_SIZE);
  const endX = Math.floor((char.x + char.width - 1) / TILE_SIZE);
  const startY = Math.floor(char.y / TILE_SIZE);
  const endY = Math.floor((char.y + char.height - 1) / TILE_SIZE);

  for (let y = startY; y <= endY; y++) {
    for (let x = startX; x <= endX; x++) {
      const tile = getTile(x * TILE_SIZE, y * TILE_SIZE);
      if (tile === 20) char.inLava = true;
      if (tile === 21) char.inWater = true;
    }
  }
}

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
          }
          break;

        case 21: // water
          if (char.name.toLowerCase() === "firey") {
            char.hp = 0;
          }
          break;

        case 22: // spikes
          char.hp -= 0.1; // Slow drain or instant death? Adjust as needed!
          break;
      }
    }
  }
}
