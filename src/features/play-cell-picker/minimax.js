const MAX_VALUE = 10;
const MIN_VALUE = -10;
const DRAW_VALUE = 0;
const INFINITY = Infinity;

export const WIN_GAME = 1;
export const LOSE_GAME = -1;
export const DRAW_GAME = 0;
export const UN_IDENTIFY_GAME = 2;

export function checkGameRowState(board, row, col, value) {
  let count = 0;
  for (
    let c = col - 3 > 0 ? col - 3 : 0;
    c < col + 3 && c < board[row].length;
    c++
  ) {
    if (board[row][c] === value) {
      count++;
      if (count === 3) {
        return value > 0 ? WIN_GAME : LOSE_GAME;
      }
    } else {
      count = 0;
    }
  }

  return UN_IDENTIFY_GAME;
}

export function checkGameColState(board, row, col, value) {
  let count = 0;
  for (
    let r = row - 3 > 0 ? row - 3 : 0;
    r < row + 3 && r < board.length;
    r++
  ) {
    if (board[r][col] === value) {
      count++;
      if (count === 3) {
        return value > 0 ? WIN_GAME : LOSE_GAME;
      }
    } else {
      count = 0;
    }
  }

  return UN_IDENTIFY_GAME;
}

export function checkGameCrossFromTopLeftState(board, row, col, value) {
  let count = 0;

  for (let i = -3; i <= 3; i++) {
    const checkingRow = row + i;
    const checkingCol = col + i;
    if (
      checkingCol < 0 ||
      checkingCol >= board[row].length ||
      checkingRow < 0 ||
      checkingRow >= board.length
    ) {
      continue;
    }
    if (board[checkingRow][checkingCol] === value) {
      count++;
      if (count === 3) {
        return value > 0 ? WIN_GAME : LOSE_GAME;
      }
    } else {
      count = 0;
    }
  }

  return UN_IDENTIFY_GAME;
}

export function checkGameCrossFromTopRightState(board, row, col, value) {
  let count = 0;

  for (let r = -3; r <= 3; r++) {
    const checkingRow = row + r;
    const checkingCol = col - r;
    if (
      checkingCol < 0 ||
      checkingCol >= board[row].length ||
      checkingRow < 0 ||
      checkingRow >= board.length
    ) {
      continue;
    }

    if (board[checkingRow][checkingCol] === value) {
      count++;
      if (count === 3) {
        return value > 0 ? WIN_GAME : LOSE_GAME;
      }
    } else {
      count = 0;
    }
  }

  return UN_IDENTIFY_GAME;
}

export function checkGameState(board, row, col, value = -1) {
  if (board[row][col] === 0) {
    return UN_IDENTIFY_GAME;
  }
  let result = checkGameRowState(board, row, col, value);
  if (result !== UN_IDENTIFY_GAME) {
    return result;
  }
  result = checkGameColState(board, row, col, value);
  if (result !== UN_IDENTIFY_GAME) {
    return result;
  }

  result = checkGameCrossFromTopLeftState(board, row, col, value);
  if (result !== UN_IDENTIFY_GAME) {
    return result;
  }

  result = checkGameCrossFromTopRightState(board, row, col, value);
  if (result !== UN_IDENTIFY_GAME) {
    return result;
  }

  let breakable = false;
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      breakable = board[r][c] === 0;
      if (breakable) {
        break;
      }
    }
    if (breakable) {
      break;
    }
  }

  if (!breakable) {
    return DRAW_GAME;
  }
  return result;
}

function setBoardStatus(board, row, col, value) {
  const curBoard = [...board];
  const curRow = [...curBoard[row]];
  curRow[col] = value;
  curBoard[row] = curRow;

  return curBoard;
}

function minimaxCellValue(board, moveRow, moveCol, isMaximizingPlayer, deep) {
  const playingValue = isMaximizingPlayer ? 1 : -1;
  const playingBoard = setBoardStatus(board, moveRow, moveCol, playingValue);

  if (
    checkGameState(playingBoard, moveRow, moveCol, playingValue) === WIN_GAME
  ) {
    return MAX_VALUE;
  }
  if (
    checkGameState(playingBoard, moveRow, moveCol, playingValue) === LOSE_GAME
  ) {
    return MIN_VALUE;
  }
  if (
    checkGameState(playingBoard, moveRow, moveCol, playingValue) === DRAW_GAME
  ) {
    return DRAW_VALUE;
  }

  if (isMaximizingPlayer) {
    let bestVal = -INFINITY;
    for (let r = 0; r < playingBoard.length; r++) {
      for (let c = 0; c < playingBoard[r].length; c++) {
        if (playingBoard[r][c] !== 0) {
          continue;
        }

        const value = minimaxCellValue(playingBoard, r, c, false, deep + 1);

        bestVal = Math.max(bestVal, value);
        log(
          "de quy",
          `max {moveRow:${moveRow},moveCol:${moveCol}} {r:${r},c:${c}} value:${value} best:${bestVal}`
        );
      }
    }
    return bestVal;
  } else {
    let bestVal = +INFINITY;

    for (let r = 0; r < playingBoard.length; r++) {
      for (let c = 0; c < playingBoard[r].length; c++) {
        if (playingBoard[r][c] !== 0) {
          continue;
        }
        const value = minimaxCellValue(playingBoard, r, c, true, deep + 1);
        bestVal = Math.min(bestVal, value);

        log(
          "de quy",
          `min {moveRow:${moveRow},moveCol:${moveCol}} {r:${r},c:${c}} value:${value} best:${bestVal}`
        );
      }
    }
    return bestVal;
  }
}

export const pickCellByMiniMax = board => {
  logs.splice(0, logs.length);

  let col = 0,
    row = 0;
  let min = +INFINITY;
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c] !== 0) {
        continue;
      }
      const cellValue = minimaxCellValue(board, r, c, false, 0);
      log("gia tri", `cell[${r},${c}]=${cellValue}`);
      if (cellValue < min) {
        col = c;
        row = r;
        min = cellValue;
      }
    }
  }

  setTimeout(printLogs, 500);
  return { row, col };
};

const logs = [];
function log(key, msg) {
  logs.push({ key, msg });
}

function printLogs() {
  console.log(logs.length);
}

window.printLogs = (from = 0, to = logs.length, filter = value => true) => {
  let printedLogs = logs.filter(filter);
  printedLogs = printedLogs.splice(from, to);

  console.log(printedLogs);
};
