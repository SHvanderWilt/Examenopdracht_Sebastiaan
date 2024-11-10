function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const previewCanvas = document.getElementById('preview');
const previewContext = previewCanvas.getContext('2d');
const scaleFactor = Math.min(window.innerWidth / 320, window.innerHeight / 640);
const grid = Math.floor(32 * scaleFactor);
canvas.width = 320 * scaleFactor;
canvas.height = 640 * scaleFactor;
previewCanvas.width = 150 * scaleFactor;
previewCanvas.height = 175 * scaleFactor;

const tetrominoSequence = [];
const upcomingTetrominos = [];
const playfield = [];
const gridHeight = 20;

for (let row = -2; row < 20; row++) {
  playfield[row] = [];
  for (let col = 0; col < 10; col++) {
    playfield[row][col] = 0;
  }
}

const tetrominos = {
  'I': [
    [0,0,0,0],
    [1,1,1,1],
    [0,0,0,0],
    [0,0,0,0]
  ],
  'J': [
    [1,0,0],
    [1,1,1],
    [0,0,0],
  ],
  'L': [
    [0,0,1],
    [1,1,1],
    [0,0,0],
  ],
  'O': [
    [1,1],
    [1,1],
  ],
  'S': [
    [0,1,1],
    [1,1,0],
    [0,0,0],
  ],
  'Z': [
    [1,1,0],
    [0,1,1],
    [0,0,0],
  ],
  'T': [
    [0,1,0],
    [1,1,1],
    [0,0,0],
  ]
};

const colors = {
  'I': 'cyan',
  'O': 'yellow',
  'T': 'purple',
  'S': 'green',
  'Z': 'red',
  'J': 'blue',
  'L': 'orange'
};

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

function renderPreview() {
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
            grid - 2,
            grid - 2
          );
        }
      });
    });
  });
}

function getNextTetromino() {
  if (tetrominoSequence.length === 0) {
    generateSequence();
  }

  const name = tetrominoSequence.pop();
  upcomingTetrominos.pop();
  upcomingTetrominos.unshift(tetrominoSequence[tetrominoSequence.length - 1]);
  renderPreview();

  const matrix = tetrominos[name];
  const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);
  const row = name === 'I' ? -1 : -2;

  return {
    name: name,
    matrix: matrix,
    row: row,
    col: col
  };
}

function rotate(matrix) {
  const N = matrix.length - 1;
  return matrix.map((row, i) =>
    row.map((val, j) => matrix[N - j][i])
  );
}

function isValidMove(matrix, cellRow, cellCol) {
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (matrix[row][col] && (
          cellCol + col < 0 ||
          cellCol + col >= playfield[0].length ||
          cellRow + row >= playfield.length ||
          playfield[cellRow + row][cellCol + col])
        ) {
        return false;
      }
    }
  }
  return true;
}

function placeTetromino() {
  for (let row = 0; row < tetromino.matrix.length; row++) {
    for (let col = 0; col < tetromino.matrix[row].length; col++) {
      if (tetromino.matrix[row][col]) {
        if (tetromino.row + row < 0) {
          return showGameOver();
        }
        playfield[tetromino.row + row][tetromino.col + col] = tetromino.name;
      }
    }
  }
  clearLines();
  tetromino = getNextTetromino();
}

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

let count = 0;
let tetromino = getNextTetromino();
let rAF = null;
let gameOver = false;
let paused = false;

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

  rAF = requestAnimationFrame(loop);
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < 20; row++) {
    for (let col = 0; col < 10; col++) {
      if (playfield[row][col]) {
        const name = playfield[row][col];
        context.fillStyle = colors[name];
        context.fillRect(col * grid, row * grid, grid - 1, grid - 1);
      }
    }
  }

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
    for (let row = 0; row < tetromino.matrix.length; row++) {
      for (let col = 0; col < tetromino.matrix[row].length; col++) {
        if (tetromino.matrix[row][col]) {
          context.fillRect((tetromino.col + col) * grid, (tetromino.row + row) * grid, grid - 1, grid - 1);
        }
      }
    }
  }
}

document.addEventListener('keydown', function(e) {
  if (gameOver) return;

  // if (e.which === 32) { // Space bar key to toggle pause
  //   paused = !paused;
  //   if (!paused) {
  //     loop(); // Restart the loop if unpaused
  //   }
  // }

  if (paused) return;

  switch (e.which) {
    case 37: // Left arrow
      if (isValidMove(tetromino.matrix, tetromino.row, tetromino.col - 1)) {
        tetromino.col--;
      }
      break;
    case 39: // Right arrow
      if (isValidMove(tetromino.matrix, tetromino.row, tetromino.col + 1)) {
        tetromino.col++;
      }
      break;
    case 40: // Down arrow
      if (isValidMove(tetromino.matrix, tetromino.row + 1, tetromino.col)) {
        tetromino.row++;
      } else {
        placeTetromino();
      }
      break;
    case 38: // Up arrow (rotate)
      const rotated = rotate(tetromino.matrix);
      if (isValidMove(rotated, tetromino.row, tetromino.col)) {
        tetromino.matrix = rotated;
      }
      break;
  }
});

document.getElementById('pause-btn').addEventListener('click', () => {
  paused = !paused;
  if (!paused) {
    loop(); // Restart the loop if unpaused
  }
});

loop();  // Start the game loop initially
