import * as assert from 'assert';

import * as geom from '../../src/geom';

describe('geom/offset', () => {
    it('starts at 0,0', () => {
        const o = new geom.Offset();
        assert.strictEqual(o.x, 0);
        assert.strictEqual(o.y, 0);
    });
    it('is mutable', () => {
        const o = new geom.Offset();
        o.x = 1;
        assert.strictEqual(o.x, 1);
    });
    describe('#constructor()', () => {
        it('works', () => {
            const o = new geom.Offset(1, 2);
            assert.strictEqual(o.x, 1);
            assert.strictEqual(o.y, 2);
        });
    });
    describe('#set()', () => {
        it('works', () => {
            const o = new geom.Offset().set(1, 2);
            assert.strictEqual(o.x, 1);
            assert.strictEqual(o.y, 2);
        });
    });
    describe('#toString()', () => {
        it('works', () => {
            assert.strictEqual(new geom.Offset(1, 2).toString(), '(1,2)');
            assert.strictEqual(new geom.Offset(-3, -4).toString(), '(-3,-4)');
        });
    });
    describe('#copyFrom()', () => {
        it('works', () => {
            assert.strictEqual(new geom.Offset().copyFrom(new geom.Offset(1, 2)).toString(), '(1,2)');
            assert.strictEqual(new geom.Offset().copyFrom({y: 2, x: 1}).toString(), '(1,2)');
        });
    });
    describe('#addOffset()', () => {
        it('works', () => {
            assert.strictEqual(new geom.Offset(1, 2).addOffset({x: -3, y: -5}).toString(), '(-2,-3)');
        });
    });
    describe('#addCardinalDirection()', () => {
        it('works', () => {
            assert.strictEqual(new geom.Offset(1, 2).addCardinalDirection(geom.Direction.NORTH).toString(),
                '(1,1)');
            assert.strictEqual(new geom.Offset(1, 2).addCardinalDirection(geom.Direction.EAST).toString(),
                '(2,2)');
            assert.strictEqual(new geom.Offset(1, 2).addCardinalDirection(geom.Direction.SOUTH).toString(),
                '(1,3)');
        });
    });
    describe('#subtractOffset()', () => {
        it('works', () => {
            assert.strictEqual(new geom.Offset(1, 2).subtractOffset({x: 3, y: 5}).toString(), '(-2,-3)');
        });
    });
});
