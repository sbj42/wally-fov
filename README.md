# WallyFOV

#### Shadow-casting field-of-view algorithm with support for walls

## Installation

~~~
npm install wally-fov
~~~

## Usage

Create a map:
~~~js
const WallyFOV = require('./build');

const width = 5;
const height = 5;
const fovMap = new WallyFOV.FieldOfViewMap(width, height);
~~~

Add some walls and bodies:
~~~js
fovMap.addWall(1, 1, WallyFOV.Direction.NORTH);
fovMap.addWall(1, 1, WallyFOV.Direction.WEST);
fovMap.addWall(2, 0, WallyFOV.Direction.SOUTH);
fovMap.addBody(2, 3);
fovMap.addBody(0, 4);
fovMap.addWall(2, 2, WallyFOV.Direction.EAST);
// keep the map up-to-date if a wall or body is removed:
fovMap.removeWall(1, 1, WallyFOV.Direction.NORTH);
fovMap.removeBody(0, 4);
~~~

Compute the field of view:
~~~js
const playerX = 2;
const playerY = 2;
const visionRadius = 2;
const fov = fovMap.getFieldOfView(playerX, playerY, visionRadius);
~~~

See which tiles are visible:
~~~js
fov.get(4, 0); // -> true
fov.get(4, 1); // -> false
~~~