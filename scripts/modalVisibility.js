function showInstructions() {
    const instructionsModal = document.getElementById('instructionsModal');
    if (instructionsModal) {
        instructionsModal.style.display = 'flex';
    } else {
        console.warn('Instructions modal not found.');
    }
}

function closeInstructions() {
    const instructionsModal = document.getElementById('instructionsModal');
    if (instructionsModal) {
        instructionsModal.style.display = 'none';
    } else {
        console.warn('Instructions modal not found.');
    }
}
