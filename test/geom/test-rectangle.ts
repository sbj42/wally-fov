import * as assert from 'assert';

import * as geom from '../../src/geom';

describe('geom/rectangle', () => {
    it('starts at 0,0 0x0', () => {
        const o = new geom.Rectangle();
        assert.strictEqual(o.westX, 0);
        assert.strictEqual(o.northY, 0);
        assert.strictEqual(o.width, 0);
        assert.strictEqual(o.height, 0);
        assert.strictEqual(o.eastX, -1);
        assert.strictEqual(o.southY, -1);
    });
    it('is mutable', () => {
        const o = new geom.Rectangle();
        o.northWest.y = 1;
        o.size.width = 2;
        assert.strictEqual(o.northY, 1);
        assert.strictEqual(o.width, 2);
    });
    describe('#constructor()', () => {
        it('works', () => {
            const o = new geom.Rectangle(1, 2, 3, 4);
            assert.strictEqual(o.westX, 1);
            assert.strictEqual(o.northY, 2);
            assert.strictEqual(o.width, 3);
            assert.strictEqual(o.height, 4);
            assert.strictEqual(o.eastX, 3);
            assert.strictEqual(o.southY, 5);
        });
        it('works with negative offsets', () => {
            const o = new geom.Rectangle(-1, -2, 3, 4);
            assert.strictEqual(o.westX, -1);
            assert.strictEqual(o.northY, -2);
            assert.strictEqual(o.width, 3);
            assert.strictEqual(o.height, 4);
            assert.strictEqual(o.eastX, 1);
            assert.strictEqual(o.southY, 1);
        });
    });
    describe('#toString()', () => {
        it('works', () => {
            assert.strictEqual(new geom.Rectangle(1, 2, 3, 4).toString(), '(1,2 3x4)');
        });
    });
    describe('#empty', () => {
        it('works', () => {
            assert.strictEqual(new geom.Rectangle(1, 2, 0, 0).empty, true);
            assert.strictEqual(new geom.Rectangle(1, 2, 9, 0).empty, true);
            assert.strictEqual(new geom.Rectangle(1, 2, 0, 9).empty, true);
            assert.strictEqual(new geom.Rectangle(1, 2, 1, 2).empty, false);
        });
    });
    describe('#area', () => {
        it('works', () => {
            assert.strictEqual(new geom.Rectangle(1, 2, 0, 0).area, 0);
            assert.strictEqual(new geom.Rectangle(1, 2, 1, 0).area, 0);
            assert.strictEqual(new geom.Rectangle(1, 2, 0, 1).area, 0);
            assert.strictEqual(new geom.Rectangle(1, 2, 1, 1).area, 1);
            assert.strictEqual(new geom.Rectangle(1, 2, 3, 4).area, 12);
            assert.strictEqual(new geom.Rectangle(1, 2, 4, 3).area, 12);
        });
        it('works with negative offsets', () => {
            assert.strictEqual(new geom.Rectangle(-1, -2, 3, 4).area, 12);
        });
    });
    describe('#copyFrom()', () => {
        it('works', () => {
            assert.strictEqual(new geom.Rectangle().copyFrom(new geom.Rectangle(1, 2, 3, 4)).toString(), '(1,2 3x4)');
            assert.strictEqual(new geom.Rectangle().copyFrom({
                height: 4,
                width: 3,
                northY: 2,
                westX: 1,
            }).toString(), '(1,2 3x4)');
        });
    });
    describe('#containsOffset()', () => {
        it('works', () => {
            assert.strictEqual(new geom.Rectangle(1, 2, 3, 4).containsOffset({x: 1, y: 3}), true);
            assert.strictEqual(new geom.Rectangle(1, 2, 3, 4).containsOffset({x: 1, y: 2}), true);
            assert.strictEqual(new geom.Rectangle(1, 2, 3, 4).containsOffset({x: 3, y: 5}), true);
            assert.strictEqual(new geom.Rectangle(1, 2, 3, 4).containsOffset({x: 4, y: 5}), false);
            assert.strictEqual(new geom.Rectangle(1, 2, 3, 4).containsOffset({x: 3, y: 6}), false);
            assert.strictEqual(new geom.Rectangle(1, 2, 3, 4).containsOffset({x: 1, y: 0}), false);
            assert.strictEqual(new geom.Rectangle(1, 2, 3, 4).containsOffset({x: 0, y: 3}), false);
        });
        it('works with negative offsets', () => {
            assert.strictEqual(new geom.Rectangle(-1, -2, 3, 4).containsOffset({x: 1, y: 1}), true);
            assert.strictEqual(new geom.Rectangle(-1, -2, 3, 4).containsOffset({x: 2, y: 1}), false);
        });
    });
    describe('#index()', () => {
        it('works', () => {
            assert.strictEqual(new geom.Rectangle(1, 2, 6, 4).index({x: 4, y: 5}), 21);
            assert.strictEqual(new geom.Rectangle(1, 2, 6, 4).index({x: 6, y: 3}), 11);
            assert.strictEqual(new geom.Rectangle(1, 2, 6, 4).index({x: 1, y: 4}), 12);
        });
        it('works with negative offsets', () => {
            assert.strictEqual(new geom.Rectangle(-1, -2, 6, 4).index({x: 2, y: 1}), 21);
        });
    });
});
