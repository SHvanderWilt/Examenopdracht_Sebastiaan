let score = 0;
let level = 1;
let linesCleared = 0;
const MAX_LEVEL = 10;

function updateScore(lines) {
    const points = [0, 100, 300, 500, 800];
    score += points[lines] * level;
    linesCleared += lines;

    // Level up every 10 lines
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

function updateGameSpeed() {
    cancelAnimationFrame(rAF);
    count = Math.max(10, 35 - (level - 1) * 5);
    rAF = requestAnimationFrame(loop);
}
