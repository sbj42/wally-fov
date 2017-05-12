import * as geom from '.';

export interface SizeLike {
    readonly width: number;
    readonly height: number;
}

export class Size implements SizeLike {
    width: number;
    height: number;

    constructor();
    constructor(width: number, height: number);
    constructor(width?: number, height?: number) {
        if (typeof width === 'undefined') {
            width = 0;
        }
        if (typeof height === 'undefined') {
            height = 0;
        }
        this.width = width;
        this.height = height;
    }

    // accessors

    toString() {
        return `(${this.width}x${this.height})`;
    }

    get empty() {
        return this.width === 0 || this.height === 0;
    }

    get area() {
        return this.width * this.height;
    }

    // mutators

    set(width: number, height: number) {
        this.width = width;
        this.height = height;
        return this;
    }

    copyFrom(other: SizeLike) {
        this.width = other.width;
        this.height = other.height;
        return this;
    }

    // utilities

    containsOffset(off: geom.OffsetLike) {
        return off.x >= 0 && off.y >= 0 && off.x < this.width && off.y < this.height;
    }

    index(off: geom.OffsetLike) {
        return off.y * this.width + off.x;
    }

    forEach(cursor: geom.Offset, callback: (offset: geom.Offset) => void) {
        for (let dy = 0; dy < this.height; dy ++) {
            for (let dx = 0; dx < this.width; dx ++) {
                cursor.x = dx;
                cursor.y = dy;
                callback(cursor);
            }
        }
    }
}
