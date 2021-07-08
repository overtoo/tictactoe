const gameBoard = (() => {
  let board = [];
  const getArray = () => board; //this might be redundant but I was getting errors when accessing gameBoard.board directly
  const setValue = (i, value) => {
    board[i] = value;
  };
  const reset = () => {
    board = [];
    for (let i = 0; i < 9; i++) {
      board.push("");
    }
  };
  return {
    board,
    getArray,
    setValue,
    reset,
  };
})();

const gameController = (() => {
  let state = {
    activePlayer: 1,
    marks: ["-", "X", "O"],
    firstRound: true,
    playerOne: "",
    playerTwo: "",
  };
  const initiliazeGame = () => {
    gameBoard.reset();
    displayController.initializeBoard(gameBoard.board);
  };
  const inputPlayers = () => {
    // let playerOne = Player(1, "salar");
    // let playerTwo = Player(2, "gab");
    state.playerOne = Player(1, prompt("Player One is:", "sal"));
    state.playerTwo = Player(2, prompt("Player Two is:", "gab"));
    state.playerOne.intro();
    state.playerTwo.intro();
  };

  const switchPlayer = () => {
    if (state.activePlayer == 1) {
      state.activePlayer = 2;
    } else if (state.activePlayer == 2) {
      state.activePlayer = 1;
    }
  };

  const play = () => {
    if (state.firstRound) {
      inputPlayers();
      state.firstRound = false;
    }
    initiliazeGame();
    clickSquare();
  };

  const checkGameOver = () => {
    let game = [...gameBoard.getArray()];
    let checkArrays = [];
    for (let i = 0; i < 3; i++) {
      checkArrays.push([game[i], game[i + 3], game[i + 6]]);
    }
    for (let i = 0; i < 9; i = i + 3) {
      checkArrays.push([game[i], game[i + 1], game[i + 2]]);
    }
    checkArrays.push([game[0], game[4], game[8]]);
    checkArrays.push([game[2], game[4], game[6]]);
    for (i in checkArrays) {
      let arr = checkArrays[i];
      if (arr[0] == arr[1] && arr[1] == arr[2] && arr[1] == "X") {
        alert(`${state.playerOne.name} wins!`);
      } else if (arr[0] == arr[1] && arr[1] == arr[2] && arr[1] == "O") {
        alert(`${state.playerTwo.name} wins!`);
      }
    }
  };

  function clickSquare() {
    let squares = document.querySelectorAll(".square");
    squares.forEach((square) => {
      square.addEventListener("click", (e) => {
        let square = e.target;
        let mark = state.marks[state.activePlayer];

        if (!square.dataset.mark) {
          let index = square.dataset.id;
          gameBoard.setValue(index, mark);
          square.dataset.mark = mark;
          displayController.refreshBoard();
          switchPlayer();
          checkGameOver();
        }
      });
    });
  }

  function reset() {
    state.activePlayer = 1;
    initiliazeGame();
    gameController.play();
  }

  return { play, reset };
})();

const Player = (number, name) => {
  const intro = () => console.log(`Player ${number} is ${name}`);

  return { intro, name, number };
};

const displayController = (() => {
  const board = document.querySelector(".board");
  function createBoard() {
    board.innerHTML = "";
    for (let i = 0; i < 9; i++) {
      let genSquare = document.createElement("div");
      genSquare.classList.add("square");
      genSquare.dataset.id = i;
      genSquare.textContent = "0";
      board.appendChild(genSquare);
    }
  }gi
  function refreshBoard() {
    let boardArray = gameBoard.getArray(); //for some reason cant do .board here only .getArray()
    for (let i = 0; i < 9; i++) {
      let targetSquare = document.querySelector(`[data-id="${i}"]`);
      targetSquare.textContent = boardArray[i];
    }
  }

  function resetBoard() {
    const reset = document.querySelector("#reset");
    reset.addEventListener("click", () => {
      gameController.reset();
    });
  }

  function initializeBoard() {
    createBoard();
    refreshBoard();
    resetBoard();
  }

  return { refreshBoard, initializeBoard };
})();

gameController.play();
