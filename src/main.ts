import './style.css'

class Position {
    x: number;
    y: number;
    direction: number;
    constructor (x: number, y: number) {
        this.x = x;
        this.y = y;
        this.direction = 0;
    }
}
const canvas: HTMLCanvasElement = document.querySelector<HTMLCanvasElement>('#app')!
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;

const SIZE: number = 64;
const SPEED: number = 4;
const PLAYER_SPEED: number = 4;
const playerDirection: boolean[] = [false, false, false, false];

ctx.fillStyle = "black";
ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

ctx.fillStyle = "cyan";
const field: number[][] = [];
for (let y: number = 0; y <= 10; ++y) {
    const row :number[] = [];

    for (let x: number = 0; x <= 20; ++x) {
        if (x == 0 || x == 20 || y == 0 || y == 10 ) {
            ctx.fillRect(x * SIZE, y * SIZE, SIZE, SIZE);
            row.push(-1);
        } else {
            if(x % 2 == 0 && y % 2 == 0) {
                ctx.fillRect(x * SIZE, y * SIZE, SIZE, SIZE);

                const r = Math.floor(Math.random() * 4)
                row.push(r);
                if (r == 0) {
                    ctx.fillRect((x + 1) * SIZE, y * SIZE, SIZE, SIZE);
                }
                if (r == 1) {
                    ctx.fillRect((x - 1) * SIZE, y * SIZE, SIZE, SIZE);
                }
                if (r == 2) {
                    ctx.fillRect(x * SIZE, (y + 1) * SIZE, SIZE, SIZE);
                }
                if (r == 3) {
                    ctx.fillRect(x * SIZE, (y - 1) * SIZE, SIZE, SIZE);
                }
            } else {
                row.push(-1);
            }   

        }

    }
    field.push(row);
}
const RIGHT: number = 0;
const LEFT: number = 1;
const UP: number = 2;
const DOWN: number = 3;

let player: Position = new Position(SIZE, SIZE * 3 + SIZE / 2);

let enemys: Position[] = [
    new Position(SIZE, SIZE * 3 + SIZE / 2),
    new Position(SIZE, SIZE * 3 + SIZE / 2),
    new Position(SIZE, SIZE * 3 + SIZE / 2),
    new Position(SIZE, SIZE * 3 + SIZE / 2),
    new Position(SIZE, SIZE * 3 + SIZE / 2),
    new Position(SIZE, SIZE * 3 + SIZE / 2),
    new Position(SIZE, SIZE * 3 + SIZE / 2),
    new Position(SIZE, SIZE * 3 + SIZE / 2),
    new Position(SIZE, SIZE * 3 + SIZE / 2),
    new Position(SIZE, SIZE * 3 + SIZE / 2)
];


function enemy(ctx: CanvasRenderingContext2D,bodyColor:string, eyeColor:string, x: number, y: number) {
    ctx.strokeStyle = bodyColor;
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.arc(x + SIZE / 2, y + 7 * SIZE / 2, SIZE / 2, 0, Math.PI, true );
    ctx.fill();

    ctx.fillRect(x, y + 7.01 * SIZE / 2, SIZE / 2, SIZE / 2);
    ctx.fillRect(x + SIZE / 2 + 0.1, y + 7.01 * SIZE / 2, SIZE / 2, SIZE / 2);

    ctx.strokeStyle = "white";
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(x + SIZE / 4, y + 7 * SIZE / 2 - 10, SIZE / 5, 0, Math.PI * 2 );
    ctx.arc(x + SIZE / 1.5, y + 7 * SIZE / 2 - 10, SIZE / 5, 0, Math.PI * 2 );
    ctx.fill();

    ctx.strokeStyle = eyeColor;
    ctx.fillStyle = eyeColor;
    ctx.beginPath();
    ctx.arc(x + SIZE / 7,   y + 7 * SIZE / 2 - 10, SIZE / 10, 0, Math.PI * 2 );
    ctx.arc(x + SIZE / 1.7, y + 7 * SIZE / 2 - 10, SIZE / 10, 0, Math.PI * 2 );
    ctx.fill();

}

function loop() {
    requestAnimationFrame(loop);

    if (playerDirection[RIGHT]) {
        player.direction = RIGHT;

        if (playerHit(player)) {
        } else {
            player.x += PLAYER_SPEED;
        }
    }
    if (playerDirection[LEFT]) {
        player.direction = LEFT;
        if (playerHit(player)) {
        } else {
            player.x -= PLAYER_SPEED;
        }
    }
    if (playerDirection[UP]) {
        player.direction = UP;
        if (playerHit(player)) {
        } else {
            player.y -= PLAYER_SPEED;
        }
    }
    if (playerDirection[DOWN]) {
        player.direction = DOWN;
        if (playerHit(player)) {
        } else {
            player.y += PLAYER_SPEED;
        }
    }

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    

    ctx.fillStyle = "cyan";
    for (let y: number = 0; y <= 10; ++y) {
        for (let x: number = 0; x <= 20; ++x) {
            if (x == 0 || x == 20 || y == 0 || y == 10 ) {
                ctx.fillRect(x * SIZE, y * SIZE, SIZE, SIZE);
            } else {
                if(x % 2 == 0 && y % 2 == 0) {
                    ctx.fillRect(x * SIZE, y * SIZE, SIZE, SIZE);
    
                    if (field[y][x] == 0) {
                        ctx.fillRect((x + 1) * SIZE, y * SIZE, SIZE, SIZE);
                    }
                    if (field[y][x] == 1) {
                        ctx.fillRect((x - 1) * SIZE, y * SIZE, SIZE, SIZE);
                    }
                    if (field[y][x] == 2) {
                        ctx.fillRect(x * SIZE, (y + 1) * SIZE, SIZE, SIZE);
                    }
                    if (field[y][x] == 3) {
                        ctx.fillRect(x * SIZE, (y - 1) * SIZE, SIZE, SIZE);
                    }
                }    
    
            }
    
        }
    }
    


    ctx.strokeStyle = "yellow";
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(player.x + SIZE / 2, player.y, SIZE / 2, Math.PI / 180 * 30,Math.PI / 180 * 330);
    ctx.lineTo(player.x + SIZE / 2, player.y);
    ctx.lineTo(player.x + SIZE / 2 + SIZE / 4 * Math.cos(30 * Math.PI / 180), player.y + SIZE / 4 * Math.sin(30 * Math.PI / 180));
    ctx.fill();
    

    let z = 0;
    for (let y: number = 0; y < 3; y++) {
        for (let x: number = 0; x < 3; x++) {
            enemy(ctx, bodyColorArray[colorIndex[y][x]], eyeColorArray[colorIndex[y][x]], enemys[z].x, enemys[z].y-SIZE * 4 + SIZE / 2);
            z += 1;
        }
    }


    

    // console.log("1:" + field[1][Math.floor(x / SIZE) + 1]);
    // console.log("2:" + field[2][Math.floor(x / SIZE) + 1]);
    // console.log("3:" + field[3][Math.floor(x / SIZE) + 1]);

    for (let i = 0; i < enemys.length; i++) {
        // yyy[i].y = enemys[i].y - SIZE / 2;
        // if (enemys[i].direction == UP) {
        //     yyy[i].y = enemys[i].y + SIZE / 2;
        // }
        hit(enemys[i], yyy[i]);
    }

}

function playerHit(position: Position): boolean {
    switch (position.direction) {
        case RIGHT:
            if (field[Math.floor(position.y / SIZE) - 1][Math.floor(position.x / SIZE) + 1] == 2 || field[Math.floor(position.y / SIZE) + 1][Math.floor(position.x / SIZE) + 1] == 3) {
                return true;
            }
            break;
        case LEFT:
            if (field[Math.floor(position.y / SIZE) - 1][Math.floor(position.x / SIZE) ] == 2 || field[Math.floor(position.y / SIZE) + 1][Math.floor(position.x / SIZE) ] == 3) {
                return true;
            }
            break;
        case UP:
            if (field[Math.floor((position.y + SIZE / 2) / SIZE) - 1][Math.floor(position.x / SIZE) - 1] == 0 || field[Math.floor((position.y + SIZE / 2) / SIZE) - 1][Math.floor(position.x / SIZE) + 1] == 1) {
                return true;
            }
            if (position.y < SIZE * 1.5) {
                return true;
            }
            break;
        case DOWN:
            if (field[Math.floor((position.y - SIZE / 2)/ SIZE) + 1][Math.floor(position.x / SIZE) - 1] == 0 || field[Math.floor((position.y - SIZE / 2) / SIZE) + 1][Math.floor(position.x / SIZE) + 1] == 1) {
                return true;
            }
            if (position.y > SIZE * 9 + SIZE / 2) {
                return true
            }
            break;
    }
    return false;
}


function hit(position: Position, yy: Position) {
    switch (position.direction) {
        case DOWN:
            if (position.x < SIZE || SIZE * 18 < position.x || position.y < SIZE + SIZE / 2 || SIZE * 9 + SIZE / 2 < position.y) {
                position.direction = UP;
                position.y =  SIZE * 9 + SIZE / 2;
            } else if (field[Math.floor(position.y / SIZE) + 1][Math.floor(position.x / SIZE) - 1] == 0 || field[Math.floor(position.y / SIZE) + 1][Math.floor(position.x / SIZE) + 1] == 1) {
                position.direction = Math.floor(Math.random() * 4);
            } else {
                position.y += SPEED;
            }
            break;
        case UP:
            if (position.x < SIZE || SIZE * 18 < position.x || position.y < SIZE + SIZE / 2 || SIZE * 9 + SIZE / 2 < position.y) {
                position.direction = DOWN;
                position.y = SIZE + SIZE / 2;
            } else if (field[Math.floor(position.y / SIZE) - 1][Math.floor(position.x / SIZE) - 1] == 0 || field[Math.floor(position.y / SIZE) - 1][Math.floor(position.x / SIZE) + 1] == 1) {
                position.direction = Math.floor(Math.random() * 4);
            } else {
                position.y -= SPEED;
            }
            break;
        case RIGHT:
            if (position.x < SIZE || SIZE * 18 < position.x || position.y < SIZE + SIZE / 2 || SIZE * 9 + SIZE / 2 < position.y) {
                position.direction = LEFT;
                position.x = SIZE * 18;
            } else if (field[Math.floor(position.y / SIZE) - 1][Math.floor(position.x / SIZE) + 1] == 2 || field[Math.floor(position.y / SIZE) + 1][Math.floor(position.x / SIZE) + 1] == 3) {
                position.direction = Math.floor(Math.random() * 4);
            } else {
                position.x += SPEED;
            }
            break;
        case LEFT:
            if (position.x < SIZE || SIZE * 18 < position.x || position.y < SIZE + SIZE / 2 || SIZE * 9 + SIZE / 2 < position.y) {
                position.direction = RIGHT;
                position.x = SIZE;
            } else if (field[Math.floor(position.y / SIZE) - 1][Math.floor(position.x / SIZE) ] == 2 || field[Math.floor(position.y / SIZE) + 1][Math.floor(position.x / SIZE) ] == 3) {
                position.direction = Math.floor(Math.random() * 4);
            } else {
                position.x -= SPEED;
            }
            break;
    }

}


let yyy: Position[] = [
    new Position(0, 0),
    new Position(0, 0),
    new Position(0, 0),
    new Position(0, 0),
    new Position(0, 0),
    new Position(0, 0),
    new Position(0, 0),
    new Position(0, 0),
    new Position(0, 0)
];
const bodyColorArray: string[] = ["red", "green", "blue"]; 
const eyeColorArray: string[] = ["black", "blue", "red"]; 
const colorIndex: number[][] = [
    [Math.floor(Math.random() * bodyColorArray.length), Math.floor(Math.random() * bodyColorArray.length),Math.floor(Math.random() * bodyColorArray.length)],
    [Math.floor(Math.random() * bodyColorArray.length), Math.floor(Math.random() * bodyColorArray.length),Math.floor(Math.random() * bodyColorArray.length)],
    [Math.floor(Math.random() * bodyColorArray.length), Math.floor(Math.random() * bodyColorArray.length),Math.floor(Math.random() * bodyColorArray.length)],
];
// const enemyPosition: number[][][] = [
//     [ [Math.random() * window.innerWidth / 1.3, Math.random() * window.innerHeight / 1.3], [Math.random() * window.innerWidth / 1.3, Math.random() * window.innerHeight / 1.3], [Math.random() * window.innerWidth / 1.3, Math.random() * window.innerHeight / 1.3] ],
//     [ [Math.random() * window.innerWidth / 1.3, Math.random() * window.innerHeight / 1.3], [Math.random() * window.innerWidth / 1.3, Math.random() * window.innerHeight / 1.3], [Math.random() * window.innerWidth / 1.3, Math.random() * window.innerHeight / 1.3] ],
//     [ [Math.random() * window.innerWidth / 1.3, Math.random() * window.innerHeight / 1.3], [Math.random() * window.innerWidth / 1.3, Math.random() * window.innerHeight / 1.3], [Math.random() * window.innerWidth / 1.3, Math.random() * window.innerHeight / 1.3] ],
// ];

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowRight":
            playerDirection[RIGHT] = true;
            break;
        case "ArrowLeft":
            playerDirection[LEFT] = true;
            break;
        case "ArrowUp":
            playerDirection[UP] = true;
            break;
        case "ArrowDown":
            playerDirection[DOWN] = true;
            break;
        default:
            break;
    }
})

document.addEventListener("keyup", (e) => {
    switch (e.key) {
        case "ArrowRight":
            playerDirection[RIGHT] = false;
            break;
        case "ArrowLeft":
            playerDirection[LEFT] = false;
            break;
        case "ArrowUp":
            playerDirection[UP] = false;
            break;
        case "ArrowDown":
            playerDirection[DOWN] = false;
            break;
        default:
            break;
    }
})



loop();