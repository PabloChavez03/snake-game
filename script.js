// HTML elements
const board = document.getElementById("board");
const scoreBoard = document.getElementById("score");
const start = document.getElementById("start");
const gameOver = document.getElementById("game-over");

// Game settings
const boardSize = 10;
const gameSpeed = 100;
const squareTypes = {
  emptySquare: 0,
  snakeSquare: 1,
  foodSquare: 2,
};
const directions = {
  ArrowUp: -10,
  ArrowDown: 10,
  ArrowLeft: -1,
  ArrowRight: 1,
};

// Game variables
let snake;
let score;
let direction;
let boardSquares;
let emptySquares;
let moveInterval;

const drawSnake = () => {
  snake.forEach((square) => drawSquare(square, "snakeSquare"));
};

const drawSquare = (square, type) => {
  const [row, column] = square.split("");
  boardSquares[row][column] = squareTypes[type];
  const squareElement = document.getElementById(square);
  squareElement.setAttribute("class", `square ${type}`);

  if (type === "emptySquare") {
    emptySquares.push(square);
  } else {
    if (emptySquares.indexOf(square) !== -1) {
      emptySquares.splice(emptySquares.indexOf(square), 1);
    }
  }
};

const moveSnake = () => {
  const newSquare = String(
    Number(snake[snake.length - 1]) + directions[direction]
  ).padStart(2, "0");

  const [row, column] = newSquare.split("");

  if (
    newSquare < 0 ||
    newSquare > boardSize * boardSize ||
    (direction == "ArrowRight" && column == 0) ||
    (direction == "ArrowLeft" && column == 9) ||
    boardSquares[row][column] === squareTypes.snakeSquare
  ) {
    onGameOver();
  } else {
    snake.push(newSquare);
    if (boardSquares[row][column] === squareTypes.foodSquare) {
      addFood();
    } else {
      const emptySquare = snake.shift();
      drawSquare(emptySquare, "emptySquare");
    }
    drawSnake();
  }
};

const addFood = () => {
  score++;
  updateScore();
  createRamdonFood();
};

const onGameOver = () => {
  gameOver.style.display = "block";
  clearInterval(moveInterval);
  start.innerHTML = "Play again"
  start.disabled = false;
};

const setDirection = (newDirection) => {
  direction = newDirection;
};

const directionEvent = (key) => {
  switch (key.code) {
    case "ArrowUp":
      direction !== "ArrowDown" && setDirection(key.code);
      break;
    case "ArrowDown":
      direction !== "ArrowUp" && setDirection(key.code);
      break;
    case "ArrowLeft":
      direction !== "ArrowRight" && setDirection(key.code);
      break;
    case "ArrowRight":
      direction !== "ArrowLeft" && setDirection(key.code);
      break;
  }
};

const createRamdonFood = () => {
  const ramdonEmptySquare =
    emptySquares[Math.floor(Math.random() * emptySquares.length)];

  drawSquare(ramdonEmptySquare, "foodSquare");
};

const updateScore = () => {
  scoreBoard.innerText = score;
};

const createBoard = () => {
  boardSquares.forEach((row, rowIndex) => {
    row.forEach((column, columnIndex) => {
      const squareValue = `${rowIndex}${columnIndex}`;
      const squareElement = document.createElement("div");
      squareElement.setAttribute("class", "square emptySquare");
      squareElement.setAttribute("id", squareValue);
      board.appendChild(squareElement);
      emptySquares.push(squareValue);
    });
  });
};

const setGame = () => {
  snake = ["00", "01"];
  score = 0;
  direction = "ArrowRight";
  boardSquares = Array.from(Array(boardSize), () =>
    new Array(boardSize).fill(squareTypes.emptySquare)
  );
  board.innerHTML = "";
  emptySquares = [];
  createBoard();
};

const startGame = () => {
  setGame();
  gameOver.style.display = "none";
  start.disabled = true;
  drawSnake();
  updateScore();
  createRamdonFood();
  document.addEventListener("keydown", directionEvent);
  moveInterval = setInterval(() => moveSnake(), gameSpeed);
};

start.addEventListener("click", startGame);
