export const TILE_SIZE = 64;

export const level = [
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,,0,0,0,0,0],
  [0,0,0,0,0,11,11,11,11,11],
  [11,11,11,11,11,12,12,12,12,12],
  [12,12,12,12,12,12,12,12,12,12], // ground row
];

export function getTile(x, y) {
  const tx = Math.floor(x / TILE_SIZE);
  const ty = Math.floor(y / TILE_SIZE);
  if (ty < 0 || ty >= level.length || tx < 0 || tx >= level[0].length) return 0;
  return level[ty][tx];
}

