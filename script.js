const CONTAINER_SIZE = 960;
const DEFAULT_GRID_SIZE = 16;
const MAX_GRID_SIZE = 100;

const container = document.querySelector('#container');
const resizeBtn = document.querySelector('#resizeBtn');
const modeRainbowBtn = document.querySelector('#modeRainbow');
const modeBlackBtn = document.querySelector('#modeBlack');

let drawMode = 'rainbow'; // 'rainbow' | 'black'

function setDrawMode(mode) {
  drawMode = mode;
  const isRainbow = mode === 'rainbow';
  modeRainbowBtn.setAttribute('aria-pressed', String(isRainbow));
  modeBlackBtn.setAttribute('aria-pressed', String(!isRainbow));
}

function clearGrid() {
  container.innerHTML = '';
}

function createGrid(gridSize) {
  clearGrid();

  // Keep layout stable even if CSS changes later
  container.style.width = `${CONTAINER_SIZE}px`;
  container.style.height = `${CONTAINER_SIZE}px`;

  const squareSize = CONTAINER_SIZE / gridSize;
  const totalSquares = gridSize * gridSize;

  for (let i = 0; i < totalSquares; i++) {
    const square = document.createElement('div');
    square.classList.add('square');
    square.style.width = `${squareSize}px`;
    square.style.height = `${squareSize}px`;
    square.dataset.darkness = '0';
    square.style.opacity = '1';

    square.addEventListener('mouseenter', () => {
      // Progressive darkening: 10 interactions -> fully opaque (alpha = 1.0)
      const current = Number.parseInt(square.dataset.darkness ?? '0', 10) || 0;
      const next = Math.min(current + 1, 10);
      square.dataset.darkness = String(next);

      if (drawMode === 'black') {
        square.style.backgroundColor = 'rgb(0, 0, 0)';
      } else {
        // Randomize RGB on every interaction
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        square.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
      }

      // Use CSS opacity for the 10% progressive darkening effect
      square.style.opacity = String(next / 10);
    });

    container.appendChild(square);
  }
}

function promptForGridSize() {
  while (true) {
    const raw = prompt(`Enter grid size (1-${MAX_GRID_SIZE})`, `${DEFAULT_GRID_SIZE}`);
    if (raw === null) return null; // user cancelled

    const n = Number.parseInt(raw, 10);
    const isValid = Number.isInteger(n) && n >= 1 && n <= MAX_GRID_SIZE;
    if (isValid) return n;

    alert(`Please enter a whole number between 1 and ${MAX_GRID_SIZE}.`);
  }
}

resizeBtn.addEventListener('click', () => {
  const newSize = promptForGridSize();
  if (newSize === null) return;
  createGrid(newSize);
});

modeRainbowBtn.addEventListener('click', () => setDrawMode('rainbow'));
modeBlackBtn.addEventListener('click', () => setDrawMode('black'));

setDrawMode('rainbow');
createGrid(DEFAULT_GRID_SIZE);