import pygame
import random

pygame.init()

WIDTH = 600
HEIGHT = 400
GRID_SIZE = 20

screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Mini Project Snake")
clock = pygame.time.Clock()

WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (220, 0, 0)
GREEN = (0, 180, 0)
ORANGE = (255, 150, 0)
PURPLE = (150, 50, 180)
PINK = (240, 80, 120)
GRAY = (200, 200, 200)
DARK_GREEN = (0, 120, 50)

WARNA_ULANG = [
    ((60, 140, 210), (100, 180, 240), (140, 200, 250)),
    ((80, 180, 100), (120, 220, 140), (160, 240, 170)),
    ((150, 90, 210), (180, 130, 230), (210, 170, 245)),
    ((240, 150, 50), (250, 180, 90), (255, 210, 130)),
    ((220, 70, 90), (240, 110, 120), (250, 150, 160))
]

EYE_WHITE = (255, 255, 255)
EYE_BLACK = (0, 0, 0)

font = pygame.font.SysFont("arial", 25)
game_over_font = pygame.font.SysFont("arial", 50)
small_font = pygame.font.SysFont("arial", 20)


def buat_posisi_acak_makanan(snake, makanan):
    kolom_maks = WIDTH // GRID_SIZE
    baris_maks = HEIGHT // GRID_SIZE

    while True:
        x = random.randint(0, kolom_maks - 1) * GRID_SIZE
        y = random.randint(0, baris_maks - 1) * GRID_SIZE

        food = pygame.Rect(
            x,
            y,
            GRID_SIZE,
            GRID_SIZE
        )

        menabrak_ular = False

        for bagian_tubuh in snake:
            if food.colliderect(bagian_tubuh):
                menabrak_ular = True
                break

        menabrak_makanan = False

        for makanan_lain in makanan:
            if food.colliderect(makanan_lain):
                menabrak_makanan = True
                break

        if not menabrak_ular and not menabrak_makanan:
            return food


def buat_semua_makanan(snake):
    makanan = []

    for i in range(5):
        food = buat_posisi_acak_makanan(
            snake,
            makanan
        )

        makanan.append(food)

    return makanan


def reset_game():

    snake = [
        pygame.Rect(300, 200, GRID_SIZE, GRID_SIZE),
        pygame.Rect(280, 200, GRID_SIZE, GRID_SIZE),
        pygame.Rect(260, 200, GRID_SIZE, GRID_SIZE)
    ]

    arah = (GRID_SIZE, 0)

    makanan = buat_semua_makanan(snake)

    skor = 0
    warna_index = 0

    return snake, arah, makanan, skor, warna_index


snake, arah, makanan, skor, warna_index = reset_game()

game_over = False
running = True


while running:

    for event in pygame.event.get():

        if event.type == pygame.QUIT:
            running = False

        if event.type == pygame.KEYDOWN:

            if not game_over:

                if event.key in (pygame.K_UP, pygame.K_w):

                    if arah != (0, GRID_SIZE):
                        arah = (0, -GRID_SIZE)

                elif event.key in (pygame.K_DOWN, pygame.K_s):

                    if arah != (0, -GRID_SIZE):
                        arah = (0, GRID_SIZE)

                elif event.key in (pygame.K_LEFT, pygame.K_a):

                    if arah != (GRID_SIZE, 0):
                        arah = (-GRID_SIZE, 0)

                elif event.key in (pygame.K_RIGHT, pygame.K_d):

                    if arah != (-GRID_SIZE, 0):
                        arah = (GRID_SIZE, 0)

            else:

                if event.key == pygame.K_r:

                    snake, arah, makanan, skor, warna_index = reset_game()

                    game_over = False

                elif event.key == pygame.K_ESCAPE:

                    running = False

    if not game_over:

        kepala_lama = snake[0]

        head_rect = pygame.Rect(
            kepala_lama.x + arah[0],
            kepala_lama.y + arah[1],
            GRID_SIZE,
            GRID_SIZE
        )

        snake.insert(0, head_rect)

        makan = False
        makanan_yang_dimakan = None

        for food in makanan:

            if head_rect.colliderect(food):

                makan = True
                makanan_yang_dimakan = food

                break

        if makan:

            skor += 1

            warna_index = (
                warna_index + 1
            ) % len(WARNA_ULANG)

            makanan.remove(
                makanan_yang_dimakan
            )

            makanan_baru = buat_posisi_acak_makanan(
                snake,
                makanan
            )

            makanan.append(
                makanan_baru
            )

        else:

            snake.pop()

        if (
            head_rect.left < 0
            or head_rect.right > WIDTH
            or head_rect.top < 0
            or head_rect.bottom > HEIGHT
        ):

            game_over = True

        for bagian_tubuh in snake[1:]:

            if head_rect.colliderect(bagian_tubuh):

                game_over = True

                break

    screen.fill(WHITE)

    for x in range(0, WIDTH, GRID_SIZE):

        pygame.draw.line(
            screen,
            GRAY,
            (x, 0),
            (x, HEIGHT)
        )

    for y in range(0, HEIGHT, GRID_SIZE):

        pygame.draw.line(
            screen,
            GRAY,
            (0, y),
            (WIDTH, y)
        )

    for i, food in enumerate(makanan):

        jenis_buah = i % 5

        x = food.centerx
        y = food.centery

        if jenis_buah == 0:
            pygame.draw.circle(
                screen,
                RED,
                (x, y),
                8
            )

            pygame.draw.line(
                screen,
                GREEN,
                (x, y - 7),
                (x + 3, y - 11),
                2
            )

            pygame.draw.ellipse(
                screen,
                GREEN,
                (x + 2, y - 12, 6, 4)
            )

            pygame.draw.circle(
                screen,
                BLACK,
                (x, y),
                8,
                1
            )

        elif jenis_buah == 1:
            pygame.draw.circle(
                screen,
                ORANGE,
                (x, y),
                8
            )

            pygame.draw.circle(
                screen,
                BLACK,
                (x, y),
                8,
                1
            )

            pygame.draw.circle(
                screen,
                (255, 200, 80),
                (x - 3, y - 3),
                2
            )

        elif jenis_buah == 2:
            pygame.draw.circle(
                screen,
                PURPLE,
                (x - 4, y - 3),
                4
            )

            pygame.draw.circle(
                screen,
                PURPLE,
                (x + 4, y - 3),
                4
            )

            pygame.draw.circle(
                screen,
                PURPLE,
                (x, y + 3),
                4
            )

            pygame.draw.circle(
                screen,
                PURPLE,
                (x, y - 8),
                3
            )

            pygame.draw.line(
                screen,
                GREEN,
                (x, y - 10),
                (x + 3, y - 13),
                2
            )

        elif jenis_buah == 3:
            pygame.draw.circle(
                screen,
                PINK,
                (x, y + 1),
                8
            )

            pygame.draw.circle(
                screen,
                BLACK,
                (x, y + 1),
                8,
                1
            )

            pygame.draw.circle(
                screen,
                BLACK,
                (x - 3, y - 2),
                1
            )

            pygame.draw.circle(
                screen,
                BLACK,
                (x + 3, y - 2),
                1
            )

            pygame.draw.circle(
                screen,
                BLACK,
                (x - 3, y + 3),
                1
            )

            pygame.draw.circle(
                screen,
                BLACK,
                (x + 3, y + 3),
                1
            )

            pygame.draw.polygon(
                screen,
                GREEN,
                [
                    (x - 4, y - 5),
                    (x, y - 10),
                    (x + 4, y - 5)
                ]
            )

        else:
            pygame.draw.circle(
                screen,
                DARK_GREEN,
                (x, y),
                9
            )

            pygame.draw.circle(
                screen,
                RED,
                (x, y),
                7
            )

            pygame.draw.arc(
                screen,
                BLACK,
                (x - 7, y - 7, 14, 14),
                0,
                3.14,
                1
            )

            pygame.draw.circle(
                screen,
                BLACK,
                (x - 3, y - 2),
                1
            )

            pygame.draw.circle(
                screen,
                BLACK,
                (x + 3, y + 2),
                1
            )

    warna_kepala, warna_badan, warna_badan2 = (
        WARNA_ULANG[warna_index]
    )

    for i, bagian in enumerate(snake):

        if i == 0:

            warna = warna_kepala

        elif i % 2 == 0:

            warna = warna_badan

        else:

            warna = warna_badan2

        pygame.draw.rect(
            screen,
            warna,
            bagian
        )

        pygame.draw.rect(
            screen,
            BLACK,
            bagian,
            1
        )

    kepala = snake[0]

    if arah == (GRID_SIZE, 0):

        mata1 = (
            kepala.right - 6,
            kepala.top + 6
        )

        mata2 = (
            kepala.right - 6,
            kepala.bottom - 6
        )

    elif arah == (-GRID_SIZE, 0):

        mata1 = (
            kepala.left + 6,
            kepala.top + 6
        )

        mata2 = (
            kepala.left + 6,
            kepala.bottom - 6
        )

    elif arah == (0, -GRID_SIZE):

        mata1 = (
            kepala.left + 6,
            kepala.top + 6
        )

        mata2 = (
            kepala.right - 6,
            kepala.top + 6
        )

    else:

        mata1 = (
            kepala.left + 6,
            kepala.bottom - 6
        )

        mata2 = (
            kepala.right - 6,
            kepala.bottom - 6
        )

    pygame.draw.circle(
        screen,
        EYE_WHITE,
        mata1,
        4
    )

    pygame.draw.circle(
        screen,
        EYE_WHITE,
        mata2,
        4
    )

    pygame.draw.circle(
        screen,
        EYE_BLACK,
        mata1,
        2
    )

    pygame.draw.circle(
        screen,
        EYE_BLACK,
        mata2,
        2
    )

    teks_skor = font.render(
        "Skor: " + str(skor),
        True,
        BLACK
    )

    screen.blit(
        teks_skor,
        (10, 10)
    )

    kecepatan = 8 + (skor // 3)

    if kecepatan > 18:

        kecepatan = 18

    if game_over:

        overlay = pygame.Surface(
            (WIDTH, HEIGHT)
        )

        overlay.set_alpha(160)

        overlay.fill(BLACK)

        screen.blit(
            overlay,
            (0, 0)
        )

        teks_game_over = game_over_font.render(
            "GAME OVER",
            True,
            RED
        )

        teks_skor_akhir = font.render(
            "Skor: " + str(skor),
            True,
            WHITE
        )

        teks_restart = small_font.render(
            "Tekan R untuk bermain lagi",
            True,
            WHITE
        )

        teks_keluar = small_font.render(
            "Tekan ESC untuk keluar",
            True,
            WHITE
        )

        screen.blit(
            teks_game_over,
            (
                WIDTH // 2
                - teks_game_over.get_width() // 2,
                110
            )
        )

        screen.blit(
            teks_skor_akhir,
            (
                WIDTH // 2
                - teks_skor_akhir.get_width() // 2,
                180
            )
        )

        screen.blit(
            teks_restart,
            (
                WIDTH // 2
                - teks_restart.get_width() // 2,
                230
            )
        )

        screen.blit(
            teks_keluar,
            (
                WIDTH // 2
                - teks_keluar.get_width() // 2,
                260
            )
        )

    pygame.display.update()

    clock.tick(kecepatan)

pygame.quit()