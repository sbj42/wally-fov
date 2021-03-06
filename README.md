# WallyFOV

![Dependencies](https://img.shields.io/badge/dependencies-1-green.svg)
[![Node.js CI](https://github.com/sbj42/wally-fov/workflows/Node.js%20CI/badge.svg)](https://github.com/sbj42/wally-fov/actions?query=workflow%3A%22Node.js+CI%22)
[![License](https://img.shields.io/github/license/sbj42/wally-fov.svg)](https://github.com/sbj42/wally-fov)

#### Shadow-casting field-of-view algorithm with support for walls

[See the demo](https://sbj42.github.io/wally-fov/demo/www/), and check out the successor to this algorithm: [WarpField](https://github.com/sbj42/warp-field), which supports portals.

## Installation

~~~
npm install wally-fov
~~~

## Usage

Create a map:
```js
const WallyFOV = require('wally-fov');

const width = 5;
const height = 5;
const fovMap = new WallyFOV.FieldOfViewMap(width, height);
```

Add some walls and bodies:
```js
fovMap.addWall(1, 1, WallyFOV.CardinalDirection.NORTH);
fovMap.addWall(1, 1, WallyFOV.CardinalDirection.WEST);
fovMap.addWall(2, 0, WallyFOV.CardinalDirection.SOUTH);
fovMap.addBody(2, 3);
fovMap.addBody(0, 4);
fovMap.addWall(2, 2, WallyFOV.CardinalDirection.EAST);
// keep the map up-to-date if a wall or body is removed:
fovMap.removeWall(1, 1, WallyFOV.CardinalDirection.NORTH);
fovMap.removeBody(0, 4);
```

Compute the field of view:
```js
const playerX = 2;
const playerY = 2;
const visionRadius = 2;
const fov = WallyFOV.computeFieldOfView(fovMap, playerX, playerY, visionRadius);
```

See which tiles are visible:
```js
fov.getVisible(4, 0); // -> true
fov.getVisible(4, 1); // -> false
```

## Upgrading to version 2

Some API changes were made for version 2, here's what you need to do to upgrade:

* The `Direction` enumeration has been renamed to `CardinalDirection`
* Instead of calling `fovMap.getFieldOfView(x, y, radius)`, call `WallyFOV.computeFieldOfView(fovMap, x, y, radius)`
* Instead of calling `fov.get(x, y)`, call `fov.getVisible(x, y)`

If you're using TypeScript, some of the type names have changed.  For instance, the type for the field of view is now `FieldOfView` instead of `MaskRectangle`.

## Details

WallyFOV works by scanning the four quadrants around the player, tracking the angles visible from the center of the player tile.  A tile is considered visible if there exists an uninterrupted ray from the player center to any point in the tile.  Bodies almost (but don't quite) fill the tile, to cover some conspicuous "corner" cases.

![Example Image](https://raw.githubusercontent.com/sbj42/wally-fov/master/img/example4.png)

In this example image, the shaded tiles are not seen.  Blue lines represent edges of the shadows at various stages of the algorithm.  Dashed lines indicate where a shadow edge is very slightly shifted because it was created by a body.

For more information, see the [Algorithm Overview](https://github.com/sbj42/wally-fov/wiki/Algorithm-Overview).
