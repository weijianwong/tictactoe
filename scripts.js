// Use module pattern for object creation.
const player = (name, mark) => {
  let isWinner = false;
  return { name, mark, isWinner };
};

const gameBoard = (() => {
  let board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  let player1 = player("weijian", "X");
  let player2 = player("xinyu", "O");
  let winningPattern = "";
  let winnerFound = false;

  const winningConditions = [
    // Horizontal
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    // Vertical
    [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2],
    ],
    // Diagonal
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    [
      [0, 2],
      [1, 1],
      [2, 0],
    ],
  ];

  const checkWin = () => {
    for (let condition of winningConditions) {
      const [a, b, c] = condition;
      const [x1, y1] = a;
      const [x2, y2] = b;
      const [x3, y3] = c;
      if (
        board[x1][y1] !== "" &&
        board[x1][y1] === board[x2][y2] &&
        board[x1][y1] === board[x3][y3]
      ) {
        winnerFound = true;
        winningPattern = board[x1][y1];
        return true; // Game is won
      }
    }
    return false; // Game not won
  };

  const isEmpty = (row, column) => {
    let symbols = ["X", "O"];
    return !symbols.includes(board[row][column]);
  };

  const addMark = (row, column, mark) => {
    board[row][column] = mark;
  };
  const isDraw = () => {
    for (let row of board) {
      for (let cell of row) {
        if (cell === "") {
          return false; // Empty cell found, game is not a draw
        }
      }
    }

    return !checkWin(); // All cells are filled, check if it's not a win
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
  const runGame = () => {
    while (!gameOver()) {
      let playerOneRow = prompt("Player 1 row: ");
      let playerOneCol = prompt("Player 1 column: ");
      while (!isEmpty(playerOneRow, playerOneCol)) {
        playerOneRow = prompt("Player 1 row: ");
        playerOneCol = prompt("Player 1 column: ");
      }
      addMark(playerOneRow, playerOneCol, player1.mark);
      if (gameOver()) {
        congratulateWinner();
        return;
      }

      let playerTwoRow = prompt("Player 2 row: ");
      let playerTwoCol = prompt("Player 2 column: ");
      while (!isEmpty(playerTwoRow, playerTwoCol)) {
        playerTwoRow = prompt("Player 2 row: ");
        playerTwoCol = prompt("Player 2 column: ");
      }
      addMark(playerTwoRow, playerTwoCol, player2.mark);

      console.log(board);
      if (gameOver()) {
        congratulateWinner();
        return;
      }
    }
    congratulateWinner();
  };
  const congratulateWinner = () => {
    if (gameOver() && winnerFound) {
      if (winningPattern === "X") {
        console.log(`Congratulations, ${player1.name} has won the game`);
      } else {
        console.log(`Congratulations, ${player2.name} has won the game`);
      }
    } else {
      console.log("The game ended in a draw.");
    }
  };
  return { runGame, board, gameOver, checkWin, isDraw };
})();
