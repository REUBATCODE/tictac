const board = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const gameBoard = document.getElementById('game-board');
let currentPlayer = 'X';
let gameState = Array(9).fill(null);
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

function checkWinner() {
    let roundWon = false;
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            drawLine(a, b, c); // Dibuja la línea en las casillas ganadoras
            break;
        }
    }
    if (roundWon) {
        statusText.textContent = `Jugador ${currentPlayer} gana!`;
        board.forEach(cell => cell.removeEventListener('click', handleCellClick));
    } else if (!gameState.includes(null)) {
        statusText.textContent = "Empate!";
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusText.textContent = `Turno de: ${currentPlayer}`;
    }
}

function drawLine(a, b, c) {
    const line = document.createElement('div');
    line.classList.add('winner-line');

    const cellA = board[a].getBoundingClientRect();
    const cellB = board[b].getBoundingClientRect();
    const cellC = board[c].getBoundingClientRect();

    const boardRect = gameBoard.getBoundingClientRect();

    const startX = (cellA.left + cellA.right) / 2 - boardRect.left;
    const startY = (cellA.top + cellA.bottom) / 2 - boardRect.top;
    const endX = (cellC.left + cellC.right) / 2 - boardRect.left;
    const endY = (cellC.top + cellC.bottom) / 2 - boardRect.top;

    line.style.left = `${startX}px`;
    line.style.top = `${startY}px`;
    line.style.width = `${Math.hypot(endX - startX, endY - startY)}px`;
    line.style.transform = `rotate(${Math.atan2(endY - startY, endX - startX)}rad)`;

    gameBoard.appendChild(line);
}


function handleCellClick(e) {
    const cell = e.target;
    const index = cell.dataset.index;

    if (!gameState[index]) {
        gameState[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add('taken');
        checkWinner();
    }
}

function restartGame() {
    gameState.fill(null);
    currentPlayer = 'X';
    board.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken');
        cell.innerHTML = '';
        cell.addEventListener('click', handleCellClick);
    });
    statusText.textContent = `Turno de: ${currentPlayer}`;

    document.querySelectorAll('.winner-line').forEach(line => line.remove());
}

board.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);
statusText.textContent = `Turno de: ${currentPlayer}`;
