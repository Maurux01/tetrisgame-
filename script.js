const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const BLOCK_SIZE = 30;
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
let score = 0;
let level = 1;
let gameLoop;
let gameBoard = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));
let currentPiece;
let gameOver = false;

const PIECES = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 1, 1], [1, 0, 0]], // L
    [[1, 1, 1], [0, 0, 1]], // J
    [[1, 1, 0], [0, 1, 1]], // S
    [[0, 1, 1], [1, 1, 0]]  // Z
];

const COLORS = [
    '#00f0f0', // cyan
    '#f0f000', // yellow
    '#a000f0', // purple
    '#f0a000', // orange
    '#0000f0', // blue
    '#00f000', // green
    '#f00000'  // red
];

class Piece {
    constructor(shape, color) {
        this.shape = shape;
        this.color = color;
        this.x = Math.floor(BOARD_WIDTH / 2) - Math.floor(shape[0].length / 2);
        this.y = 0;
    }
}

function createNewPiece() {
    const randomIndex = Math.floor(Math.random() * PIECES.length);
    return new Piece(PIECES[randomIndex], COLORS[randomIndex]);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the board
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            if (gameBoard[y][x]) {
                ctx.fillStyle = gameBoard[y][x];
                ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
            }
        }
    }
    
    // Draw current piece
    if (currentPiece) {
        ctx.fillStyle = currentPiece.color;
        for (let y = 0; y < currentPiece.shape.length; y++) {
            for (let x = 0; x < currentPiece.shape[y].length; x++) {
                if (currentPiece.shape[y][x]) {
                    ctx.fillRect(
                        (currentPiece.x + x) * BLOCK_SIZE,
                        (currentPiece.y + y) * BLOCK_SIZE,
                        BLOCK_SIZE - 1,
                        BLOCK_SIZE - 1
                    );
                }
            }
        }
    }
}

function collision(piece, moveX = 0, moveY = 0) {
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
            if (piece.shape[y][x]) {
                const newX = piece.x + x + moveX;
                const newY = piece.y + y + moveY;
                
                if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
                    return true;
                }
                
                if (newY >= 0 && gameBoard[newY][newX]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function mergePiece() {
    for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
            if (currentPiece.shape[y][x]) {
                if (currentPiece.y + y <= 0) {
                    gameOver = true;
                    return;
                }
                gameBoard[currentPiece.y + y][currentPiece.x + x] = currentPiece.color;
            }
        }
    }
}

function clearLines() {
    let linesCleared = 0;
    
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
        if (gameBoard[y].every(cell => cell !== 0)) {
            gameBoard.splice(y, 1);
            gameBoard.unshift(Array(BOARD_WIDTH).fill(0));
            linesCleared++;
            y++;
        }
    }
    
    if (linesCleared > 0) {
        score += linesCleared * 100 * level;
        document.getElementById('score').textContent = score;
        if (score >= level * 1000) {
            level++;
            document.getElementById('level').textContent = level;
        }
    }
}

function rotatePiece() {
    const rotated = [];
    for (let i = 0; i < currentPiece.shape[0].length; i++) {
        rotated.push([]);
        for (let j = currentPiece.shape.length - 1; j >= 0; j--) {
            rotated[i].push(currentPiece.shape[j][i]);
        }
    }
    
    const previousShape = currentPiece.shape;
    currentPiece.shape = rotated;
    
    if (collision(currentPiece)) {
        currentPiece.shape = previousShape;
    }
}

function update() {
    if (!collision(currentPiece, 0, 1)) {
        currentPiece.y++;
    } else {
        mergePiece();
        if (gameOver) {
            endGame();
            return;
        }
        clearLines();
        currentPiece = createNewPiece();
    }
    draw();
}

function startGame() {
    gameBoard = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));
    score = 0;
    level = 1;
    gameOver = false;
    document.getElementById('score').textContent = '0';
    document.getElementById('level').textContent = '1';
    document.getElementById('game-over').style.display = 'none';
    currentPiece = createNewPiece();
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(() => update(), 1000 / level);
    draw();
}

function endGame() {
    clearInterval(gameLoop);
    document.getElementById('game-over').style.display = 'block';
}

document.addEventListener('keydown', (e) => {
    if (gameOver) return;
    
    switch (e.key) {
        case 'ArrowLeft':
            if (!collision(currentPiece, -1, 0)) {
                currentPiece.x--;
                draw();
            }
            break;
        case 'ArrowRight':
            if (!collision(currentPiece, 1, 0)) {
                currentPiece.x++;
                draw();
            }
            break;
        case 'ArrowDown':
            if (!collision(currentPiece, 0, 1)) {
                currentPiece.y++;
                draw();
            }
            break;
        case 'ArrowUp':
            rotatePiece();
            draw();
            break;
    }
});

startGame();

function endGame() {
    clearInterval(gameLoop);
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('final-score').textContent = score;
}
