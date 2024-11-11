let score = 0;
let level = 1;
let linesCleared = 0;
const MAX_LEVEL = 10;

// Points per lines cleared
function updateScore(lines) {
  const points = [0, 100, 300, 500, 800];
  score += points[lines] * level;
  linesCleared += lines;

  if (linesCleared >= 10 * level && level < MAX_LEVEL) {
    level++;
    updateGameSpeed(); // This function should adjust the game speed based on level
  }

  updateScoreDisplay();
}

// Clear completed lines and update the score
function clearLines() {
  let lines = 0;

  for (let row = gridHeight - 1; row >= 0; row--) {
    if (isLineComplete(row)) {
      removeLine(row);
      lines++;
    }
  }

  if (lines > 0) {
    updateScore(lines);
  }
}

// Check if a line is complete
function isLineComplete(row) {
  try {
    return playfield[row].every(cell => !!cell);
  } catch (e) {
    console.error("Error checking line completion:", e);
    return false;
  }
}

// Remove a completed line and shift rows down
function removeLine(row) {
  try {
    for (let r = row; r > 0; r--) {
      playfield[r] = playfield[r - 1];
    }
    playfield[0] = new Array(playfield[0].length).fill(0);
  } catch (e) {
    console.error("Error removing line:", e);
  }
}

// Update score display elements
function updateScoreDisplay() {
  const scoreDisplay = document.getElementById('scoreDisplay');
  const levelDisplay = document.getElementById('levelDisplay');
  if (scoreDisplay && levelDisplay) {
    scoreDisplay.textContent = `Score: ${score}`;
    levelDisplay.textContent = `Level: ${level}`;
  } else {
    console.error("Score display elements not found.");
  }
}

// Reset the entire game
function resetGame() {
  score = 0;
  level = 1;
  linesCleared = 0;
  updateScoreDisplay();

  // Clear playfield
  for (let row = 0; row < playfield.length; row++) {
    playfield[row].fill(0);
  }

  // Reset sequence and preview
  tetrominoSequence.length = 0;
  upcomingTetrominos.length = 0;
  generateSequence();
  renderPreview();

  // Reset game state
  gameOver = false;
  paused = false;
  count = 0;
  tetromino = getNextTetromino();

  // Restart the game loop
  cancelAnimationFrame(rAF);
  rAF = requestAnimationFrame(loop);
}

// Reset the current level without affecting score
function resetLevel() {
  for (let row = 0; row < playfield.length; row++) {
    playfield[row].fill(0);
  }

  // Reset tetromino sequence and preview
  tetrominoSequence.length = 0;
  upcomingTetrominos.length = 0;
  generateSequence();
  renderPreview();
  tetromino = getNextTetromino();

  // Restart the game loop
  cancelAnimationFrame(rAF);
  rAF = requestAnimationFrame(loop);
}

// Modal controls with secure button handling
function setupModalControls() {
  const resetBtn = document.getElementById('reset-btn');
  const resetModal = document.getElementById('resetModal');
  const resetGameBtn = document.getElementById('resetGameBtn');
  const resetLevelBtn = document.getElementById('resetLevelBtn');
  const cancelBtn = document.getElementById('cancelBtn');

  if (resetBtn && resetModal && resetGameBtn && resetLevelBtn && cancelBtn) {
    resetBtn.addEventListener('click', () => {
      paused = true;
      resetModal.style.display = 'flex';
    });

    resetGameBtn.addEventListener('click', () => {
      location.reload();
    });

    resetLevelBtn.addEventListener('click', () => {
      resetLevel();
      closeModal();
      paused = false;
      loop();
    });

    cancelBtn.addEventListener('click', () => {
      closeModal();
      paused = false;
      loop();
    });
  } else {
    console.error("One or more modal control elements not found.");
  }
}

// Close the reset modal
function closeModal() {
  const resetModal = document.getElementById('resetModal');
  if (resetModal) {
    resetModal.style.display = 'none';
  } else {
    console.error("Reset modal element not found.");
  }
}

// Initialize modal controls at the start
setupModalControls();
