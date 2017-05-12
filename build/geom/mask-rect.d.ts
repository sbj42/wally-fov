import * as geom from '.';
export declare class MaskRect implements geom.RectangleLike {
    private readonly _rectangle;
    private readonly _mask;
    private readonly _outsideValue;
    constructor(rect: geom.RectangleLike, initialValue?: boolean, outsideValue?: boolean);
    toString(): string;
    readonly westX: number;
    readonly northY: number;
    readonly width: number;
    readonly height: number;
    index(off: geom.OffsetLike): number;
    getAt(index: number): boolean;
    get(x: number, y: number): boolean;
    setAt(index: number, value: boolean): this;
    set(off: geom.OffsetLike, value: boolean): this;
    forEach(cursor: geom.Offset, callback: (cursor: geom.Offset, value: boolean) => void): void;
}
