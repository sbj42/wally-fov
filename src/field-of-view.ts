import * as geom from 'tiled-geometry';

/**
 * The FieldOfView interface maps each tile on a FieldOfViewMap to a boolean representing
 * whether that tile is visible from some origin.
 */
export interface FieldOfView {

    readonly origin: geom.OffsetLike;

    readonly chebyshevRadius: number;

    getVisible(x: number, y: number): boolean;

    toString(): string;
}
