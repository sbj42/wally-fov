import * as geom from '.';

const LOCAL_OFF = new geom.Offset();

export class MaskRect implements geom.RectangleLike {
    private readonly _rectangle = new geom.Rectangle();
    private readonly _mask: geom.Mask;
    private readonly _outsideValue: boolean;

    constructor(rect: geom.RectangleLike, initialValue = false, outsideValue = false) {
        this._rectangle.copyFrom(rect);
        this._mask = new geom.Mask(rect, initialValue);
        this._outsideValue = outsideValue;
    }

    // accessors

    toString() {
        return `${this._rectangle.northWest}/${this._outsideValue}\n${this._mask}`;
    }

    get westX() {
        return this._rectangle.westX;
    }

    get northY() {
        return this._rectangle.northY;
    }

    get width() {
        return this._rectangle.width;
    }

    get height() {
        return this._rectangle.height;
    }

    index(off: geom.OffsetLike) {
        return this._mask.index(LOCAL_OFF.copyFrom(off).subtractOffset(this._rectangle.northWest));
    }

    getAt(index: number) {
        return this._mask.getAt(index);
    }

    get(x: number, y: number) {
        LOCAL_OFF.set(x, y);
        if (!this._rectangle.containsOffset(LOCAL_OFF)) {
            return this._outsideValue;
        }
        return this._mask.get(LOCAL_OFF.subtractOffset(this._rectangle.northWest));
    }
    // mutators

    setAt(index: number, value: boolean) {
        this._mask.setAt(index, value);
        return this;
    }

    set(off: geom.OffsetLike, value: boolean) {
        this._mask.set(LOCAL_OFF.copyFrom(off).subtractOffset(this._rectangle.northWest), value);
        return this;
    }

    // utilities

    forEach(cursor: geom.Offset, callback: (cursor: geom.Offset, value: boolean) => void) {
        this._mask.forEach(cursor, (off, value) => {
            callback(off.addOffset(this._rectangle.northWest), value);
        });
    }
}
