import * as geom from './geom';
export declare class FieldOfViewMap {
    private readonly _size;
    private readonly _tileFlags;
    constructor(width: number, height: number);
    private _addFlag(off, flag);
    private _removeFlag(off, flag);
    addWall(x: number, y: number, dir: geom.Direction): void;
    removeWall(x: number, y: number, dir: geom.Direction): void;
    getWalls(x: number, y: number): number;
    addBody(x: number, y: number): void;
    removeBody(x: number, y: number): void;
    getBody(x: number, y: number): number;
    getFieldOfView(x: number, y: number, chebyshevRadius: number): geom.MaskRect;
    private _quadrant(mask, origin, chebyshevRadius, xDir, yDir);
}
