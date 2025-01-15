class Tetris {
    constructor(width = 10, height = 20) {
        this.width = width;
        this.height = height;
        this.grid = this.createGrid();
        this.score = 0;
        this.gameOver = false;
        this.currentPiece = null;
        this.colors = ['cyan', 'blue', 'orange', 'yellow', 'green', 'purple', 'red'];
    }

    // Piezas del Tetris (tetriminós)
    static pieces = [
        [[1, 1, 1, 1]],  // I
        [[1, 1, 1],      // L
         [1, 0, 0]],
        [[1, 1, 1],      // J
         [0, 0, 1]],
        [[1, 1],         // O
         [1, 1]],
        [[0, 1, 1],      // S
         [1, 1, 0]],
        [[1, 1, 1],      // T
         [0, 1, 0]],
        [[1, 1, 0],      // Z
         [0, 1, 1]]
    ];

    createGrid() {
        return Array(this.height).fill().map(() => Array(this.width).fill(0));
    }

    // Genera una nueva pieza
    newPiece() {
        const pieceIndex = Math.floor(Math.random() * Tetris.pieces.length);
        const piece = Tetris.pieces[pieceIndex];
        const color = this.colors[pieceIndex];
        this.currentPiece = {
            shape: piece,
            x: Math.floor((this.width - piece[0].length) / 2),
            y: 0,
            color: color
        };
    }

    // Verifica si una posición es válida
    isValidMove(piece, x, y) {
        return piece.shape.every((row, dy) => {
            return row.every((value, dx) => {
                let newX = x + dx;
                let newY = y + dy;
                return (
                    value === 0 ||
                    (newX >= 0 &&
                     newX < this.width &&
                     newY < this.height &&
                     (newY < 0 || this.grid[newY][newX] === 0))
                );
            });
        });
    }

    // Rota la pieza actual
    rotate() {
        const rotated = this.currentPiece.shape[0].map((_, i) =>
            this.currentPiece.shape.map(row => row[row.length - 1 - i])
        );
        
        if (this.isValidMove({...this.currentPiece, shape: rotated},
                            this.currentPiece.x,
                            this.currentPiece.y)) {
            this.currentPiece.shape = rotated;
        }
    }

    // Mueve la pieza hacia abajo
    moveDown() {
        if (this.isValidMove(this.currentPiece,
                            this.currentPiece.x,
                            this.currentPiece.y + 1)) {
            this.currentPiece.y++;
            return true;
        }
        this.mergePiece();
        this.clearLines();
        this.newPiece();
        if (!this.isValidMove(this.currentPiece,
                             this.currentPiece.x,
                             this.currentPiece.y)) {
            this.gameOver = true;
        }
        return false;
    }

    // Mueve la pieza a la izquierda
    moveLeft() {
        if (this.isValidMove(this.currentPiece,
                            this.currentPiece.x - 1,
                            this.currentPiece.y)) {
            this.currentPiece.x--;
        }
    }

    // Mueve la pieza a la derecha
    moveRight() {
        if (this.isValidMove(this.currentPiece,
                            this.currentPiece.x + 1,
                            this.currentPiece.y)) {
            this.currentPiece.x++;
        }
    }

    // Fusiona la pieza con el tablero
    mergePiece() {
        this.currentPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    const newY = this.currentPiece.y + y;
                    if (newY >= 0) {
                        this.grid[newY][this.currentPiece.x + x] = this.currentPiece.color;
                    }
                }
            });
        });
    }

    // Limpia las líneas completas
    clearLines() {
        let linesCleared = 0;
        for (let y = this.height - 1; y >= 0; y--) {
            if (this.grid[y].every(cell => cell !== 0)) {
                this.grid.splice(y, 1);
                this.grid.unshift(Array(this.width).fill(0));
                linesCleared++;
                y++;
            }
        }
        this.score += linesCleared * 100;
    }
}

// Inicialización y control del juego
function initGame() {
    const game = new Tetris();
    game.newPiece();
    
    // Manejo de eventos del teclado
    document.addEventListener('keydown', event => {
        if (!game.gameOver) {
            switch(event.key) {
                case 'ArrowLeft':
                    game.moveLeft();
                    break;
                case 'ArrowRight':
                    game.moveRight();
                    break;
                case 'ArrowDown':
                    game.moveDown();
                    break;
                case 'ArrowUp':
                    game.rotate();
                    break;
            }
            drawGame();
        }
    });

    // Bucle principal del juego
    function gameLoop() {
        if (!game.gameOver) {
            game.moveDown();
            drawGame();
            setTimeout(gameLoop, 1000);
        }
    }

    // Función para dibujar el juego
    function drawGame() {
        const canvas = document.getElementById('tetris');
        const ctx = canvas.getContext('2d');
        const blockSize = 30;

        // Limpia el canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibuja la cuadrícula
        game.grid.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    ctx.fillStyle = value;
                    ctx.fillRect(x * blockSize, y * blockSize, blockSize - 1, blockSize - 1);
                }
            });
        });

        // Dibuja la pieza actual
        if (game.currentPiece) {
            ctx.fillStyle = game.currentPiece.color;
            game.currentPiece.shape.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0) {
                        ctx.fillRect(
                            (game.currentPiece.x + x) * blockSize,
                            (game.currentPiece.y + y) * blockSize,
                            blockSize - 1,
                            blockSize - 1
                        );
                    }
                });
            });
        }

        // Muestra la puntuación
        document.getElementById('score').textContent = `Score: ${game.score}`;

        // Muestra Game Over
        if (game.gameOver) {
            ctx.fillStyle = 'black';
            ctx.font = '48px Arial';
            ctx.fillText('Game Over!', canvas.width/4, canvas.height/2);
        }
    }

    gameLoop();
}