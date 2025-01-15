const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const TETROMINOES = {
  I: {
    shape: [[1, 1, 1, 1]],
    class: 'cyan'
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1]
    ],
    class: 'blue'
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1]
    ],
    class: 'orange'
  },
  O: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    class: 'yellow'
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0]
    ],
    class: 'green'
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1]
    ],
    class: 'purple'
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1]
    ],
    class: 'red'
  }
};

class Tetris {
  constructor() {
    this.board = Array.from({ length: BOARD_HEIGHT }, () =>
      Array(BOARD_WIDTH).fill(null)
    );
    this.score = 0;
    this.gameOver = false;
    this.isPaused = false;
    this.currentPiece = this.createNewPiece();
    this.boardElement = document.getElementById('board');
    this.scoreElement = document.getElementById('score');
    this.gameOverElement = document.getElementById('game-over');
    this.pausedElement = document.getElementById('paused');
    
    this.initBoard();
    this.bindControls();
    this.startGameLoop();
  }

  initBoard() {
    this.boardElement.innerHTML = '';
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.setAttribute('data-x', x);
        cell.setAttribute('data-y', y);
        this.boardElement.appendChild(cell);
      }
    }
  }

  createNewPiece() {
    const keys = Object.keys(TETROMINOES);
    const tetromino = TETROMINOES[keys[Math.floor(Math.random() * keys.length)]];
    return {
      shape: tetromino.shape,
      class: tetromino.class,
      position: { x: 4, y: 0 }
    };
  }

  isValidMove(shape, x, y) {
    return shape.every((row, dy) =>
      row.every((cell, dx) => {
        if (!cell) return true;
        const newX = x + dx;
        const newY = y + dy;
        return (
          newX >= 0 &&
          newX < BOARD_WIDTH &&
          newY < BOARD_HEIGHT &&
          (newY < 0 || this.board[newY][newX] === null)
        );
      })
    );
  }

  rotate() {
    if (this.gameOver || this.isPaused) return;
    const rotated = this.currentPiece.shape[0].map((_, i) =>
      this.currentPiece.shape.map(row => row[i]).reverse()
    );
    if (this.isValidMove(rotated, this.currentPiece.position.x, this.currentPiece.position.y)) {
      this.currentPiece.shape = rotated;
      this.render();
    }
  }

  moveHorizontal(dir) {
    if (this.gameOver || this.isPaused) return;
    const newX = this.currentPiece.position.x + dir;
    if (this.isValidMove(this.currentPiece.shape, newX, this.currentPiece.position.y)) {
      this.currentPiece.position.x = newX;
      this.render();
    }
  }

  moveDown() {
    if (this.gameOver || this.isPaused) return;
    
    const newY = this.currentPiece.position.y + 1;
    if (this.isValidMove(this.currentPiece.shape, this.currentPiece.position.x, newY)) {
      this.currentPiece.position.y = newY;
      this.render();
      return true;
    }
    
    this.lockPiece();
    return false;
  }

  lockPiece() {
    this.currentPiece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          const boardY = this.currentPiece.position.y + y;
          const boardX = this.currentPiece.position.x + x;
          if (boardY >= 0) {
            this.board[boardY][boardX] = this.currentPiece.class;
          }
        }
      });
    });

    this.clearLines();
    this.currentPiece = this.createNewPiece();
    
    if (!this.isValidMove(this.currentPiece.shape, this.currentPiece.position.x, this.currentPiece.position.y)) {
      this.gameOver = true;
      this.gameOverElement.classList.remove('hidden');
    }
  }

  clearLines() {
    let linesCleared = 0;
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (this.board[y].every(cell => cell !== null)) {
        this.board.splice(y, 1);
        this.board.unshift(Array(BOARD_WIDTH).fill(null));
        linesCleared++;
        y++;
      }
    }
    
    if (linesCleared > 0) {
      this.score += linesCleared * 100;
      this.scoreElement.textContent = this.score;
    }
  }

  render() {
    const cells = this.boardElement.getElementsByClassName('cell');
    
    // Clear all cells
    Array.from(cells).forEach(cell => {
      cell.className = 'cell';
    });
    
    // Render locked pieces
    this.board.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          const index = y * BOARD_WIDTH + x;
          cells[index].classList.add(cell);
        }
      });
    });
    
    // Render current piece
    this.currentPiece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          const boardY = this.currentPiece.position.y + y;
          const boardX = this.currentPiece.position.x + x;
          if (boardY >= 0 && boardY < BOARD_HEIGHT) {
            const index = boardY * BOARD_WIDTH + boardX;
            cells[index].classList.add(this.currentPiece.class);
          }
        }
      });
    });
  }

  bindControls() {
    document.addEventListener('keydown', (event) => {
      switch(event.key) {
        case 'ArrowLeft':
          this.moveHorizontal(-1);
          break;
        case 'ArrowRight':
          this.moveHorizontal(1);
          break;
        case 'ArrowDown':
          this.moveDown();
          break;
        case 'ArrowUp':
          this.rotate();
          break;
        case 'p':
          this.togglePause();
          break;
        case 'r':
          if (this.gameOver) this.reset();
          break;
      }
    });
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    this.pausedElement.classList.toggle('hidden', !this.isPaused);
  }

  reset() {
    this.board = Array.from({ length: BOARD_HEIGHT }, () =>
      Array(BOARD_WIDTH).fill(null)
    );
    this.score = 0;
    this.gameOver = false;
    this.isPaused = false;
    this.currentPiece = this.createNewPiece();
    this.scoreElement.textContent = '0';
    this.gameOverElement.classList.add('hidden');
    this.pausedElement.classList.add('hidden');
    this.render();
  }

  startGameLoop() {
    setInterval(() => {
      if (!this.gameOver && !this.isPaused) {
        this.moveDown();
      }
    }, 1000);
  }
}

// Start the game
new Tetris();
