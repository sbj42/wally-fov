import * as geom from 'tiled-geometry';
import { FieldOfView } from './field-of-view';

/**
 * The FieldOfViewImpl class is the concrete implementation of the FieldOfView interface.
 */
export class FieldOfViewImpl implements FieldOfView {
    readonly origin: geom.Offset;
    readonly chebyshevRadius: number;
    readonly visible: geom.MaskRectangle;

    constructor(origin: geom.Offset, chebyshevRadius: number) {
        this.origin = origin;
        this.chebyshevRadius = chebyshevRadius;
        const boundRect = new geom.Rectangle(
            origin.x - chebyshevRadius, origin.y - chebyshevRadius,
            chebyshevRadius * 2 + 1, chebyshevRadius * 2 + 1,
        );
        this.visible = new geom.MaskRectangle(boundRect);
        // the origin is always visible
        this.visible.setAtOffset(origin, true);
    }

    getVisible(x: number, y: number): boolean {
        return this.visible.get(x, y);
    }

    toString(): string {
        let ret = '';
        for (const location of this.visible.locations()) {
            const {x, y} = location;
            if (this.origin.equals(location)) {
                ret += '@';
            } else if (this.getVisible(x, y)) {
                ret += '-';
            } else {
                ret += '.';
            }
            if (x === this.visible.westX + this.visible.width - 1) {
                ret += '\n';
            }
        }
        return ret;
    }
}
