export const TILE_SIZE = 64;

// Your level array
export let level = [
  [10,10,10,10,10,10,10,10,10,10],
  [10,0,0,0,0,0,0,0,0,10],
  [10,0,30,0,0,0,0,0,0,10], // 30 = spawn
  [10,0,0,0,0,0,0,0,0,10],
  [10,10,10,10,10,10,10,10,10,10]
];

// Get tile type at world coords
export function getTile(x, y) {
  const tx = Math.floor(x / TILE_SIZE);
  const ty = Math.floor(y / TILE_SIZE);
  if (ty < 0 || ty >= level.length || tx < 0 || tx >= level[0].length) return 0;
  return level[ty][tx];
}

// Find the first spawn (tile 30)
export function findSpawn() {
  for (let y = 0; y < level.length; y++) {
    for (let x = 0; x < level[0].length; x++) {
      if (level[y][x] === 30) return { x: x*TILE_SIZE, y: y*TILE_SIZE };
    }
  }
  return { x: 0, y: 0 };
}
