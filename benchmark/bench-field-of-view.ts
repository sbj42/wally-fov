import * as Benchmark from 'benchmark';
import * as seedrandom from 'seedrandom';

import {FieldOfViewMap, Direction} from '../src';

// tslint:disable:no-console

const suite = new Benchmark.Suite();
suite.on('cycle', (event: any) => {
    console.log(`field-of-view/${event.target}`);
});
const width = 31;
const height = 31;
const originX = 15;
const originY = 15;
{
    const fovMap = new FieldOfViewMap(width, height);
    suite.add('FieldOfViewMap#getFieldOfView([15x15 empty field])', () => {
        fovMap.getFieldOfView(originX, originY, 15);
    });
}
{
    const fovMap = new FieldOfViewMap(width, height);
    const random = seedrandom.alea('abc');
    const chance = 0.03;
    for (let y = 0; y < height; y ++) {
        for (let x = 0; x < width; x ++) {
            if (y > 0 && random() < chance) {
                fovMap.addWall(x, y, Direction.NORTH);
            }
            if (x < width - 1 && random() < chance) {
                fovMap.addWall(x, y, Direction.EAST);
            }
            if (y < height - 1 && random() < chance) {
                fovMap.addWall(x, y, Direction.SOUTH);
            }
            if (x > 0 && random() < chance) {
                fovMap.addWall(x, y, Direction.WEST);
            }
        }
    }
    suite.add('FieldOfViewMap#getFieldOfView([15x15 with some walls])', () => {
        fovMap.getFieldOfView(originX, originY, 15);
    });
}
{
    const fovMap = new FieldOfViewMap(width, height);
    const random = seedrandom.alea('abc');
    const chance = 0.07;
    for (let y = 0; y < height; y ++) {
        for (let x = 0; x < width; x ++) {
            if (random() < chance) {
                fovMap.addBody(x, y);
            }
        }
    }
    suite.add('FieldOfViewMap#getFieldOfView([15x15 with some bodies])', () => {
        fovMap.getFieldOfView(originX, originY, 15);
    });
}

suite.run();
