// drawing.js
import { ctx } from './canvas.js';
import { level, TILE_SIZE } from './level.js';
import { characters } from './characters.js';

// --- Image loader ---
const images = {};

function loadImage(name, src) {
  const img = new Image();
  img.src = src;
  images[name] = img;
}

// Load your tile images here
loadImage("grass", "./grass.png");

// --- Tile definitions ---
// use either:
//   color: "#hex"
//   img: "imageKey"

const TILES = {
  10: { color: "#8B0000" }, // DO NOT CHANGE COLOR!!!
  11: { color: "#000000" },
  12: { color: "#8B4513" },
  13: { img: "grass" },     // IMAGE TILE
  20: { color: "#FF4500" },
  21: { color: "#1E90FF" },
  22: { color: "#808080" },
  30: { color: "#FFFF00" }
};

// --- Draw the level ---
export function drawLevel(cameraX, cameraY) {
  for (let y = 0; y < level.length; y++) {
    for (let x = 0; x < level[y].length; x++) {
      const tile = level[y][x];
      if (tile === 0) continue;

      const def = TILES[tile];

      const drawX = x * TILE_SIZE - cameraX;
      const drawY = y * TILE_SIZE - cameraY;

      if (def?.img && images[def.img]?.complete) {
        ctx.drawImage(images[def.img], drawX, drawY, TILE_SIZE, TILE_SIZE);
      } else {
        ctx.fillStyle = def?.color || "#FF69B4";
        ctx.fillRect(drawX, drawY, TILE_SIZE, TILE_SIZE);
      }

      // Spawn tile marker
      if (tile === 30) {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(
          drawX + TILE_SIZE/2,
          drawY + TILE_SIZE/2,
          TILE_SIZE/4,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }
  }
}

// --- Draw characters ---
export function drawCharacters(cameraX, cameraY) {
  for (let key in characters) {
    const char = characters[key];

    if (char._img && char._img.complete) {
      ctx.drawImage(
        char._img,
        char.x - cameraX,
        char.y - cameraY,
        char.width,
        char.height
      );
    } else {
      ctx.fillStyle = "gray";
      ctx.fillRect(
        char.x - cameraX,
        char.y - cameraY,
        char.width,
        char.height
      );
    }

    // HP bar
    ctx.fillStyle = "red";
    const hpWidth = (char.hp / 4) * char.width;
    ctx.fillRect(char.x - cameraX, char.y - 10 - cameraY, hpWidth, 5);

    ctx.strokeStyle = "black";
    ctx.strokeRect(char.x - cameraX, char.y - 10 - cameraY, char.width, 5);
  }
}
