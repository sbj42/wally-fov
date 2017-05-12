import * as geom from '.';
export interface RectangleLike extends geom.SizeLike {
    readonly westX: number;
    readonly northY: number;
}
export declare class Rectangle implements RectangleLike, geom.SizeLike {
    northWest: geom.Offset;
    size: geom.Size;
    constructor();
    constructor(westX: number, northY: number, width: number, height: number);
    toString(): string;
    readonly northY: number;
    readonly southY: number;
    readonly westX: number;
    readonly eastX: number;
    readonly width: number;
    readonly height: number;
    readonly empty: boolean;
    readonly area: number;
    copyFrom(other: RectangleLike): this;
    containsOffset(off: geom.OffsetLike): boolean;
    index(off: geom.OffsetLike): number;
}
