import * as assert from 'assert';

import * as geom from '../../src/geom';

describe('geom/direction', () => {
    describe('DIRECTIONS', () => {
        it('has 4 directions', () => {
            assert.deepEqual(geom.DIRECTIONS.length, 4);
        });
    });
    describe('directionOpposite', () => {
        it('works', () => {
            assert.strictEqual(geom.directionOpposite(geom.Direction.NORTH), geom.Direction.SOUTH);
            assert.strictEqual(geom.directionOpposite(geom.Direction.EAST), geom.Direction.WEST);
            assert.strictEqual(geom.directionOpposite(geom.Direction.SOUTH), geom.Direction.NORTH);
            assert.strictEqual(geom.directionOpposite(geom.Direction.WEST), geom.Direction.EAST);
        });
    });
});
