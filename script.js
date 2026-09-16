const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const menuScreen = document.getElementById("menuScreen");
const gameScreen = document.getElementById("gameScreen");
const gameOverScreen = document.getElementById("gameOverScreen");

const scoreText = document.getElementById("scoreText");
const levelText = document.getElementById("levelText");
const bestText = document.getElementById("bestText");
const menuBest = document.getElementById("menuBest");
const finalScore = document.getElementById("finalScore");

const startButton = document.getElementById("startButton");
const exitButton = document.getElementById("exitButton");

const restartButton = document.getElementById("restartButton");
const gameExitButton = document.getElementById("gameExitButton");

const upButton = document.getElementById("upButton");
const downButton = document.getElementById("downButton");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");


/* =========================
   GRID
========================= */

const GRID = 20;


/* =========================
   WARNA
========================= */

const BACKGROUND = "#370514";
const HEADER = "#4b071b";
const GRID_COLOR = "#69142d";

const MAROON_TUA = "#55051e";
const MAROON_PINK = "#d26987";

const WHITE = "#ffffff";
const WHITE_SOFT = "#ffebf2";


/* =========================
   WARNA MAKANAN
========================= */

const FOOD_COLORS = [
    "#ff5a6e",
    "#ffbe3c",
    "#aa5ad2",
    "#50aaf0",
    "#46c86e"
];


/* =========================
   WARNA ULAR
========================= */

const SNAKE_COLORS = [

    [
        "#af2d46",
        "#911e37",
        "#6e1428"
    ],

    [
        "#c33750",
        "#a0233c",
        "#7d142d"
    ],

    [
        "#961e37",
        "#781428",
        "#5a0a1e"
    ],

    [
        "#d74b64",
        "#af2d46",
        "#871932"
    ],

    [
        "#82142d",
        "#690a23",
        "#4b0519"
    ]

];


/* =========================
   GAME VARIABLE
========================= */

let snake = [];
let foods = [];

let direction = {
    x: 1,
    y: 0
};

let score = 0;
let bestScore = 0;
let colorIndex = 0;

let gameOver = false;

let lastMove = 0;

let particles = [];

let animationID;


/* =========================
   CANVAS
========================= */

function resizeCanvas() {

    const rect = canvas.getBoundingClientRect();

    canvas.width = Math.floor(rect.width);
    canvas.height = Math.floor(rect.height);

    draw();
}

window.addEventListener(
    "resize",
    resizeCanvas
);


/* =========================
   RESET GAME
========================= */

function resetGame() {

    const startX =
        Math.floor(
            canvas.width / 2 / GRID
        ) * GRID;

    const startY =
        Math.max(
            GRID * 4,
            Math.floor(
                canvas.height / 2 / GRID
            ) * GRID
        );

    snake = [

        {
            x: startX,
            y: startY
        },

        {
            x: startX - GRID,
            y: startY
        },

        {
            x: startX - GRID * 2,
            y: startY
        }

    ];

    direction = {
        x: 1,
        y: 0
    };

    score = 0;

    colorIndex = 0;

    gameOver = false;

    lastMove = performance.now();

    particles = [];

    foods = [];

    for (let i = 0; i < 5; i++) {

        foods.push(
            createFood()
        );

    }

    updateScore();

    gameOverScreen.classList.add("hidden");
}


/* =========================
   BUAT MAKANAN
========================= */

function createFood() {

    let food;

    while (true) {

        const columns =
            Math.floor(
                canvas.width / GRID
            );

        const rows =
            Math.floor(
                canvas.height / GRID
            );

        const x =
            Math.floor(
                Math.random() * columns
            ) * GRID;

        const y =
            Math.floor(
                Math.random() * rows
            ) * GRID;

        food = {
            x: x,
            y: y
        };

        const hitSnake = snake.some(
            segment =>
                segment.x === food.x &&
                segment.y === food.y
        );

        const hitFood = foods.some(
            item =>
                item.x === food.x &&
                item.y === food.y
        );

        if (!hitSnake && !hitFood) {
            return food;
        }
    }
}


/* =========================
   PARTIKEL
========================= */

function createParticles(
    x,
    y,
    color
) {

    for (let i = 0; i < 15; i++) {

        const angle =
            Math.random() *
            Math.PI *
            2;

        const speed =
            1 +
            Math.random() * 2.5;

        particles.push({

            x: x,

            y: y,

            dx:
                Math.cos(angle) *
                speed,

            dy:
                Math.sin(angle) *
                speed,

            size:
                2 +
                Math.random() * 3,

            color: color,

            life: 25

        });
    }
}


/* =========================
   UPDATE PARTIKEL
========================= */

function updateParticles() {

    particles.forEach(
        particle => {

            particle.x +=
                particle.dx;

            particle.y +=
                particle.dy;

            particle.life--;

        }
    );

    particles =
        particles.filter(
            particle =>
                particle.life > 0
        );
}


/* =========================
   GAMBAR PARTIKEL
========================= */

function drawParticles() {

    particles.forEach(
        particle => {

            ctx.beginPath();

            ctx.arc(
                particle.x,
                particle.y,
                particle.size,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                particle.color;

            ctx.fill();

        }
    );
}


/* =========================
   UPDATE SCORE
========================= */

function updateScore() {

    scoreText.textContent =
        "Score : " + score;

    const level =
        1 +
        Math.floor(score / 5);

    levelText.textContent =
        "Level : " + level;

    bestText.textContent =
        "Best : " + bestScore;

    menuBest.textContent =
        "Best Score : " + bestScore;
}


/* =========================
   GANTI ARAH
========================= */

function changeDirection(
    x,
    y
) {

    if (gameOver) {
        return;
    }

    if (
        direction.x === -x &&
        direction.y === -y
    ) {
        return;
    }

    direction = {
        x: x,
        y: y
    };
}


/* =========================
   KEYBOARD
========================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "ArrowUp" ||
            event.key.toLowerCase() === "w") {

            changeDirection(0, -1);

        }

        else if (
            event.key === "ArrowDown" ||
            event.key.toLowerCase() === "s"
        ) {

            changeDirection(0, 1);

        }

        else if (
            event.key === "ArrowLeft" ||
            event.key.toLowerCase() === "a"
        ) {

            changeDirection(-1, 0);

        }

        else if (
            event.key === "ArrowRight" ||
            event.key.toLowerCase() === "d"
        ) {

            changeDirection(1, 0);

        }

        else if (
            event.key === "Escape"
        ) {

            showMenu();

        }

        else if (
            gameOver &&
            event.key.toLowerCase() === "r"
        ) {

            resetGame();

        }

    }
);


/* =========================
   TOMBOL HP
========================= */

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


/* =========================
   CEK TABRAKAN
========================= */

function checkCollision(
    head
) {

    /* Tembok */

    if (
        head.x < 0 ||
        head.y < 0 ||
        head.x + GRID > canvas.width ||
        head.y + GRID > canvas.height
    ) {

        return true;

    }


    /* Badan sendiri */

    for (
        let i = 0;
        i < snake.length;
        i++
    ) {

        if (
            head.x === snake[i].x &&
            head.y === snake[i].y
        ) {

            return true;

        }
    }

    return false;
}


/* =========================
   UPDATE GAME
========================= */

function updateGame() {

    if (gameOver) {
        return;
    }

    const head = {

        x:
            snake[0].x +
            direction.x * GRID,

        y:
            snake[0].y +
            direction.y * GRID

    };


    /* Tabrakan */

    if (
        checkCollision(head)
    ) {

        endGame();

        return;
    }


    /* Tambah kepala */

    snake.unshift(head);


    /* Cek makanan */

    let foodIndex = -1;

    for (
        let i = 0;
        i < foods.length;
        i++
    ) {

        if (
            head.x === foods[i].x &&
            head.y === foods[i].y
        ) {

            foodIndex = i;

            break;
        }
    }


    /* Makan */

    if (foodIndex !== -1) {

        const food =
            foods[foodIndex];

        score++;

        colorIndex =
            (
                colorIndex + 1
            ) %
            SNAKE_COLORS.length;

        createParticles(
            food.x + GRID / 2,
            food.y + GRID / 2,
            FOOD_COLORS[
                foodIndex %
                FOOD_COLORS.length
            ]
        );

        foods.splice(
            foodIndex,
            1
        );

        foods.push(
            createFood()
        );

        if (
            score > bestScore
        ) {

            bestScore = score;

        }

        updateScore();

    }

    else {

        snake.pop();

    }
}


/* =========================
   GAMBAR GRID
========================= */

function drawGrid() {

    ctx.strokeStyle =
        GRID_COLOR;

    ctx.lineWidth = 1;

    for (
        let x = 0;
        x < canvas.width;
        x += GRID
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            0
        );

        ctx.lineTo(
            x,
            canvas.height
        );

        ctx.stroke();
    }


    for (
        let y = 0;
        y < canvas.height;
        y += GRID
    ) {

        ctx.beginPath();

        ctx.moveTo(
            0,
            y
        );

        ctx.lineTo(
            canvas.width,
            y
        );

        ctx.stroke();
    }
}


/* =========================
   GAMBAR ULAR
========================= */

function drawSnake() {

    const colors =
        SNAKE_COLORS[
            colorIndex
        ];


    snake.forEach(
        (segment, index) => {

            const color =
                colors[
                    Math.min(
                        index,
                        2
                    )
                ];

            ctx.fillStyle =
                color;

            ctx.beginPath();

            ctx.roundRect(
                segment.x + 1,
                segment.y + 1,
                GRID - 2,
                GRID - 2,
                7
            );

            ctx.fill();


            /* Kepala */

            if (index === 0) {

                drawEyes(
                    segment
                );

            }

        }
    );
}


/* =========================
   MATA ULAR
========================= */

function drawEyes(
    head
) {

    let eye1;
    let eye2;


    if (
        direction.x === 1
    ) {

        eye1 = {
            x: head.x + 15,
            y: head.y + 5
        };

        eye2 = {
            x: head.x + 15,
            y: head.y + 15
        };

    }

    else if (
        direction.x === -1
    ) {

        eye1 = {
            x: head.x + 5,
            y: head.y + 5
        };

        eye2 = {
            x: head.x + 5,
            y: head.y + 15
        };

    }

    else if (
        direction.y === -1
    ) {

        eye1 = {
            x: head.x + 5,
            y: head.y + 5
        };

        eye2 = {
            x: head.x + 15,
            y: head.y + 5
        };

    }

    else {

        eye1 = {
            x: head.x + 5,
            y: head.y + 15
        };

        eye2 = {
            x: head.x + 15,
            y: head.y + 15
        };

    }


    /* Mata putih */

    ctx.fillStyle =
        WHITE;

    ctx.beginPath();

    ctx.arc(
        eye1.x,
        eye1.y,
        4,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.beginPath();

    ctx.arc(
        eye2.x,
        eye2.y,
        4,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* Pupil */

    ctx.fillStyle =
        MAROON_TUA;

    ctx.beginPath();

    ctx.arc(
        eye1.x,
        eye1.y,
        2,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.beginPath();

    ctx.arc(
        eye2.x,
        eye2.y,
        2,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


/* =========================
   GAMBAR MAKANAN
========================= */

function drawFoods() {

    const time =
        performance.now();

    foods.forEach(
        (food, index) => {

            const pulse =
                Math.sin(
                    time * 0.006 +
                    index
                ) * 2;

            const size =
                7 + pulse;

            const centerX =
                food.x +
                GRID / 2;

            const centerY =
                food.y +
                GRID / 2;

            const color =
                FOOD_COLORS[
                    index %
                    FOOD_COLORS.length
                ];


            /* Glow */

            ctx.beginPath();

            ctx.arc(
                centerX,
                centerY,
                size + 5,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                color + "55";

            ctx.fill();


            /* Makanan */

            ctx.beginPath();

            ctx.arc(
                centerX,
                centerY,
                size,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                color;

            ctx.fill();


            /* Kilau */

            ctx.beginPath();

            ctx.arc(
                centerX - 2,
                centerY - 2,
                2,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                WHITE;

            ctx.fill();

        }
    );
}


/* =========================
   DRAW
========================= */

function draw() {

    ctx.fillStyle =
        BACKGROUND;

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    drawGrid();

    drawFoods();

    drawSnake();

    drawParticles();
}


/* =========================
   GAME LOOP
========================= */

function gameLoop(
    timestamp
) {

    if (
        !gameOver
    ) {

        const level =
            1 +
            Math.floor(
                score / 5
            );

        const speed =
            Math.max(
                70,
                130 -
                score * 3
            );


        if (
            timestamp -
            lastMove >=
            speed
        ) {

            lastMove =
                timestamp;

            updateGame();

        }

    }

    updateParticles();

    draw();

    animationID =
        requestAnimationFrame(
            gameLoop
        );
}


/* =========================
   GAME OVER
========================= */

function endGame() {

    gameOver = true;

    finalScore.textContent =
        "Score kamu : " +
        score;

    gameOverScreen.classList.remove(
        "hidden"
    );
}


/* =========================
   MULAI GAME
========================= */

function startGame() {

    menuScreen.classList.add(
        "hidden"
    );

    gameScreen.classList.remove(
        "hidden"
    );

    resizeCanvas();

    resetGame();

    cancelAnimationFrame(
        animationID
    );

    animationID =
        requestAnimationFrame(
            gameLoop
        );
}


/* =========================
   KEMBALI MENU
========================= */

function showMenu() {

    gameScreen.classList.add(
        "hidden"
    );

    menuScreen.classList.remove(
        "hidden"
    );

    gameOverScreen.classList.add(
        "hidden"
    );

    cancelAnimationFrame(
        animationID
    );

    menuBest.textContent =
        "Best Score : " +
        bestScore;
}


/* =========================
   BUTTON MENU
========================= */

startButton.addEventListener(
    "click",
    startGame
);


exitButton.addEventListener(
    "click",
    function() {

        window.close();

    }
);


/* =========================
   BUTTON GAME OVER
========================= */

restartButton.addEventListener(
    "click",
    function() {

        resetGame();

    }
);


gameExitButton.addEventListener(
    "click",
    function() {

        showMenu();

    }
);


/* =========================
   LOAD AWAL
========================= */

resizeCanvas();

updateScore();