import * as WallyFOV from '../src';
import * as geom from 'tiled-geometry';

function checkFov(fov: WallyFOV.FieldOfView, str: string) {
    expect('\n' + fov.toString()).toBe(str);
}

describe('field-of-view', () => {
    it('works in middle of empty field', () => {
        const map = new WallyFOV.FieldOfViewMap(7, 7);
        const fov = WallyFOV.computeFieldOfView(map, 3, 3, 2);
        checkFov(fov, `
-----
-----
--@--
-----
-----
`);
    });
    it('works near north edge of empty field', () => {
        const map = new WallyFOV.FieldOfViewMap(7, 7);
        const fov = WallyFOV.computeFieldOfView(map, 3, 1, 2);
        checkFov(fov, `
.....
-----
--@--
-----
-----
`);
    });
    it('works near west edge of empty field', () => {
        const map = new WallyFOV.FieldOfViewMap(7, 7);
        const fov = WallyFOV.computeFieldOfView(map, 1, 3, 2);
        checkFov(fov, `
.----
.----
.-@--
.----
.----
`);
    });
    it('works near corner of empty field', () => {
        const map = new WallyFOV.FieldOfViewMap(7, 7);
        const fov = WallyFOV.computeFieldOfView(map, 5, 5, 2);
        checkFov(fov, `
----.
----.
--@-.
----.
.....
`);
    });
    it('works in middle of a field that\'s too small', () => {
        const map = new WallyFOV.FieldOfViewMap(3, 3);
        const fov = WallyFOV.computeFieldOfView(map, 1, 1, 2);
        checkFov(fov, `
.....
.---.
.-@-.
.---.
.....
`);
    });
    it('works for a simple square walled-off room', () => {
        const map = new WallyFOV.FieldOfViewMap(7, 7);
        map.addWall(2, 2, geom.CardinalDirection.NORTH);
        map.addWall(3, 2, geom.CardinalDirection.NORTH);
        map.addWall(4, 2, geom.CardinalDirection.NORTH);
        map.addWall(2, 2, geom.CardinalDirection.WEST);
        map.addWall(2, 3, geom.CardinalDirection.WEST);
        map.addWall(2, 4, geom.CardinalDirection.WEST);
        map.addWall(4, 2, geom.CardinalDirection.EAST);
        map.addWall(4, 3, geom.CardinalDirection.EAST);
        map.addWall(4, 4, geom.CardinalDirection.EAST);
        map.addWall(2, 4, geom.CardinalDirection.SOUTH);
        map.addWall(3, 4, geom.CardinalDirection.SOUTH);
        map.addWall(4, 4, geom.CardinalDirection.SOUTH);
        const fov = WallyFOV.computeFieldOfView(map, 3, 3, 2);
        checkFov(fov, `
.....
.---.
.-@-.
.---.
.....
`);
    });
    it('works for a simple square blocked-in room', () => {
        const map = new WallyFOV.FieldOfViewMap(7, 7);
        map.addBody(2, 2);
        map.addBody(3, 2);
        map.addBody(4, 2);
        map.addBody(2, 3);
        map.addBody(4, 3);
        map.addBody(2, 4);
        map.addBody(3, 4);
        map.addBody(4, 4);
        const fov = WallyFOV.computeFieldOfView(map, 3, 3, 2);
        checkFov(fov, `
.....
.---.
.-@-.
.---.
.....
`);
    });
    it('works for someone standing in gaps in a wall', () => {
        const map = new WallyFOV.FieldOfViewMap(7, 7);
        map.addWall(2, 2, geom.CardinalDirection.NORTH);
        map.addWall(4, 2, geom.CardinalDirection.NORTH);
        map.addWall(2, 2, geom.CardinalDirection.WEST);
        map.addWall(2, 4, geom.CardinalDirection.WEST);
        map.addWall(4, 2, geom.CardinalDirection.EAST);
        map.addWall(4, 4, geom.CardinalDirection.EAST);
        map.addWall(2, 4, geom.CardinalDirection.SOUTH);
        map.addWall(4, 4, geom.CardinalDirection.SOUTH);
        map.addBody(3, 2);
        map.addBody(2, 3);
        map.addBody(4, 3);
        map.addBody(3, 4);
        const fov = WallyFOV.computeFieldOfView(map, 3, 3, 2);
        checkFov(fov, `
.....
.---.
.-@-.
.---.
.....
`);
    });
    it('works for gaps between bodies', () => {
        const map = new WallyFOV.FieldOfViewMap(7, 7);
        map.addBody(3, 2);
        map.addBody(2, 3);
        map.addBody(4, 3);
        map.addBody(3, 4);
        const fov = WallyFOV.computeFieldOfView(map, 3, 3, 3);
        checkFov(fov, `
--...--
---.---
.-----.
..-@-..
.-----.
---.---
--...--
`);
    });
    it('works for gaps in walls', () => {
        const map = new WallyFOV.FieldOfViewMap(7, 7);
        map.addWall(2, 2, geom.CardinalDirection.NORTH);
        map.addWall(4, 2, geom.CardinalDirection.NORTH);
        map.addWall(2, 2, geom.CardinalDirection.WEST);
        map.addWall(2, 4, geom.CardinalDirection.WEST);
        map.addWall(4, 2, geom.CardinalDirection.EAST);
        map.addWall(4, 4, geom.CardinalDirection.EAST);
        map.addWall(2, 4, geom.CardinalDirection.SOUTH);
        map.addWall(4, 4, geom.CardinalDirection.SOUTH);
        const fov = WallyFOV.computeFieldOfView(map, 3, 3, 3);
        checkFov(fov, `
..---..
..---..
-------
---@---
-------
..---..
..---..
`);
    });
    it('works when a body cuts two wedges', () => {
        const map = new WallyFOV.FieldOfViewMap(2, 8);
        map.addWall(0, 3, geom.CardinalDirection.EAST);
        map.addWall(0, 6, geom.CardinalDirection.EAST);
        map.addWall(0, 7, geom.CardinalDirection.EAST);
        map.addBody(1, 6);
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
        const fov = WallyFOV.computeFieldOfView(map, 0, 0, 7);
        expect(fov.getVisible(1, 7)).toBe(false);
    });
    it('works when two separate walls arrive at the same angle', () => {
        const map = new WallyFOV.FieldOfViewMap(6, 3);
        map.addWall(2, 0, geom.CardinalDirection.SOUTH);
        map.addWall(4, 2, geom.CardinalDirection.EAST);
        // O=origin, #=wall, Y=should be occluded
        // +---+---+---+---+---+---+
        // | O |   |   |   |   |   |
        // +---+---+###+---+---+---+
        // |   |   |   |   |   |   |
        // +---+---+---+---+---+---+
        // |   |   |   |   |   # Y | <- Y should be entirely occluded by the two walls
        // +---+---+---+---+---+---+
        const fov = WallyFOV.computeFieldOfView(map, 0, 0, 5);
        expect(fov.getVisible(5, 2)).toBe(false);
    });
    it('works for a tile blocked entirely by its near walls', () => {
        const map = new WallyFOV.FieldOfViewMap(3, 3);
        map.addWall(2, 1, geom.CardinalDirection.SOUTH);
        map.addWall(1, 2, geom.CardinalDirection.EAST);
        // O=origin, #=wall, Y=should be occluded
        // +---+---+
        // | O |   |
        // +---+###+
        // |   # Y | <- Y should be entirely occluded by the two walls
        // +---+---+
        const fov = WallyFOV.computeFieldOfView(map, 1, 1, 1);
        expect(fov.getVisible(2, 2)).toBe(false);
    });
    it('works for a tile blocked entirely by its near walls, with bodies', () => {
        const map = new WallyFOV.FieldOfViewMap(3, 3);
        map.addBody(2, 1);
        map.addBody(1, 2);
        map.addWall(2, 1, geom.CardinalDirection.SOUTH);
        map.addWall(1, 2, geom.CardinalDirection.EAST);
        // O=origin, X=body, #=wall, Y=should be occluded by body and walls
        // +---+---+
        // | O | X |
        // +---+###+
        // | X # Y | <- Y should be entirely occluded by the two walls
        // +---+---+
        const fov = WallyFOV.computeFieldOfView(map, 1, 1, 1);
        expect(fov.getVisible(2, 2)).toBe(false);
    });
    it('gets example 1 right', () => {
        const map = new WallyFOV.FieldOfViewMap(11, 11);
        map.addBody(3, 3);
        map.addBody(5, 3);
        map.addBody(6, 5);
        map.addBody(3, 6);
        map.addBody(4, 8);
        const fov = WallyFOV.computeFieldOfView(map, 5, 5, 5);
        checkFov(fov, `
..---.-----
..---.-----
--.--.----.
---------..
--------...
-----@-....
--------...
..-------..
.---------.
-----------
---.-------
`);
    });
    it('gets example 2 right', () => {
        const map = new WallyFOV.FieldOfViewMap(11, 11);
        map.addBody(4, 3);
        map.addBody(3, 4);
        map.addBody(8, 5);
        map.addBody(7, 6);
        map.addBody(2, 7);
        map.addBody(3, 7);
        map.addBody(4, 7);
        map.addBody(6, 7);
        map.addBody(7, 7);
        const fov = WallyFOV.computeFieldOfView(map, 5, 5, 5);
        checkFov(fov, `
--..-------
---.-------
.----------
..---------
-----------
-----@---..
-----------
--------...
....---....
....---....
....---....
`);
    });
    it('gets example 3 right', () => {
        const map = new WallyFOV.FieldOfViewMap(11, 11);
        map.addWall(2, 0, geom.CardinalDirection.EAST);
        map.addWall(2, 1, geom.CardinalDirection.EAST);
        map.addWall(2, 2, geom.CardinalDirection.EAST);
        map.addWall(2, 3, geom.CardinalDirection.EAST);
        map.addWall(5, 1, geom.CardinalDirection.SOUTH);
        map.addWall(6, 3, geom.CardinalDirection.NORTH);
        map.addWall(7, 3, geom.CardinalDirection.NORTH);
        map.addWall(4, 4, geom.CardinalDirection.WEST);
        map.addWall(5, 5, geom.CardinalDirection.EAST);
        map.addWall(3, 6, geom.CardinalDirection.NORTH);
        map.addWall(3, 6, geom.CardinalDirection.EAST);
        map.addWall(4, 8, geom.CardinalDirection.WEST);
        map.addWall(4, 8, geom.CardinalDirection.SOUTH);
        const fov = WallyFOV.computeFieldOfView(map, 5, 5, 5);
        checkFov(fov, `
...--.-....
...--.-....
...----....
-..-----...
-------....
-----@.....
---.---....
...-----...
..-------..
.---------.
---.-------
`);
    });
    it('gets example 4 right', () => {
        const map = new WallyFOV.FieldOfViewMap(11, 11);
        map.addWall(2, 2, geom.CardinalDirection.EAST);
        map.addWall(7, 3, geom.CardinalDirection.WEST);
        map.addWall(6, 4, geom.CardinalDirection.EAST);
        map.addWall(6, 6, geom.CardinalDirection.EAST);
        map.addWall(4, 6, geom.CardinalDirection.WEST);
        map.addBody(4, 3);
        map.addBody(3, 4);
        map.addBody(6, 3);
        map.addBody(3, 7);
        map.addBody(6, 7);
        const fov = WallyFOV.computeFieldOfView(map, 5, 5, 5);
        checkFov(fov, `
-...---....
--..---....
.------....
..-----...-
-----------
-----@-----
-----------
-..-----..-
...------..
..-----.--.
..-----..--
`);
    });
    it('works with offset out of bounds', () => {
        const map = new WallyFOV.FieldOfViewMap(7, 7);
        const fov = WallyFOV.computeFieldOfView(map, 10, 10, 2);
        checkFov(fov, `
---..
---..
--@..
.....
.....
`);
    });
    it('works with negative offsets', () => {
        const map = new WallyFOV.FieldOfViewMap(7, 7);
        const fov = WallyFOV.computeFieldOfView(map, -2, -2, 2);
        checkFov(fov, `
.....
.....
..@--
..---
..---
`);
    });
});
