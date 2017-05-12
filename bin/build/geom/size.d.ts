import * as geom from '.';
export interface SizeLike {
    readonly width: number;
    readonly height: number;
}
export declare class Size implements SizeLike {
    width: number;
    height: number;
    constructor();
    constructor(width: number, height: number);
    toString(): string;
    readonly empty: boolean;
    readonly area: number;
    set(width: number, height: number): this;
    copyFrom(other: SizeLike): this;
    containsOffset(off: geom.OffsetLike): boolean;
    index(off: geom.OffsetLike): number;
    forEach(cursor: geom.Offset, callback: (offset: geom.Offset) => void): void;
}
