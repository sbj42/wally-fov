import * as geom from 'tiled-geometry';

/**
 * These flags determine whether a given tile has walls in any of the cardinal
 * directions, and whether there is a "body" in the tile.
 */
export enum TileFlags {
    NONE = 0,
    WALL_NORTH = geom.CardinalDirectionFlags.NORTH,
    WALL_EAST  = geom.CardinalDirectionFlags.EAST,
    WALL_WEST  = geom.CardinalDirectionFlags.WEST,
    WALL_SOUTH = geom.CardinalDirectionFlags.SOUTH,
    BODY       = 1 << geom.CARDINAL_DIRECTIONS.length,
}

export function tileFlagsForWallAtCardinalDirection(dir: geom.CardinalDirection): TileFlags {
    return geom.cardinalDirectionFlagsFromCardinalDirection(dir) as unknown as TileFlags;
}

export function cardinalDirectionFlagsFromTileFlags(tileFlags: TileFlags): geom.CardinalDirectionFlags {
    return tileFlags & geom.CardinalDirectionFlags.ALL;
}

export function tileFlagsHasCardinalDirection(tileFlags: TileFlags, direction: geom.CardinalDirection): boolean {
    return geom.cardinalDirectionFlagsHasCardinalDirection(cardinalDirectionFlagsFromTileFlags(tileFlags), direction);
}
