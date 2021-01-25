import * as geom from 'tiled-geometry';
import {cardinalDirectionFlagsFromTileFlags, TileFlags, tileFlagsForWallAtCardinalDirection} from './tile-flags';

/**
 * We avoid heap allocations in some places by using this preallocated offset object.
 */
const LOCAL_OFF = new geom.Offset();

/**
 * The FieldOfViewMap class describes the map over which the field of view will be
 * computed.  It starts empty.
 */
export class FieldOfViewMap {
    private readonly _size = new geom.Size();
    private readonly _tileFlags: number[];

    constructor(width: number, height: number) {
        this._size.set(width, height);
        this._tileFlags = new Array<number>(this._size.area).fill(0);
    }

    get width(): number {
        return this._size.width;
    }

    get height(): number {
        return this._size.height;
    }

    // bodies

    addBody(x: number, y: number): this {
        this._addFlag(x, y, TileFlags.BODY);
        return this;
    }

    removeBody(x: number, y: number): this {
        this._removeFlag(x, y, TileFlags.BODY);
        return this;
    }

    getBody(x: number, y: number): boolean {
        const index = this.index(x, y);
        return (this.getTileFlagsAtIndex(index) & TileFlags.BODY) !== 0;
    }

    // walls

    /**
     * Adds a wall at a particular edge.  This automatically adds the
     * corresponding wall on the other side.
     */
    addWall(x: number, y: number, dir: geom.CardinalDirection): this {
        if (this._size.contains(x, y)) {
            this._addFlag(x, y, 1 << dir);
            LOCAL_OFF.set(x, y);
            LOCAL_OFF.addCardinalDirection(dir);
            if (this._size.containsOffset(LOCAL_OFF)) {
                this._addFlag(LOCAL_OFF.x, LOCAL_OFF.y, 1 << geom.cardinalDirectionOpposite(dir));
            }
        }
        return this;
    }

    /**
     * Removes a wall at a particular edge.  This automatically removes the
     * corresponding wall on the other side.
     */
    removeWall(x: number, y: number, dir: geom.CardinalDirection): this {
        if (this._size.contains(x, y)) {
            this._removeFlag(x, y, 1 << dir);
            LOCAL_OFF.set(x, y);
            LOCAL_OFF.addCardinalDirection(dir);
            if (this._size.containsOffset(LOCAL_OFF)) {
                this._removeFlag(LOCAL_OFF.x, LOCAL_OFF.y, 1 << geom.cardinalDirectionOpposite(dir));
            }
        }
        return this;
    }

    getWalls(x: number, y: number): geom.CardinalDirectionFlags {
        const index = this.index(x, y);
        return cardinalDirectionFlagsFromTileFlags(this.getTileFlagsAtIndex(index));
    }

    getWall(x: number, y: number, dir: geom.CardinalDirection): boolean {
        const index = this.index(x, y);
        return (this.getTileFlagsAtIndex(index) & tileFlagsForWallAtCardinalDirection(dir)) !== 0;
    }

    // internal

    index(x: number, y: number): number {
        return this._size.index(x, y);
    }

    private _addFlag(x: number, y: number, flag: TileFlags) {
        const index = this._size.index(x, y);
        this._tileFlags[index] |= flag;
    }

    private _removeFlag(x: number, y: number, flag: TileFlags) {
        const index = this._size.index(x, y);
        this._tileFlags[index] &= ~flag;
    }

    getTileFlagsAtIndex(index: number): TileFlags {
        return this._tileFlags[index];
    }
}
