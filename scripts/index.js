// Random integer function with bounds validation
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  if (min > max) {
    throw new Error("Min value must be less than or equal to max");
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Secure DOM access
const canvas = document.getElementById('game');
const previewCanvas = document.getElementById('preview');
if (!canvas || !previewCanvas) {
  throw new Error("Canvas elements not found");
}
const context = canvas.getContext('2d');
const previewContext = previewCanvas.getContext('2d');

// Set scale factor safely
const scaleFactor = Math.min(window.innerWidth / 320, window.innerHeight / 640);
const grid = Math.floor(32 * scaleFactor);

// Set canvas dimensions safely
canvas.width = 320 * scaleFactor;
canvas.height = 640 * scaleFactor;
previewCanvas.width = 150 * scaleFactor;
previewCanvas.height = 175 * scaleFactor;

// Safe variable initialization
const tetrominoSequence = [];
const upcomingTetrominos = [];
const playfield = [];
const gridHeight = 20;

try {
  // Initialize playfield
  for (let row = -2; row < gridHeight; row++) {
    playfield[row] = Array(10).fill(0);
  }
} catch (e) {
  console.error("Error initializing playfield:", e);
}

// Tetromino shapes and colors, ensure data integrity
const tetrominos = {
  'I': [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
  'J': [[1,0,0],[1,1,1],[0,0,0]],
  'L': [[0,0,1],[1,1,1],[0,0,0]],
  'O': [[1,1],[1,1]],
  'S': [[0,1,1],[1,1,0],[0,0,0]],
  'Z': [[1,1,0],[0,1,1],[0,0,0]],
  'T': [[0,1,0],[1,1,1],[0,0,0]]
};

// Tetromino color mapping
const colors = {
  'I': 'cyan', 'O': 'yellow', 'T': 'purple',
  'S': 'green', 'Z': 'red', 'J': 'blue', 'L': 'orange'
};

// Generate randomized sequence securely
function generateSequence() {
  const sequence = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
  while (sequence.length) {
    const rand = getRandomInt(0, sequence.length - 1);
    const name = sequence.splice(rand, 1)[0];
    tetrominoSequence.push(name);
  }
  if (upcomingTetrominos.length === 0) {
    upcomingTetrominos.push(...tetrominoSequence.slice(-3));
  }
}

// Render the preview box securely
function renderPreview() {
  try {
    previewContext.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    upcomingTetrominos.forEach((name, index) => {
      const matrix = tetrominos[name];
      previewContext.fillStyle = colors[name];
      matrix.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (cell) {
            previewContext.fillRect(
              colIndex * grid + 10,
              rowIndex * grid + index * (grid * 3) + 10,
              grid - 2, grid - 2
            );
          }
        });
      });
    });
  } catch (e) {
    console.error("Error rendering preview:", e);
  }
}

// Get the next tetromino securely
function getNextTetromino() {
  if (tetrominoSequence.length === 0) generateSequence();

  const name = tetrominoSequence.pop();
  upcomingTetrominos.pop();
  upcomingTetrominos.unshift(tetrominoSequence[tetrominoSequence.length - 1]);

  renderPreview();

  const matrix = tetrominos[name];
  const col = Math.floor(playfield[0].length / 2 - matrix[0].length / 2);
  const row = name === 'I' ? -1 : -2;

  return { name, matrix, row, col };
}

// Rotate tetromino safely
function rotate(matrix) {
  const N = matrix.length - 1;
  return matrix.map((row, i) => row.map((val, j) => matrix[N - j][i]));
}

// Validate movement securely
function isValidMove(matrix, cellRow, cellCol) {
  return matrix.every((row, r) => row.every((cell, c) =>
    !cell || (
      cellCol + c >= 0 &&
      cellCol + c < playfield[0].length &&
      cellRow + r < playfield.length &&
      !playfield[cellRow + r][cellCol + c]
    )
  ));
}

// Clear filled lines safely
function clearLines() {
  try {
    for (let row = playfield.length - 1; row >= 0; row--) {
      if (playfield[row].every(cell => cell !== 0)) {
        playfield.splice(row, 1);
        playfield.unshift(Array(playfield[0].length).fill(0));
        row++;
      }
    }
  } catch (e) {
    console.error("Error clearing lines:", e);
  }
}

// Place the tetromino securely
function placeTetromino() {
  try {
    tetromino.matrix.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell) {
          if (tetromino.row + r < 0) return showGameOver();
          playfield[tetromino.row + r][tetromino.col + c] = tetromino.name;
        }
      });
    });
    clearLines();
    tetromino = getNextTetromino();
  } catch (e) {
    console.error("Error placing tetromino:", e);
  }
}

// Display game over screen securely
function showGameOver() {
  cancelAnimationFrame(rAF);
  gameOver = true;
  context.fillStyle = 'black';
  context.globalAlpha = 0.75;
  context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);
  context.globalAlpha = 1;
  context.fillStyle = 'white';
  context.font = '36px monospace';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2);
}

// Game variables
let count = 0;
let tetromino = getNextTetromino();
let rAF = null;
let gameOver = false;
let paused = false;

// Main game loop with secure error handling
function loop() {
  if (paused) {
    context.fillStyle = 'black';
    context.globalAlpha = 0.75;
    context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);
    context.globalAlpha = 1;
    context.fillStyle = 'white';
    context.font = '36px monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('Game Paused', canvas.width / 2, canvas.height / 2);
    return;
  }

  try {
    rAF = requestAnimationFrame(loop);
    context.clearRect(0, 0, canvas.width, canvas.height);

    playfield.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell) {
          context.fillStyle = colors[cell];
          context.fillRect(c * grid, r * grid, grid - 1, grid - 1);
        }
      });
    });

    if (tetromino) {
      if (++count > 35) {
        tetromino.row++;
        count = 0;
        if (!isValidMove(tetromino.matrix, tetromino.row, tetromino.col)) {
          tetromino.row--;
          placeTetromino();
        }
      }
      context.fillStyle = colors[tetromino.name];
      tetromino.matrix.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell) {
            context.fillRect((tetromino.col + c) * grid, (tetromino.row + r) * grid, grid - 1, grid - 1);
          }
        });
      });
    }
  } catch (e) {
    console.error("Error in game loop:", e);
  }
}

// Secure key event handling
document.addEventListener('keydown', (e) => {
  if (gameOver || paused) return;

  switch (e.key) {
    case 'ArrowLeft':
      if (isValidMove(tetromino.matrix, tetromino.row, tetromino.col - 1)) tetromino.col--;
      break;
    case 'ArrowRight':
      if (isValidMove(tetromino.matrix, tetromino.row, tetromino.col + 1)) tetromino.col++;
      break;
    case 'ArrowDown':
      if (isValidMove(tetromino.matrix, tetromino.row + 1, tetromino.col)) tetromino.row++;
      else placeTetromino();
      break;
    case 'ArrowUp':
      const rotated = rotate(tetromino.matrix);
      if (isValidMove(rotated, tetromino.row, tetromino.col)) tetromino.matrix = rotated;
      break;
  }
});

// Pause button setup
document.getElementById('pause-btn').addEventListener('click', () => {
  paused = !paused;
  if (!paused) loop();
});

// Start game loop
rAF = requestAnimationFrame(loop);
