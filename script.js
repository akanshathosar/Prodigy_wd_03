const boxes = document.querySelectorAll(".box");
const msgContainer = document.querySelector(".msg-container");
const msg = document.getElementById("msg");
const newGameBtn = document.getElementById("new-btn");
const resetBtn = document.getElementById("reset-btn");
const backBtn = document.getElementById("back-btn");
const mainGame = document.getElementById("main-game");
const modeSection = document.querySelector(".mode-selection");

const pvpModeBtn = document.getElementById("pvp-mode");
const aiModeBtn = document.getElementById("ai-mode");

let currentPlayer = "X";
let gameGrid = ["", "", "", "", "", "", "", "", ""];
let isGameActive = true;
let vsAI = false;

const winningPositions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Show Game UI
function startGame(mode) {
  vsAI = mode === "AI";
  modeSection.classList.add("hide");
  mainGame.classList.remove("hide");
  resetGame();
}

// Box Click
boxes.forEach((box, index) => {
  box.addEventListener("click", () => {
    if (!isGameActive || box.innerText !== "") return;

    box.innerText = currentPlayer;
    gameGrid[index] = currentPlayer;

    if (checkWin()) {
      endGame(`${currentPlayer} wins!`);
      return;
    } else if (!gameGrid.includes("")) {
      endGame("It's a Tie!");
      return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";

    if (vsAI && currentPlayer === "O") {
      setTimeout(makeAIMove, 500); // Delay AI move
    }
  });
});

// AI Move (random empty box)
function makeAIMove() {
  if (!isGameActive) return;

  const bestMove = getBestMove();
  boxes[bestMove].innerText = "O";
  gameGrid[bestMove] = "O";

  if (checkWin()) {
    endGame("O wins!");
  } else if (!gameGrid.includes("")) {
    endGame("It's a Tie!");
  } else {
    currentPlayer = "X";
  }
}

function getBestMove() {
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < gameGrid.length; i++) {
    if (gameGrid[i] === "") {
      gameGrid[i] = "O";
      let score = minimax(gameGrid, 0, false);
      gameGrid[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  return move;
}

function minimax(board, depth, isMaximizing) {
  if (checkWinner("O")) return 10 - depth;
  if (checkWinner("X")) return depth - 10;
  if (!board.includes("")) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "O";
        let score = minimax(board, depth + 1, false);
        board[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "X";
        let score = minimax(board, depth + 1, true);
        board[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function checkWinner(player) {
  return winningPositions.some((pos) => {
    return (
      gameGrid[pos[0]] === player &&
      gameGrid[pos[1]] === player &&
      gameGrid[pos[2]] === player
    );
  });
}


// Check Win
function checkWin() {
  return winningPositions.some((pattern) => {
    const [a, b, c] = pattern;
    return (
      gameGrid[a] &&
      gameGrid[a] === gameGrid[b] &&
      gameGrid[a] === gameGrid[c]
    );
  });
}

// End Game
function endGame(result) {
  isGameActive = false;
  msg.innerText = result;
  msgContainer.classList.remove("hide");
}

// Reset Game
function resetGame() {
  gameGrid = ["", "", "", "", "", "", "", "", ""];
  isGameActive = true;
  currentPlayer = "X";
  boxes.forEach((box) => (box.innerText = ""));
  msgContainer.classList.add("hide");
}

// Button Events
newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);
backBtn.addEventListener("click", () => {
  mainGame.classList.add("hide");
  modeSection.classList.remove("hide");
  resetGame();
});

pvpModeBtn.addEventListener("click", () => startGame("PVP"));
aiModeBtn.addEventListener("click", () => startGame("AI"));
