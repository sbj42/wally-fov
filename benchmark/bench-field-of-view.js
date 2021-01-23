/* eslint-disable @typescript-eslint/no-var-requires */
const Benchmark = require('benchmark');
const seedrandom = require('seedrandom');

const {FieldOfViewMap, CardinalDirection, computeFieldOfView} = require('../lib');

/* eslint-disable no-console */

const suite = new Benchmark.Suite();
suite.on('cycle', (event) => {
    console.log(`${event.target}`);
});
const width = 31;
const height = 31;
const originX = 15;
const originY = 15;
{
    const map = new FieldOfViewMap(width, height);
    suite.add('computeFieldOfView([15x15 empty field])', () => {
        computeFieldOfView(map, originX, originY, 15);
    });
}
{
    const map = new FieldOfViewMap(width, height);
    const random = seedrandom.alea('abc');
    const chance = 0.03;
    for (let y = 0; y < height; y ++) {
        for (let x = 0; x < width; x ++) {
            if (y > 0 && random() < chance) {
                map.addWall(x, y, CardinalDirection.NORTH);
            }
            if (x < width - 1 && random() < chance) {
                map.addWall(x, y, CardinalDirection.EAST);
            }
            if (y < height - 1 && random() < chance) {
                map.addWall(x, y, CardinalDirection.SOUTH);
            }
            if (x > 0 && random() < chance) {
                map.addWall(x, y, CardinalDirection.WEST);
            }
        }
    }
    suite.add('computeFieldOfView([15x15 with some walls])', () => {
        computeFieldOfView(map, originX, originY, 15);
    });
}
{
    const map = new FieldOfViewMap(width, height);
    const random = seedrandom.alea('abc');
    const chance = 0.07;
    for (let y = 0; y < height; y ++) {
        for (let x = 0; x < width; x ++) {
            if (random() < chance) {
                map.addBody(x, y);
            }
        }
    }
    suite.add('computeFieldOfView([15x15 with some bodies])', () => {
        computeFieldOfView(map, originX, originY, 15);
    });
}

suite.run();
