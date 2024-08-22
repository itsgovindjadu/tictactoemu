document.addEventListener('DOMContentLoaded', () => {
    const gridElement = document.getElementById('grid');
    const restartButton = document.getElementById('restart');
    const messageElement = document.getElementById('message');
    const boardSizeSelect = document.getElementById('boardSize');
    const modeSelect = document.getElementById('mode');
    const difficultySelect = document.getElementById('difficulty');
    const difficultyContainer = document.getElementById('difficultyContainer');

    let boardSize = 3;
    let cells = [];
    let currentPlayer = 'x';
    let gameBoard = [];
    let gameMode = 'multiplayer';

    function createBoard(size) {
        gridElement.innerHTML = '';
        cells = [];
        gameBoard = Array(size).fill(null).map(() => Array(size).fill(null));
        gridElement.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        gridElement.style.gridTemplateRows = `repeat(${size}, 1fr)`;
        gridElement.style.width = `${size * 100}px`;
        gridElement.style.height = `${size * 100}px`;
        for (let i = 0; i < size * size; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = i;
            cell.addEventListener('click', handleClick);
            gridElement.appendChild(cell);
            cells.push(cell);
        }
    }

    function handleClick(event) {
        const index = event.target.dataset.index;
        const row = Math.floor(index / boardSize);
        const col = index % boardSize;

        if (!gameBoard[row][col] && !checkWinner()) {
            gameBoard[row][col] = currentPlayer;
            cells[index].classList.add(currentPlayer);
            cells[index].textContent = currentPlayer.toUpperCase();

            if (checkWinner()) {
                messageElement.textContent = `${currentPlayer.toUpperCase()} wins!`;
                cells.forEach(cell => cell.removeEventListener('click', handleClick));
                return;
            }

            if (checkDraw()) {
                messageElement.textContent = 'It\'s a draw!';
                return;
            }

            currentPlayer = currentPlayer === 'x' ? 'o' : 'x';

            if (gameMode === 'singleplayer' && currentPlayer === 'o') {
                setTimeout(() => aiMove(), 500);
            }
        }
    }

    function aiMove() {
        const emptyCells = cells.filter((cell, index) => !gameBoard[Math.floor(index / boardSize)][index % boardSize]);
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            const index = randomCell.dataset.index;
            const row = Math.floor(index / boardSize);
            const col = index % boardSize;

            gameBoard[row][col] = 'o';
            randomCell.classList.add('o');
            randomCell.textContent = 'O';

            if (checkWinner()) {
                messageElement.textContent = 'O wins!';
                cells.forEach(cell => cell.removeEventListener('click', handleClick));
                return;
            }

            if (checkDraw()) {
                messageElement.textContent = 'It\'s a draw!';
            }

            currentPlayer = 'x';
        }
    }

    function checkWinner() {
        // Check rows
        for (let i = 0; i < boardSize; i++) {
            if (gameBoard[i].every(cell => cell === currentPlayer)) return true;
        }

        // Check columns
        for (let i = 0; i < boardSize; i++) {
            if (gameBoard.every(row => row[i] === currentPlayer)) return true;
        }

        // Check diagonals
        if (gameBoard.every((row, i) => row[i] === currentPlayer)) return true;
        if (gameBoard.every((row, i) => row[boardSize - 1 - i] === currentPlayer)) return true;

        return false;
    }

    function checkDraw() {
        return gameBoard.flat().every(cell => cell !== null);
    }

    function restartGame() {
        createBoard(boardSize);
        messageElement.textContent = '';
        currentPlayer = 'x';
        cells.forEach(cell => {
            cell.classList.remove('x', 'o', 'winner');
            cell.textContent = '';
            cell.addEventListener('click', handleClick);
        });
    }

    function updateMode() {
        gameMode = modeSelect.value;
        if (gameMode === 'singleplayer') {
            difficultyContainer.style.display = 'block';
        } else {
            difficultyContainer.style.display = 'none';
        }
        restartGame();
    }

    boardSizeSelect.addEventListener('change', (event) => {
        boardSize = parseInt(event.target.value, 10);
        restartGame();
    });

    modeSelect.addEventListener('change', updateMode);

    restartButton.addEventListener('click', restartGame);

    createBoard(boardSize);
});