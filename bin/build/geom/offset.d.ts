import * as geom from '.';
export interface OffsetLike {
    readonly x: number;
    readonly y: number;
}
export declare class Offset implements OffsetLike {
    x: number;
    y: number;
    constructor();
    constructor(x: number, y: number);
    toString(): string;
    set(x: number, y: number): this;
    copyFrom(other: OffsetLike): this;
    addOffset(off: OffsetLike): this;
    addCardinalDirection(dir: geom.Direction): this;
    subtractOffset(off: OffsetLike): this;
}
