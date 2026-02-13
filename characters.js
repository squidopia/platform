import { level, TILE_SIZE, getTile } from './level.js';

export const characters = {
  firey: { name:"Firey", width:55, height:48, speed:8, jumpHeight:18, hp:4, color:"orange", vx:0, vy:0, x:0, y:0, onGround:false },
  leafy: { name:"Leafy", width:48, height:60, speed:9, jumpHeight:22, hp:3, color:"green", vx:0, vy:0, x:0, y:0, onGround:false },
  pin: { name:"Pin", width:45, height:60, speed:7, jumpHeight:20, hp:5, color:"red", vx:0, vy:0, x:0, y:0, onGround:false }

};

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
