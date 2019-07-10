import React, { useRef, useEffect } from "react";
import Swal from "sweetalert2";

import {
  pickCellByMiniMax,
  checkGameState,
  UN_IDENTIFY_GAME,
  WIN_GAME,
  LOSE_GAME,
  DRAW_GAME
} from "./features";

const cellPadding = 10.0;
const numOfCells = 3;
let board = [];
const boardSize = Math.min(window.innerWidth, window.innerHeight);
const padding = 5.0;
const cellSize = (boardSize - padding * 2) / numOfCells;
const endRowX = boardSize - padding * 2;
const endColY = boardSize - padding * 2;
const cellLineWidth = 1;
const markLineWidth = 6;

function drawBoard(context) {
  context.beginPath();

  for (var i = 0; i <= numOfCells; i++) {
    const row = i * cellSize + padding;
    const beginRow = [padding, row > endColY ? endColY : row];
    const endRow = [endRowX, row > endColY ? endColY : row];

    const col = i * cellSize + padding;
    const beginCol = [col > endRowX ? endRowX : col, padding];
    const endCol = [col > endRowX ? endRowX : col, endColY];

    context.moveTo(beginRow[0], beginRow[1]);
    context.lineTo(endRow[0], endRow[1]);

    context.moveTo(beginCol[0], beginCol[1]);
    context.lineTo(endCol[0], endCol[1]);
  }

  context.lineWidth = cellLineWidth;
  context.strokeStyle = "black";
  context.stroke();
}

function getMousePosition(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  return { x, y };
}

function toCellPosition(x, y) {
  const col = parseInt((x - padding) / cellSize, 10);
  const row = parseInt((y - padding) / cellSize, 10);

  return { col, row };
}

function isPlayable(r, c) {
  return board[r][c] === 0;
}

function cellPos(r, c) {
  const row = r * cellSize + padding;
  const nextRow = row + cellSize > endRowX ? endRowX : row + cellSize;

  const col = c * cellSize + padding;
  const nextCol = col + cellSize > endColY ? endColY : col + cellSize;

  return { row, nextRow, col, nextCol };
}
function drawX(context, r, c) {
  const { row, nextRow, col, nextCol } = cellPos(r, c);

  context.beginPath();

  context.moveTo(col + cellPadding, row + cellPadding);
  context.lineTo(nextCol - cellPadding, nextRow - cellPadding);

  context.moveTo(nextCol - cellPadding, row + cellPadding);
  context.lineTo(col + cellPadding, nextRow - cellPadding);

  context.lineWidth = markLineWidth;
  context.strokeStyle = "orange";
  context.stroke();
}

function playX(context, row, col) {
  if (!isPlayable(row, col)) {
    return false;
  }

  drawX(context, row, col);

  board[row][col] = 1;
  return true;
}

function drawO(context, r, c) {
  const { row, col } = cellPos(r, c);
  context.beginPath();
  context.arc(
    col + cellSize / 2,
    row + cellSize / 2,
    cellSize / 2 - cellPadding,
    0,
    2 * Math.PI
  );

  context.lineWidth = markLineWidth;
  context.strokeStyle = "green";
  context.stroke();
}

function playO(context) {
  const { row, col } = pickCellByMiniMax(board);

  drawO(context, row, col);

  board[row][col] = -1;

  return { row, col };
}

let gameDone = false;

function processMouseClick(canvas, event) {
  if (gameDone) {
    return;
  }
  const { x, y } = getMousePosition(canvas, event);
  const { col, row } = toCellPosition(x, y);

  if (row < 0 || row >= numOfCells || col < 0 || col >= numOfCells) {
    return;
  }

  if (!playX(canvas.getContext("2d"), row, col)) {
    return;
  }

  if (checkCaroGameState(row, col, 1) !== UN_IDENTIFY_GAME) {
    return;
  }

  const { row: rowO, col: colO } = playO(canvas.getContext("2d"), row, col);

  checkCaroGameState(rowO, colO, -1);
}

function checkCaroGameState(row, col, value) {
  const gameState = checkGameState(board, row, col, value);

  switch (gameState) {
    case WIN_GAME:
      Swal.fire({
        title: "Móa!",
        text: "Dơơơơ...",
        imageUrl: "images/thua.png",
        imageWidth: 400,
        imageAlt: "Móa! Dơơơơ...",
        animation: true,
        onClose: () => {
          gameDone = false;
          initBoard();
          drawContext.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
          drawBoard(drawContext);
        }
      });
      gameDone = true;
      break;
    case LOSE_GAME:
      Swal.fire({
        title: "Thua chưa!",
        text: "AI đấy...",
        imageUrl: "images/thang.gif",
        imageWidth: 400,
        imageAlt: "Thua chưa! AI đấy...",
        animation: true,
        onClose: () => {
          gameDone = false;
          initBoard();
          drawContext.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
          drawBoard(drawContext);
        }
      });

      gameDone = true;
      break;
    case DRAW_GAME:
      Swal.fire({
        title: "Hòa!",
        text: "Hòa cái beep...",
        imageUrl: "images/hoa.png",
        imageWidth: 400,
        imageAlt: "Thua chưa! AI đấy...",
        animation: true,
        onClose: () => {
          gameDone = false;
          initBoard();

          drawContext.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
          drawBoard(drawContext);
        }
      });

      gameDone = true;
      break;
    default:
      break;
  }

  return gameState;
}

function initBoard() {
  board = [];
  for (var r = 0; r < numOfCells; r++) {
    board[r] = [];
    for (var c = 0; c < numOfCells; c++) {
      board[r].push(0);
    }
  }
}
let drawContext;
let drawCanvas;

function App() {
  const canvas = useRef(null);
  useEffect(() => {
    initBoard();

    const ctx = canvas.current.getContext("2d");
    drawCanvas = canvas.current;
    drawContext = ctx;
    drawBoard(ctx);
  });

  return (
    <canvas
      width={boardSize}
      height={boardSize}
      ref={canvas}
      onClick={e => {
        processMouseClick(canvas.current, e);
      }}
    />
  );
}

export default App;
