import { TILE_SIZE, level } from './level.js';

export const characters = {
  firey: { name:"Firey", width:48, height:48, speed:8, jumpHeight:18, hp:4, color:"orange", vx:0, vy:0, x:0, y:0, onGround:false },
  leafy: { name:"Leafy", width:48, height:48, speed:9, jumpHeight:22, hp:3, color:"green", vx:0, vy:0, x:0, y:0, onGround:false }
};

export let activeCharacter = characters.firey;

// safe spawn above empty tiles
export function spawnCharacter(char, startX = 0) {
  for (let y = 0; y < level.length; y++) {
    if (level[y][startX] === 0 && level[y+1] && level[y+1][startX] === 1) {
      char.x = startX * TILE_SIZE + (TILE_SIZE - char.width)/2;
      char.y = y * TILE_SIZE;
      return;
    }
  }
  char.x = startX * TILE_SIZE;
  char.y = 0;
}

// initialize spawn
spawnCharacter(characters.firey, 0);
spawnCharacter(characters.leafy, 1);

export function switchCharacter(name) {
  if (characters[name]) activeCharacter = characters[name];
}
