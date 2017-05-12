"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var geom = require(".");
var LOCAL_OFF = new geom.Offset();
var Rectangle = (function () {
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
//# sourceMappingURL=rectangle.js.map