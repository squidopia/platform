import { canvas, ctx } from './canvas.js';
import { updateControls, moveCharacter } from './movement.js';
import { drawLevel, drawCharacters } from './drawing.js';
import { getCamera } from './camera.js';

function loop() {
  updateControls();
  moveCharacter();

  const camera = getCamera();
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawLevel(camera.x, camera.y);
  drawCharacters(camera.x, camera.y);

  requestAnimationFrame(loop);
}

loop();
