import {FieldOfViewMap} from '../src';
import * as geom from 'tiled-geometry';

describe('field-of-view-map', () => {
    it('wall manipulation works', () => {
        const fovMap = new FieldOfViewMap(7, 7);
        expect(fovMap.getWall(2, 2, geom.CardinalDirection.NORTH)).toBe(false);
        expect(fovMap.getWall(2, 1, geom.CardinalDirection.SOUTH)).toBe(false);
        expect(fovMap.getWall(3, 2, geom.CardinalDirection.SOUTH)).toBe(false);
        expect(fovMap.getWall(3, 3, geom.CardinalDirection.NORTH)).toBe(false);
        expect(fovMap.getWall(2, 4, geom.CardinalDirection.WEST)).toBe(false);
        expect(fovMap.getWall(1, 4, geom.CardinalDirection.EAST)).toBe(false);
        expect(fovMap.getWall(2, 5, geom.CardinalDirection.EAST)).toBe(false);
        expect(fovMap.getWall(3, 5, geom.CardinalDirection.WEST)).toBe(false);
        fovMap.addWall(2, 2, geom.CardinalDirection.NORTH);
        fovMap.addWall(3, 2, geom.CardinalDirection.SOUTH);
        fovMap.addWall(2, 4, geom.CardinalDirection.WEST);
        fovMap.addWall(2, 5, geom.CardinalDirection.EAST);
        expect(fovMap.getWall(2, 2, geom.CardinalDirection.NORTH)).toBe(true);
        expect(fovMap.getWall(2, 1, geom.CardinalDirection.SOUTH)).toBe(true);
        expect(fovMap.getWall(2, 1, geom.CardinalDirection.NORTH)).toBe(false);
        expect(fovMap.getWall(2, 3, geom.CardinalDirection.SOUTH)).toBe(false);
        expect(fovMap.getWall(3, 2, geom.CardinalDirection.SOUTH)).toBe(true);
        expect(fovMap.getWall(3, 3, geom.CardinalDirection.NORTH)).toBe(true);
        expect(fovMap.getWall(3, 3, geom.CardinalDirection.SOUTH)).toBe(false);
        expect(fovMap.getWall(3, 1, geom.CardinalDirection.NORTH)).toBe(false);
        expect(fovMap.getWall(2, 4, geom.CardinalDirection.WEST)).toBe(true);
        expect(fovMap.getWall(1, 4, geom.CardinalDirection.EAST)).toBe(true);
        expect(fovMap.getWall(1, 4, geom.CardinalDirection.WEST)).toBe(false);
        expect(fovMap.getWall(3, 4, geom.CardinalDirection.EAST)).toBe(false);
        expect(fovMap.getWall(2, 5, geom.CardinalDirection.EAST)).toBe(true);
        expect(fovMap.getWall(3, 5, geom.CardinalDirection.WEST)).toBe(true);
        expect(fovMap.getWall(3, 5, geom.CardinalDirection.EAST)).toBe(false);
        expect(fovMap.getWall(1, 5, geom.CardinalDirection.WEST)).toBe(false);
        fovMap.removeWall(2, 2, geom.CardinalDirection.NORTH);
        fovMap.removeWall(3, 2, geom.CardinalDirection.SOUTH);
        fovMap.removeWall(2, 4, geom.CardinalDirection.WEST);
        fovMap.removeWall(2, 5, geom.CardinalDirection.EAST);
        expect(fovMap.getWall(2, 2, geom.CardinalDirection.NORTH)).toBe(false);
        expect(fovMap.getWall(2, 1, geom.CardinalDirection.SOUTH)).toBe(false);
        expect(fovMap.getWall(3, 2, geom.CardinalDirection.SOUTH)).toBe(false);
        expect(fovMap.getWall(3, 3, geom.CardinalDirection.NORTH)).toBe(false);
        expect(fovMap.getWall(2, 4, geom.CardinalDirection.WEST)).toBe(false);
        expect(fovMap.getWall(1, 4, geom.CardinalDirection.EAST)).toBe(false);
        expect(fovMap.getWall(2, 5, geom.CardinalDirection.EAST)).toBe(false);
        expect(fovMap.getWall(3, 5, geom.CardinalDirection.WEST)).toBe(false);
    });
    it('wall manipulation works at the edge of the map', () => {
        const fovMap = new FieldOfViewMap(2, 2);
        fovMap.addWall(0, 0, geom.CardinalDirection.NORTH);
        expect(fovMap.getWall(0, 0, geom.CardinalDirection.NORTH)).toBe(true);
        fovMap.removeWall(0, 0, geom.CardinalDirection.NORTH);
        expect(fovMap.getWall(0, 0, geom.CardinalDirection.NORTH)).toBe(false);
        fovMap.addWall(0, 0, geom.CardinalDirection.WEST);
        expect(fovMap.getWall(0, 0, geom.CardinalDirection.WEST)).toBe(true);
        fovMap.removeWall(0, 0, geom.CardinalDirection.WEST);
        expect(fovMap.getWall(0, 0, geom.CardinalDirection.WEST)).toBe(false);
        fovMap.addWall(1, 1, geom.CardinalDirection.SOUTH);
        expect(fovMap.getWall(1, 1, geom.CardinalDirection.SOUTH)).toBe(true);
        fovMap.removeWall(1, 1, geom.CardinalDirection.SOUTH);
        expect(fovMap.getWall(1, 1, geom.CardinalDirection.SOUTH)).toBe(false);
        fovMap.addWall(1, 1, geom.CardinalDirection.EAST);
        expect(fovMap.getWall(1, 1, geom.CardinalDirection.EAST)).toBe(true);
        fovMap.removeWall(1, 1, geom.CardinalDirection.EAST);
        expect(fovMap.getWall(1, 1, geom.CardinalDirection.EAST)).toBe(false);
    });
    it('body manipulation works', () => {
        const fovMap = new FieldOfViewMap(7, 7);
        expect(fovMap.getBody(0, 0)).toBe(false);
        expect(fovMap.getBody(1, 0)).toBe(false);
        expect(fovMap.getBody(0, 1)).toBe(false);
        expect(fovMap.getBody(1, 1)).toBe(false);
        fovMap.addBody(0, 0);
        fovMap.addBody(0, 1);
        expect(fovMap.getBody(0, 0)).toBe(true);
        expect(fovMap.getBody(1, 0)).toBe(false);
        expect(fovMap.getBody(0, 1)).toBe(true);
        expect(fovMap.getBody(1, 1)).toBe(false);
        expect(fovMap.getBody(5, 5)).toBe(false);
        expect(fovMap.getBody(6, 6)).toBe(false);
        fovMap.addBody(1, 0);
        fovMap.addBody(1, 1);
        fovMap.removeBody(0, 0);
        fovMap.removeBody(0, 1);
        fovMap.addBody(5, 5);
        fovMap.addBody(6, 6);
        expect(fovMap.getBody(0, 0)).toBe(false);
        expect(fovMap.getBody(1, 0)).toBe(true);
        expect(fovMap.getBody(0, 1)).toBe(false);
        expect(fovMap.getBody(1, 1)).toBe(true);
        expect(fovMap.getBody(5, 5)).toBe(true);
        expect(fovMap.getBody(6, 6)).toBe(true);
        fovMap.removeBody(5, 5);
        fovMap.removeBody(6, 6);
        expect(fovMap.getBody(5, 5)).toBe(false);
        expect(fovMap.getBody(6, 6)).toBe(false);
    });
});
