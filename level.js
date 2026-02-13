export const TILE_SIZE = 32;

// Your level array
export let level = [
  // Sky
  Array(40).fill(0),
  Array(40).fill(0),
  Array(40).fill(0),
  Array(40).fill(0),
  Array(40).fill(0),

  // Spawn + small obstacles
  [0,0,0,0,0,0,0,12,12,0,0,10,10,10,0,0,0,12,12,0,0,10,10,10,0,0,0,12,12,0,0,10,10,10,0,0,0,0,0,0],
  [0,0,0,10,10,0,12,12,12,0,0,0,0,12,12,12,0,0,0,10,10,10,0,0,12,12,12,0,0,0,0,10,10,10,0,0,0,0,0,0],
  [0,0,0,0,0,0,10,10,10,0,12,12,12,0,0,0,10,10,10,0,12,12,12,0,0,0,10,10,10,0,12,12,12,0,0,0,0,0,0,0],

  // Lava and water row
  [0,0,0,0,0,0,0,20,20,20,0,0,0,0,21,21,21,0,0,0,20,20,20,0,0,0,0,21,21,21,0,0,0,0,20,20,20,0,0,0],
  
  // Mid section: spikes + small platforms
  [0,0,22,22,22,0,0,10,10,10,0,0,22,22,22,0,0,10,10,10,0,0,22,22,22,0,0,10,10,10,0,0,22,22,22,0,0,0,0,0],
  [0,10,10,0,0,12,12,12,0,0,10,10,10,0,0,12,12,12,0,0,10,10,10,0,0,12,12,12,0,0,10,10,10,0,0,12,12,12,0,0],

  // Long ground to show all base tiles
  Array(40).fill(10),
  Array(40).fill(10),
  Array(40).fill(12),
  Array(40).fill(12),
  Array(40).fill(0),

  // Final section: mix of everything for style
  [10,10,0,0,20,20,0,0,22,22,22,0,0,12,12,12,0,10,10,10,0,21,21,21,0,0,22,22,22,0,12,12,12,0,0,10,10,10,0,0],
  [0,0,12,12,0,0,21,21,0,0,10,10,10,0,12,12,12,0,0,10,10,10,0,0,20,20,0,0,22,22,22,0,0,12,12,12,0,10,10,0,0],

  // Finish with some sky rows
  Array(40).fill(0),
  Array(40).fill(0),
  Array(40).fill(0)
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
