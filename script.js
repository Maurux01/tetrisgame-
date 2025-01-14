const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');

const ROWS = 20;
const COLUMNS = 10;
const BLOCK_SIZE = 30;
const COLORS = ['#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#8E44AD', '#1ABC9C', '#E74C3C'];

const tetrominos = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[0, 1, 0], [1, 1, 1]], // T
  [[1, 1, 0], [0, 1, 1]], // S
  [[0, 1, 1], [1, 1, 0]], // Z
  [[1, 0, 0], [1, 1, 1]], // J
  [[0, 0, 1], [1, 1, 1]], // L
];

let board = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0));
let currentPiece = createPiece();
let gameOver = false;

function createPiece() {
  const type = Math.floor(Math.random() * tetrominos.length);
  return {
    shape: tetrominos[type],
    x: Math.floor(COLUMNS / 2) - 1,
    y: 0,
    color: COLORS[type],
  };
}

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      if (board[row][col]) {
        ctx.fillStyle = board[row][col];
        ctx.fillRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    }
  }
}

function drawPiece() {
  for (let row = 0; row < currentPiece.shape.length; row++) {
    for (let col = 0; col < currentPiece.shape[row].length; col++) {
      if (currentPiece.shape[row][col]) {
        ctx.fillStyle = currentPiece.color;
        ctx.fillRect(
          (currentPiece.x + col) * BLOCK_SIZE,
          (currentPiece.y + row) * BLOCK_SIZE,
          BLOCK_SIZE,
          BLOCK_SIZE
        );
      }
    }
  }
}

function isValidMove() {
  for (let row = 0; row < currentPiece.shape.length; row++) {
    for (let col = 0; col < currentPiece.shape[row].length; col++) {
      if (currentPiece.shape[row][col]) {
        const x = currentPiece.x + col;
        const y = currentPiece.y + row;
        if (x < 0 || x >= COLUMNS || y >= ROWS || (y >= 0 && board[y][x])) {
          return false;
        }
      }
    }
  }
  return true;
}

function placePiece() {
  for (let row = 0; row < currentPiece.shape.length; row++) {
    for (let col = 0; col < currentPiece.shape[row].length; col++) {
      if (currentPiece.shape[row][col]) {
        const x = currentPiece.x + col;
        const y = currentPiece.y + row;
        if (y >= 0) {
          board[y][x] = currentPiece.color;
        }
      }
    }
  }
}

function clearRows() {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row].every(cell => cell !== 0)) {
      board.splice(row, 1);
      board.unshift(Array(COLUMNS).fill(0));
    }
  }
}

function rotatePiece() {
  const rotatedShape = currentPiece.shape[0].map((_, index) =>
    currentPiece.shape.map(row => row[index])
  );
  const originalShape = currentPiece.shape;
  currentPiece.shape = rotatedShape;

  if (!isValidMove()) {
    currentPiece.shape = originalShape;
  }
}

function movePiece(direction) {
  currentPiece.x += direction;
  if (!isValidMove()) {
    currentPiece.x -= direction;
  }
}

function dropPiece() {
  currentPiece.y++;
  if (!isValidMove()) {
    currentPiece.y--;
    placePiece();
    clearRows();
    currentPiece = createPiece();
    if (!isValidMove()) {
      gameOver = true;
    }
  }
}

function handleKeyPress(event) {
  if (gameOver) return;
  if (event.key === 'ArrowLeft') {
    movePiece(-1);
  } else if (event.key === 'ArrowRight') {
    movePiece(1);
  } else if (event.key === 'ArrowDown') {
    dropPiece();
  } else if (event.key === 'ArrowUp') {
    rotatePiece();
  }
}

function gameLoop() {
  if (gameOver) {
    alert('Game Over!');
    return;
  }
  drawBoard();
  drawPiece();
  dropPiece();
  requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', handleKeyPress);

gameLoop();
