function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const placeToken = (row, column, token) => {
    if (board[row][column].getValue() === "") {
      board[row][column].addToken(token);
      return true;
    }
    return false;
  };

  const checkForWinner = (player) => {
    const winningString = player.token + player.token + player.token;

    for (let i = 0; i < columns; i++) {
      if (
        board[i][0].getValue() +
          board[i][1].getValue() +
          board[i][2].getValue() ===
          winningString ||
        board[0][i].getValue() +
          board[1][i].getValue() +
          board[2][i].getValue() ===
          winningString ||
        board[0][0].getValue() +
          board[1][1].getValue() +
          board[2][2].getValue() ===
          winningString ||
        board[2][0].getValue() +
          board[1][1].getValue() +
          board[0][2].getValue() ===
          winningString
      ) {
        // console.log(`${player.name} Wins`);
        return true;
      }
    }
    return false;
  };

  const resetBoard = () => {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i].push(Cell());
      }
    }
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.table(boardWithCellValues);
  };

  return { placeToken, printBoard, getBoard, checkForWinner, resetBoard };
}

function Cell() {
  let value = "";

  const addToken = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    addToken: addToken,
    getValue: getValue,
  };
}

function GameController() {
  const board = Gameboard();

  //   board.printBoard();

  const players = [
    {
      name: "Player One",
      token: "O",
    },
    {
      name: "Player Two",
      token: "X",
    },
  ];

  let currentPlayer = players[0];

  const updatePlayerName = (name, player) => {
    players[player].name = name;
  };

  const getCurrentPlayer = () => currentPlayer;

  const switchCurrentPlayer = () => {
    currentPlayer === players[0]
      ? (currentPlayer = players[1])
      : (currentPlayer = players[0]);
  };

  const playRound = (row, column) => {
    const validMove = board.placeToken(row, column, currentPlayer.token);
    if (validMove) {
      if (board.checkForWinner(currentPlayer)) {
        currentPlayer = players[0];
        return true;
      } else {
        switchCurrentPlayer();
      }
    }
  };

  const resetBoard = () => {
    currentPlayer = players[0];
    board.resetBoard();
  };

  return {
    playRound,
    getCurrentPlayer,
    getBoard: board.getBoard,
    resetBoard,
    printBoard: board.printBoard,
    updatePlayerName,
  };
}

function screenController() {
  const game = GameController();
  const boardTiles = document.querySelector(".tiles-container");
  const boardHeader = document.querySelector(".game-container > h2");
  const resetButton = document.querySelector(".game-container div:last-child");
  const playerOneName = document.querySelector("#p1");
  const playerTwoName = document.querySelector("#p2");

  playerOneName.addEventListener("change", (event) => {
    if (event.target.value === "") game.updatePlayerName("Player 1", 0);
    else game.updatePlayerName(event.target.value, 0);

    updateScreen();
  });
  playerTwoName.addEventListener("change", (event) => {
    if (event.target.value === "") game.updatePlayerName("Player 2", 1);
    else game.updatePlayerName(event.target.value, 1);

    updateScreen();
  });

  resetButton.addEventListener("click", () => {
    game.resetBoard();
    updateScreen();
  });

  const updateScreen = (winner = false) => {
    const board = game.getBoard();
    const currentPlayer = game.getCurrentPlayer();

    winner
      ? (boardHeader.textContent = `${currentPlayer.name} Wins!`)
      : (boardHeader.textContent = `${currentPlayer.name}'s turn: ${currentPlayer.token}`);

    while (boardTiles.firstChild) boardTiles.removeChild(boardTiles.lastChild);

    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const tile = document.createElement("p");
        tile.dataset.row = rowIndex;
        tile.dataset.column = columnIndex;
        tile.textContent = cell.getValue();
        boardTiles.append(tile);
      });
    });
  };

  boardTiles.addEventListener("click", (e) => {
    const row = e.target.dataset.row;
    const column = e.target.dataset.column;
    const currentPlayer = game.getCurrentPlayer();

    const gameOver = game.playRound(row, column);
    if (gameOver) {
      //   while (resetButton.firstChild)
      // resetButton.removeChild(resetButton.lastChild);

      //   const button = document.createElement("button");

      //   button.textContent = "Reset Game";
      //   resetButton.append(button);
      updateScreen(true);
    } else updateScreen();
  });
  // Initial Screen
  updateScreen();
}

screenController();
