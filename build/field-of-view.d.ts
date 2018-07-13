import * as geom from './geom';
/**
 * The FieldOFViewMap represents the map over which the field of view will be
 * computed.  It starts out empty.  You can add walls and bodies to it, and then
 * use getFieldOfView() to compute the field of view from a given point.
 */
export declare class FieldOfViewMap {
    private readonly _size;
    private readonly _tileFlags;
    constructor(width: number, height: number);
    private _addFlag;
    private _removeFlag;
    /**
     * Adds a wall at a particular edge.  This automatically adds the
     * corresponding wall on the other side.
     */
    addWall(x: number, y: number, dir: geom.Direction): void;
    /**
     * Removes a wall at a particular edge.  This automatically removes the
     * corresponding wall on the other side.
     */
    removeWall(x: number, y: number, dir: geom.Direction): void;
    getWalls(x: number, y: number): number;
    addBody(x: number, y: number): void;
    removeBody(x: number, y: number): void;
    getBody(x: number, y: number): number;
    /**
     * Compute the field of view for a camera at the given tile.
     * chebyshevRadius is the vision radius.  It uses chebyshev distance
     * (https://en.wikipedia.org/wiki/Chebyshev_distance), which just means
     * that the limit of vision in a large empty field will be square.
     *
     * This returns a MaskRect, which indicates which tiles are visible.
     * maskRect.get(x, y) will return true for visible tiles.
     */
    getFieldOfView(x: number, y: number, chebyshevRadius: number): geom.MaskRect;
    private _quadrant;
}
