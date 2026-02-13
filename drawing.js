import { level, TILE_SIZE } from './level.js';
import { ctx } from './canvas.js';

export function drawLevel(cameraX, cameraY) {
  for (let y = 0; y < level.length; y++) {
    for (let x = 0; x < level[y].length; x++) {
      const tile = level[y][x];
      if (tile === 0) continue;
      ctx.fillStyle = tile === 1 ? "#8B4513" : "#FF4500";
      ctx.fillRect(x*TILE_SIZE - cameraX, y*TILE_SIZE - cameraY, TILE_SIZE, TILE_SIZE);
    }
  }
}

export function drawCharacter(char, cameraX, cameraY) {
  ctx.fillStyle = char.color;
  ctx.fillRect(char.x - cameraX, char.y - cameraY, char.width, char.height);

  // HP bar
  ctx.fillStyle = "red";
  ctx.fillRect(char.x - cameraX, char.y - 10 - cameraY, char.width * (char.hp / 4), 5);
}
