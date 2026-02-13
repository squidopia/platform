export const characters = {
  firey: { ... },
  leafy: { ... }
};
export let activeCharacter = characters.firey;

export function switchCharacter(name) {
  if (characters[name]) activeCharacter = characters[name];
}

export function spawnCharacter(char, startX) { ... }
