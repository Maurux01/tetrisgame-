const board = document.getElementById("board");
const nextPieceContainer = document.getElementById("next-piece");
const scoreElement = document.getElementById("score");

// Dimensiones del tablero
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

// Tablero y variables globales
let boardArray = Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));
let currentPiece;
let nextPiece;
let score = 0;

// Tetrominós y colores
const tetrominos = [
  { shape: [[1, 1, 1, 1]], color: "cyan" }, // I
  { shape: [[1, 1], [1, 1]], color: "yellow" }, // O
  { shape: [[0, 1, 0], [1, 1, 1]], color: "purple" }, // T
  { shape: [[1, 1, 0], [0, 1, 1]], color: "green" }, // S
  { shape: [[0, 1, 1], [1, 1, 0]], color: "red" }, // Z
  { shape: [[1, 0, 0], [1, 1, 1]], color: "blue" }, // L
  { shape: [[0, 0, 1], [1, 1, 1]], color: "orange" }, // J
];

// Generar tablero inicial
function createBoard() {
  board.innerHTML = "";
  for (let row = 0; row < BOARD_HEIGHT; row++) {
    for (let col = 0; col < BOARD_WIDTH; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      if (boardArray[row][col] !== 0) {
        cell.style.backgroundColor = boardArray[row][col];
      }
      board.appendChild(cell);
    }
  }
}

// Generar nueva pieza
function generatePiece() {
  const randomIndex = Math.floor(Math.random() * tetrominos.length);
  return {
    shape: tetrominos[randomIndex].shape,
    color: tetrominos[randomIndex].color,
    row: 0,
    col: Math.floor(BOARD_WIDTH / 2) - 1,
  };
}

// Dibujar pieza en el tablero
function drawPiece(piece, clear = false) {
  const { shape, row, col, color } = piece;
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        const x = row + r;
        const y = col + c;
        if (x >= 0 && x < BOARD_HEIGHT && y >= 0 && y < BOARD_WIDTH) {
          boardArray[x][y] = clear ? 0 : color;
        }
      }
    }
  }
}

// Mover pieza hacia abajo
function moveDown() {
  drawPiece(currentPiece, true);
  currentPiece.row++;
  drawPiece(currentPiece);
  createBoard();
}

// Iniciar juego
function startGame() {
  currentPiece = generatePiece();
  nextPiece = generatePiece();
  drawPiece(currentPiece);
  createBoard();
}

// Inicialización
startGame();
