const CONTAINER_SIZE = 960;
const DEFAULT_GRID_SIZE = 16;
const MAX_GRID_SIZE = 100;

const container = document.querySelector('#container');
const resizeBtn = document.querySelector('#resizeBtn');

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

    square.addEventListener('mouseenter', () => {
      square.classList.add('active');
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

createGrid(DEFAULT_GRID_SIZE);