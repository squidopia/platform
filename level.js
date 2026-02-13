import { TILE_SIZE } from './canvas.js';

export const level = [
  [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10],
 [10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10],
 [10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10],
 [10,0,0,0,0,0,0,30,0,0,0,0,0,0,0,0,0,0,0,10],
 [10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10,10],
 [10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10,10,10],
 [10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10,10,10,10],
  [10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10,10,10,10,10],
  [10,0,0,0,0,0,0,0,0,10,10,10,0,0,0,10,10,10,10,10],
  [10,0,0,10,10,10,0,0,0,10,10,10,0,0,0,10,10,10,10,10],
  [10,20,20,10,10,10,20,20,20,10,10,10,20,20,20,10,10,10,10,10],
  [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10]
];


export const TILE_TYPES = {
  0: "#87CEEB",  // empty
  10: "#8B0000", // dark red
  11: "#000000", // black
  12: "#8B4513", // brown
  13: "#008000", // green
  20: "#FF4500", // lava
  21: "#1E90FF", // water
  22: "#808080", // spikes
  30: "#FFD700"  // spawn
};

// optional helper to get tile at coordinates
export function getTile(x, y) {
  const tx = Math.floor(x / TILE_SIZE);
  const ty = Math.floor(y / TILE_SIZE);
  if (ty < 0 || ty >= level.length || tx < 0 || tx >= level[0].length) return 0;
  return level[ty][tx];
}

// helper to find spawn
export function findSpawn() {
  for (let y = 0; y < level.length; y++) {
    for (let x = 0; x < level[0].length; x++) {
      if (level[y][x] === 30) return { x: x*TILE_SIZE, y: y*TILE_SIZE };
    }
  }
  return { x: 0, y: 0 };
}

