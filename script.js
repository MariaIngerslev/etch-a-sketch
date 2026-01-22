/* Constants */
const DEFAULT_GRID_SIZE = 16;
const ERASE_COLOR = '#fff'; // Matches square background

/* DOM Elements */
const container = document.querySelector('#container');
const clearBtn = document.querySelector('#clearBtn');
const gridSizeSlider = document.querySelector('#grid-size-slider');
const gridSizeDisplay = document.querySelector('#grid-size-display');
const colorPicker = document.querySelector('#colorPicker');
const brightnessSlider = document.querySelector('#brightness-slider');

/* Mode Buttons */
const modeRainbowBtn = document.querySelector('#modeRainbow');
const modeBlackBtn = document.querySelector('#modeBlack');
const modeEraserBtn = document.querySelector('#modeEraser');

/* State */
let drawMode = 'rainbow'; 
let brightnessValue = 50; 

/* --- LOGIC --- */

function setDrawMode(mode) {
  drawMode = mode;
  modeRainbowBtn.setAttribute('aria-pressed', String(mode === 'rainbow'));
  modeBlackBtn.setAttribute('aria-pressed', String(mode === 'black'));
  modeEraserBtn.setAttribute('aria-pressed', String(mode === 'eraser'));
}

function hexToRgb(hex) {
  const normalized = hex.replace('#', '');
  const int = parseInt(normalized, 16);
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}

function rgbToHsl(r, g, b) {
  const rNorm = r / 255, gNorm = g / 255, bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm), min = Math.min(rNorm, gNorm, bNorm);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
      case gNorm: h = (bNorm - rNorm) / d + 2; break;
      case bNorm: h = (rNorm - gNorm) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToRgb(h, s, l) {
  s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return { 
      r: Math.round(255 * f(0)), 
      g: Math.round(255 * f(8)), 
      b: Math.round(255 * f(4)) 
  };
}

function adjustLightness(rgb, sliderValue) {
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const factor = (sliderValue - 50) / 50; 
  let newL = hsl.l;
  if (factor < 0) {
      newL = hsl.l * (1 + factor); 
  } else {
      newL = hsl.l + (100 - hsl.l) * factor;
  }
  return hslToRgb(hsl.h, hsl.s, newL);
}

function randomRgb() {
  return {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
  };
}

/* --- GRID LOGIC --- */

function clearGrid() {
  container.innerHTML = '';
}

function applyDraw(square) {
  if (drawMode === 'eraser') {
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
  square.style.backgroundColor = `rgb(${adjusted.r}, ${adjusted.g}, ${adjusted.b})`;
}

function createGrid(size) {
  clearGrid();
  // Fixed container size to match the CSS-defined screen dimensions
  const containerSize = 640;
  const squareSize = containerSize / size;

  for (let i = 0; i < size * size; i++) {
    const square = document.createElement('div');
    square.classList.add('square');
    square.style.width = `${squareSize}px`;
    square.style.height = `${squareSize}px`;
    
    square.addEventListener('mouseenter', () => applyDraw(square));
    container.appendChild(square);
  }
}

/* --- EVENT LISTENERS --- */

gridSizeSlider.addEventListener('input', (e) => {
  const size = e.target.value;
  gridSizeDisplay.textContent = `${size} x ${size}`;
  createGrid(size);
});

clearBtn.addEventListener('click', () => {
  createGrid(gridSizeSlider.value);
});

modeRainbowBtn.addEventListener('click', () => setDrawMode('rainbow'));
modeBlackBtn.addEventListener('click', () => setDrawMode('black'));
modeEraserBtn.addEventListener('click', () => setDrawMode('eraser'));

colorPicker.addEventListener('input', () => {
    setDrawMode('color');
});
colorPicker.addEventListener('click', () => setDrawMode('color'));

brightnessSlider.addEventListener('input', (e) => {
  brightnessValue = Number(e.target.value);
});

/* --- INIT --- */
createGrid(DEFAULT_GRID_SIZE);