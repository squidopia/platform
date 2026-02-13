import { canvas, ctx } from './canvas.js';
import { characters, activeCharacter, switchCharacter } from './characters.js';
import { updateControls, moveCharacter } from './movement.js';
import { drawLevel, drawCharacter } from './drawing.js';
import { getCamera } from './camera.js';

// --- MAIN LOOP ---
function loop() {
  updateControls(activeCharacter);
  moveCharacter(activeCharacter);

  const camera = getCamera();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawLevel(camera.x, camera.y);

  for (let key in characters) drawCharacter(characters[key], camera.x, camera.y);

  requestAnimationFrame(loop);
}

loop();
