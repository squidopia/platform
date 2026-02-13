export const canvas = document.getElementById("game");
export const ctx = canvas.getContext("2d");

// Set canvas to full window size
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
