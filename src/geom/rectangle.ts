import * as geom from '.';

export interface RectangleLike extends geom.SizeLike {
    readonly westX: number;
    readonly northY: number;
}

const LOCAL_OFF = new geom.Offset();

export class Rectangle implements RectangleLike, geom.SizeLike {
    northWest: geom.Offset;
    size: geom.Size;

    constructor();
    constructor(westX: number, northY: number, width: number, height: number);
    constructor(westX?: number, northY?: number, width?: number, height?: number) {
        if (typeof westX === 'undefined') {
            westX = 0;
        }
        if (typeof northY === 'undefined') {
            northY = 0;
        }
        if (typeof width === 'undefined') {
            width = 0;
        }
        if (typeof height === 'undefined') {
            height = 0;
        }
        this.northWest = new geom.Offset(westX, northY);
        this.size = new geom.Size(width, height);
    }

    // accessors

    toString() {
        return `(${this.westX},${this.northY} ${this.width}x${this.height})`;
    }

    get northY() {
        return this.northWest.y;
    }

    get southY() {
        return this.northWest.y + this.size.height - 1;
    }

    get westX() {
        return this.northWest.x;
    }

    get eastX() {
        return this.northWest.x + this.size.width - 1;
    }

    get width() {
        return this.size.width;
    }

    get height() {
        return this.size.height;
    }

    get empty() {
        return this.size.empty;
    }

    get area() {
        return this.size.area;
    }

    // mutators

    copyFrom(other: RectangleLike) {
        this.northWest.set(other.westX, other.northY);
        this.size.set(other.width, other.height);
        return this;
    }

    // utilities

    containsOffset(off: geom.OffsetLike) {
        return this.size.containsOffset(LOCAL_OFF.copyFrom(off).subtractOffset(this.northWest));
    }

    index(off: geom.OffsetLike) {
        return this.size.index(LOCAL_OFF.copyFrom(off).subtractOffset(this.northWest));
    }
}
