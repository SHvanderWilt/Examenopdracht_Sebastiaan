let score = 0;
let level = 1;
let linesCleared = 0;
const MAX_LEVEL = 10;

function updateScore(lines) {
    const points = [0, 100, 300, 500, 800]; // Points for 0, 1, 2, 3, or 4 lines cleared
    score += points[lines] * level; // Multiply by current level for difficulty scaling
    linesCleared += lines;

    // Level up every 10 lines
    if (linesCleared >= 10 * level && level < MAX_LEVEL) {
        level++;
        updateGameSpeed();  // Update speed when level increases
    }
    
    updateScoreDisplay(); // Update the display of score/level
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
    return playfield[row].every(cell => !!cell); // Checks if every cell in the row is filled
}

function removeLine(row) {
    for (let r = row; r > 0; r--) {
        playfield[r] = playfield[r - 1]; // Move all rows above down by 1
    }

    playfield[0] = new Array(playfield[0].length).fill(0); // Clear the top row
}

function updateScoreDisplay() {
    document.getElementById('scoreDisplay').textContent = `Score: ${score}`;
    document.getElementById('levelDisplay').textContent = `Level: ${level}`;
}

function updateGameSpeed() {
    cancelAnimationFrame(rAF);
    count = Math.max(10, 35 - (level - 1) * 5); // Increase speed by reducing count threshold
    rAF = requestAnimationFrame(loop);
}
