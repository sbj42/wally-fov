import * as WallyFOV from '../../lib';
import * as EasyStar from 'easystarjs';

const demo = document.getElementById('canvas') as HTMLCanvasElement;
const context = demo.getContext('2d') as CanvasRenderingContext2D;
const width = 37;
const height = 19;
const tileImages = new Array<string[]>(width * height);

function index(x: number, y: number) {
    return y * width + x;
}

let map: WallyFOV.FieldOfViewMap;
let easystar: EasyStar.js;

function generateMap() {

    map = new WallyFOV.FieldOfViewMap(width, height);
    easystar = new EasyStar.js();
    const grid = new Array<number[]>();
    for (let y = 0; y < height; y ++) {
        grid.push(new Array<number>(width).fill(0));
    }
    easystar.enableDiagonals();
    easystar.setGrid(grid);
    easystar.setAcceptableTiles([0]);
    easystar.enableSync();

    const turnChance = 0.1;
    for (let i = 0; i < 50; i ++) {
        let x = Math.floor(Math.random() * (width - 2) + 1);
        let y = Math.floor(Math.random() * (height - 2) + 1);
        if (map.getWalls(x, y)) {
            continue;
        }
        let dir = Math.floor(Math.random() * 4) as WallyFOV.CardinalDirection;
        const len = Math.floor(Math.random() * 7 + 2);
        for (let j = 0; j < len; j ++) {
            if (x < 1 || x >= width-1 || y < 1 || y >= height-1) {
                break;
            }
            map.addWall(x, y, dir);
            const turn = Math.random();
            switch (dir) {
                case WallyFOV.CardinalDirection.NORTH:
                    if (turn < turnChance) {
                        dir = WallyFOV.CardinalDirection.WEST;
                        x ++;
                        y --;
                    } else if (turn > 1 - turnChance) {
                        dir = WallyFOV.CardinalDirection.EAST;
                    } else {
                        x ++;
                    }
                    break;
                case WallyFOV.CardinalDirection.EAST:
                    if (turn < turnChance) {
                        dir = WallyFOV.CardinalDirection.NORTH;
                        x ++;
                        y ++;
                    } else if (turn > 1 - turnChance) {
                        dir = WallyFOV.CardinalDirection.SOUTH;
                    } else {
                        y ++;
                    }
                    break;
                case WallyFOV.CardinalDirection.SOUTH:
                    if (turn < turnChance) {
                        dir = WallyFOV.CardinalDirection.EAST;
                        x --;
                        y ++;
                    } else if (turn > 1 - turnChance) {
                        dir = WallyFOV.CardinalDirection.WEST;
                    } else {
                        x --;
                    }
                    break;
                case WallyFOV.CardinalDirection.WEST:
                    if (turn < turnChance) {
                        dir = WallyFOV.CardinalDirection.SOUTH;
                        x --;
                        y --;
                    } else if (turn > 1 - turnChance) {
                        dir = WallyFOV.CardinalDirection.NORTH;
                    } else {
                        y --;
                    }
                    break;
            }
        }
    }

    const bodyChance = 0.08;
    for (let y = 0; y < height; y ++) {
        for (let x = 0; x < width; x ++) {
            const walls = map.getWalls(x, y);
            if (walls === 0 && Math.random() < bodyChance) {
                map.addBody(x, y);
                grid[y][x] = 1;
            } else {
                const ok: EasyStar.Direction[] = [];
                if ((walls & WallyFOV.CardinalDirectionFlags.NORTH) === 0) {
                    ok.push(EasyStar.TOP);
                }
                if ((walls & WallyFOV.CardinalDirectionFlags.EAST) === 0) {
                    ok.push(EasyStar.RIGHT);
                }
                if ((walls & WallyFOV.CardinalDirectionFlags.SOUTH) === 0) {
                    ok.push(EasyStar.BOTTOM);
                }
                if ((walls & WallyFOV.CardinalDirectionFlags.WEST) === 0) {
                    ok.push(EasyStar.LEFT);
                }
                easystar.setDirectionalCondition(x, y, ok);
            }
        }
    }

}

function randomPlace() {
    let x: number;
    let y: number;
    do {
        x = Math.floor(Math.random() * width);
        y = Math.floor(Math.random() * height);
    } while (map.getWalls(x, y) || map.getBody(x, y));
    return [x, y];
}

let px: number;
let py: number;

function start() {
    generateMap();
    [px, py] = randomPlace();
    tileImages.fill([]);
    for (let y = 0; y < height; y ++) {
        for (let x = 0; x < width; x ++) {
            const walls = map.getWalls(x, y);
            const images = tileImages[index(x, y)] = [] as string[];
            if (Math.random() > 0.3) {
                images.push('floor' + Math.floor(1 + Math.random() * 6));
            }
            if ((walls & WallyFOV.CardinalDirectionFlags.NORTH) !== 0) {
                images.push('north');
            }
            if ((walls & WallyFOV.CardinalDirectionFlags.EAST) !== 0) {
                images.push('east');
            }
            if ((walls & WallyFOV.CardinalDirectionFlags.SOUTH) !== 0) {
                images.push('south');
            }
            if ((walls & WallyFOV.CardinalDirectionFlags.WEST) !== 0) {
                images.push('west');
            }
            if (map.getBody(x, y)) {
                images.push('box' + Math.floor(1 + Math.random() * 3));
            }
            images.forEach((image) => {
                context.drawImage(tiles, imageOff[image] * 32, 0, 32, 32, x * 32, y * 32, 32, 32);
            });
        }
    }
}

function render() {
    context.fillStyle = '#fff';
    context.fillRect(0, 0, width * 32, height * 32);
    for (let y = 0; y < height; y ++) {
        for (let x = 0; x < width; x ++) {
            const images = tileImages[index(x, y)];
            images.forEach((image) => {
                context.drawImage(tiles, imageOff[image] * 32, 0, 32, 32, x * 32, y * 32, 32, 32);
            });
            if (x === px && y === py) {
                context.drawImage(tiles, imageOff['player'] * 32, 0, 32, 32, x * 32, y * 32, 32, 32);
            }
        }
    }
    const fov = map.getFieldOfView(px, py, 15);
    for (let y = 0; y < height; y ++) {
        for (let x = 0; x < width; x ++) {
            if (!fov.get(x, y)) {
                context.drawImage(tiles, imageOff['shadow'] * 32, 0, 32, 32, x * 32, y * 32, 32, 32);
            }
        }
    }
}

const imageOff: {[id: string]: number} = {
    'floor1': 0,
    'floor2': 1,
    'floor3': 2,
    'floor4': 3,
    'floor5': 4,
    'floor6': 5,
    'north': 6,
    'east': 7,
    'south': 8,
    'west': 9,
    'player': 10,
    'box1': 11,
    'box2': 12,
    'box3': 13,
    'shadow': 14,
};
const tiles = new Image();
tiles.src = './tiles.png';
tiles.onload = function() {

    start();

    let working = false;
    let path: {x: number, y: number}[] | undefined;

    function step() {

        if (!path) {
            if (working) {
                easystar.calculate();
            } else {
                const [nx, ny] = randomPlace();
                working = true;
                easystar.findPath(px, py, nx, ny, function(p) {
                    path = p;
                    working = false;
                    requestAnimationFrame(step);
                });
                easystar.calculate();
                return;
            }
        } else if (path.length > 0) {
            const part = path.shift();
            if (part) {
                const {x: nx, y: ny} = part;
                px = nx;
                py = ny;
            }
        } else {
            path = undefined;
        }

        render();
        setTimeout(() => requestAnimationFrame(step), 120);
    }

    requestAnimationFrame(step);

};