import { gameState } from './characters.js';
import { canvas } from './canvas.js';

export function getCamera() {
  const lerp = 0.1;
  if (!getCamera.x) getCamera.x = gameState.activeCharacter.x - canvas.width / 2;
  if (!getCamera.y) getCamera.y = gameState.activeCharacter.y - canvas.height / 2;

  getCamera.x += ((gameState.activeCharacter.x - canvas.width / 2) - getCamera.x) * lerp;
  getCamera.y += ((gameState.activeCharacter.y - canvas.height / 2) - getCamera.y) * lerp;

  return { x: getCamera.x, y: getCamera.y };
}
