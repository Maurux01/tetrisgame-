body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(31, 41, 55);
  color: white;
  font-family: system-ui, -apple-system, sans-serif;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.score {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
}

.board {
  border: 4px solid rgb(75, 85, 99);
  background-color: rgb(17, 24, 39);
  padding: 0.5rem;
  display: grid;
  grid-template-columns: repeat(10, 1.5rem);
  gap: 1px;
}

.cell {
  width: 1.5rem;
  height: 1.5rem;
  border: 1px solid rgb(55, 65, 81);
  background-color: rgb(17, 24, 39);
}

.message {
  margin-top: 1rem;
  font-size: 1.25rem;
}

.controls {
  margin-top: 1rem;
  font-size: 0.875rem;
  color: rgb(156, 163, 175);
  text-align: center;
}

.controls p {
  margin: 0.25rem 0;
}

.hidden {
  display: none;
}

/* Tetromino colors */
.cyan { background-color: rgb(6, 182, 212); }
.blue { background-color: rgb(59, 130, 246); }
.orange { background-color: rgb(249, 115, 22); }
.yellow { background-color: rgb(234, 179, 8); }
.green { background-color: rgb(34, 197, 94); }
.purple { background-color: rgb(168, 85, 247); }
.red { background-color: rgb(239, 68, 68); }
