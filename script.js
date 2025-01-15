const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const SHAPES = {
  I: [[1,1,1,1]],
  O: [[1,1],[1,1]],
  T: [[0,1,0],[1,1,1]],
  S: [[0,1,1],[1,1,0]],
  Z: [[1,1,0],[0,1,1]],
  J: [[1,0,0],[1,1,1]],
  L: [[0,0,1],[1,1,1]]
};

class Game {
  constructor() {
    this.board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));
    this.score = 0;
    this.currentPiece = null;
    this.gameOver = false;
    
    this.createBoard();
    this.spawnPiece();
    this.bindControls();
    this.gameLoop();
  }
  
  createBoard() {
    const board = document.getElementById('game-board');
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      const row = document.createElement('div');
      row.className = 'row';
      for (let x = 0; x < BOARD_WIDTH; x++) {
        const cell = document.createElement('div');
        cell.className = 'cell empty';
        row.appendChild(cell);
      }
      board.appendChild(row);
    }
  }
  
  spawnPiece() {
    const pieces = Object.entries(SHAPES);
    const [type, shape] = pieces[Math.floor(Math.random() * pieces.length)];
    this.currentPiece = {
      type,
      shape: JSON.parse(JSON.stringify(shape)),
      x: Math.floor((BOARD_WIDTH - shape[0].length) / 2),
      y: 0
    };
    
    if (!this.isValidMove(0, 0)) {
      this.gameOver = true;
      alert('Game Over! Score: ' + this.score);
      this.reset();
    }
  }
  
  isValidMove(moveX, moveY, newShape = null) {
    const shape = newShape || this.currentPiece.shape;
    const newX = this.currentPiece.x + moveX;
    const newY = this.currentPiece.y + moveY;
    
    return shape.every((row, y) =>
      row.every((cell, x) => {
        if (!cell) return true;
        const boardX = newX + x;
        const boardY = newY + y;
        return (
          boardX >= 0 &&
          boardX < BOARD_WIDTH &&
          boardY < BOARD_HEIGHT &&
          !this.board[boardY]?.[boardX]
        );
      })
    );
  }
  
  rotate() {
    const newShape = this.currentPiece.shape[0].map((_, i) =>
      this.currentPiece.shape.map(row => row[i]).reverse()
    );
    if (this.isValidMove(0, 0, newShape)) {
      this.currentPiece.shape = newShape;
      this.draw();
    }
  }
  
  moveDown() {
    if (this.isValidMove(0, 1)) {
      this.currentPiece.y++;
      this.draw();
      return true;
    }
    this.lockPiece();
    return false;
  }
  
  moveHorizontal(dir) {
    if (this.isValidMove(dir, 0)) {
      this.currentPiece.x += dir;
      this.draw();
    }
  }
  
  lockPiece() {
    this.currentPiece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          const boardY = this.currentPiece.y + y;
          const boardX = this.currentPiece.x + x;
          this.board[boardY][boardX] = this.currentPiece.type;
        }
      });
    });
    
    this.clearLines();
    this.spawnPiece();
  }
  
  clearLines() {
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (this.board[y].every(cell => cell)) {
        this.board.splice(y, 1);
        this.board.unshift(Array(BOARD_WIDTH).fill(0));
        this.score += 100;
        document.getElementById('score').textContent = this.score;
      }
    }
  }
  
  draw() {
    const cells = document.getElementsByClassName('cell');
    let index = 0;
    
    // Clear board
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        cells[index].className = 'cell ' + (this.board[y][x] || 'empty');
        index++;
      }
    }
    
    // Draw current piece
    this.currentPiece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          const boardY = this.currentPiece.y + y;
          const boardX = this.currentPiece.x + x;
          if (boardY >= 0) {
            const index = boardY * BOARD_WIDTH + boardX;
            cells[index].className = 'cell ' + this.currentPiece.type;
          }
        }
      });
    });
  }
  
  bindControls() {
    document.addEventListener('keydown', (e) => {
      if (this.gameOver) return;
      
      switch(e.key) {
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
        case ' ':
          while(this.moveDown());
          break;
      }
    });
  }
  
  reset() {
    this.board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));
    this.score = 0;
    this.gameOver = false;
    document.getElementById('score').textContent = '0';
    this.spawnPiece();
  }
  
  gameLoop() {
    setInterval(() => {
      if (!this.gameOver) {
        this.moveDown();
      }
    }, 1000);
  }
}

// Start the game
new Game();