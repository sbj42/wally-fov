// tslint:disable:no-bitwise

export enum Direction {
    NORTH = 0,
    EAST  = 1,
    SOUTH = 2,
    WEST  = 3,
}

export const DIRECTIONS = [
    Direction.NORTH,
    Direction.EAST,
    Direction.SOUTH,
    Direction.WEST,
];

export function directionOpposite(dir: Direction) {
    return ((dir + 2) & 3) as Direction;
}
