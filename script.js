const board = document.querySelector(".board");
const startButton = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");

const scoreElement = document.querySelector("#score");
const highScoreElement = document.querySelector("#high-score");
const timeElement = document.querySelector("#time");


const isMobile = window.innerWidth < 768;

const blockWidth = isMobile ? 25 : 50;
const blockHeight = isMobile ? 25 : 50;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

const blocks = [];

let snake;
let food;
let direction;
let gameInterval;
let timerInterval;
let score;
let seconds;

let highScore = Number(localStorage.getItem("highscore")) || 0;
highScoreElement.innerText = highScore;

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement("div");
        block.classList.add("block");
        board.appendChild(block);
        blocks[`${row}-${col}`] = block;
    }
}

function generateFood() {
    do {
        food = {
            x: Math.floor(Math.random() * rows),
            y: Math.floor(Math.random() * cols),
        };
    } while (
        snake.some(segment => segment.x === food.x && segment.y === food.y)
    );
}

function initializeGame() {
    snake = [
        { x: 1, y: 3 }
    ];

    direction = "right";
    score = 0;
    seconds = 0;

    scoreElement.innerText = score;
    timeElement.innerText = seconds;

    blocks.forEach(block => {
        block.classList.remove("fill", "food");
    });

    generateFood();

    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.add("fill");
    });

    blocks[`${food.x}-${food.y}`].classList.add("food");
}

function render() {

    let head;

    switch (direction) {
        case "up":
            head = { x: snake[0].x - 1, y: snake[0].y };
            break;

        case "down":
            head = { x: snake[0].x + 1, y: snake[0].y };
            break;

        case "left":
            head = { x: snake[0].x, y: snake[0].y - 1 };
            break;

        case "right":
            head = { x: snake[0].x, y: snake[0].y + 1 };
            break;
    }

    // Wall collision
    if (
        head.x < 0 ||
        head.x >= rows ||
        head.y < 0 ||
        head.y >= cols
    ) {
        gameOver();
        return;
    }

    // Self collision
    if (
        snake.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        gameOver();
        return;
    }

    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    });

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {

        score++;
        scoreElement.innerText = score;

        if (score > highScore) {
            highScore = score;
            highScoreElement.innerText = highScore;
            localStorage.setItem("highscore", highScore);
        }

        blocks[`${food.x}-${food.y}`].classList.remove("food");
        generateFood();

    } else {
        snake.pop();
    }

    blocks[`${food.x}-${food.y}`].classList.add("food");

    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.add("fill");
    });
}

function gameOver() {

    clearInterval(gameInterval);
    clearInterval(timerInterval);

    modal.style.display = "flex";
    startGameModal.style.display = "none";
    gameOverModal.style.display = "flex";
}

startButton.addEventListener("click", () => {

    modal.style.display = "none";

    initializeGame();

    gameInterval = setInterval(render, 200);

    timerInterval = setInterval(() => {
        seconds++;
        timeElement.innerText = seconds;
    }, 1000);
});

function restartGame() {
    location.reload();
}

document.addEventListener("keydown", (event) => {

    switch (event.key) {

        case "ArrowUp":
            if (direction !== "down")
                direction = "up";
            break;

        case "ArrowDown":
            if (direction !== "up")
                direction = "down";
            break;

        case "ArrowLeft":
            if (direction !== "right")
                direction = "left";
            break;

        case "ArrowRight":
            if (direction !== "left")
                direction = "right";
            break;
    }
});

let startX = 0;
let startY = 0;

document.addEventListener("touchstart",(e)=>{
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

document.addEventListener("touchend",(e)=>{

    let endX = e.changedTouches[0].clientX;
    let endY = e.changedTouches[0].clientY;

    let dx = endX - startX;
    let dy = endY - startY;

    if(Math.abs(dx) > Math.abs(dy)){

        if(dx > 30 && direction!="left")
            direction="right";

        else if(dx < -30 && direction!="right")
            direction="left";

    }else{

        if(dy > 30 && direction!="up")
            direction="down";

        else if(dy < -30 && direction!="down")
            direction="up";

    }

});