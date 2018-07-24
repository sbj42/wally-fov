import * as geom from './geom';

// tslint:disable:no-bitwise

/**
 * These flags determine whether a given tile has walls in any of the cardinal
 * directions, and whether there is a "body" in the tile.
 */
enum TileFlag {
    WALL_NORTH = 1 << geom.Direction.NORTH,
    WALL_EAST  = 1 << geom.Direction.EAST,
    WALL_WEST  = 1 << geom.Direction.WEST,
    WALL_SOUTH = 1 << geom.Direction.SOUTH,
    BODY       = 1 << geom.DIRECTIONS.length,
}

/**
 * In the shadowcasting algorithm, each shadow is represented by a "wedge",
 * running from a "low" angle to a "high" angle.  The wedges are all stored in
 * a simple number array, with two numbers for each wedge.  These constants
 * (WEDGE_LOW and WEDGE_HIGH) help to identify which number is which.
 * WEDGE_COUNT is just how many numbers per wedge.
 */
const WEDGE_LOW = 0;
const WEDGE_HIGH = 1;
const WEDGE_COUNT = 2;

/**
 * Bodies in this algorithm do not entirely fill their tiles.  This is
 * implemented by adjusting the angles of the shadows the bodies cast,
 * making the wedge very slightly narrower.  BODY_EPSILON represents the
 * amount of reduction on either side of the wedge.
 */
const BODY_EPSILON = 0.00001;

/**
 * Walls do fill the entire tile edge.  With infinite precision, there would be
 * no need to adjust the shadow cast by a wall.  But we're using floating point
 * math here, which means imprecision can creep in and cause angles not to line
 * up properly.  To fix that, we widen the wedges of the shadows cast by walls.
 * We must make sure not to widen them as much as we narrow the body shadows,
 * or else they might close the gap we want between a body and a wall.
 */
const WALL_EPSILON = BODY_EPSILON / 10;

/**
 * We avoid heap allocations during the core part of the algorithm by using this
 * preallocated offset object.
 */
const LOCAL_OFF = new geom.Offset();

/**
 * The FieldOFViewMap represents the map over which the field of view will be
 * computed.  It starts out empty.  You can add walls and bodies to it, and then
 * use getFieldOfView() to compute the field of view from a given point.
 */
export class FieldOfViewMap {
    private readonly _size = new geom.Size();
    private readonly _tileFlags: number[];

    constructor(width: number, height: number) {
        this._size.set(width, height);
        this._tileFlags = new Array<number>(this._size.area).fill(0);
    }

    private _addFlag(off: geom.OffsetLike, flag: TileFlag) {
        const index = this._size.index(off);
        this._tileFlags[index] |= flag;
    }

    private _removeFlag(off: geom.OffsetLike, flag: TileFlag) {
        const index = this._size.index(off);
        this._tileFlags[index] &= ~flag;
    }

    // setup and maintenance

    /**
     * Adds a wall at a particular edge.  This automatically adds the
     * corresponding wall on the other side.
     */
    addWall(x: number, y: number, dir: geom.Direction) {
        LOCAL_OFF.set(x, y).addCardinalDirection(dir);
        if (this._size.containsOffset(LOCAL_OFF)) {
            this._addFlag(LOCAL_OFF, 1 << geom.directionOpposite(dir));
            LOCAL_OFF.set(x, y);
            this._addFlag(LOCAL_OFF, 1 << dir);
        }
    }

    /**
     * Removes a wall at a particular edge.  This automatically removes the
     * corresponding wall on the other side.
     */
    removeWall(x: number, y: number, dir: geom.Direction) {
        LOCAL_OFF.set(x, y).addCardinalDirection(dir);
        if (this._size.containsOffset(LOCAL_OFF)) {
            this._removeFlag(LOCAL_OFF, 1 << geom.directionOpposite(dir));
            LOCAL_OFF.set(x, y);
            this._removeFlag(LOCAL_OFF, 1 << dir);
        }
    }

    getWalls(x: number, y: number) {
        LOCAL_OFF.set(x, y);
        const index = this._size.index(LOCAL_OFF);
        return this._tileFlags[index] & geom.DirectionFlags.ALL;
    }

    getWall(x: number, y: number, dir: geom.Direction) {
        return (this.getWalls(x, y) & (1 << dir)) !== 0;
    }

    addBody(x: number, y: number) {
        LOCAL_OFF.set(x, y);
        this._addFlag(LOCAL_OFF, TileFlag.BODY);
    }

    removeBody(x: number, y: number) {
        LOCAL_OFF.set(x, y);
        this._removeFlag(LOCAL_OFF, TileFlag.BODY);
    }

    getBody(x: number, y: number) {
        LOCAL_OFF.set(x, y);
        const index = this._size.index(LOCAL_OFF);
        return (this._tileFlags[index] & TileFlag.BODY) !== 0;
    }

    // execution

    /**
     * Compute the field of view for a camera at the given tile.
     * chebyshevRadius is the vision radius.  It uses chebyshev distance
     * (https://en.wikipedia.org/wiki/Chebyshev_distance), which just means
     * that the limit of vision in a large empty field will be square.
     *
     * This returns a MaskRect, which indicates which tiles are visible.
     * maskRect.get(x, y) will return true for visible tiles.
     */
    getFieldOfView(x: number, y: number, chebyshevRadius: number): geom.MaskRect {
        const origin = new geom.Offset(x, y);
        const boundRect = new geom.Rectangle(
            origin.x - chebyshevRadius, origin.y - chebyshevRadius,
            chebyshevRadius * 2 + 1, chebyshevRadius * 2 + 1,
        );
        const mask = new geom.MaskRect(boundRect);
        // the player can always see itself
        mask.set(origin, true);
        // the field is divided into quadrants
        this._quadrant(mask, origin, chebyshevRadius, -1, -1);
        this._quadrant(mask, origin, chebyshevRadius,  1, -1);
        this._quadrant(mask, origin, chebyshevRadius, -1,  1);
        this._quadrant(mask, origin, chebyshevRadius,  1,  1);
        return mask;
    }

    private _quadrant(mask: geom.MaskRect, origin: geom.OffsetLike, chebyshevRadius: number,
                      xDir: number, yDir: number) {
        const {x: startX, y: startY} = origin;
        const endDX = (Math.min(Math.max(startX + xDir * (chebyshevRadius + 1),
                                         -1), this._size.width) - startX) * xDir;
        const endDY = (Math.min(Math.max(startY + yDir * (chebyshevRadius + 1),
                                         -1), this._size.height) - startY) * yDir;
        if (endDX < 0 || endDY < 0) {
            // the origin is outside of the map
            return;
        }
        const farYFlag = yDir === 1 ? TileFlag.WALL_SOUTH : TileFlag.WALL_NORTH;
        const farXFlag = xDir === 1 ? TileFlag.WALL_EAST : TileFlag.WALL_WEST;
        const startMapIndex = this._size.index(origin);
        const startMaskIndex = mask.index(origin);
        // Initial wedge is from slope zero to slope infinity (i.e. the whole quadrant)
        const wedges = [0, Number.POSITIVE_INFINITY];
        // X += Y must be written as X = X + Y, in order not to trigger deoptimization due to
        // http://stackoverflow.com/questions/34595356/what-does-compound-let-const-assignment-mean
        for (let dy = 0, yMapIndex = startMapIndex, yMaskIndex = startMaskIndex;
             dy !== endDY && wedges.length > 0;
             dy ++, yMapIndex = yMapIndex + yDir * this._size.width, yMaskIndex = yMaskIndex + yDir * mask.width
        ) {
            const divYpos = 1 / (dy + 0.5);
            const divYneg = dy === 0 ? Number.POSITIVE_INFINITY : 1 / (dy - 0.5);
            let wedgeIndex = 0;
            // X += Y must be written as X = X + Y, in order not to trigger deoptimization due to
            // http://stackoverflow.com/questions/34595356/what-does-compound-let-const-assignment-mean
            for (let dx = 0, mapIndex = yMapIndex, maskIndex = yMaskIndex,
                 slopeY = -0.5 * divYpos, slopeX = 0.5 * divYneg;
                 dx !== endDX && wedgeIndex !== wedges.length;
                 dx ++, mapIndex = mapIndex + xDir, maskIndex = maskIndex + xDir,
                 slopeY = slopeY + divYpos, slopeX = slopeX + divYneg
            ) {
                // the slopes of the four corners of this tile
                // these are named as follows:
                //   slopeY is the slope closest to the Y axis
                //   slopeFar is the slope to the farthest corner
                //   slopeX is the slope closest to the X axis
                // this is always true:
                //   slopeY < slopeFar < slopeX
                //
                // O = origin, C = current
                // +---+---+---+
                // | O |   |   |
                // +---+---+---X
                // |   |   | C |
                // +---+---Y---F

                // the walls of this tile
                // these are named as follows:
                //   wallY is the farthest horizontal wall (slopeY to slopeFar)
                //   wallX is the farthest vertical wall (slopeFar to slopeX)
                //
                // O = origin, C = current
                // +---+---+---+
                // | O |   |   |
                // +---+---+---+
                // |   |   | C X
                // +---+---+-Y-+

                // advance the wedge index until this tile is not after the current wedge
                while (slopeY >= wedges[wedgeIndex + WEDGE_HIGH]) {
                    // X += Y must be written as X = X + Y, in order not to trigger deoptimization due to
                    // http://stackoverflow.com/questions/34595356/what-does-compound-let-const-assignment-mean
                    wedgeIndex = wedgeIndex + WEDGE_COUNT;
                    if (wedgeIndex >= wedges.length) {
                        break;
                    }
                }
                if (wedgeIndex >= wedges.length) {
                    break;
                }

                // if the current wedge is after this tile, move on
                if (slopeX <= wedges[wedgeIndex + WEDGE_LOW]) {
                    continue;
                }

                // we can see this tile
                mask.setAt(maskIndex, true);

                // const/let must be at the top of a block, in order not to trigger deoptimization due to
                // https://github.com/nodejs/node/issues/9729
                {
                    const wallY = (this._tileFlags[mapIndex] & farYFlag) !== 0;
                    const wallX = (this._tileFlags[mapIndex] & farXFlag) !== 0;
                    if (wallX && wallY) {
                        // this tile has both far walls
                        // so we can't see beyond it and the whole range should be cut out of the wedge(s)
                        wedgeIndex = cutWedge(wedges, wedgeIndex, slopeY - WALL_EPSILON, slopeX + WALL_EPSILON);
                    } else {
                        const body = (dx !== 0 || dy !== 0) && (this._tileFlags[mapIndex] & TileFlag.BODY) !== 0;
                        if (body) {
                            if (wallX) {
                                wedgeIndex = cutWedge(wedges, wedgeIndex,
                                    slopeY + BODY_EPSILON, slopeX + WALL_EPSILON);
                            } else if (wallY) {
                                wedgeIndex = cutWedge(wedges, wedgeIndex,
                                    slopeY - WALL_EPSILON, slopeX - BODY_EPSILON);
                            } else {
                                wedgeIndex = cutWedge(wedges, wedgeIndex,
                                    slopeY + BODY_EPSILON, slopeX - BODY_EPSILON);
                            }
                        } else if (wallX) {
                            const slopeFar = slopeY + divYpos;
                            wedgeIndex = cutWedge(wedges, wedgeIndex,
                                slopeFar - WALL_EPSILON, slopeX + WALL_EPSILON);
                        } else if (wallY) {
                            const slopeFar = slopeY + divYpos;
                            wedgeIndex = cutWedge(wedges, wedgeIndex,
                                slopeY - WALL_EPSILON, slopeFar + WALL_EPSILON);
                        }
                    }
                }
            }
        }
    }
}

/**
 * This function cuts a range of angles out of the wedge array.
 */
function cutWedge(wedges: number[], wedgeIndex: number, low: number, high: number): number {
    for (; ; ) {
        if (wedgeIndex === wedges.length) {
            return wedgeIndex;
        }
        if (low <= wedges[wedgeIndex + WEDGE_HIGH]) {
            break;
        }
        // This next line is to cover a hypothetical edge case, where two slopes
        // are not the same, but are within the BODY_EPSILON distance.  That
        // would be due to either floating point error or due to a very large
        // field radius.  Either way I haven't been able to construct a test
        // case for it.
        wedgeIndex += WEDGE_COUNT;
    }
    if (low <= wedges[wedgeIndex + WEDGE_LOW]) {
        if (high >= wedges[wedgeIndex + WEDGE_HIGH]) {
            // wedge is entirely occluded, remove it
            wedges.splice(wedgeIndex, WEDGE_COUNT);
            // now looking at the next wedge (or past the end)
            return cutWedge(wedges, wedgeIndex, low, high);
        } else if (high >= wedges[wedgeIndex + WEDGE_LOW]) {
            // low part of wedge is occluded, trim it
            wedges[wedgeIndex + WEDGE_LOW] = high;
            // still looking at the same wedge
        } else {
            // this cut doesn't reach the current wedge
        }
    } else if (high >= wedges[wedgeIndex + WEDGE_HIGH]) {
        // high part of wedge is occluded, trim it
        wedges[wedgeIndex + WEDGE_HIGH] = low;
        // move on to the next wedge
        wedgeIndex += WEDGE_COUNT;
        return cutWedge(wedges, wedgeIndex, low, high);
    } else {
        // middle part of wedge is occluded, split it
        wedges.splice(wedgeIndex, 0, wedges[wedgeIndex + WEDGE_LOW], low);
        wedgeIndex += WEDGE_COUNT;
        wedges[wedgeIndex + WEDGE_LOW] = high;
        // now looking at the second wedge of the split
    }
    return wedgeIndex;
}
