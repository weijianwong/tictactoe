// Use module pattern for object creation.
const player = (name, mark) => {
  let isWinner = false;
  return { name, mark, isWinner };
};
const displayController = () => {
  let turn = document.querySelector(".player-turn");
  let grids = document.getElementsByClassName("grid-item");
  let button = document.querySelector(".start-game");
  return {
    turn,
    grids,
    button,
  };
};

const gameBoard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];
  let player1 = player("weijian", "X");
  let player2 = player("xinyu", "O");
  let currentPlayer = player1;
  let { turn, grids, button } = displayController();

  const resetGame = () => {
    board = ["", "", "", "", "", "", "", "", ""];
    turn.textContent = "";
    for (let grid of grids) {
      grid.textContent = "";
      grid.removeEventListener("click", clickHandler);
    }
  };

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

  const checkWin = () => {
    for (let condition of winningConditions) {
      const [a, b, c] = condition;
      if (!isEmpty(a) && board[a] === board[b] && board[a] === board[c]) {
        return true;
      }
    }
    return false;
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

  const announceDraw = () => {
    alert("Game is a draw");
  };

  const isDraw = () => {
    if (!hasEmptyGrids() && !checkWin()) {
      return true;
    }
    return false;
  };

  const gameOver = () => {
    if (checkWin()) {
      return true;
    }
    if (isDraw()) {
      return true;
    }
    return false;
  };
  function clickHandler(event) {
    event.target.textContent = currentPlayer.mark;
    let index = parseInt(event.target.id.split("-")[1]);
    board[index] = currentPlayer.mark;
    if (checkWin()) {
      congratulateWinner();
      resetGame();
    } else if (isDraw()) {
      announceDraw();
      resetGame();
    } else {
      currentPlayer = currentPlayer === player1 ? player2 : player1;
      turn.textContent = `${currentPlayer.name}'s turn.`;
    }
  }
  const runGame = () => {
    turn.textContent = `${player1.name}'s turn.`;
    for (let i = 0; i < grids.length; i++) {
      if (isEmpty(i)) {
        grids[i].addEventListener("click", clickHandler);
      }
    }
  };
  const congratulateWinner = () => {
    alert(`Congratulations, ${currentPlayer.name}! You have won the game`);
  };
  return {
    runGame,
    board,
    gameOver,
    checkWin,
  };
})();
const startButton = document.querySelector(".start-game");
startButton.addEventListener("click", gameBoard.runGame);
