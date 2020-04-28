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
    get northY(): number;
    get southY(): number;
    get westX(): number;
    get eastX(): number;
    get width(): number;
    get height(): number;
    get empty(): boolean;
    get area(): number;
    copyFrom(other: RectangleLike): this;
    containsOffset(off: geom.OffsetLike): boolean;
    index(off: geom.OffsetLike): number;
}
