const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const menuScreen = document.getElementById("menuScreen");
const gameUI = document.getElementById("gameUI");
const gameOverScreen = document.getElementById("gameOver");

const scoreText = document.getElementById("scoreText");
const levelText = document.getElementById("levelText");
const bestText = document.getElementById("bestText");
const bestMenu = document.getElementById("bestMenu");
const finalScore = document.getElementById("finalScore");

const startButton = document.getElementById("startButton");
const exitButton = document.getElementById("exitButton");
const restartButton = document.getElementById("restartButton");
const menuButton = document.getElementById("menuButton");

const upButton = document.getElementById("upButton");
const downButton = document.getElementById("downButton");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");


// =========================
// CANVAS
// =========================

const GRID = 20;

let WIDTH = 1100;
let HEIGHT = 650;

function resizeCanvas() {

    const rect = canvas.getBoundingClientRect();

    WIDTH = Math.floor(rect.width);
    HEIGHT = Math.floor(rect.height);

    canvas.width = WIDTH;
    canvas.height = HEIGHT;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();


// =========================
// WARNA
// =========================

const COLORS = [

    {
        head: "#ff5064",
        body: "#dc284d",
        tail: "#aa1433"
    },

    {
        head: "#50b4ff",
        body: "#2882dc",
        tail: "#1450aa"
    },

    {
        head: "#78f082",
        body: "#3cc85a",
        tail: "#1e8c37"
    },

    {
        head: "#ffbe46",
        body: "#ff871e",
        tail: "#d2500f"
    },

    {
        head: "#c878ff",
        body: "#9641e1",
        tail: "#5f1eaa"
    },

    {
        head: "#ff82d7",
        body: "#e646af",
        tail: "#b4237d"
    },

    {
        head: "#46ebe0",
        body: "#1eb9af",
        tail: "#0a7878"
    }

];


// =========================
// MAKANAN
// =========================

const FOOD_COLORS = [
    "#ff5a6e",
    "#ffbe3c",
    "#aa5ae0",
    "#50aaf0",
    "#46c878"
];

const FOOD_TYPES = [
    "apple",
    "pizza",
    "burger",
    "donut",
    "watermelon",
    "fries",
    "chicken"
];


// =========================
// GAME VARIABLES
// =========================

let snake = [];
let foods = [];

let direction = {
    x: 1,
    y: 0
};

let nextDirection = {
    x: 1,
    y: 0
};

let score = 0;
let level = 1;

let bestScore =
    Number(localStorage.getItem("snakeBest")) || 0;

let colorIndex = 0;

let gameRunning = false;
let gameOver = false;

let lastMove = 0;

let particles = [];


// =========================
// RESET GAME
// =========================

function resetGame() {

    snake = [

        {
            x: Math.floor(WIDTH / GRID / 2),
            y: Math.floor((HEIGHT / GRID) / 2)
        },

        {
            x: Math.floor(WIDTH / GRID / 2) - 1,
            y: Math.floor((HEIGHT / GRID) / 2)
        },

        {
            x: Math.floor(WIDTH / GRID / 2) - 2,
            y: Math.floor((HEIGHT / GRID) / 2)
        }

    ];

    direction = {
        x: 1,
        y: 0
    };

    nextDirection = {
        x: 1,
        y: 0
    };

    score = 0;
    level = 1;

    colorIndex = 0;

    particles = [];

    foods = [];

    for (let i = 0; i < 5; i++) {
        createFood();
    }

    updateUI();
}


// =========================
// FOOD
// =========================

function createFood() {

    let food;

    do {

        food = {

            x: Math.floor(
                Math.random() * (WIDTH / GRID)
            ),

            y: Math.floor(
                Math.random() *
                ((HEIGHT - 100) / GRID)
            ) + 5,

            type:
                FOOD_TYPES[
                    Math.floor(
                        Math.random() *
                        FOOD_TYPES.length
                    )
                ],

            color:
                FOOD_COLORS[
                    Math.floor(
                        Math.random() *
                        FOOD_COLORS.length
                    )
                ],

            pulse: Math.random() * Math.PI * 2

        };

    } while (
        snake.some(
            part =>
                part.x === food.x &&
                part.y === food.y
        )
        ||
        foods.some(
            item =>
                item.x === food.x &&
                item.y === food.y
        )
    );

    foods.push(food);
}


// =========================
// INPUT
// =========================

function changeDirection(x, y) {

    if (
        x === -direction.x &&
        y === -direction.y
    ) {
        return;
    }

    nextDirection = {
        x: x,
        y: y
    };
}


document.addEventListener("keydown", function(event) {

    if (!gameRunning) return;

    switch (event.key) {

        case "ArrowUp":
        case "w":
        case "W":

            changeDirection(0, -1);
            event.preventDefault();

            break;

        case "ArrowDown":
        case "s":
        case "S":

            changeDirection(0, 1);
            event.preventDefault();

            break;

        case "ArrowLeft":
        case "a":
        case "A":

            changeDirection(-1, 0);
            event.preventDefault();

            break;

        case "ArrowRight":
        case "d":
        case "D":

            changeDirection(1, 0);
            event.preventDefault();

            break;
    }

});


// =========================
// BUTTON CONTROL
// =========================

upButton.addEventListener(
    "click",
    () => changeDirection(0, -1)
);

downButton.addEventListener(
    "click",
    () => changeDirection(0, 1)
);

leftButton.addEventListener(
    "click",
    () => changeDirection(-1, 0)
);

rightButton.addEventListener(
    "click",
    () => changeDirection(1, 0)
);


// =========================
// GAME UPDATE
// =========================

function updateGame() {

    direction = nextDirection;

    const head = {

        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y

    };


    // =========================
    // TABRAK TEMBOK
    // =========================

    const maxX =
        Math.floor(WIDTH / GRID) - 1;

    const maxY =
        Math.floor((HEIGHT - 100) / GRID) + 4;


    if (
        head.x < 0 ||
        head.x > maxX ||
        head.y < 5 ||
        head.y > maxY
    ) {

        endGame();
        return;
    }


    // =========================
    // TABRAK BADAN SENDIRI
    // =========================

    if (
        snake.some(
            part =>
                part.x === head.x &&
                part.y === head.y
        )
    ) {

        endGame();
        return;
    }


    snake.unshift(head);


    // =========================
    // MAKAN
    // =========================

    let ateFood = false;

    for (let i = foods.length - 1; i >= 0; i--) {

        if (
            head.x === foods[i].x &&
            head.y === foods[i].y
        ) {

            foods.splice(i, 1);

            score++;

            colorIndex++;

            if (
                colorIndex >= COLORS.length
            ) {
                colorIndex = 0;
            }

            level =
                1 +
                Math.floor(score / 5);

            createFood();

            createParticles(
                head.x * GRID + GRID / 2,
                head.y * GRID + GRID / 2
            );

            ateFood = true;
        }
    }


    if (!ateFood) {
        snake.pop();
    }


    updateUI();
}


// =========================
// PARTICLES
// =========================

function createParticles(x, y) {

    for (let i = 0; i < 18; i++) {

        particles.push({

            x: x,
            y: y,

            vx:
                (Math.random() - 0.5) * 5,

            vy:
                (Math.random() - 0.5) * 5,

            life: 1,

            color:
                FOOD_COLORS[
                    Math.floor(
                        Math.random() *
                        FOOD_COLORS.length
                    )
                ]

        });

    }
}


function updateParticles() {

    particles.forEach(p => {

        p.x += p.vx;
        p.y += p.vy;

        p.life -= 0.035;

    });

    particles =
        particles.filter(
            p => p.life > 0
        );
}


// =========================
// DRAW BACKGROUND
// =========================

function drawBackground() {

    ctx.fillStyle = "#370515";

    ctx.fillRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );


    // Header

    ctx.fillStyle = "#4b071b";

    ctx.fillRect(
        0,
        0,
        WIDTH,
        90
    );


    // Grid

    ctx.strokeStyle =
        "rgba(150, 40, 70, 0.22)";

    ctx.lineWidth = 1;


    for (
        let x = 0;
        x < WIDTH;
        x += GRID
    ) {

        ctx.beginPath();

        ctx.moveTo(x, 90);
        ctx.lineTo(x, HEIGHT);

        ctx.stroke();

    }


    for (
        let y = 100;
        y < HEIGHT;
        y += GRID
    ) {

        ctx.beginPath();

        ctx.moveTo(0, y);
        ctx.lineTo(WIDTH, y);

        ctx.stroke();

    }
}


// =========================
// DRAW FOOD
// =========================

function drawFood(food) {

    const x =
        food.x * GRID +
        GRID / 2;

    const y =
        food.y * GRID +
        GRID / 2;

    food.pulse += 0.08;

    const scale =
        1 +
        Math.sin(food.pulse) * 0.08;

    const radius =
        7 * scale;


    // Glow

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radius + 5,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        food.color + "35";

    ctx.fill();


    // Main food

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        food.color;

    ctx.fill();


    // Highlight

    ctx.beginPath();

    ctx.arc(
        x - 2,
        y - 2,
        2,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "rgba(255,255,255,0.75)";

    ctx.fill();
}


// =========================
// DRAW SNAKE
// =========================

function drawSnake() {

    const colors =
        COLORS[colorIndex];


    snake.forEach((part, index) => {

        const x =
            part.x * GRID;

        const y =
            part.y * GRID;


        let color;

        if (index === 0) {

            color = colors.head;

        } else if (
            index === snake.length - 1
        ) {

            color = colors.tail;

        } else {

            color = colors.body;

        }


        // Shadow

        ctx.fillStyle =
            "rgba(0,0,0,0.25)";

        ctx.fillRect(
            x + 3,
            y + 4,
            GRID - 3,
            GRID - 3
        );


        // Body

        ctx.fillStyle = color;

        roundRect(
            ctx,
            x + 1,
            y + 1,
            GRID - 2,
            GRID - 2,
            6
        );

        ctx.fill();


        // Kepala

        if (index === 0) {

            drawEyes(
                x,
                y
            );

        }

    });
}


// =========================
// EYES
// =========================

function drawEyes(x, y) {

    let eye1;
    let eye2;


    if (direction.x === 1) {

        eye1 = {
            x: x + 14,
            y: y + 6
        };

        eye2 = {
            x: x + 14,
            y: y + 14
        };

    } else if (direction.x === -1) {

        eye1 = {
            x: x + 6,
            y: y + 6
        };

        eye2 = {
            x: x + 6,
            y: y + 14
        };

    } else if (direction.y === -1) {

        eye1 = {
            x: x + 6,
            y: y + 6
        };

        eye2 = {
            x: x + 14,
            y: y + 6
        };

    } else {

        eye1 = {
            x: x + 6,
            y: y + 14
        };

        eye2 = {
            x: x + 14,
            y: y + 14
        };

    }


    ctx.fillStyle = "white";

    ctx.beginPath();

    ctx.arc(
        eye1.x,
        eye1.y,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.arc(
        eye2.x,
        eye2.y,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle = "#25030d";

    ctx.beginPath();

    ctx.arc(
        eye1.x,
        eye1.y,
        1.4,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.arc(
        eye2.x,
        eye2.y,
        1.4,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


// =========================
// ROUNDED RECT
// =========================

function roundRect(
    ctx,
    x,
    y,
    width,
    height,
    radius
) {

    ctx.beginPath();

    ctx.moveTo(
        x + radius,
        y
    );

    ctx.lineTo(
        x + width - radius,
        y
    );

    ctx.quadraticCurveTo(
        x + width,
        y,
        x + width,
        y + radius
    );

    ctx.lineTo(
        x + width,
        y + height - radius
    );

    ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius,
        y + height
    );

    ctx.lineTo(
        x + radius,
        y + height
    );

    ctx.quadraticCurveTo(
        x,
        y + height,
        x,
        y + height - radius
    );

    ctx.lineTo(
        x,
        y + radius
    );

    ctx.quadraticCurveTo(
        x,
        y,
        x + radius,
        y
    );

    ctx.closePath();
}


// =========================
// PARTICLE DRAW
// =========================

function drawParticles() {

    particles.forEach(p => {

        ctx.globalAlpha = p.life;

        ctx.fillStyle = p.color;

        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            3,
            0,
            Math.PI * 2
        );

        ctx.fill();

    });

    ctx.globalAlpha = 1;
}


// =========================
// UI
// =========================

function updateUI() {

    scoreText.textContent = score;

    levelText.textContent = level;

    bestText.textContent = bestScore;

    bestMenu.textContent = bestScore;
}


// =========================
// GAME LOOP
// =========================

function gameLoop(timestamp) {

    if (
        gameRunning &&
        !gameOver
    ) {

        const speed =
            Math.max(
                70,
                160 - score * 4
            );


        if (
            timestamp - lastMove >= speed
        ) {

            updateGame();

            lastMove = timestamp;

        }

    }


    updateParticles();


    // DRAW

    drawBackground();

    foods.forEach(drawFood);

    drawSnake();

    drawParticles();


    requestAnimationFrame(gameLoop);
}


// =========================
// START GAME
// =========================

function startGame() {

    resizeCanvas();

    resetGame();

    gameRunning = true;

    gameOver = false;

    menuScreen.classList.add("hidden");

    gameOverScreen.classList.add("hidden");

    gameUI.style.display = "block";

    lastMove = performance.now();
}


// =========================
// GAME OVER
// =========================

function endGame() {

    gameRunning = false;

    gameOver = true;


    if (score > bestScore) {

        bestScore = score;

        localStorage.setItem(
            "snakeBest",
            bestScore
        );

    }


    finalScore.textContent = score;

    updateUI();

    gameOverScreen.classList.remove(
        "hidden"
    );
}


// =========================
// BUTTON MENU
// =========================

startButton.addEventListener(
    "click",
    startGame
);


restartButton.addEventListener(
    "click",
    startGame
);


menuButton.addEventListener(
    "click",
    function() {

        gameRunning = false;

        gameOver = false;

        gameOverScreen.classList.add(
            "hidden"
        );

        menuScreen.classList.remove(
            "hidden"
        );

        updateUI();

    }
);


exitButton.addEventListener(
    "click",
    function() {

        alert(
            "Terima kasih sudah bermain 🐍"
        );

    }
);


// =========================
// INITIAL
// =========================

gameUI.style.display = "block";

updateUI();

requestAnimationFrame(gameLoop);