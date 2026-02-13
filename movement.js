// ===============================
// === PHYSICS SETTINGS (TWEAK) ===
// ===============================

const PHYSICS = {
  gravityNormal: 0.8,
  gravityLiquid: 0.08,
  maxFallSpeed: 15,
  groundFriction: 0.95
};


// --- Movement and collision ---
export function moveCharacter() {
  const char = gameState.activeCharacter;

  // Reset hazard flags BEFORE physics
  char.inWater = false;
  char.inLava = false;

  // Apply gravity
  const gravity = (char.inWater || char.inLava)
    ? PHYSICS.gravityLiquid
    : PHYSICS.gravityNormal;

  char.vy += gravity;

  // Terminal velocity
  if (char.vy > PHYSICS.maxFallSpeed) {
    char.vy = PHYSICS.maxFallSpeed;
  }

  // Horizontal movement
  moveAxis(char, char.vx, 0);

  // Vertical movement
  moveAxis(char, 0, char.vy);

  // Ground friction
  if (char.onGround) {
    char.vx *= PHYSICS.groundFriction;
  }

  // Check hazards AFTER movement
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


// --- Hazard handling ---
function handleHazards(char) {
  const startX = Math.floor(char.x / TILE_SIZE);
  const endX = Math.floor((char.x + char.width - 1) / TILE_SIZE);
  const startY = Math.floor(char.y / TILE_SIZE);
  const endY = Math.floor((char.y + char.height - 1) / TILE_SIZE);

  for (let y = startY; y <= endY; y++) {   // FIXED LOOP
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
