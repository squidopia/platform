import { activeCharacter } from './characters.js';

export function getCamera() {
  const lerp = 0.1;
  if (!getCamera.x) getCamera.x = activeCharacter.x - window.innerWidth / 2;
  if (!getCamera.y) getCamera.y = activeCharacter.y - window.innerHeight / 2;

  getCamera.x += ((activeCharacter.x - window.innerWidth / 2) - getCamera.x) * lerp;
  getCamera.y += ((activeCharacter.y - window.innerHeight / 2) - getCamera.y) * lerp;
  return { x: getCamera.x, y: getCamera.y };
}
