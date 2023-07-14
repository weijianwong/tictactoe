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
  };
})();

const gameController = (() => {
  const player1 = player("Player 1", "X");
  const player2 = player("Player 2", "O");
  const players = [player1, player2];
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

  const printBoard = () => console.log(board.getBoard());

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const getWinner = () => winner;

  const getWinnerFound = () => winnerFound;

  const getGameIsDraw = () => gameIsDraw;

  const isDraw = () => {
    if (!board.hasEmptyGrids() && !winnerFound) {
      return true;
    }
    return false;
  };

  const checkWin = () => {
    for (let condition of winningConditions) {
      const [a, b, c] = condition;
      if (
        !board.isEmpty(a) &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        return true;
      }
    }
    return false;
  };

  const resetGame = () => {
    board.resetBoard();
    currentBoard = board.getBoard();
    winner = null;
    activePlayer = players[0];
    gameIsDraw = false;
    winnerFound = false;
  };

  const playOneRound = (gridNumber) => {
    board.placeMarker(gridNumber, activePlayer.mark);
    if (checkWin()) {
      winnerFound = true;
      winner = activePlayer;
    }
    if (isDraw()) {
      gameIsDraw = true;
    }
    switchPlayerTurn();
    printBoard();
  };
  return {
    resetGame,
    playOneRound,
    getActivePlayer,
    getWinner,
    getWinnerFound,
    getGameIsDraw,
  };
})();

const ScreenController = () => {
  let game = gameController;
  let turn = document.querySelector(".player-turn");
  let grids = document.getElementsByClassName("grid-item");
  let startButton = document.querySelector(".start-game");
  let mainContent = document.querySelector(".main-content");

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
    startButton.textContent = "Start game";
    startButton.removeEventListener("click", resetBoard);
    startButton.addEventListener("click", startGame);
    game.resetGame();
    turn.textContent = "";
    for (let grid of grids) {
      grid.textContent = "";
      grid.removeEventListener("click", clickHandler);
    }
  };

  function clickHandler(event) {
    if (event.target.textContent === "") {
      event.target.textContent = game.getActivePlayer().mark;
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
  const startGame = () => {
    startButton.addEventListener("click", updateScreen);
  };
  const updateScreen = () => {
    startButton.textContent = "Reset game";
    startButton.removeEventListener("click", updateScreen);
    startButton.addEventListener("click", resetBoard);
    const activePlayer = game.getActivePlayer();

    turn.textContent = `${activePlayer.name}'s turn.`;

    for (let i = 0; i < grids.length; i++) {
      grids[i].addEventListener("click", clickHandler);
    }
  };
  // initial render
  startGame();
};

ScreenController();
