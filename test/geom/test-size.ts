import * as assert from 'assert';

import * as geom from '../../src/geom';

describe('geom/size', () => {
    it('starts at 0x0', () => {
        const o = new geom.Size();
        assert.equal(o.width, 0);
        assert.equal(o.height, 0);
    });
    it('is mutable', () => {
        const o = new geom.Size();
        o.width = 1;
        assert.equal(o.width, 1);
    });
    describe('#constructor()', () => {
        it('works', () => {
            const o = new geom.Size(1, 2);
            assert.equal(o.width, 1);
            assert.equal(o.height, 2);
        });
    });
    describe('#set()', () => {
        it('works', () => {
            const o = new geom.Size().set(1, 2);
            assert.equal(o.width, 1);
            assert.equal(o.height, 2);
        });
    });
    describe('#toString()', () => {
        it('works', () => {
            assert.equal(new geom.Size(1, 2).toString(), '(1x2)');
        });
    });
    describe('#empty', () => {
        it('works', () => {
            assert.equal(new geom.Size(0, 0).empty, true);
            assert.equal(new geom.Size(1, 0).empty, true);
            assert.equal(new geom.Size(0, 1).empty, true);
            assert.equal(new geom.Size(1, 1).empty, false);
        });
    });
    describe('#area', () => {
        it('works', () => {
            assert.equal(new geom.Size(0, 0).area, 0);
            assert.equal(new geom.Size(1, 0).area, 0);
            assert.equal(new geom.Size(0, 1).area, 0);
            assert.equal(new geom.Size(1, 1).area, 1);
            assert.equal(new geom.Size(3, 4).area, 12);
            assert.equal(new geom.Size(4, 3).area, 12);
        });
    });
    describe('#copyFrom()', () => {
        it('works', () => {
            assert.equal(new geom.Size().copyFrom(new geom.Size(1, 2)).toString(), '(1x2)');
            assert.equal(new geom.Size().copyFrom({height: 2, width: 1}).toString(), '(1x2)');
        });
    });
    describe('#containsOffset()', () => {
        it('works', () => {
            assert.equal(new geom.Size(5, 10).containsOffset({x: 3, y: 6}), true);
            assert.equal(new geom.Size(5, 10).containsOffset({x: -3, y: 6}), false);
            assert.equal(new geom.Size(5, 10).containsOffset({x: 3, y: -6}), false);
            assert.equal(new geom.Size(5, 10).containsOffset({x: 6, y: 3}), false);
            assert.equal(new geom.Size(5, 10).containsOffset({x: 3, y: 11}), false);
            assert.equal(new geom.Size(5, 10).containsOffset({x: 0, y: 0}), true);
            assert.equal(new geom.Size(5, 10).containsOffset({x: 4, y: 9}), true);
            assert.equal(new geom.Size(5, 10).containsOffset({x: 5, y: 9}), false);
            assert.equal(new geom.Size(5, 10).containsOffset({x: 4, y: 10}), false);
            assert.equal(new geom.Size(5, 10).containsOffset({x: 5, y: 10}), false);
        });
    });
    describe('#index()', () => {
        it('works', () => {
            assert.equal(new geom.Size(5, 10).index(new geom.Offset()), 0);
            assert.equal(new geom.Size(5, 10).index({x: 4, y: 2}), 14);
            assert.equal(new geom.Size(5, 10).index({x: 0, y: 3}), 15);
            assert.equal(new geom.Size(5, 10).index({x: 3, y: 6}), 33);
        });
    });
});
