document.addEventListener('DOMContentLoaded', startGame);

function addCheckForWinListener() {
  document.getElementsByClassName('board')[0].addEventListener('click', checkForWin);
  document.getElementsByClassName('board')[0].addEventListener('contextmenu', checkForWin);
}


let BOARD_SIZE = 5;
let NUMBER_OF_MINES = 5;

const board = {
  cells: [],
};

function startGame() {
  populateBoard(BOARD_SIZE);
  addCheckForWinListener();
  processBoard(numberOfMinesSurrounding);
  initBoard();
  setInitialConfig();
  addConfigChangeListener();
}

function resetBoard() {
  const boardNode = document.getElementsByClassName('board')[0];
  while (boardNode.lastElementChild) {
    boardNode.removeChild(boardNode.lastElementChild);
  }
  board.cells = [];
  populateBoard();
  drawBoard(boardNode);
  addListeners(boardNode);
  processBoard(numberOfMinesSurrounding);
  displayMessage("Let's Play!");
  addCheckForWinListener();
}

function setupBoard() {
  populateBoard(BOARD_SIZE);
}

function setInitialConfig() {
  const boardSizeInput = document.querySelector('#boardSizeInput');
  const numberOfMinesInput = document.querySelector('#numberOfMinesInput');
  boardSizeInput.value = BOARD_SIZE;
  boardSizeInput.labels[0].textContent = BOARD_SIZE;
  numberOfMinesInput.value = NUMBER_OF_MINES;
  numberOfMinesInput.labels[0].textContent = NUMBER_OF_MINES + ' ish';
}

function updateBoardSize(boardSize) {
  BOARD_SIZE = parseInt(boardSize);
}

function updateNumberOfMines(numberOfMinesSurrounding) {
  NUMBER_OF_MINES = parseInt(numberOfMinesSurrounding);
}

function addConfigChangeListener() {
  const boardSizeInput = document.querySelector('#boardSizeInput');
  const numberOfMinesInput = document.querySelector('#numberOfMinesInput');
  boardSizeInput.addEventListener('change', (e) => {
    boardSizeInput.labels[0].textContent = e.target.value;
    updateBoardSize(e.target.value);
  });
  numberOfMinesInput.addEventListener('change', (e) => {
    numberOfMinesInput.labels[0].textContent = e.target.value + ' ish';
    updateNumberOfMines(e.target.value);
  });
}

function newCell(
  {row, col, isMine = false, isMarked = false, hidden = true, surroundingMines = 0}
  ) {
  return {
    row,
    col,
    isMine,
    isMarked,
    hidden,
    surroundingMines,
  }
}

function mineGenerator() {
  const mineArray = [];
  while (mineArray.length < NUMBER_OF_MINES) {
    mineArray.push(Math.floor(Math.random() * board.cells.length));
  }
  for (let mine in mineArray) {
    let idx = mineArray[mine];
    board.cells[idx].isMine = true;
  }
}

function populateBoard() {
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      const cell = newCell({
        row: i,
        col: j,
      });
      board.cells.push(cell);
    }
  }
  mineGenerator();
}


function processBoard(f) {
  for (let cell in board.cells) {
    f(board.cells[cell]);
  };
}

function checkForWin() {
  let noFailedChecks = true;
  let i = 0;
  while (noFailedChecks && i < BOARD_SIZE**2){
    let cell = board.cells[i];
    noFailedChecks = checkCellForWin(cell);
    i++;
  }
  if(noFailedChecks) {
    displayMessage('You Win');
  }
}

function checkCellForWin(cell) {
  if (cell.isMine) {
    if (cell.isMarked) {
      return true;
    } else {
      return false;
    }
  } else {
    if (!cell.hidden) {
      return true;
    } else {
      return false;
    }
  }
}

function numberOfMinesSurrounding(cell) {
  let surroundingCells = getValidSurrounding(cell);
  let mineCount = 0;
  for (let i in surroundingCells) {
    let surroundingCell = surroundingCells[i];
    mineCount += surroundingCell.isMine;
  };
  cell.surroundingMines = mineCount;
}

function getValidSurrounding(cell) {
  let {row, col} = cell;
  let rowRange = getBounds(row);
  let colRange = getBounds(col);
  let surroundingCells = [];
  for (let i in rowRange) {
    let currentRow = rowRange[i];
    for (let j in colRange) {
      let currentCol = colRange[j];
      let currentCell = board.cells[currentRow * BOARD_SIZE + currentCol];
      if (!(currentCell === cell)) {
        surroundingCells.push(currentCell)
      }
    }
  }
  return surroundingCells
}

function getBounds(rowOrCol) {
  let validRange = [];
  for (let i = -1; i < 2; i++) {
    if (rowOrCol + i >= 0 && rowOrCol + i <= (BOARD_SIZE -1)) {
      validRange.push(rowOrCol + i)
    }
  }
  return validRange
}