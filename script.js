const DEFAULT_GRID_SIZE = 16;
const MAX_GRID_SIZE = 100;
const ERASE_COLOR = '#ffffff';

const container = document.querySelector('#container');
const resizeBtn = document.querySelector('#resizeBtn');
const colorPicker = document.querySelector('#colorPicker');
const modeRainbowBtn = document.querySelector('#modeRainbow');
const modeBlackBtn = document.querySelector('#modeBlack');
const modeEraserBtn = document.querySelector('#modeEraser');

let drawMode = 'rainbow'; // 'rainbow' | 'black' | 'color' | 'eraser'

function setDrawMode(mode) {
  drawMode = mode;
  modeRainbowBtn.setAttribute('aria-pressed', String(mode === 'rainbow'));
  modeBlackBtn.setAttribute('aria-pressed', String(mode === 'black'));
  modeEraserBtn.setAttribute('aria-pressed', String(mode === 'eraser'));
}

function clearGrid() {
  container.innerHTML = '';
}

function applyDraw(square) {
  square.style.opacity = '1';

  if (drawMode === 'eraser') {
    // Reset to a "blank" square (white), regardless of screen background.
    square.style.backgroundColor = ERASE_COLOR;
    return;
  }

  if (drawMode === 'black') {
    square.style.backgroundColor = 'rgb(0, 0, 0)';
    return;
  }

  if (drawMode === 'color') {
    square.style.backgroundColor = colorPicker.value;
    return;
  }

  // rainbow
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  square.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}

function createGrid(gridSize) {
  clearGrid();

  // Compute square size from the actual rendered container (responsive)
  const containerSize = container.clientWidth;
  const squareSize = containerSize / gridSize;
  const totalSquares = gridSize * gridSize;

  for (let i = 0; i < totalSquares; i++) {
    const square = document.createElement('div');
    square.classList.add('square');
    square.style.width = `${squareSize}px`;
    square.style.height = `${squareSize}px`;
    square.style.opacity = '1';

    square.addEventListener('mouseenter', () => {
      applyDraw(square);
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
modeEraserBtn.addEventListener('click', () => setDrawMode('eraser'));
colorPicker.addEventListener('input', () => setDrawMode('color'));

setDrawMode('rainbow');
createGrid(DEFAULT_GRID_SIZE);