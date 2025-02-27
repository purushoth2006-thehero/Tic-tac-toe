const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart");
const difficultySelector = document.getElementById("difficulty");

let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let human = "X";
let ai = "O";
let difficulty = parseFloat(difficultySelector.value);

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]
];

difficultySelector.addEventListener("change", () => {
    difficulty = parseFloat(difficultySelector.value);
});

cells.forEach(cell => {
    cell.addEventListener("click", () => {
        const index = cell.dataset.index;

        if (board[index] === "" && gameActive) {
            board[index] = human;
            cell.textContent = human;
            cell.dataset.player = human;
            checkWinner();

            if (gameActive) {
                setTimeout(aiMove, 500);
            }
        }
    });
});

function aiMove() {
    let bestMove;
    if (Math.random() < difficulty) {
        bestMove = minimax(board, ai).index;
    } else {
        let availableSpots = board.map((cell, index) => cell === "" ? index : null).filter(index => index !== null);
        bestMove = availableSpots[Math.floor(Math.random() * availableSpots.length)];
    }

    board[bestMove] = ai;
    cells[bestMove].textContent = ai;
    cells[bestMove].dataset.player = ai;
    checkWinner();
}

function checkWinner() {
    let roundWon = false;

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            cells[a].classList.add("win");
            cells[b].classList.add("win");
            cells[c].classList.add("win");
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `Player ${board[a]} Wins!`;
        gameActive = false;
    } else if (!board.includes("")) {
        statusText.textContent = "It's a Draw!";
        gameActive = false;
    } else {
        statusText.textContent = gameActive ? "AI's Turn (O)" : "Your Turn (X)";
    }
}

function minimax(newBoard, player) {
    let availableSpots = newBoard.map((cell, index) => cell === "" ? index : null).filter(index => index !== null);

    if (checkWin(newBoard, human)) return { score: -10 };
    if (checkWin(newBoard, ai)) return { score: 10 };
    if (availableSpots.length === 0) return { score: 0 };

    let moves = availableSpots.map(i => {
        newBoard[i] = player;
        let score = player === ai ? minimax(newBoard, human).score : minimax(newBoard, ai).score;
        newBoard[i] = "";
        return { index: i, score };
    });

    return player === ai ? moves.reduce((best, move) => move.score > best.score ? move : best) :
                           moves.reduce((best, move) => move.score < best.score ? move : best);
}

function checkWin(board, player) {
    return winPatterns.some(pattern => pattern.every(index => board[index] === player));
}

restartBtn.addEventListener("click", () => {
    board.fill("");
    gameActive = true;
    statusText.textContent = "Your Turn (X)";
    cells.forEach(cell => {
        cell.textContent = "";
        cell.removeAttribute("data-player");
        cell.classList.remove("win");
    });
});