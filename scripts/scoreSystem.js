let score = 0;
let level = 1;
let linesCleared = 0;
const MAX_LEVEL = 10;

let gameSpeed = 35;  // Controls the falling speed of the tetrominoes
const speedPerLevel = 2;  // Number of levels before the speed increases
const minSpeed = 10; // Minimum speed

let rAF;  // This will store the animation frame ID for canceling the loop

// Function to update game speed based on the current level
function updateGameSpeed() {
    gameSpeed = Math.max(minSpeed, 35 - (level - 1) * speedPerLevel);  // Ensures speed doesn't go below `minSpeed`
}

// Reset the game speed
function resetGameSpeed() {
    gameSpeed = 35;  // Reset to default speed
    updateGameSpeed();  // Recalculate the speed based on the starting level
}

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

    // Reset game speed
    resetGameSpeed();

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

    // Stop any existing game loop and start a new one
    cancelAnimationFrame(rAF); // Stop the existing game loop
    rAF = requestAnimationFrame(loop); // Start the game loop
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

    // Reset the game speed based on the new level
    updateGameSpeed();

    // Stop the current loop and restart with the new speed
    cancelAnimationFrame(rAF);
    rAF = requestAnimationFrame(loop);
}

document.getElementById('reset-btn').addEventListener('click', () => {
    paused = true; // Pause the game
    document.getElementById('resetModal').style.display = 'flex';
});

document.getElementById('resetGameBtn').addEventListener('click', () => {
    // Refresh the page to reset everything
    location.reload();
});

document.getElementById('resetLevelBtn').addEventListener('click', () => {
    resetLevel();  // Reset the level but keep the game running
    closeModal();
    paused = false; // Unpause game after level reset
    loop(); // Start the game loop immediately after reset
});

document.getElementById('cancelBtn').addEventListener('click', () => {
    closeModal();
    paused = false; // Unpause game if cancelled
    loop(); // Start the game loop immediately after cancelling
});

function closeModal() {
    document.getElementById('resetModal').style.display = 'none';
}


// Draw playfield and falling tetromino
playfield.forEach((row, r) => {
    row.forEach((cell, c) => {
        if (cell) {
            context.fillStyle = colors[cell];
            context.fillRect(c * grid, r * grid, grid - 1, grid - 1);
        }
    });
});

if (tetromino) {
    if (++count > gameSpeed) {  // Use `gameSpeed` for the speed control
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
