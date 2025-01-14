document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  const scoreDisplay = document.querySelector('#score');
  const startBtn = document.querySelector('#start-button');
  const width = 10;
  let timerId;
  let score = 0;

  const colors = ['orange', 'red', 'purple', 'green', 'blue'];

  // Tetrominoes
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const theTetrominoes = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];

  let currentPosition = 4;
  let currentRotation = 0;

  // Randomly select a Tetromino and its first rotation
  let random = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

  // Draw the Tetromino
  function draw() {
    current.forEach((index) => {
      grid.children[currentPosition + index].classList.add('tetromino');
      grid.children[currentPosition + index].style.backgroundColor =
        colors[random];
    });
  }

  // Undraw the Tetromino
  function undraw() {
    current.forEach((index) => {
      grid.children[currentPosition + index].classList.remove('tetromino');
      grid.children[currentPosition + index].style.backgroundColor = '';
    });
  }

  // Assign functions to keyCodes
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      moveDown();
    }
  }
  document.addEventListener('keydown', control);

  // Move down function
  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }

  // Freeze function
  function freeze() {
    if (
      current.some((index) =>
        grid.children[currentPosition + index + width].classList.contains('taken')
      )
    ) {
      current.forEach((index) =>
        grid.children[currentPosition + index].classList.add('taken')
      );
      // Start a new Tetromino falling
      random = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      addScore();
      gameOver();
    }
  }

  // Move the Tetromino left, unless it is at the edge or there is a blockage
  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % width === 0
    );

    if (!isAtLeftEdge) currentPosition -= 1;

    if (
      current.some((index) =>
        grid.children[currentPosition + index].classList.contains('taken')
      )
    ) {
      currentPosition += 1;
    }

    draw();
  }

  // Move the Tetromino right, unless it is at the edge or there is a blockage
  function moveRight() {
    undraw();
    const isAtRightEdge = current.some(
      (index) => (currentPosition + index) % width === width - 1
    );

    if (!isAtRightEdge) currentPosition += 1;

    if (
      current.some((index) =>
        grid.children[currentPosition + index].classList.contains('taken')
      )
    ) {
      currentPosition -= 1;
    }

    draw();
  }

  // Rotate the Tetromino
  function rotate() {
    undraw();
    currentRotation++;
    if (currentRotation === current.length) {
      currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation];
    draw();
  }

  // Add score
  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];

      if (row.every((index) => grid.children[index].classList.contains('taken'))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach((index) => {
          grid.children[index].classList.remove('taken');
          grid.children[index].classList.remove('tetromino');
          grid.children[index].style.backgroundColor = '';
        });
        const squaresRemoved = Array.from(grid.children).splice(i, width);
        squaresRemoved.forEach((square) => grid.appendChild(square));
      }
    }
  }

  // Game over
  function gameOver() {
    if (
      current.some((index) =>
        grid.children[currentPosition + index].classList.contains('taken')
      )
    ) {
      scoreDisplay.innerHTML = 'Game Over';
      clearInterval(timerId);
    }
  }

  // Start/Pause button
  startBtn.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, 1000);
    }
  });
});
