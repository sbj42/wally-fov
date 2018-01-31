import * as assert from 'assert';

import {FieldOfViewMap} from '../src/field-of-view';
import * as geom from '../src/geom';

describe('carto/field-of-view', () => {
    it('works in middle of empty field', () => {
        const fovMap = new FieldOfViewMap(7, 7);
        const fov = fovMap.getFieldOfView(3, 3, 2);
        assert.equal(fov.toString(), `(1,1)/false
☑☑☑☑☑
☑☑☑☑☑
☑☑☑☑☑
☑☑☑☑☑
☑☑☑☑☑
`);
    });
    it('works near north edge of empty field', () => {
        const fovMap = new FieldOfViewMap(7, 7);
        const fov = fovMap.getFieldOfView(3, 1, 2);
        assert.equal(fov.toString(), `(1,-1)/false
☐☐☐☐☐
☑☑☑☑☑
☑☑☑☑☑
☑☑☑☑☑
☑☑☑☑☑
`);
    });
    it('works near west edge of empty field', () => {
        const fovMap = new FieldOfViewMap(7, 7);
        const fov = fovMap.getFieldOfView(1, 3, 2);
        assert.equal(fov.toString(), `(-1,1)/false
☐☑☑☑☑
☐☑☑☑☑
☐☑☑☑☑
☐☑☑☑☑
☐☑☑☑☑
`);
    });
    it('works near corner of empty field', () => {
        const fovMap = new FieldOfViewMap(7, 7);
        const fov = fovMap.getFieldOfView(5, 5, 2);
        assert.equal(fov.toString(), `(3,3)/false
☑☑☑☑☐
☑☑☑☑☐
☑☑☑☑☐
☑☑☑☑☐
☐☐☐☐☐
`);
    });
    it('works in middle of a field that\'s too small', () => {
        const fovMap = new FieldOfViewMap(3, 3);
        const fov = fovMap.getFieldOfView(1, 1, 2);
        assert.equal(fov.toString(), `(-1,-1)/false
☐☐☐☐☐
☐☑☑☑☐
☐☑☑☑☐
☐☑☑☑☐
☐☐☐☐☐
`);
    });
    it('works for a simple square walled-off room', () => {
        const fovMap = new FieldOfViewMap(7, 7);
        fovMap.addWall(2, 2, geom.Direction.NORTH);
        fovMap.addWall(3, 2, geom.Direction.NORTH);
        fovMap.addWall(4, 2, geom.Direction.NORTH);
        fovMap.addWall(2, 2, geom.Direction.WEST);
        fovMap.addWall(2, 3, geom.Direction.WEST);
        fovMap.addWall(2, 4, geom.Direction.WEST);
        fovMap.addWall(4, 2, geom.Direction.EAST);
        fovMap.addWall(4, 3, geom.Direction.EAST);
        fovMap.addWall(4, 4, geom.Direction.EAST);
        fovMap.addWall(2, 4, geom.Direction.SOUTH);
        fovMap.addWall(3, 4, geom.Direction.SOUTH);
        fovMap.addWall(4, 4, geom.Direction.SOUTH);
        const fov = fovMap.getFieldOfView(3, 3, 2);
        assert.equal(fov.toString(), `(1,1)/false
☐☐☐☐☐
☐☑☑☑☐
☐☑☑☑☐
☐☑☑☑☐
☐☐☐☐☐
`);
    });
    it('works for a simple square blocked-in room', () => {
        const fovMap = new FieldOfViewMap(7, 7);
        fovMap.addBody(2, 2);
        fovMap.addBody(3, 2);
        fovMap.addBody(4, 2);
        fovMap.addBody(2, 3);
        fovMap.addBody(4, 3);
        fovMap.addBody(2, 4);
        fovMap.addBody(3, 4);
        fovMap.addBody(4, 4);
        const fov = fovMap.getFieldOfView(3, 3, 2);
        assert.equal(fov.toString(), `(1,1)/false
☐☐☐☐☐
☐☑☑☑☐
☐☑☑☑☐
☐☑☑☑☐
☐☐☐☐☐
`);
    });
    it('works for someone standing in gaps in a wall', () => {
        const fovMap = new FieldOfViewMap(7, 7);
        fovMap.addWall(2, 2, geom.Direction.NORTH);
        fovMap.addWall(4, 2, geom.Direction.NORTH);
        fovMap.addWall(2, 2, geom.Direction.WEST);
        fovMap.addWall(2, 4, geom.Direction.WEST);
        fovMap.addWall(4, 2, geom.Direction.EAST);
        fovMap.addWall(4, 4, geom.Direction.EAST);
        fovMap.addWall(2, 4, geom.Direction.SOUTH);
        fovMap.addWall(4, 4, geom.Direction.SOUTH);
        fovMap.addBody(3, 2);
        fovMap.addBody(2, 3);
        fovMap.addBody(4, 3);
        fovMap.addBody(3, 4);
        const fov = fovMap.getFieldOfView(3, 3, 2);
        assert.equal(fov.toString(), `(1,1)/false
☐☐☐☐☐
☐☑☑☑☐
☐☑☑☑☐
☐☑☑☑☐
☐☐☐☐☐
`);
    });
    it('works for gaps between bodies', () => {
        const fovMap = new FieldOfViewMap(7, 7);
        fovMap.addBody(3, 2);
        fovMap.addBody(2, 3);
        fovMap.addBody(4, 3);
        fovMap.addBody(3, 4);
        const fov = fovMap.getFieldOfView(3, 3, 3);
        assert.equal(fov.toString(), `(0,0)/false
☑☑☐☐☐☑☑
☑☑☑☐☑☑☑
☐☑☑☑☑☑☐
☐☐☑☑☑☐☐
☐☑☑☑☑☑☐
☑☑☑☐☑☑☑
☑☑☐☐☐☑☑
`);
    });
    it('works for gaps in walls', () => {
        const fovMap = new FieldOfViewMap(7, 7);
        fovMap.addWall(2, 2, geom.Direction.NORTH);
        fovMap.addWall(4, 2, geom.Direction.NORTH);
        fovMap.addWall(2, 2, geom.Direction.WEST);
        fovMap.addWall(2, 4, geom.Direction.WEST);
        fovMap.addWall(4, 2, geom.Direction.EAST);
        fovMap.addWall(4, 4, geom.Direction.EAST);
        fovMap.addWall(2, 4, geom.Direction.SOUTH);
        fovMap.addWall(4, 4, geom.Direction.SOUTH);
        const fov = fovMap.getFieldOfView(3, 3, 3);
        assert.equal(fov.toString(), `(0,0)/false
☐☐☑☑☑☐☐
☐☐☑☑☑☐☐
☑☑☑☑☑☑☑
☑☑☑☑☑☑☑
☑☑☑☑☑☑☑
☐☐☑☑☑☐☐
☐☐☑☑☑☐☐
`);
    });
    it('works when a body cuts two wedges', () => {
        const fovMap = new FieldOfViewMap(2, 8);
        fovMap.addWall(0, 3, geom.Direction.EAST);
        fovMap.addWall(0, 6, geom.Direction.EAST);
        fovMap.addWall(0, 7, geom.Direction.EAST);
        fovMap.addBody(1, 6);
        // O=origin, X=body, #=wall, Y=should be occluded
        // +---+---+
        // | O |   |
        // +---+---+
        // |   |   |
        // +---+---+
        // |   |   |
        // +---+---+
        // |   #   | <- this wall causes two wedges to hit X
        // +---+---+
        // |   |   |
        // +---+---+
        // |   |   |
        // +---+---+
        // |   # X | <- to pass test, X must cut into both wedges
        // +---+---+
        // |   # Y | <- ensuring that Y is not visible
        // +---+---+
        const fov = fovMap.getFieldOfView(0, 0, 7);
        assert.equal(fov.get(1, 7), false);
    });
    it('works when two separate walls arrive at the same angle', () => {
        const fovMap = new FieldOfViewMap(6, 3);
        fovMap.addWall(2, 0, geom.Direction.SOUTH);
        fovMap.addWall(4, 2, geom.Direction.EAST);
        // O=origin, #=wall, Y=should be occluded
        // +---+---+---+---+---+---+
        // | O |   |   |   |   |   |
        // +---+---+###+---+---+---+
        // |   |   |   |   |   |   |
        // +---+---+---+---+---+---+
        // |   |   |   |   |   # Y | <- Y should be entirely occluded by the two walls
        // +---+---+---+---+---+---+
        const fov = fovMap.getFieldOfView(0, 0, 5);
        assert.equal(fov.get(5, 2), false);
    });
    it('works for a tile blocked entirely by its near walls', () => {
        const fovMap = new FieldOfViewMap(3, 3);
        fovMap.addWall(2, 1, geom.Direction.SOUTH);
        fovMap.addWall(1, 2, geom.Direction.EAST);
        // O=origin, #=wall, Y=should be occluded
        // +---+---+
        // | O |   |
        // +---+###+
        // |   # Y | <- Y should be entirely occluded by the two walls
        // +---+---+
        const fov = fovMap.getFieldOfView(1, 1, 1);
        assert.equal(fov.get(2, 2), false);
    });
    it('works for a tile blocked entirely by its near walls, with bodies', () => {
        const fovMap = new FieldOfViewMap(3, 3);
        fovMap.addBody(2, 1);
        fovMap.addBody(1, 2);
        fovMap.addWall(2, 1, geom.Direction.SOUTH);
        fovMap.addWall(1, 2, geom.Direction.EAST);
        // O=origin, X=body, #=wall, Y=should be occluded by body and walls
        // +---+---+
        // | O | X |
        // +---+###+
        // | X # Y | <- Y should be entirely occluded by the two walls
        // +---+---+
        const fov = fovMap.getFieldOfView(1, 1, 1);
        assert.equal(fov.get(2, 2), false);
    });
    it('gets example 1 right', () => {
        const fovMap = new FieldOfViewMap(11, 11);
        fovMap.addBody(3, 3);
        fovMap.addBody(5, 3);
        fovMap.addBody(6, 5);
        fovMap.addBody(3, 6);
        fovMap.addBody(4, 8);
        const fov = fovMap.getFieldOfView(5, 5, 5);
        assert.equal(fov.toString(), `(0,0)/false
☐☐☑☑☑☐☑☑☑☑☑
☐☐☑☑☑☐☑☑☑☑☑
☑☑☐☑☑☐☑☑☑☑☐
☑☑☑☑☑☑☑☑☑☐☐
☑☑☑☑☑☑☑☑☐☐☐
☑☑☑☑☑☑☑☐☐☐☐
☑☑☑☑☑☑☑☑☐☐☐
☐☐☑☑☑☑☑☑☑☐☐
☐☑☑☑☑☑☑☑☑☑☐
☑☑☑☑☑☑☑☑☑☑☑
☑☑☑☐☑☑☑☑☑☑☑
`);
    });
    it('gets example 2 right', () => {
        const fovMap = new FieldOfViewMap(11, 11);
        fovMap.addBody(4, 3);
        fovMap.addBody(3, 4);
        fovMap.addBody(8, 5);
        fovMap.addBody(7, 6);
        fovMap.addBody(2, 7);
        fovMap.addBody(3, 7);
        fovMap.addBody(4, 7);
        fovMap.addBody(6, 7);
        fovMap.addBody(7, 7);
        const fov = fovMap.getFieldOfView(5, 5, 5);
        assert.equal(fov.toString(), `(0,0)/false
☑☑☐☐☑☑☑☑☑☑☑
☑☑☑☐☑☑☑☑☑☑☑
☐☑☑☑☑☑☑☑☑☑☑
☐☐☑☑☑☑☑☑☑☑☑
☑☑☑☑☑☑☑☑☑☑☑
☑☑☑☑☑☑☑☑☑☐☐
☑☑☑☑☑☑☑☑☑☑☑
☑☑☑☑☑☑☑☑☐☐☐
☐☐☐☐☑☑☑☐☐☐☐
☐☐☐☐☑☑☑☐☐☐☐
☐☐☐☐☑☑☑☐☐☐☐
`);
    });
    it('gets example 3 right', () => {
        const fovMap = new FieldOfViewMap(11, 11);
        fovMap.addWall(2, 0, geom.Direction.EAST);
        fovMap.addWall(2, 1, geom.Direction.EAST);
        fovMap.addWall(2, 2, geom.Direction.EAST);
        fovMap.addWall(2, 3, geom.Direction.EAST);
        fovMap.addWall(5, 1, geom.Direction.SOUTH);
        fovMap.addWall(6, 3, geom.Direction.NORTH);
        fovMap.addWall(7, 3, geom.Direction.NORTH);
        fovMap.addWall(4, 4, geom.Direction.WEST);
        fovMap.addWall(5, 5, geom.Direction.EAST);
        fovMap.addWall(3, 6, geom.Direction.NORTH);
        fovMap.addWall(3, 6, geom.Direction.EAST);
        fovMap.addWall(4, 8, geom.Direction.WEST);
        fovMap.addWall(4, 8, geom.Direction.SOUTH);
        const fov = fovMap.getFieldOfView(5, 5, 5);
        assert.equal(fov.toString(), `(0,0)/false
☐☐☐☑☑☐☑☐☐☐☐
☐☐☐☑☑☐☑☐☐☐☐
☐☐☐☑☑☑☑☐☐☐☐
☑☐☐☑☑☑☑☑☐☐☐
☑☑☑☑☑☑☑☐☐☐☐
☑☑☑☑☑☑☐☐☐☐☐
☑☑☑☐☑☑☑☐☐☐☐
☐☐☐☑☑☑☑☑☐☐☐
☐☐☑☑☑☑☑☑☑☐☐
☐☑☑☑☑☑☑☑☑☑☐
☑☑☑☐☑☑☑☑☑☑☑
`);
    });
    it('gets example 4 right', () => {
        const fovMap = new FieldOfViewMap(11, 11);
        fovMap.addWall(2, 2, geom.Direction.EAST);
        fovMap.addWall(7, 3, geom.Direction.WEST);
        fovMap.addWall(6, 4, geom.Direction.EAST);
        fovMap.addWall(6, 6, geom.Direction.EAST);
        fovMap.addWall(4, 6, geom.Direction.WEST);
        fovMap.addBody(4, 3);
        fovMap.addBody(3, 4);
        fovMap.addBody(6, 3);
        fovMap.addBody(3, 7);
        fovMap.addBody(6, 7);
        const fov = fovMap.getFieldOfView(5, 5, 5);
        assert.equal(fov.toString(), `(0,0)/false
☑☐☐☐☑☑☑☐☐☐☐
☑☑☐☐☑☑☑☐☐☐☐
☐☑☑☑☑☑☑☐☐☐☐
☐☐☑☑☑☑☑☐☐☐☑
☑☑☑☑☑☑☑☑☑☑☑
☑☑☑☑☑☑☑☑☑☑☑
☑☑☑☑☑☑☑☑☑☑☑
☑☐☐☑☑☑☑☑☐☐☑
☐☐☐☑☑☑☑☑☑☐☐
☐☐☑☑☑☑☑☐☑☑☐
☐☐☑☑☑☑☑☐☐☑☑
`);
    });
    it('works with offset out of bounds', () => {
        const fovMap = new FieldOfViewMap(7, 7);
        const fov = fovMap.getFieldOfView(10, 10, 2);
        assert.equal(fov.toString(), `(8,8)/false
☑☑☑☐☐
☑☑☑☐☐
☑☑☑☐☐
☐☐☐☐☐
☐☐☐☐☐
`);
    });
    it('works with negative offsets', () => {
        const fovMap = new FieldOfViewMap(7, 7);
        const fov = fovMap.getFieldOfView(-2, -2, 2);
        assert.equal(fov.toString(), `(-4,-4)/false
☐☐☐☐☐
☐☐☐☐☐
☐☐☑☑☑
☐☐☑☑☑
☐☐☑☑☑
`);
    });
});
