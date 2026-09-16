const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const WIDTH = 400;
const HEIGHT = 600;
const GRID_SIZE = 20;

const FOOD_COLORS = [
    "#ff788c",
    "#ffd764",
    "#b496e6",
    "#82bef0",
    "#78d296"
];

const SNAKE_COLORS = [
    ["#78d296", "#5abe82", "#46a56e"],
    ["#82bef0", "#64a5dc", "#4b8cc3"],
    ["#ffbe78", "#f5a05a", "#e18746"],
    ["#d2a0eb", "#b982d7", "#a069c3"]
];

let highScore = Number(localStorage.getItem("cuteSnakeHighScore") || 0);
let snake = [];
let direction = { x: GRID_SIZE, y: 0 };
let foods = [];
let score = 0;
let colorIndex = 0;
let gameOver = false;
let screenState = "menu";
let lastMove = 0;
let moveDelay = 145;

const titleFont = "bold 44px Arial";
const buttonFont = "bold 22px Arial";
const infoFont = "18px Arial";
const scoreFont = "bold 18px Arial";
const gameOverFont = "bold 38px Arial";

function randomFoodPosition() {
    let food;

    do {
        const x = Math.floor(Math.random() * (WIDTH / GRID_SIZE)) * GRID_SIZE;
        const y = (5 + Math.floor(Math.random() * ((HEIGHT / GRID_SIZE) - 5))) * GRID_SIZE;
        food = { x, y };
    } while (
        snake.some(s => s.x === food.x && s.y === food.y) ||
        foods.some(f => f.x === food.x && f.y === food.y)
    );

    return food;
}

function createFoods() {
    foods = [];
    for (let i = 0; i < 5; i++) {
        foods.push(randomFoodPosition());
    }
}

function resetGame() {
    snake = [
        { x: 200, y: 300 },
        { x: 180, y: 300 },
        { x: 160, y: 300 }
    ];

    direction = { x: GRID_SIZE, y: 0 };
    score = 0;
    colorIndex = 0;
    gameOver = false;
    moveDelay = 145;
    createFoods();
}

function roundedRect(x, y, width, height, radius, fill) {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.fillStyle = fill;
    ctx.fill();
}

function drawMenu() {
    ctx.fillStyle = "#800020";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = "#a52d49";
    ctx.beginPath();
    ctx.arc(20, 35, 75, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#690019";
    ctx.beginPath();
    ctx.arc(390, 565, 85, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#b94159";
    ctx.beginPath();
    ctx.arc(375, 40, 25, 0, Math.PI * 2);
    ctx.fill();

    roundedRect(35, 55, 330, 490, 30, "#fff5f5");

    ctx.fillStyle = "#800020";
    ctx.font = titleFont;
    ctx.textAlign = "center";
    ctx.fillText("SNAKE GAME", WIDTH / 2, 145);

    // Ular hiasan
    const miniSnake = [
        { x: 165, y: 185, c: "#78d296" },
        { x: 185, y: 185, c: "#5abe82" },
        { x: 205, y: 185, c: "#46a56e" }
    ];

    miniSnake.forEach(part => {
        ctx.fillStyle = part.c;
        ctx.beginPath();
        ctx.arc(part.x, part.y, 14, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(169, 181, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#3c3741";
    ctx.beginPath();
    ctx.arc(169, 181, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#784650";
    ctx.font = infoFont;
    ctx.fillText("Welcome to Cute Snake! 🐍", WIDTH / 2, 225);

    roundedRect(90, 255, 220, 50, 15, "#fadce1");

    ctx.fillStyle = "#3c3741";
    ctx.font = infoFont;
    ctx.fillText(`Best Score : ${highScore}`, WIDTH / 2, 287);

    roundedRect(80, 330, 240, 55, 15, "#a52a41");
    ctx.fillStyle = "#ffffff";
    ctx.font = buttonFont;
    ctx.fillText("MULAI GAME", WIDTH / 2, 365);

    roundedRect(80, 400, 240, 55, 15, "#911932");
    ctx.fillText("KELUAR", WIDTH / 2, 435);

    ctx.fillStyle = "#784650";
    ctx.font = infoFont;
    ctx.fillText("WASD / Arrow Keys untuk bermain", WIDTH / 2, 480);
    ctx.fillText("Mobile: gunakan tombol arah", WIDTH / 2, 510);
}

function drawHeader() {
    ctx.fillStyle = "#961932";
    ctx.fillRect(0, 0, WIDTH, 85);

    roundedRect(20, 18, 105, 50, 15, "#fff5f5");
    roundedRect(145, 18, 110, 50, 15, "#fff5f5");
    roundedRect(275, 18, 105, 50, 15, "#fff5f5");

    ctx.fillStyle = "#3c3741";
    ctx.font = scoreFont;
    ctx.textAlign = "center";
    ctx.fillText(`Score: ${score}`, 72, 49);

    const level = Math.floor(score / 5) + 1;
    ctx.fillText(`Level: ${level}`, 200, 49);
    ctx.fillText(`Best: ${highScore}`, 327, 49);
}

function drawSnake() {
    const colors = SNAKE_COLORS[colorIndex];
    const [headColor, bodyColor, bodyColor2] = colors;

    snake.forEach((part, i) => {
        const color = i === 0
            ? headColor
            : (i % 2 ? bodyColor : bodyColor2);

        roundedRect(part.x, part.y, GRID_SIZE, GRID_SIZE, 7, color);
    });

    drawFace();
}

function drawFace() {
    const head = snake[0];
    let eye1, eye2;

    if (direction.x > 0) {
        eye1 = { x: head.x + 14, y: head.y + 5 };
        eye2 = { x: head.x + 14, y: head.y + 15 };
    } else if (direction.x < 0) {
        eye1 = { x: head.x + 6, y: head.y + 5 };
        eye2 = { x: head.x + 6, y: head.y + 15 };
    } else if (direction.y < 0) {
        eye1 = { x: head.x + 5, y: head.y + 6 };
        eye2 = { x: head.x + 15, y: head.y + 6 };
    } else {
        eye1 = { x: head.x + 5, y: head.y + 14 };
        eye2 = { x: head.x + 15, y: head.y + 14 };
    }

    [eye1, eye2].forEach(eye => {
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(eye.x, eye.y, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#3c3741";
        ctx.beginPath();
        ctx.arc(eye.x, eye.y, 2, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.fillStyle = "#ffaabe";
    ctx.beginPath();
    ctx.arc(head.x + 4, head.y + 14, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(head.x + 16, head.y + 14, 2, 0, Math.PI * 2);
    ctx.fill();
}

function drawFoods() {
    foods.forEach((food, i) => {
        ctx.fillStyle = FOOD_COLORS[i % FOOD_COLORS.length];
        ctx.beginPath();
        ctx.arc(food.x + 10, food.y + 10, 9, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#78d296";
        ctx.beginPath();
        ctx.arc(food.x + 15, food.y + 3, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(food.x + 7, food.y + 7, 2, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawGame() {
    ctx.fillStyle = "#800020";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    drawHeader();

    ctx.fillStyle = "#690019";
    ctx.fillRect(0, 100, WIDTH, HEIGHT - 100);

    ctx.strokeStyle = "#871e35";
    ctx.lineWidth = 1;

    for (let x = 0; x < WIDTH; x += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 100);
        ctx.lineTo(x, HEIGHT);
        ctx.stroke();
    }

    for (let y = 100; y < HEIGHT; y += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(WIDTH, y);
        ctx.stroke();
    }

    drawSnake();
    drawFoods();

    ctx.fillStyle = "#f5cdd2";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText("WASD / Arrow Keys", WIDTH / 2, HEIGHT - 12);

    if (gameOver) {
        drawGameOver();
    }
}

function drawGameOver() {
    ctx.fillStyle = "rgba(90, 0, 20, 0.82)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    roundedRect(45, 190, 310, 220, 25, "#fff5f5");

    ctx.fillStyle = "#a52a41";
    ctx.font = gameOverFont;
    ctx.textAlign = "center";
    ctx.fillText("Oops!", WIDTH / 2, 250);

    ctx.fillStyle = "#3c3741";
    ctx.font = "bold 30px Arial";
    ctx.fillText("Game Over", WIDTH / 2, 300);

    ctx.font = scoreFont;
    ctx.fillText(`Score kamu: ${score}`, WIDTH / 2, 340);

    ctx.fillStyle = "#a52a41";
    ctx.fillText("R = Main Lagi", WIDTH / 2, 380);
    ctx.fillText("ESC = Menu", WIDTH / 2, 405);
}

function setDirection(newDirection) {
    if (gameOver) return;

    if (newDirection === "up" && direction.y !== GRID_SIZE) {
        direction = { x: 0, y: -GRID_SIZE };
    } else if (newDirection === "down" && direction.y !== -GRID_SIZE) {
        direction = { x: 0, y: GRID_SIZE };
    } else if (newDirection === "left" && direction.x !== GRID_SIZE) {
        direction = { x: -GRID_SIZE, y: 0 };
    } else if (newDirection === "right" && direction.x !== -GRID_SIZE) {
        direction = { x: GRID_SIZE, y: 0 };
    }
}

function updateGame() {
    if (gameOver) return;

    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    snake.unshift(head);

    let eatenIndex = foods.findIndex(
        food => food.x === head.x && food.y === head.y
    );

    if (eatenIndex !== -1) {
        score++;

        colorIndex = (colorIndex + 1) % SNAKE_COLORS.length;

        foods.splice(eatenIndex, 1);
        foods.push(randomFoodPosition());

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("cuteSnakeHighScore", highScore);
        }

        moveDelay = Math.max(55, 145 - score * 5);
    } else {
        snake.pop();
    }

    const hitWall =
        head.x < 0 ||
        head.x >= WIDTH ||
        head.y < 100 ||
        head.y >= HEIGHT;

    const hitSelf = snake.slice(1).some(
        part => part.x === head.x && part.y === head.y
    );

    if (hitWall || hitSelf) {
        gameOver = true;
    }
}

function startGame() {
    resetGame();
    screenState = "game";
}

function handleCanvasClick(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = WIDTH / rect.width;
    const scaleY = HEIGHT / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    if (screenState === "menu") {
        if (x >= 80 && x <= 320 && y >= 330 && y <= 385) {
            startGame();
        }

        if (x >= 80 && x <= 320 && y >= 400 && y <= 455) {
            screenState = "exit";
        }
    }
}

document.addEventListener("keydown", event => {
    const key = event.key.toLowerCase();

    if (screenState === "menu") {
        if (key === "enter") {
            startGame();
        }
        return;
    }

    if (screenState === "exit") {
        if (key === "enter" || key === "escape") {
            screenState = "menu";
        }
        return;
    }

    if (gameOver) {
        if (key === "r") {
            startGame();
        } else if (key === "escape") {
            screenState = "menu";
        }
        return;
    }

    if (key === "arrowup" || key === "w") setDirection("up");
    if (key === "arrowdown" || key === "s") setDirection("down");
    if (key === "arrowleft" || key === "a") setDirection("left");
    if (key === "arrowright" || key === "d") setDirection("right");

    if (key === "escape") {
        screenState = "menu";
    }
});

canvas.addEventListener("click", handleCanvasClick);

document.querySelectorAll(".control").forEach(button => {
    const directionName = button.dataset.direction;

    button.addEventListener("pointerdown", event => {
        event.preventDefault();

        if (screenState === "menu") {
            startGame();
        } else if (screenState === "game") {
            if (gameOver) return;
            setDirection(directionName);
        }
    });
});

function gameLoop(timestamp) {
    if (screenState === "menu") {
        drawMenu();
    } else if (screenState === "game") {
        if (timestamp - lastMove >= moveDelay) {
            updateGame();
            lastMove = timestamp;
        }
        drawGame();
    } else if (screenState === "exit") {
        ctx.fillStyle = "#800020";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = "#fff5f5";
        ctx.font = "bold 30px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Game ditutup", WIDTH / 2, HEIGHT / 2);
        ctx.font = infoFont;
        ctx.fillText("Tekan Enter untuk kembali", WIDTH / 2, HEIGHT / 2 + 45);
    }

    requestAnimationFrame(gameLoop);
}

resetGame();
requestAnimationFrame(gameLoop);
