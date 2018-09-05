var WallyFov =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/bin/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/field-of-view.ts":
/*!******************************!*\
  !*** ./src/field-of-view.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var geom = __webpack_require__(/*! ./geom */ "./src/geom/index.ts");
// tslint:disable:no-bitwise
/**
 * These flags determine whether a given tile has walls in any of the cardinal
 * directions, and whether there is a "body" in the tile.
 */
var TileFlag;
(function (TileFlag) {
    TileFlag[TileFlag["WALL_NORTH"] = 1] = "WALL_NORTH";
    TileFlag[TileFlag["WALL_EAST"] = 2] = "WALL_EAST";
    TileFlag[TileFlag["WALL_WEST"] = 8] = "WALL_WEST";
    TileFlag[TileFlag["WALL_SOUTH"] = 4] = "WALL_SOUTH";
    TileFlag[TileFlag["BODY"] = 1 << geom.DIRECTIONS.length] = "BODY";
})(TileFlag || (TileFlag = {}));
/**
 * In the shadowcasting algorithm, each shadow is represented by a "wedge",
 * running from a "low" angle to a "high" angle.  The wedges are all stored in
 * a simple number array, with two numbers for each wedge.  These constants
 * (WEDGE_LOW and WEDGE_HIGH) help to identify which number is which.
 * WEDGE_COUNT is just how many numbers per wedge.
 */
var WEDGE_LOW = 0;
var WEDGE_HIGH = 1;
var WEDGE_COUNT = 2;
/**
 * Bodies in this algorithm do not entirely fill their tiles.  This is
 * implemented by adjusting the angles of the shadows the bodies cast,
 * making the wedge very slightly narrower.  BODY_EPSILON represents the
 * amount of reduction on either side of the wedge.
 */
var BODY_EPSILON = 0.00001;
/**
 * Walls do fill the entire tile edge.  With infinite precision, there would be
 * no need to adjust the shadow cast by a wall.  But we're using floating point
 * math here, which means imprecision can creep in and cause angles not to line
 * up properly.  To fix that, we widen the wedges of the shadows cast by walls.
 * We must make sure not to widen them as much as we narrow the body shadows,
 * or else they might close the gap we want between a body and a wall.
 */
var WALL_EPSILON = BODY_EPSILON / 10;
/**
 * We avoid heap allocations during the core part of the algorithm by using this
 * preallocated offset object.
 */
var LOCAL_OFF = new geom.Offset();
/**
 * The FieldOFViewMap represents the map over which the field of view will be
 * computed.  It starts out empty.  You can add walls and bodies to it, and then
 * use getFieldOfView() to compute the field of view from a given point.
 */
var FieldOfViewMap = /** @class */ (function () {
    function FieldOfViewMap(width, height) {
        this._size = new geom.Size();
        this._size.set(width, height);
        this._tileFlags = new Array(this._size.area).fill(0);
    }
    FieldOfViewMap.prototype._addFlag = function (off, flag) {
        var index = this._size.index(off);
        this._tileFlags[index] |= flag;
    };
    FieldOfViewMap.prototype._removeFlag = function (off, flag) {
        var index = this._size.index(off);
        this._tileFlags[index] &= ~flag;
    };
    // setup and maintenance
    /**
     * Adds a wall at a particular edge.  This automatically adds the
     * corresponding wall on the other side.
     */
    FieldOfViewMap.prototype.addWall = function (x, y, dir) {
        LOCAL_OFF.set(x, y);
        if (this._size.containsOffset(LOCAL_OFF)) {
            this._addFlag(LOCAL_OFF, 1 << dir);
            LOCAL_OFF.addCardinalDirection(dir);
            if (this._size.containsOffset(LOCAL_OFF)) {
                this._addFlag(LOCAL_OFF, 1 << geom.directionOpposite(dir));
            }
        }
    };
    /**
     * Removes a wall at a particular edge.  This automatically removes the
     * corresponding wall on the other side.
     */
    FieldOfViewMap.prototype.removeWall = function (x, y, dir) {
        LOCAL_OFF.set(x, y);
        if (this._size.containsOffset(LOCAL_OFF)) {
            this._removeFlag(LOCAL_OFF, 1 << dir);
            LOCAL_OFF.addCardinalDirection(dir);
            if (this._size.containsOffset(LOCAL_OFF)) {
                this._removeFlag(LOCAL_OFF, 1 << geom.directionOpposite(dir));
            }
        }
    };
    FieldOfViewMap.prototype.getWalls = function (x, y) {
        LOCAL_OFF.set(x, y);
        var index = this._size.index(LOCAL_OFF);
        return this._tileFlags[index] & geom.DirectionFlags.ALL;
    };
    FieldOfViewMap.prototype.getWall = function (x, y, dir) {
        return (this.getWalls(x, y) & (1 << dir)) !== 0;
    };
    FieldOfViewMap.prototype.addBody = function (x, y) {
        LOCAL_OFF.set(x, y);
        this._addFlag(LOCAL_OFF, TileFlag.BODY);
    };
    FieldOfViewMap.prototype.removeBody = function (x, y) {
        LOCAL_OFF.set(x, y);
        this._removeFlag(LOCAL_OFF, TileFlag.BODY);
    };
    FieldOfViewMap.prototype.getBody = function (x, y) {
        LOCAL_OFF.set(x, y);
        var index = this._size.index(LOCAL_OFF);
        return (this._tileFlags[index] & TileFlag.BODY) !== 0;
    };
    // execution
    /**
     * Compute the field of view for a camera at the given tile.
     * chebyshevRadius is the vision radius.  It uses chebyshev distance
     * (https://en.wikipedia.org/wiki/Chebyshev_distance), which just means
     * that the limit of vision in a large empty field will be square.
     *
     * This returns a MaskRect, which indicates which tiles are visible.
     * maskRect.get(x, y) will return true for visible tiles.
     */
    FieldOfViewMap.prototype.getFieldOfView = function (x, y, chebyshevRadius) {
        var origin = new geom.Offset(x, y);
        var boundRect = new geom.Rectangle(origin.x - chebyshevRadius, origin.y - chebyshevRadius, chebyshevRadius * 2 + 1, chebyshevRadius * 2 + 1);
        var mask = new geom.MaskRect(boundRect);
        // the player can always see itself
        mask.set(origin, true);
        // the field is divided into quadrants
        this._quadrant(mask, origin, chebyshevRadius, -1, -1);
        this._quadrant(mask, origin, chebyshevRadius, 1, -1);
        this._quadrant(mask, origin, chebyshevRadius, -1, 1);
        this._quadrant(mask, origin, chebyshevRadius, 1, 1);
        return mask;
    };
    FieldOfViewMap.prototype._quadrant = function (mask, origin, chebyshevRadius, xDir, yDir) {
        var startX = origin.x, startY = origin.y;
        var endDX = (Math.min(Math.max(startX + xDir * (chebyshevRadius + 1), -1), this._size.width) - startX) * xDir;
        var endDY = (Math.min(Math.max(startY + yDir * (chebyshevRadius + 1), -1), this._size.height) - startY) * yDir;
        if (endDX < 0 || endDY < 0) {
            // the origin is outside of the map
            return;
        }
        var farYFlag = yDir === 1 ? TileFlag.WALL_SOUTH : TileFlag.WALL_NORTH;
        var farXFlag = xDir === 1 ? TileFlag.WALL_EAST : TileFlag.WALL_WEST;
        var startMapIndex = this._size.index(origin);
        var startMaskIndex = mask.index(origin);
        // Initial wedge is from slope zero to slope infinity (i.e. the whole quadrant)
        var wedges = [0, Number.POSITIVE_INFINITY];
        // X += Y must be written as X = X + Y, in order not to trigger deoptimization due to
        // http://stackoverflow.com/questions/34595356/what-does-compound-let-const-assignment-mean
        for (var dy = 0, yMapIndex = startMapIndex, yMaskIndex = startMaskIndex; dy !== endDY && wedges.length > 0; dy++, yMapIndex = yMapIndex + yDir * this._size.width, yMaskIndex = yMaskIndex + yDir * mask.width) {
            var divYpos = 1 / (dy + 0.5);
            var divYneg = dy === 0 ? Number.POSITIVE_INFINITY : 1 / (dy - 0.5);
            var wedgeIndex = 0;
            // X += Y must be written as X = X + Y, in order not to trigger deoptimization due to
            // http://stackoverflow.com/questions/34595356/what-does-compound-let-const-assignment-mean
            for (var dx = 0, mapIndex = yMapIndex, maskIndex = yMaskIndex, slopeY = -0.5 * divYpos, slopeX = 0.5 * divYneg; dx !== endDX && wedgeIndex !== wedges.length; dx++, mapIndex = mapIndex + xDir, maskIndex = maskIndex + xDir,
                slopeY = slopeY + divYpos, slopeX = slopeX + divYneg) {
                // the slopes of the four corners of this tile
                // these are named as follows:
                //   slopeY is the slope closest to the Y axis
                //   slopeFar is the slope to the farthest corner
                //   slopeX is the slope closest to the X axis
                // this is always true:
                //   slopeY < slopeFar < slopeX
                //
                // O = origin, C = current
                // +---+---+---+
                // | O |   |   |
                // +---+---+---X
                // |   |   | C |
                // +---+---Y---F
                // the walls of this tile
                // these are named as follows:
                //   wallY is the farthest horizontal wall (slopeY to slopeFar)
                //   wallX is the farthest vertical wall (slopeFar to slopeX)
                //
                // O = origin, C = current
                // +---+---+---+
                // | O |   |   |
                // +---+---+---+
                // |   |   | C X
                // +---+---+-Y-+
                // advance the wedge index until this tile is not after the current wedge
                while (slopeY >= wedges[wedgeIndex + WEDGE_HIGH]) {
                    // X += Y must be written as X = X + Y, in order not to trigger deoptimization due to
                    // http://stackoverflow.com/questions/34595356/what-does-compound-let-const-assignment-mean
                    wedgeIndex = wedgeIndex + WEDGE_COUNT;
                    if (wedgeIndex >= wedges.length) {
                        break;
                    }
                }
                if (wedgeIndex >= wedges.length) {
                    break;
                }
                // if the current wedge is after this tile, move on
                if (slopeX <= wedges[wedgeIndex + WEDGE_LOW]) {
                    continue;
                }
                // we can see this tile
                mask.setAt(maskIndex, true);
                // const/let must be at the top of a block, in order not to trigger deoptimization due to
                // https://github.com/nodejs/node/issues/9729
                {
                    var wallY = (this._tileFlags[mapIndex] & farYFlag) !== 0;
                    var wallX = (this._tileFlags[mapIndex] & farXFlag) !== 0;
                    if (wallX && wallY) {
                        // this tile has both far walls
                        // so we can't see beyond it and the whole range should be cut out of the wedge(s)
                        wedgeIndex = cutWedge(wedges, wedgeIndex, slopeY - WALL_EPSILON, slopeX + WALL_EPSILON);
                    }
                    else {
                        var body = (dx !== 0 || dy !== 0) && (this._tileFlags[mapIndex] & TileFlag.BODY) !== 0;
                        if (body) {
                            if (wallX) {
                                wedgeIndex = cutWedge(wedges, wedgeIndex, slopeY + BODY_EPSILON, slopeX + WALL_EPSILON);
                            }
                            else if (wallY) {
                                wedgeIndex = cutWedge(wedges, wedgeIndex, slopeY - WALL_EPSILON, slopeX - BODY_EPSILON);
                            }
                            else {
                                wedgeIndex = cutWedge(wedges, wedgeIndex, slopeY + BODY_EPSILON, slopeX - BODY_EPSILON);
                            }
                        }
                        else if (wallX) {
                            var slopeFar = slopeY + divYpos;
                            wedgeIndex = cutWedge(wedges, wedgeIndex, slopeFar - WALL_EPSILON, slopeX + WALL_EPSILON);
                        }
                        else if (wallY) {
                            var slopeFar = slopeY + divYpos;
                            wedgeIndex = cutWedge(wedges, wedgeIndex, slopeY - WALL_EPSILON, slopeFar + WALL_EPSILON);
                        }
                    }
                }
            }
        }
    };
    return FieldOfViewMap;
}());
exports.FieldOfViewMap = FieldOfViewMap;
/**
 * This function cuts a range of angles out of the wedge array.
 */
function cutWedge(wedges, wedgeIndex, low, high) {
    for (;;) {
        if (wedgeIndex === wedges.length) {
            return wedgeIndex;
        }
        if (low <= wedges[wedgeIndex + WEDGE_HIGH]) {
            break;
        }
        // This next line is to cover a hypothetical edge case, where two slopes
        // are not the same, but are within the BODY_EPSILON distance.  That
        // would be due to either floating point error or due to a very large
        // field radius.  Either way I haven't been able to construct a test
        // case for it.
        wedgeIndex += WEDGE_COUNT;
    }
    if (low <= wedges[wedgeIndex + WEDGE_LOW]) {
        if (high >= wedges[wedgeIndex + WEDGE_HIGH]) {
            // wedge is entirely occluded, remove it
            wedges.splice(wedgeIndex, WEDGE_COUNT);
            // now looking at the next wedge (or past the end)
            return cutWedge(wedges, wedgeIndex, low, high);
        }
        else if (high >= wedges[wedgeIndex + WEDGE_LOW]) {
            // low part of wedge is occluded, trim it
            wedges[wedgeIndex + WEDGE_LOW] = high;
            // still looking at the same wedge
        }
        else {
            // this cut doesn't reach the current wedge
        }
    }
    else if (high >= wedges[wedgeIndex + WEDGE_HIGH]) {
        // high part of wedge is occluded, trim it
        wedges[wedgeIndex + WEDGE_HIGH] = low;
        // move on to the next wedge
        wedgeIndex += WEDGE_COUNT;
        return cutWedge(wedges, wedgeIndex, low, high);
    }
    else {
        // middle part of wedge is occluded, split it
        wedges.splice(wedgeIndex, 0, wedges[wedgeIndex + WEDGE_LOW], low);
        wedgeIndex += WEDGE_COUNT;
        wedges[wedgeIndex + WEDGE_LOW] = high;
        // now looking at the second wedge of the split
    }
    return wedgeIndex;
}


/***/ }),

/***/ "./src/geom/direction-flags.ts":
/*!*************************************!*\
  !*** ./src/geom/direction-flags.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-bitwise
var DirectionFlags;
(function (DirectionFlags) {
    DirectionFlags[DirectionFlags["NONE"] = 0] = "NONE";
    DirectionFlags[DirectionFlags["NORTH"] = 1] = "NORTH";
    DirectionFlags[DirectionFlags["EAST"] = 2] = "EAST";
    DirectionFlags[DirectionFlags["SOUTH"] = 4] = "SOUTH";
    DirectionFlags[DirectionFlags["WEST"] = 8] = "WEST";
    DirectionFlags[DirectionFlags["ALL"] = 15] = "ALL";
})(DirectionFlags = exports.DirectionFlags || (exports.DirectionFlags = {}));
function directionFlagsToString(flags) {
    var ret = '[';
    if ((flags & DirectionFlags.NORTH) !== 0) {
        ret += 'N';
    }
    if ((flags & DirectionFlags.EAST) !== 0) {
        ret += 'E';
    }
    if ((flags & DirectionFlags.SOUTH) !== 0) {
        ret += 'S';
    }
    if ((flags & DirectionFlags.WEST) !== 0) {
        ret += 'W';
    }
    return ret + ']';
}
exports.directionFlagsToString = directionFlagsToString;
// conversion
function directionFlagsFromDirection(dir) {
    return (1 << dir);
}
exports.directionFlagsFromDirection = directionFlagsFromDirection;


/***/ }),

/***/ "./src/geom/direction.ts":
/*!*******************************!*\
  !*** ./src/geom/direction.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// tslint:disable:no-bitwise
Object.defineProperty(exports, "__esModule", { value: true });
var Direction;
(function (Direction) {
    Direction[Direction["NORTH"] = 0] = "NORTH";
    Direction[Direction["EAST"] = 1] = "EAST";
    Direction[Direction["SOUTH"] = 2] = "SOUTH";
    Direction[Direction["WEST"] = 3] = "WEST";
})(Direction = exports.Direction || (exports.Direction = {}));
exports.DIRECTIONS = [
    Direction.NORTH,
    Direction.EAST,
    Direction.SOUTH,
    Direction.WEST,
];
function directionOpposite(dir) {
    return ((dir + 2) & 3);
}
exports.directionOpposite = directionOpposite;


/***/ }),

/***/ "./src/geom/index.ts":
/*!***************************!*\
  !*** ./src/geom/index.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./direction */ "./src/geom/direction.ts"));
__export(__webpack_require__(/*! ./direction-flags */ "./src/geom/direction-flags.ts"));
__export(__webpack_require__(/*! ./offset */ "./src/geom/offset.ts"));
__export(__webpack_require__(/*! ./size */ "./src/geom/size.ts"));
__export(__webpack_require__(/*! ./rectangle */ "./src/geom/rectangle.ts"));
__export(__webpack_require__(/*! ./mask */ "./src/geom/mask.ts"));
__export(__webpack_require__(/*! ./mask-rect */ "./src/geom/mask-rect.ts"));


/***/ }),

/***/ "./src/geom/mask-rect.ts":
/*!*******************************!*\
  !*** ./src/geom/mask-rect.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var geom = __webpack_require__(/*! . */ "./src/geom/index.ts");
var LOCAL_OFF = new geom.Offset();
var MaskRect = /** @class */ (function () {
    function MaskRect(rect, initialValue, outsideValue) {
        if (initialValue === void 0) { initialValue = false; }
        if (outsideValue === void 0) { outsideValue = false; }
        this._rectangle = new geom.Rectangle();
        this._rectangle.copyFrom(rect);
        this._mask = new geom.Mask(rect, initialValue);
        this._outsideValue = outsideValue;
    }
    // accessors
    MaskRect.prototype.toString = function () {
        return this._rectangle.northWest + "/" + this._outsideValue + "\n" + this._mask;
    };
    Object.defineProperty(MaskRect.prototype, "westX", {
        get: function () {
            return this._rectangle.westX;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MaskRect.prototype, "northY", {
        get: function () {
            return this._rectangle.northY;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MaskRect.prototype, "width", {
        get: function () {
            return this._rectangle.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MaskRect.prototype, "height", {
        get: function () {
            return this._rectangle.height;
        },
        enumerable: true,
        configurable: true
    });
    MaskRect.prototype.index = function (off) {
        return this._mask.index(LOCAL_OFF.copyFrom(off).subtractOffset(this._rectangle.northWest));
    };
    MaskRect.prototype.getAt = function (index) {
        return this._mask.getAt(index);
    };
    MaskRect.prototype.get = function (x, y) {
        LOCAL_OFF.set(x, y);
        if (!this._rectangle.containsOffset(LOCAL_OFF)) {
            return this._outsideValue;
        }
        return this._mask.get(LOCAL_OFF.subtractOffset(this._rectangle.northWest));
    };
    // mutators
    MaskRect.prototype.setAt = function (index, value) {
        this._mask.setAt(index, value);
        return this;
    };
    MaskRect.prototype.set = function (off, value) {
        this._mask.set(LOCAL_OFF.copyFrom(off).subtractOffset(this._rectangle.northWest), value);
        return this;
    };
    // utilities
    MaskRect.prototype.forEach = function (cursor, callback) {
        var _this = this;
        this._mask.forEach(cursor, function (off, value) {
            callback(off.addOffset(_this._rectangle.northWest), value);
        });
    };
    return MaskRect;
}());
exports.MaskRect = MaskRect;


/***/ }),

/***/ "./src/geom/mask.ts":
/*!**************************!*\
  !*** ./src/geom/mask.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var geom = __webpack_require__(/*! . */ "./src/geom/index.ts");
var Mask = /** @class */ (function () {
    // TODO consider Uint8Array for bits
    function Mask(size, initialValue) {
        if (initialValue === void 0) { initialValue = false; }
        this._size = new geom.Size();
        this._size.copyFrom(size);
        this._bits = new Array(this._size.area).fill(initialValue);
    }
    // accessors
    Mask.prototype.toString = function () {
        var ret = '';
        var off = new geom.Offset();
        for (var y = 0; y < this._size.height; y++) {
            for (var x = 0; x < this._size.width; x++) {
                off.set(x, y);
                ret += this.get(off.set(x, y)) ? '☑' : '☐';
            }
            ret += '\n';
        }
        return ret;
    };
    Object.defineProperty(Mask.prototype, "width", {
        get: function () {
            return this._size.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Mask.prototype, "height", {
        get: function () {
            return this._size.height;
        },
        enumerable: true,
        configurable: true
    });
    Mask.prototype.index = function (off) {
        return this._size.index(off);
    };
    Mask.prototype.getAt = function (index) {
        return this._bits[index];
    };
    Mask.prototype.get = function (off) {
        return this.getAt(this.index(off));
    };
    // mutators
    Mask.prototype.setAt = function (index, value) {
        this._bits[index] = value;
        return this;
    };
    Mask.prototype.set = function (off, value) {
        return this.setAt(this.index(off), value);
    };
    // utilities
    Mask.prototype.forEach = function (cursor, callback) {
        var _this = this;
        var index = 0;
        this._size.forEach(cursor, function (off) {
            callback(off, _this._bits[index]);
            index++;
        });
    };
    return Mask;
}());
exports.Mask = Mask;


/***/ }),

/***/ "./src/geom/offset.ts":
/*!****************************!*\
  !*** ./src/geom/offset.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var X_FROM_CARDINAL_DIRECTION = [0, 1, 0, -1];
var Y_FROM_CARDINAL_DIRECTION = [-1, 0, 1, 0];
var Offset = /** @class */ (function () {
    function Offset(x, y) {
        if (typeof x === 'undefined') {
            x = 0;
        }
        if (typeof y === 'undefined') {
            y = 0;
        }
        this.x = x;
        this.y = y;
    }
    Offset.prototype.toString = function () {
        return "(" + this.x + "," + this.y + ")";
    };
    // mutators
    Offset.prototype.set = function (x, y) {
        this.x = x;
        this.y = y;
        return this;
    };
    Offset.prototype.copyFrom = function (other) {
        this.x = other.x;
        this.y = other.y;
        return this;
    };
    Offset.prototype.addOffset = function (off) {
        this.x += off.x;
        this.y += off.y;
        return this;
    };
    Offset.prototype.addCardinalDirection = function (dir) {
        this.x += X_FROM_CARDINAL_DIRECTION[dir];
        this.y += Y_FROM_CARDINAL_DIRECTION[dir];
        return this;
    };
    Offset.prototype.subtractOffset = function (off) {
        this.x -= off.x;
        this.y -= off.y;
        return this;
    };
    return Offset;
}());
exports.Offset = Offset;


/***/ }),

/***/ "./src/geom/rectangle.ts":
/*!*******************************!*\
  !*** ./src/geom/rectangle.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var geom = __webpack_require__(/*! . */ "./src/geom/index.ts");
var LOCAL_OFF = new geom.Offset();
var Rectangle = /** @class */ (function () {
    function Rectangle(westX, northY, width, height) {
        if (typeof westX === 'undefined') {
            westX = 0;
        }
        if (typeof northY === 'undefined') {
            northY = 0;
        }
        if (typeof width === 'undefined') {
            width = 0;
        }
        if (typeof height === 'undefined') {
            height = 0;
        }
        this.northWest = new geom.Offset(westX, northY);
        this.size = new geom.Size(width, height);
    }
    // accessors
    Rectangle.prototype.toString = function () {
        return "(" + this.westX + "," + this.northY + " " + this.width + "x" + this.height + ")";
    };
    Object.defineProperty(Rectangle.prototype, "northY", {
        get: function () {
            return this.northWest.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "southY", {
        get: function () {
            return this.northWest.y + this.size.height - 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "westX", {
        get: function () {
            return this.northWest.x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "eastX", {
        get: function () {
            return this.northWest.x + this.size.width - 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "width", {
        get: function () {
            return this.size.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "height", {
        get: function () {
            return this.size.height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "empty", {
        get: function () {
            return this.size.empty;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "area", {
        get: function () {
            return this.size.area;
        },
        enumerable: true,
        configurable: true
    });
    // mutators
    Rectangle.prototype.copyFrom = function (other) {
        this.northWest.set(other.westX, other.northY);
        this.size.set(other.width, other.height);
        return this;
    };
    // utilities
    Rectangle.prototype.containsOffset = function (off) {
        return this.size.containsOffset(LOCAL_OFF.copyFrom(off).subtractOffset(this.northWest));
    };
    Rectangle.prototype.index = function (off) {
        return this.size.index(LOCAL_OFF.copyFrom(off).subtractOffset(this.northWest));
    };
    return Rectangle;
}());
exports.Rectangle = Rectangle;


/***/ }),

/***/ "./src/geom/size.ts":
/*!**************************!*\
  !*** ./src/geom/size.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Size = /** @class */ (function () {
    function Size(width, height) {
        if (typeof width === 'undefined') {
            width = 0;
        }
        if (typeof height === 'undefined') {
            height = 0;
        }
        this.width = width;
        this.height = height;
    }
    // accessors
    Size.prototype.toString = function () {
        return "(" + this.width + "x" + this.height + ")";
    };
    Object.defineProperty(Size.prototype, "empty", {
        get: function () {
            return this.width === 0 || this.height === 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Size.prototype, "area", {
        get: function () {
            return this.width * this.height;
        },
        enumerable: true,
        configurable: true
    });
    // mutators
    Size.prototype.set = function (width, height) {
        this.width = width;
        this.height = height;
        return this;
    };
    Size.prototype.copyFrom = function (other) {
        this.width = other.width;
        this.height = other.height;
        return this;
    };
    // utilities
    Size.prototype.containsOffset = function (off) {
        return off.x >= 0 && off.y >= 0 && off.x < this.width && off.y < this.height;
    };
    Size.prototype.index = function (off) {
        return off.y * this.width + off.x;
    };
    Size.prototype.forEach = function (cursor, callback) {
        for (var dy = 0; dy < this.height; dy++) {
            for (var dx = 0; dx < this.width; dx++) {
                cursor.x = dx;
                cursor.y = dy;
                callback(cursor);
            }
        }
    };
    return Size;
}());
exports.Size = Size;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
 *  WallyFOV
 *  github.com/sbj42/wally-fov
 *  James Clark
 *  Licensed under the MIT license.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var field_of_view_1 = __webpack_require__(/*! ./field-of-view */ "./src/field-of-view.ts");
exports.FieldOfViewMap = field_of_view_1.FieldOfViewMap;
var geom_1 = __webpack_require__(/*! ./geom */ "./src/geom/index.ts");
exports.Direction = geom_1.Direction;
exports.DirectionFlags = geom_1.DirectionFlags;
exports.MaskRect = geom_1.MaskRect;


/***/ })

/******/ });
//# sourceMappingURL=wally-fov-1.0.2.js.map