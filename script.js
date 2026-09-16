// ==========================================
// CANVAS
// ==========================================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


// ==========================================
// UKURAN GAME
// ==========================================

const GRID = 20;

let WIDTH = 1000;
let HEIGHT = 600;


// ==========================================
// WARNA
// ==========================================

const WARNA_MAKANAN = [
    "#800020",
    "#a52a44",
    "#b45a6e",
    "#78283c",
    "#640019"
];

const WARNA_ULANG = [
    ["#800020", "#a52a44", "#640019"],
    ["#961e3c", "#800020", "#5a0014"],
    ["#b4465a", "#9b233c", "#781428"],
    ["#963250", "#7d1432", "#5f001e"],
    ["#be3c5a", "#a01e41", "#7d0a28"]
];


// ==========================================
// GAME VARIABLE
// ==========================================

let snake = [];
let makanan = [];

let arah = {
    x: GRID,
    y: 0
};

let skor = 0;
let highScore = 0;

let warnaIndex = 0;

let gameRunning = false;
let gameOver = false;

let lastMove = 0;

let particles = [];

let smoothPositions = [];


// ==========================================
// ELEMENT HTML
// ==========================================

const menu = document.getElementById("menu");
const gameScreen = document.getElementById("gameScreen");

const scoreText = document.getElementById("score");
const levelText = document.getElementById("level");
const bestScoreText = document.getElementById("bestScore");

const menuBestScore =
    document.getElementById("menuBestScore");

const gameOverPanel =
    document.getElementById("gameOver");

const finalScore =
    document.getElementById("finalScore");


// ==========================================
// RESPONSIVE CANVAS
// ==========================================

function resizeCanvas() {

    const mobile =
        window.innerWidth <= 600;

    if (mobile) {

        WIDTH = Math.min(
            400,
            window.innerWidth
        );

        HEIGHT = Math.min(
            700,
            window.innerHeight
        );

    } else {

        WIDTH = Math.min(
            1000,
            window.innerWidth
        );

        HEIGHT = Math.min(
            600,
            window.innerHeight
        );
    }

    canvas.width = WIDTH;
    canvas.height = HEIGHT;
}


// ==========================================
// BUAT MAKANAN
// ==========================================

function buatMakanan() {

    let food;

    while (true) {

        const x =
            Math.floor(
                Math.random() *
                (WIDTH / GRID)
            ) * GRID;

        const y =
            (Math.floor(
                Math.random() *
                ((HEIGHT - 120) / GRID)
            ) * GRID) + 100;

        food = {
            x: x,
            y: y,
            width: GRID,
            height: GRID
        };

        const kenaSnake =
            snake.some(segment =>
                segment.x === food.x &&
                segment.y === food.y
            );

        const kenaFood =
            makanan.some(item =>
                item.x === food.x &&
                item.y === food.y
            );

        if (!kenaSnake && !kenaFood) {
            break;
        }
    }

    return food;
}


// ==========================================
// SEMUA MAKANAN
// ==========================================

function semuaMakanan() {

    makanan = [];

    for (let i = 0; i < 5; i++) {
        makanan.push(buatMakanan());
    }
}


// ==========================================
// RESET GAME
// ==========================================

function resetGame() {

    const x =
        Math.floor(
            WIDTH / 2 / GRID
        ) * GRID;

    const y =
        Math.floor(
            HEIGHT / 2 / GRID
        ) * GRID;

    snake = [
        {
            x: x,
            y: y
        },
        {
            x: x - GRID,
            y: y
        },
        {
            x: x - GRID * 2,
            y: y
        }
    ];

    arah = {
        x: GRID,
        y: 0
    };

    skor = 0;

    warnaIndex = 0;

    gameOver = false;

    particles = [];

    smoothPositions =
        snake.map(segment => ({
            x: segment.x,
            y: segment.y
        }));

    semuaMakanan();

    updateScore();

    gameOverPanel.classList.add("hidden");
}


// ==========================================
// UPDATE SCORE
// ==========================================

function updateScore() {

    scoreText.textContent = skor;

    levelText.textContent =
        Math.floor(skor / 5) + 1;

    bestScoreText.textContent =
        highScore;

    menuBestScore.textContent =
        highScore;
}


// ==========================================
// PARTIKEL
// ==========================================

function efekMakan(x, y, warna) {

    for (let i = 0; i < 14; i++) {

        particles.push({
            x: x,
            y: y,

            vx:
                Math.random() * 5 - 2.5,

            vy:
                Math.random() * 5 - 2.5,

            life: 25,

            color: warna
        });
    }
}


// ==========================================
// UPDATE PARTIKEL
// ==========================================

function updateParticles() {

    for (let i = particles.length - 1;
         i >= 0;
         i--) {

        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        p.vy += 0.08;

        p.life--;

        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }
}


// ==========================================
// GAMBAR PARTIKEL
// ==========================================

function drawParticles() {

    particles.forEach(p => {

        const size =
            Math.max(
                2,
                Math.floor(p.life / 7)
            );

        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = p.color;

        ctx.fill();
    });
}


// ==========================================
// COLLISION
// ==========================================

function collision(a, b) {

    return (
        a.x < b.x + GRID &&
        a.x + GRID > b.x &&
        a.y < b.y + GRID &&
        a.y + GRID > b.y
    );
}


// ==========================================
// UPDATE GAME
// ==========================================

function updateGame(timestamp) {

    if (!gameRunning || gameOver) {
        return;
    }

    const kecepatan =
        Math.max(
            70,
            125 - skor * 3
        );

    if (
        timestamp - lastMove >=
        kecepatan
    ) {

        lastMove = timestamp;

        const kepala = {
            x: snake[0].x + arah.x,
            y: snake[0].y + arah.y
        };

        snake.unshift(kepala);

        let makananDimakan = -1;

        for (let i = 0;
             i < makanan.length;
             i++) {

            if (
                collision(
                    kepala,
                    makanan[i]
                )
            ) {

                makananDimakan = i;
                break;
            }
        }

        if (makananDimakan !== -1) {

            skor++;

            warnaIndex =
                (warnaIndex + 1) %
                WARNA_ULANG.length;

            const food =
                makanan[makananDimakan];

            efekMakan(
                food.x + GRID / 2,
                food.y + GRID / 2,
                WARNA_MAKANAN[makananDimakan]
            );

            makanan.splice(
                makananDimakan,
                1
            );

            makanan.push(
                buatMakanan()
            );

            if (skor > highScore) {

                highScore = skor;

                localStorage.setItem(
                    "snakeHighScore",
                    highScore
                );
            }

            updateScore();

        } else {

            snake.pop();
        }


        // ==================================
        // TABRAKAN DINDING
        // ==================================

        if (
            kepala.x < 0 ||
            kepala.x + GRID > WIDTH ||
            kepala.y < 100 ||
            kepala.y + GRID > HEIGHT
        ) {

            endGame();
            return;
        }


        // ==================================
        // TABRAKAN BADAN
        // ==================================

        for (let i = 1;
             i < snake.length;
             i++) {

            if (
                kepala.x === snake[i].x &&
                kepala.y === snake[i].y
            ) {

                endGame();
                return;
            }
        }
    }

    updateSmooth();

    updateParticles();
}


// ==========================================
// SMOOTH MOVEMENT
// ==========================================

function updateSmooth() {

    if (
        smoothPositions.length !==
        snake.length
    ) {

        smoothPositions =
            snake.map(segment => ({
                x: segment.x,
                y: segment.y
            }));
    }

    const faktor =
        0.25;

    for (
        let i = 0;
        i < snake.length;
        i++
    ) {

        smoothPositions[i].x +=
            (
                snake[i].x -
                smoothPositions[i].x
            ) * faktor;

        smoothPositions[i].y +=
            (
                snake[i].y -
                smoothPositions[i].y
            ) * faktor;
    }
}


// ==========================================
// GAMBAR BACKGROUND
// ==========================================

function drawBackground() {

    ctx.fillStyle =
        "#f8e1e6";

    ctx.fillRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );


    // Header

    ctx.fillStyle =
        "#640019";

    ctx.fillRect(
        0,
        0,
        WIDTH,
        85
    );


    // Area game

    ctx.fillStyle =
        "#f8e1e6";

    ctx.fillRect(
        0,
        100,
        WIDTH,
        HEIGHT - 100
    );


    // Grid

    ctx.strokeStyle =
        "#ebc8d0";

    ctx.lineWidth = 1;

    for (
        let x = 0;
        x < WIDTH;
        x += GRID
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            100
        );

        ctx.lineTo(
            x,
            HEIGHT
        );

        ctx.stroke();
    }

    for (
        let y = 100;
        y < HEIGHT;
        y += GRID
    ) {

        ctx.beginPath();

        ctx.moveTo(
            0,
            y
        );

        ctx.lineTo(
            WIDTH,
            y
        );

        ctx.stroke();
    }
}


// ==========================================
// GAMBAR SNAKE
// ==========================================

function drawSnake() {

    const warna =
        WARNA_ULANG[warnaIndex];

    snake.forEach((segment, i) => {

        const posisi =
            smoothPositions[i];

        const x =
            Math.round(posisi.x);

        const y =
            Math.round(posisi.y);

        let warnaBagian;

        if (i === 0) {

            warnaBagian =
                warna[0];

        } else if (i % 2 === 1) {

            warnaBagian =
                warna[1];

        } else {

            warnaBagian =
                warna[2];
        }

        ctx.fillStyle =
            warnaBagian;

        roundRect(
            ctx,
            x,
            y,
            GRID,
            GRID,
            7
        );

        ctx.fill();
    });


    // Mata

    const kepala =
        snake[0];

    const x =
        Math.round(
            smoothPositions[0].x
        );

    const y =
        Math.round(
            smoothPositions[0].y
        );

    let mata1;
    let mata2;

    if (arah.x > 0) {

        mata1 = {
            x: x + GRID - 6,
            y: y + 5
        };

        mata2 = {
            x: x + GRID - 6,
            y: y + GRID - 5
        };

    } else if (arah.x < 0) {

        mata1 = {
            x: x + 6,
            y: y + 5
        };

        mata2 = {
            x: x + 6,
            y: y + GRID - 5
        };

    } else if (arah.y < 0) {

        mata1 = {
            x: x + 5,
            y: y + 6
        };

        mata2 = {
            x: x + GRID - 5,
            y: y + 6
        };

    } else {

        mata1 = {
            x: x + 5,
            y: y + GRID - 6
        };

        mata2 = {
            x: x + GRID - 5,
            y: y + GRID - 6
        };
    }

    drawEye(mata1);
    drawEye(mata2);
}


// ==========================================
// MATA SNAKE
// ==========================================

function drawEye(pos) {

    ctx.beginPath();

    ctx.arc(
        pos.x,
        pos.y,
        4,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "#ffffff";

    ctx.fill();

    ctx.beginPath();

    ctx.arc(
        pos.x,
        pos.y,
        2,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "#3c141e";

    ctx.fill();
}


// ==========================================
// GAMBAR MAKANAN
// ==========================================

function drawFoods(timestamp) {

    makanan.forEach((food, i) => {

        const pulse =
            Math.sin(
                timestamp * 0.008 + i
            ) * 2;

        const radius =
            9 + pulse;

        const centerX =
            food.x + GRID / 2;

        const centerY =
            food.y + GRID / 2;


        // Buah

        ctx.beginPath();

        ctx.arc(
            centerX,
            centerY,
            radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            WARNA_MAKANAN[i];

        ctx.fill();


        // Highlight

        ctx.beginPath();

        ctx.arc(
            centerX - 3,
            centerY - 3,
            2,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "#ffffff";

        ctx.fill();


        // Daun kecil

        ctx.beginPath();

        ctx.arc(
            centerX + 5,
            centerY - 7,
            3,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "#640019";

        ctx.fill();
    });
}


// ==========================================
// ROUNDED RECT
// ==========================================

function roundRect(
    context,
    x,
    y,
    width,
    height,
    radius
) {

    context.beginPath();

    context.roundRect(
        x,
        y,
        width,
        height,
        radius
    );
}


// ==========================================
// HEADER CANVAS
// ==========================================

function drawCanvasHeader() {

    ctx.font =
        "bold 17px Arial";

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";

    const boxes = [

        {
            x: 20,
            width: 120,
            text:
                `Score: ${skor}`
        },

        {
            x: WIDTH / 2 - 60,
            width: 120,
            text:
                `Level: ${Math.floor(skor / 5) + 1}`
        },

        {
            x: WIDTH - 140,
            width: 120,
            text:
                `Best: ${highScore}`
        }
    ];

    boxes.forEach(box => {

        ctx.fillStyle =
            "#fffafa";

        roundRect(
            ctx,
            box.x,
            18,
            box.width,
            50,
            15
        );

        ctx.fill();

        ctx.fillStyle =
            "#3c141e";

        ctx.fillText(
            box.text,
            box.x + box.width / 2,
            43
        );
    });
}


// ==========================================
// RENDER
// ==========================================

function drawGame(timestamp) {

    if (!gameRunning) {
        return;
    }

    drawBackground();

    drawCanvasHeader();

    drawSnake();

    drawFoods(timestamp);

    drawParticles();


    // Info bawah

    ctx.font =
        "15px Arial";

    ctx.fillStyle =
        "#784852";

    ctx.textAlign =
        "center";

    ctx.fillText(
        "WASD / Arrow Keys",
        WIDTH / 2,
        HEIGHT - 15
    );
}


// ==========================================
// GAME LOOP
// ==========================================

function gameLoop(timestamp) {

    updateGame(timestamp);

    drawGame(timestamp);

    requestAnimationFrame(gameLoop);
}


// ==========================================
// MULAI GAME
// ==========================================

function startGame() {

    resizeCanvas();

    resetGame();

    menu.classList.add("hidden");

    gameScreen.classList.remove("hidden");

    gameRunning = true;

    lastMove =
        performance.now();
}


// ==========================================
// GAME OVER
// ==========================================

function endGame() {

    gameOver = true;

    gameRunning = true;

    finalScore.textContent =
        skor;

    gameOverPanel.classList.remove(
        "hidden"
    );
}


// ==========================================
// RESTART
// ==========================================

function restartGame() {

    resetGame();

    gameOverPanel.classList.add(
        "hidden"
    );

    gameRunning = true;

    lastMove =
        performance.now();
}


// ==========================================
// KEMBALI MENU
// ==========================================

function backToMenu() {

    gameRunning = false;

    gameOver = false;

    gameScreen.classList.add(
        "hidden"
    );

    menu.classList.remove(
        "hidden"
    );

    menuBestScore.textContent =
        highScore;
}


// ==========================================
// KELUAR
// ==========================================

function exitGame() {

    gameRunning = false;

    menu.innerHTML = `
        <div class="menu-panel">
            <h1>TERIMA KASIH</h1>

            <p class="welcome">
                Game telah ditutup.
            </p>
        </div>
    `;
}


// ==========================================
// GANTI ARAH
// ==========================================

function changeDirection(direction) {

    if (gameOver) {
        return;
    }

    if (
        direction === "up" &&
        arah.y !== GRID
    ) {

        arah = {
            x: 0,
            y: -GRID
        };

    } else if (
        direction === "down" &&
        arah.y !== -GRID
    ) {

        arah = {
            x: 0,
            y: GRID
        };

    } else if (
        direction === "left" &&
        arah.x !== GRID
    ) {

        arah = {
            x: -GRID,
            y: 0
        };

    } else if (
        direction === "right" &&
        arah.x !== -GRID
    ) {

        arah = {
            x: GRID,
            y: 0
        };
    }
}


// ==========================================
// KEYBOARD WINDOWS
// ==========================================

document.addEventListener(
    "keydown",
    event => {

        const key =
            event.key.toLowerCase();

        if (
            key === "arrowup" ||
            key === "w"
        ) {

            changeDirection("up");

        } else if (
            key === "arrowdown" ||
            key === "s"
        ) {

            changeDirection("down");

        } else if (
            key === "arrowleft" ||
            key === "a"
        ) {

            changeDirection("left");

        } else if (
            key === "arrowright" ||
            key === "d"
        ) {

            changeDirection("right");
        }


        // ==================================
        // ESC
        // ==================================

        if (
            key === "escape"
        ) {

            if (gameOver) {

                backToMenu();

            } else if (gameRunning) {

                backToMenu();
            }
        }


        // ==================================
        // R RESTART
        // ==================================

        if (
            key === "r" &&
            gameOver
        ) {

            restartGame();
        }
    }
);


// ==========================================
// TOMBOL MENU
// ==========================================

document
    .getElementById("startButton")
    .addEventListener(
        "click",
        startGame
    );


document
    .getElementById("exitButton")
    .addEventListener(
        "click",
        exitGame
    );


// ==========================================
// TOMBOL GAME OVER
// ==========================================

document
    .getElementById("restartButton")
    .addEventListener(
        "click",
        restartGame
    );


document
    .getElementById("menuButton")
    .addEventListener(
        "click",
        backToMenu
    );


// ==========================================
// KONTROL MOBILE
// ==========================================

document
    .querySelectorAll(
        ".mobile-controls button"
    )
    .forEach(button => {

        button.addEventListener(
            "touchstart",
            event => {

                event.preventDefault();

                changeDirection(
                    button.dataset.direction
                );
            },
            {
                passive: false
            }
        );

        button.addEventListener(
            "click",
            () => {

                changeDirection(
                    button.dataset.direction
                );
            }
        );
    });


// ==========================================
// RESPONSIVE
// ==========================================

window.addEventListener(
    "resize",
    () => {

        if (!gameRunning) {
            resizeCanvas();
            return;
        }

        const oldWidth =
            WIDTH;

        const oldHeight =
            HEIGHT;

        resizeCanvas();

        if (
            WIDTH !== oldWidth ||
            HEIGHT !== oldHeight
        ) {

            // Menjaga snake tetap berada
            // di dalam area game

            snake.forEach(segment => {

                segment.x =
                    Math.max(
                        0,
                        Math.min(
                            segment.x,
                            WIDTH - GRID
                        )
                    );

                segment.y =
                    Math.max(
                        100,
                        Math.min(
                            segment.y,
                            HEIGHT - GRID
                        )
                    );
            });
        }
    }
);


// ==========================================
// LOAD HIGH SCORE
// ==========================================

const savedScore =
    localStorage.getItem(
        "snakeHighScore"
    );

if (savedScore) {

    highScore =
        parseInt(savedScore);

    menuBestScore.textContent =
        highScore;
}


// ==========================================
// INIT
// ==========================================

resizeCanvas();

requestAnimationFrame(
    gameLoop
);
// ==========================================
// KONTROL MOBILE
// ==========================================

document
    .querySelectorAll(".mobile-controls button")
    .forEach(button => {

        button.addEventListener(
            "touchstart",
            event => {

                event.preventDefault();

                changeDirection(
                    button.dataset.direction
                );
            },
            {
                passive: false
            }
        );

        button.addEventListener(
            "click",
            event => {

                // Abaikan click yang muncul setelah touch
                if (event.detail === 0) {
                    return;
                }

                changeDirection(
                    button.dataset.direction
                );
            }
        );
    });