import { level, TILE_SIZE, getTile } from './level.js';

// characters.js
export const characters = {
  firey: { name:"Firey", width:36, height:48, speed:6, jumpHeight:12, hp:4, image:"assets/firey.png", vx:0, vy:0, x:0, y:0, onGround:false },
  leafy: { name:"Leafy", width:36, height:64, speed:7, jumpHeight:18, hp:3, image:"assets/leafy.png", vx:0, vy:0, x:0, y:0, onGround:false },
  pin: { name:"Pin", width:36, height:57, speed:6, jumpHeight:14, hp:5, image:"assets/pin.png", vx:0, vy:0, x:0, y:0, onGround:false }
};


// Preload images
for (let key in characters) {
  const char = characters[key];
  char._img = new Image();
  char._img.src = char.image;
}


export const gameState = {
  activeCharacter: characters.firey
};

// --- Better spawn function ---
export function spawnCharacter(char) {
  // Look for the first spawn tile (30) anywhere
  for (let y = 0; y < level.length; y++) {
    for (let x = 0; x < level[y].length; x++) {
      if (level[y][x] === 30) {
        char.x = x * TILE_SIZE + (TILE_SIZE - char.width)/2;
        char.y = y * TILE_SIZE;
        return;
      }
    }
  }

  // fallback: empty above solid
  for (let y = 0; y < level.length; y++) {
    for (let x = 0; x < level[y].length; x++) {
      if (level[y][x] === 0 && level[y+1] && level[y+1][x] >= 10 && level[y+1][x] <= 13) {
        char.x = x * TILE_SIZE + (TILE_SIZE - char.width)/2;
        char.y = y * TILE_SIZE;
        return;
      }
    }
  }

  // default fallback
  char.x = 0;
  char.y = 0;
}

// Initialize spawns
spawnCharacter(characters.firey);
spawnCharacter(characters.leafy);
spawnCharacter(characters.pin);


export function switchCharacter(name) {
  if (characters[name]) gameState.activeCharacter = characters[name];
}
