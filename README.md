# WallyFOV

![Dependencies](https://img.shields.io/badge/dependencies-none-green.svg)]
[![Node.js CI](https://github.com/sbj42/wally-fov/workflows/Node.js%20CI/badge.svg)](https://github.com/sbj42/wally-fov/actions?query=workflow%3A%22Node.js+CI%22)
[![License](https://img.shields.io/github/license/sbj42/wally-fov.svg)](https://github.com/sbj42/wally-fov)

#### Shadow-casting field-of-view algorithm with support for walls

[See the demo](https://sbj42.github.io/projects/wally-fov-demo/www/), and check out the successor to this algorithm: [WarpField](https://github.com/sbj42/warp-field), which supports portals.

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
fovMap.addWall(1, 1, WallyFOV.Direction.NORTH);
fovMap.addWall(1, 1, WallyFOV.Direction.WEST);
fovMap.addWall(2, 0, WallyFOV.Direction.SOUTH);
fovMap.addBody(2, 3);
fovMap.addBody(0, 4);
fovMap.addWall(2, 2, WallyFOV.Direction.EAST);
// keep the map up-to-date if a wall or body is removed:
fovMap.removeWall(1, 1, WallyFOV.Direction.NORTH);
fovMap.removeBody(0, 4);
```

Compute the field of view:
```js
const playerX = 2;
const playerY = 2;
const visionRadius = 2;
const fov = fovMap.getFieldOfView(playerX, playerY, visionRadius);
```

See which tiles are visible:
```js
fov.get(4, 0); // -> true
fov.get(4, 1); // -> false
```

## Details

WallyFOV works by scanning the four quadrants around the player, tracking the angles visible from the center of the player tile.  A tile is considered visible if there exists an uninterrupted ray from the player center to any point in the tile.  Bodies almost (but don't quite) fill the tile, to cover some conspicuous "corner" cases.

![Example Image](https://raw.githubusercontent.com/sbj42/wally-fov/master/img/example4.png)

In this example image, the shaded tiles are not seen.  Blue lines represent edges of the shadows at various stages of the algorithm.  Dashed lines indicate where a shadow edge is very slightly shifted because it was created by a body.

For more information, see the [Algorithm Overview](https://github.com/sbj42/wally-fov/wiki/Algorithm-Overview).
