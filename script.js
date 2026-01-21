const DEFAULT_GRID_SIZE = 16;
const MAX_GRID_SIZE = 100;
const ERASE_COLOR = '#ffffff';

const container = document.querySelector('#container');
const resizeBtn = document.querySelector('#resizeBtn');
const gridSizeSlider = document.querySelector('#grid-size-slider');
const gridSizeDisplay = document.querySelector('#grid-size-display');
const colorPicker = document.querySelector('#colorPicker');
const modeRainbowBtn = document.querySelector('#modeRainbow');
const modeBlackBtn = document.querySelector('#modeBlack');
const modeEraserBtn = document.querySelector('#modeEraser');
const brightnessSlider = document.querySelector('#brightness-slider');

let drawMode = 'rainbow'; // 'rainbow' | 'black' | 'color' | 'eraser'
let brightnessValue = Number(brightnessSlider.value); // 0-100, 50 = neutral

function setDrawMode(mode) {
  drawMode = mode;
  modeRainbowBtn.setAttribute('aria-pressed', String(mode === 'rainbow'));
  modeBlackBtn.setAttribute('aria-pressed', String(mode === 'black'));
  modeEraserBtn.setAttribute('aria-pressed', String(mode === 'eraser'));
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function hexToRgb(hex) {
  const normalized = hex.replace('#', '');
  const int = Number.parseInt(normalized, 16);
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
}

function rgbToHsl(r, g, b) {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));

    switch (max) {
      case rNorm:
        h = 60 * (((gNorm - bNorm) / delta) % 6);
        break;
      case gNorm:
        h = 60 * ((bNorm - rNorm) / delta + 2);
        break;
      default:
        h = 60 * ((rNorm - gNorm) / delta + 4);
        break;
    }
  }

  return {
    h: (h + 360) % 360,
    s: s * 100,
    l: l * 100,
  };
}

function hslToRgb(h, s, l) {
  const sNorm = s / 100;
  const lNorm = l / 100;

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lNorm - c / 2;

  let rPrime = 0;
  let gPrime = 0;
  let bPrime = 0;

  if (h < 60) {
    rPrime = c;
    gPrime = x;
  } else if (h < 120) {
    rPrime = x;
    gPrime = c;
  } else if (h < 180) {
    gPrime = c;
    bPrime = x;
  } else if (h < 240) {
    gPrime = x;
    bPrime = c;
  } else if (h < 300) {
    rPrime = x;
    bPrime = c;
  } else {
    rPrime = c;
    bPrime = x;
  }

  return {
    r: Math.round((rPrime + m) * 255),
    g: Math.round((gPrime + m) * 255),
    b: Math.round((bPrime + m) * 255),
  };
}

function adjustLightness(rgb, sliderValue) {
  const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // sliderValue: 0..100, center 50 = neutral
  const t = (sliderValue - 50) / 50; // -1..1
  let newL = l;

  if (t < 0) {
    // Move toward black
    newL = l * (1 + t);
  } else if (t > 0) {
    // Move toward white
    newL = l + (100 - l) * t;
  }

  const clampedL = clamp(newL, 0, 100);
  return hslToRgb(h, s, clampedL);
}

function rgbToCss({ r, g, b }) {
  return `rgb(${r}, ${g}, ${b})`;
}

function randomRgb() {
  return {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
  };
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

  let baseRgb;

  if (drawMode === 'black') {
    baseRgb = { r: 0, g: 0, b: 0 };
  } else if (drawMode === 'color') {
    baseRgb = hexToRgb(colorPicker.value);
  } else {
    baseRgb = randomRgb();
  }

  const adjusted = adjustLightness(baseRgb, brightnessValue);
  square.style.backgroundColor = rgbToCss(adjusted);
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

function updateGridSizeDisplay(size) {
  gridSizeDisplay.textContent = `${size} x ${size}`;
}

gridSizeSlider.addEventListener('input', (event) => {
  const newSize = Number(event.target.value);
  updateGridSizeDisplay(newSize);
  createGrid(newSize);
});

resizeBtn.addEventListener('click', () => {
  const currentSize = Number(gridSizeSlider.value);
  createGrid(currentSize);
});

modeRainbowBtn.addEventListener('click', () => setDrawMode('rainbow'));
modeBlackBtn.addEventListener('click', () => setDrawMode('black'));
modeEraserBtn.addEventListener('click', () => setDrawMode('eraser'));
colorPicker.addEventListener('input', () => setDrawMode('color'));
brightnessSlider.addEventListener('input', (event) => {
  brightnessValue = Number(event.target.value);
});

setDrawMode('rainbow');
updateGridSizeDisplay(DEFAULT_GRID_SIZE);
createGrid(DEFAULT_GRID_SIZE);