"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var X_FROM_CARDINAL_DIRECTION = [0, 1, 0, -1];
var Y_FROM_CARDINAL_DIRECTION = [-1, 0, 1, 0];
var Offset = (function () {
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
//# sourceMappingURL=offset.js.map