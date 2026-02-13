// drawing.js
import { ctx } from './canvas.js';
import { level, TILE_SIZE } from './level.js';
import { characters } from './characters.js';

// --- Tile colors ---
const TILE_COLORS = {
  10: "#8B0000",  // dark red
  11: "#000000",  // black
  12: "#8B4513",  // brown
  13: "#008000",  // green
  20: "#FF4500",  // lava
  21: "#1E90FF",  // water
  22: "#808080",  // gray (spikes later)
  30: "#FFFF00"   // spawn tile
};

// --- Draw the level ---
export function drawLevel(cameraX, cameraY) {
  for (let y = 0; y < level.length; y++) {
    for (let x = 0; x < level[y].length; x++) {
      const tile = level[y][x];
      if (tile === 0) continue;

      ctx.fillStyle = TILE_COLORS[tile] || "#FF69B4"; // default pink
      ctx.fillRect(
        x * TILE_SIZE - cameraX,
        y * TILE_SIZE - cameraY,
        TILE_SIZE,
        TILE_SIZE
      );

      // Spawn tile marker
      if (tile === 30) {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(
          x * TILE_SIZE - cameraX + TILE_SIZE/2,
          y * TILE_SIZE - cameraY + TILE_SIZE/2,
          TILE_SIZE/4,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }
  }
}

// --- Draw all characters ---
export function drawCharacters(cameraX, cameraY) {
  for (let key in characters) {
    const char = characters[key];

    // Only draw if image is loaded
    if (char._img && char._img.complete) {
      ctx.drawImage(
        char._img,
        char.x - cameraX,
        char.y - cameraY,
        char.width,
        char.height
      );
    } else {
      // fallback rectangle while image loads
      ctx.fillStyle = "gray";
      ctx.fillRect(char.x - cameraX, char.y - cameraY, char.width, char.height);
    }

    // Draw HP bar
    ctx.fillStyle = "red";
    const hpWidth = (char.hp / 4) * char.width; // assumes max HP = 4
    ctx.fillRect(char.x - cameraX, char.y - 10 - cameraY, hpWidth, 5);
    ctx.strokeStyle = "black";
    ctx.strokeRect(char.x - cameraX, char.y - 10 - cameraY, char.width, 5);
  }
}
