export const TILE_SIZE = 64;

export const level = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,13,13,13,13,13],
  [0,0,0,0,0,13,13,0,13,13,13,13,13,13,13,12,12,12,12,12,12,12],
  [13,13,13,13,11,0,12,12,12,12, 12,12,12,12,12,12,12,12,12,12],
  [12,12,12,12,12,0,12,12,12,12,12,12,12,12,12,12,12,12,12,12], // ground row
];

export function getTile(x, y) {
  const tx = Math.floor(x / TILE_SIZE);
  const ty = Math.floor(y / TILE_SIZE);
  if (ty < 0 || ty >= level.length || tx < 0 || tx >= level[0].length) return 0;
  return level[ty][tx];
}

