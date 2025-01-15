class Tetris {
  constructor() {
      this.canvas = document.getElementById('tetris');
      this.ctx = this.canvas.getContext('2d');
      this.scoreElement = document.getElementById('score');
      this.levelElement = document.getElementById('level');
      
      // Game properties
      this.gridWidth = 10;
      this.gridHeight = 20;
      this.cellSize = 20;
      this.score = 0;
      this.level = 1;
      this.grid = Array(this.gridHeight).fill().map(() => Array(this.gridWidth).fill(0));
      
      // Tetromino shapes
      this.shapes = [
          [[1, 1, 1, 1]], // I
          [[1, 1], [1, 1]], // O
          [[1, 1, 1], [0, 1, 0]], // T
          [[1, 1, 1], [1, 0, 0]], // L
          [[1, 1, 1], [0, 0, 1]], // J
          [[1, 1, 0], [0, 1, 1]], // S
          [[0, 1, 1], [1, 1, 0]]  // Z
      ];
      
      // Colors for pieces
      this.colors = ['#00f0f0', '#f0f000', '#a000f0', '#f0a000', '#0000f0', '#00f000', '#f00000'];
      
      this.currentPiece = null;
      this.currentPieceX = 0;
      this.currentPieceY = 0;
      this.currentPieceColor = '';
      
      // Bind keyboard controls
      document.addEventListener('keydown', this.handleKeyPress.bind(this));
      
      this.gameLoop = null;
      this.dropInterval = 1000;
      
      this.spawnPiece();
      this.startGame();
  }

  spawnPiece() {
      const shapeIndex = Math.floor(Math.random() * this.shapes.length);
      this.currentPiece = this.shapes[shapeIndex];
      this.currentPieceColor = this.colors[shapeIndex];
      this.currentPieceX = Math.floor((this.gridWidth - this.currentPiece[0].length) / 2);
      this.currentPieceY = 0;
      
      if (this.checkCollision()) {
          this.gameOver();
      }
  }

  draw() {
      // Clear canvas
      this.ctx.fillStyle = '#000';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Draw grid
      for (let y = 0; y < this.gridHeight; y++) {
          for (let x = 0; x < this.gridWidth; x++) {
              if (this.grid[y][x]) {
                  this.ctx.fillStyle = this.grid[y][x];
                  this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize - 1, this.cellSize - 1);
              }
          }
      }
      
      // Draw current piece
      if (this.currentPiece) {
          this.ctx.fillStyle = this.currentPieceColor;
          for (let y = 0; y < this.currentPiece.length; y++) {
              for (let x = 0; x < this.currentPiece[y].length; x++) {
                  if (this.currentPiece[y][x]) {
                      this.ctx.fillRect(
                          (this.currentPieceX + x) * this.cellSize,
                          (this.currentPieceY + y) * this.cellSize,
                          this.cellSize - 1,
                          this.cellSize - 1
                      );
                  }
              }
          }
      }
  }

  checkCollision() {
      for (let y = 0; y < this.currentPiece.length; y++) {
          for (let x = 0; x < this.currentPiece[y].length; x++) {
              if (this.currentPiece[y][x]) {
                  const newX = this.currentPieceX + x;
                  const newY = this.currentPieceY + y;
                  
                  if (newX < 0 || newX >= this.gridWidth || 
                      newY >= this.gridHeight ||
                      (newY >= 0 && this.grid[newY][newX])) {
                      return true;
                  }
              }
          }
      }
      return false;
  }

  mergePiece() {
      for (let y = 0; y < this.currentPiece.length; y++) {
          for (let x = 0; x < this.currentPiece[y].length; x++) {
              if (this.currentPiece[y][x]) {
                  const gridY = this.currentPieceY + y;
                  if (gridY >= 0) {
                      this.grid[gridY][this.currentPieceX + x] = this.currentPieceColor;
                  }
              }
          }
      }
      this.checkLines();
      this.spawnPiece();
  }

  moveDown() {
      this.currentPieceY++;
      if (this.checkCollision()) {
          this.currentPieceY--;
          this.mergePiece();
      }
      this.draw();
  }

  hardDrop() {
      while (!this.checkCollision()) {
          this.currentPieceY++;
      }
      this.currentPieceY--;
      this.mergePiece();
      this.draw();
  }

  moveLeft() {
      this.currentPieceX--;
      if (this.checkCollision()) {
          this.currentPieceX++;
      }
      this.draw();
  }

  moveRight() {
      this.currentPieceX++;
      if (this.checkCollision()) {
          this.currentPieceX--;
      }
      this.draw();
  }

  rotate() {
      const newPiece = this.currentPiece[0].map((_, i) =>
          this.currentPiece.map(row => row[i]).reverse()
      );
      
      const oldPiece = this.currentPiece;
      this.currentPiece = newPiece;
      
      if (this.checkCollision()) {
          this.currentPiece = oldPiece;
      }
      
      this.draw();
  }

  checkLines() {
      for (let y = this.gridHeight - 1; y >= 0; y--) {
          if (this.grid[y].every(cell => cell !== 0)) {
              // Remove the line
              this.grid.splice(y, 1);
              // Add new empty line at top
              this.grid.unshift(Array(this.gridWidth).fill(0));
              
              this.score += 100;
              this.scoreElement.textContent = this.score;
              
              if (this.score % 1000 === 0) {
                  this.level++;
                  this.levelElement.textContent = this.level;
                  this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);
                  this.restartGameLoop();
              }
          }
      }
  }

  handleKeyPress(event) {
      switch(event.keyCode) {
          case 37: // Left arrow
              this.moveLeft();
              break;
          case 39: // Right arrow
              this.moveRight();
              break;
          case 40: // Down arrow
              this.moveDown();
              break;
          case 38: // Up arrow
              this.rotate();
              break;
          case 32: // Space bar
              this.hardDrop();
              break;
      }
  }

  gameOver() {
      clearInterval(this.gameLoop);
      alert('Game Over! Score: ' + this.score);
      this.reset();
  }

  reset() {
      this.grid = Array(this.gridHeight).fill().map(() => Array(this.gridWidth).fill(0));
      this.score = 0;
      this.level = 1;
      this.scoreElement.textContent = this.score;
      this.levelElement.textContent = this.level;
      this.dropInterval = 1000;
      this.spawnPiece();
      this.startGame();
  }

  restartGameLoop() {
      clearInterval(this.gameLoop);
      this.startGame();
  }

  startGame() {
      this.gameLoop = setInterval(() => {
          this.moveDown();
      }, this.dropInterval);
  }
}

// Start the game
const game = new Tetris();