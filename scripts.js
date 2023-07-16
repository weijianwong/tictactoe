// Use module pattern for object creation.
const player = (name, mark) => {
  return { name, mark };
};
const gameBoard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const resetBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  const placeMarker = (gridNumber, mark) => {
    if (isEmpty(gridNumber)) {
      board[gridNumber] = mark;
    }
  };

  const isEmpty = (gridNumber) => {
    return board[gridNumber] === "";
  };
  const hasEmptyGrids = () => {
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        return true;
      }
    }
    return false;
  };

  return {
    getBoard,
    placeMarker,
    hasEmptyGrids,
    isEmpty,
    resetBoard,
    board,
  };
})();

const gameController = (() => {
  const player1 = player("Player 1", "X");
  const player2 = player("Player 2", "O");
  const computer = player("Computer", "O");
  let players = [player1, player2];
  let winner = null;
  let winnerFound = false;
  let gameIsDraw = false;
  let board = gameBoard;
  let currentBoard = board.getBoard();
  const winningConditions = [
    // Horizontal
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Vertical
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonal
    [0, 4, 8],
    [2, 4, 6],
  ];
  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const getWinner = () => winner;

  const getWinnerFound = () => winnerFound;

  const getGameIsDraw = () => gameIsDraw;

  const setPlayers = () => {
    players = [player1, computer];
  };

  const gameEnded = () => {
    if (!board.hasEmptyGrids() && !winnerFound) {
      gameIsDraw = true;
      return true;
    }

    for (let condition of winningConditions) {
      const [a, b, c] = condition;
      if (
        !board.isEmpty(a) &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        if (currentBoard[a] === "X") {
          winner = players[0];
        } else {
          winner = players[1];
        }
        winnerFound = true;
        return true;
      }
    }
    return false;
  };

  const gameDraw = () => {
    if (!gameWon() && !board.hasEmptyGrids()) {
      return true;
    }
    return false;
  };
  let simulatedWinner;
  const gameWon = () => {
    for (let condition of winningConditions) {
      const [a, b, c] = condition;
      if (
        !board.isEmpty(a) &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        if (currentBoard[a] === "X") {
          simulatedWinner = players[0];
        } else {
          simulatedWinner = players[1];
        }
        return true;
      }
    }
    return false;
  };

  const resetGame = () => {
    board.resetBoard();
    currentBoard = board.getBoard();
    winner = null;
    players = [player1, player2];
    activePlayer = players[0];
    gameIsDraw = false;
    winnerFound = false;
    simulatedWinner = null;
  };

  function getNextPlayer(currentPlayer) {
    return currentPlayer === player1 ? computer : player1;
  }

  function getAvailableMoves(currentBoard) {
    let availableMoves = [];
    for (let i = 0; i < currentBoard.length; i++) {
      if (currentBoard[i] === "") {
        availableMoves.push(i);
      }
    }
    return availableMoves;
  }

  function getScore() {
    if (gameWon() && simulatedWinner === player1) {
      return 10;
    } else if (gameWon() && simulatedWinner === computer) {
      return -10;
    } else {
      return 0;
    }
  }

  function minimax(boardNow, playerNow) {
    if (gameWon() || gameDraw()) {
      let score = getScore();
      return { score: score, index: null };
    }
    let movesAvail = getAvailableMoves(boardNow);
    let bestScore = playerNow === computer ? 100 : -100;
    let bestMove;
    // for maximizing player
    if (playerNow === player1) {
      for (let move of movesAvail) {
        currentBoard[move] = playerNow.mark; // Simulate the move
        let newScore = minimax(currentBoard, getNextPlayer(player1)).score; // Recursive call
        currentBoard[move] = "";
        if (newScore > bestScore) {
          bestScore = newScore;
          bestMove = move;
        }
      }
      return { score: bestScore, index: bestMove };
    }
    // for minimizing player
    else {
      for (let move of movesAvail) {
        currentBoard[move] = playerNow.mark; // Simulate the move
        let newScore = minimax(currentBoard, getNextPlayer(computer)).score; // Recursive call
        currentBoard[move] = "";
        if (newScore < bestScore) {
          bestScore = newScore;
          bestMove = move;
        }
      }
      return { score: bestScore, index: bestMove };
    }
  }

  const playOneRoundWithComputer = (gridNumber) => {
    playOneRound(gridNumber);
    if (gameEnded()) {
      return;
    }
    let computerMove = minimax(currentBoard, computer).index;
    playOneRound(computerMove);
  };

  const playOneRound = (gridNumber) => {
    board.placeMarker(gridNumber, activePlayer.mark);
    if (gameEnded()) {
      return;
    }
    switchPlayerTurn();
  };
  return {
    getBoard: board.getBoard,
    resetGame,
    playOneRound,
    getActivePlayer,
    getWinner,
    getWinnerFound,
    getGameIsDraw,
    setPlayers,
    playOneRoundWithComputer,
  };
})();

const ScreenController = () => {
  let game = gameController;
  let gameStarted = false;
  let playingWithComputer = false;
  let turn = document.querySelector(".player-turn");
  let grids = document.getElementsByClassName("grid-item");
  let startButton = document.querySelector(".start-game");
  let mainContent = document.querySelector(".main-content");
  let vsComputerButton = document.querySelector(".vs-computer");
  let resetGameButton = document.querySelector(".reset-game");

  const announceResult = () => {
    mainContent.classList.add("disabled");
    const popupScreen = document.getElementById("popupScreen");
    const popupContent = document.getElementById("popupContent");
    const closeButton = document.getElementById("closeButton");
    popupScreen.style.display = "block";
    if (game.getWinnerFound()) {
      popupContent.textContent = `Congratulations ${
        game.getWinner().name
      }, you have won the game!`;
    } else {
      popupContent.textContent = `The game is a draw!`;
    }

    closeButton.addEventListener("click", function () {
      resetBoard();
      popupScreen.style.display = "none";
      mainContent.classList.remove("disabled");
    });
  };

  const resetBoard = () => {
    updateButtons();
    game.resetGame();
    turn.textContent = "";
    if (playingWithComputer) {
      for (let grid of grids) {
        grid.textContent = "";
        grid.removeEventListener("click", clickForComputer);
      }
    } else {
      for (let grid of grids) {
        grid.textContent = "";
        grid.removeEventListener("click", clickHandler);
      }
    }
    playingWithComputer = false;
  };

  function clickHandler(event) {
    if (event.target.textContent === "") {
      let index = parseInt(event.target.id.split("-")[1]);
      game.playOneRound(index);
      updateScreen();
      if (game.getGameIsDraw()) {
        announceResult();
      } else if (game.getWinnerFound()) {
        announceResult();
      }
    }
  }
  function clickForComputer(event) {
    if (event.target.textContent === "") {
      let index = parseInt(event.target.id.split("-")[1]);
      game.playOneRoundWithComputer(index);
      updateScreen();
      if (game.getGameIsDraw()) {
        announceResult();
      } else if (game.getWinnerFound()) {
        announceResult();
      }
    }
  }

  const startGame = () => {
    resetGameButton.style.display = "none";
    startButton.addEventListener("click", () => {
      gameStarted = true;
      updateScreen();
      updateButtons();
    });
    vsComputerButton.addEventListener("click", () => {
      gameStarted = true;
      playingWithComputer = true;
      game.setPlayers();
      updateScreen();
      updateButtons();
    });
  };

  const updateButtons = () => {
    if (gameStarted) {
      startButton.style.display = "none";
      vsComputerButton.style.display = "none";
      resetGameButton.style.display = "block";
      resetGameButton.addEventListener("click", resetBoard);
      gameStarted = false;
    } else {
      startButton.style.display = "block";
      vsComputerButton.style.display = "block";
      resetGameButton.style.display = "none";
    }
  };
  const updateScreen = () => {
    let board = game.getBoard();

    const activePlayer = game.getActivePlayer();

    turn.textContent = `${activePlayer.name}'s turn.`;

    for (let i = 0; i < 9; i++) {
      if (playingWithComputer) {
        grids[i].addEventListener("click", clickForComputer);
        grids[i].textContent = board[i];
      } else {
        grids[i].addEventListener("click", clickHandler);
        grids[i].textContent = board[i];
      }
    }
  };
  // initial render
  startGame();
};

ScreenController();
