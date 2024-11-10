let score = 0;
let level = 1;
let linesCleared = 0;
const MAX_LEVEL = 10;

function updateScore(lines) {
    const points = [0, 100, 300, 500, 800];
    score += points[lines] * level;
    linesCleared += lines;

    if (linesCleared >= 10 * level && level < MAX_LEVEL) {
        level++;
        updateGameSpeed();
    }
    
    updateScoreDisplay();
}

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

function isLineComplete(row) {
    return playfield[row].every(cell => !!cell);
}

function removeLine(row) {
    for (let r = row; r > 0; r--) {
        playfield[r] = playfield[r - 1];
    }

    playfield[0] = new Array(playfield[0].length).fill(0);
}

function updateScoreDisplay() {
    document.getElementById('scoreDisplay').textContent = `Score: ${score}`;
    document.getElementById('levelDisplay').textContent = `Level: ${level}`;
}

function resetGame() {
    // Reset score and level
    score = 0;
    level = 1;
    linesCleared = 0;
    updateScoreDisplay();

    // Reset playfield
    for (let row = 0; row < playfield.length; row++) {
        playfield[row].fill(0);
    }

    // Reset tetromino sequence and upcoming pieces
    tetrominoSequence.length = 0;
    upcomingTetrominos.length = 0;
    generateSequence();
    renderPreview();

    // Reset game variables
    gameOver = false;
    paused = false;
    count = 0;
    tetromino = getNextTetromino();

    // Restart game loop
    cancelAnimationFrame(rAF); // Stop any existing game loop
    rAF = requestAnimationFrame(loop); // Start a new game loop
}

function resetLevel() {
    // Reset playfield for the current level only
    for (let row = 0; row < playfield.length; row++) {
        playfield[row].fill(0);
    }

    // Reset the current tetromino and preview
    tetrominoSequence.length = 0;
    upcomingTetrominos.length = 0;
    generateSequence();
    renderPreview();
    tetromino = getNextTetromino();

    // Restart game loop
    cancelAnimationFrame(rAF);
    rAF = requestAnimationFrame(loop);
}

document.getElementById('reset-btn').addEventListener('click', () => {
    paused = true; // Pause the game
    document.getElementById('resetModal').style.display = 'flex';
});

document.getElementById('resetGameBtn').addEventListener('click', () => {
    resetGame();
    closeModal();
    paused = false; // Unpause game after reset
    loop(); // Restart the game loop
});

document.getElementById('resetLevelBtn').addEventListener('click', () => {
    resetLevel();
    closeModal();
    paused = false; // Unpause game after level reset
    loop(); // Restart the game loop
});

document.getElementById('cancelBtn').addEventListener('click', () => {
    closeModal();
    paused = false; // Unpause game if cancelled
    loop(); // Restart the game loop
});

function closeModal() {
    document.getElementById('resetModal').style.display = 'none';
}
