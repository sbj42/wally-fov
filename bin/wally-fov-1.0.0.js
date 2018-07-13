var WallyFov=function(t){var e={};function i(r){if(e[r])return e[r].exports;var n=e[r]={i:r,l:!1,exports:{}};return t[r].call(n.exports,n,n.exports,i),n.l=!0,n.exports}return i.m=t,i.c=e,i.d=function(t,e,r){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(i.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)i.d(r,n,function(e){return t[e]}.bind(null,n));return r},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="/bin/",i(i.s=9)}([function(t,e,i){"use strict";function r(t){for(var i in t)e.hasOwnProperty(i)||(e[i]=t[i])}Object.defineProperty(e,"__esModule",{value:!0}),r(i(7)),r(i(6)),r(i(5)),r(i(4)),r(i(3)),r(i(2)),r(i(1))},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=i(0),n=new r.Offset,o=function(){function t(t,e,i){void 0===e&&(e=!1),void 0===i&&(i=!1),this._rectangle=new r.Rectangle,this._rectangle.copyFrom(t),this._mask=new r.Mask(t,e),this._outsideValue=i}return t.prototype.toString=function(){return this._rectangle.northWest+"/"+this._outsideValue+"\n"+this._mask},Object.defineProperty(t.prototype,"westX",{get:function(){return this._rectangle.westX},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"northY",{get:function(){return this._rectangle.northY},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"width",{get:function(){return this._rectangle.width},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"height",{get:function(){return this._rectangle.height},enumerable:!0,configurable:!0}),t.prototype.index=function(t){return this._mask.index(n.copyFrom(t).subtractOffset(this._rectangle.northWest))},t.prototype.getAt=function(t){return this._mask.getAt(t)},t.prototype.get=function(t,e){return n.set(t,e),this._rectangle.containsOffset(n)?this._mask.get(n.subtractOffset(this._rectangle.northWest)):this._outsideValue},t.prototype.setAt=function(t,e){return this._mask.setAt(t,e),this},t.prototype.set=function(t,e){return this._mask.set(n.copyFrom(t).subtractOffset(this._rectangle.northWest),e),this},t.prototype.forEach=function(t,e){var i=this;this._mask.forEach(t,function(t,r){e(t.addOffset(i._rectangle.northWest),r)})},t}();e.MaskRect=o},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=i(0),n=function(){function t(t,e){void 0===e&&(e=!1),this._size=new r.Size,this._size.copyFrom(t),this._bits=new Array(this._size.area).fill(e)}return t.prototype.toString=function(){for(var t="",e=new r.Offset,i=0;i<this._size.height;i++){for(var n=0;n<this._size.width;n++)e.set(n,i),t+=this.get(e.set(n,i))?"☑":"☐";t+="\n"}return t},Object.defineProperty(t.prototype,"width",{get:function(){return this._size.width},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"height",{get:function(){return this._size.height},enumerable:!0,configurable:!0}),t.prototype.index=function(t){return this._size.index(t)},t.prototype.getAt=function(t){return this._bits[t]},t.prototype.get=function(t){return this.getAt(this.index(t))},t.prototype.setAt=function(t,e){return this._bits[t]=e,this},t.prototype.set=function(t,e){return this.setAt(this.index(t),e)},t.prototype.forEach=function(t,e){var i=this,r=0;this._size.forEach(t,function(t){e(t,i._bits[r]),r++})},t}();e.Mask=n},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=i(0),n=new r.Offset,o=function(){function t(t,e,i,n){void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0),void 0===n&&(n=0),this.northWest=new r.Offset(t,e),this.size=new r.Size(i,n)}return t.prototype.toString=function(){return"("+this.westX+","+this.northY+" "+this.width+"x"+this.height+")"},Object.defineProperty(t.prototype,"northY",{get:function(){return this.northWest.y},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"southY",{get:function(){return this.northWest.y+this.size.height-1},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"westX",{get:function(){return this.northWest.x},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"eastX",{get:function(){return this.northWest.x+this.size.width-1},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"width",{get:function(){return this.size.width},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"height",{get:function(){return this.size.height},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"empty",{get:function(){return this.size.empty},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"area",{get:function(){return this.size.area},enumerable:!0,configurable:!0}),t.prototype.copyFrom=function(t){return this.northWest.set(t.westX,t.northY),this.size.set(t.width,t.height),this},t.prototype.containsOffset=function(t){return this.size.containsOffset(n.copyFrom(t).subtractOffset(this.northWest))},t.prototype.index=function(t){return this.size.index(n.copyFrom(t).subtractOffset(this.northWest))},t}();e.Rectangle=o},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=function(){function t(t,e){void 0===t&&(t=0),void 0===e&&(e=0),this.width=t,this.height=e}return t.prototype.toString=function(){return"("+this.width+"x"+this.height+")"},Object.defineProperty(t.prototype,"empty",{get:function(){return 0===this.width||0===this.height},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"area",{get:function(){return this.width*this.height},enumerable:!0,configurable:!0}),t.prototype.set=function(t,e){return this.width=t,this.height=e,this},t.prototype.copyFrom=function(t){return this.width=t.width,this.height=t.height,this},t.prototype.containsOffset=function(t){return t.x>=0&&t.y>=0&&t.x<this.width&&t.y<this.height},t.prototype.index=function(t){return t.y*this.width+t.x},t.prototype.forEach=function(t,e){for(var i=0;i<this.height;i++)for(var r=0;r<this.width;r++)t.x=r,t.y=i,e(t)},t}();e.Size=r},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=[0,1,0,-1],n=[-1,0,1,0],o=function(){function t(t,e){void 0===t&&(t=0),void 0===e&&(e=0),this.x=t,this.y=e}return t.prototype.toString=function(){return"("+this.x+","+this.y+")"},t.prototype.set=function(t,e){return this.x=t,this.y=e,this},t.prototype.copyFrom=function(t){return this.x=t.x,this.y=t.y,this},t.prototype.addOffset=function(t){return this.x+=t.x,this.y+=t.y,this},t.prototype.addCardinalDirection=function(t){return this.x+=r[t],this.y+=n[t],this},t.prototype.subtractOffset=function(t){return this.x-=t.x,this.y-=t.y,this},t}();e.Offset=o},function(t,e,i){"use strict";var r;Object.defineProperty(e,"__esModule",{value:!0}),function(t){t[t.NONE=0]="NONE",t[t.NORTH=1]="NORTH",t[t.EAST=2]="EAST",t[t.SOUTH=4]="SOUTH",t[t.WEST=8]="WEST",t[t.ALL=15]="ALL"}(r=e.DirectionFlags||(e.DirectionFlags={})),e.directionFlagsToString=function(t){var e="[";return 0!=(t&r.NORTH)&&(e+="N"),0!=(t&r.EAST)&&(e+="E"),0!=(t&r.SOUTH)&&(e+="S"),0!=(t&r.WEST)&&(e+="W"),e+"]"},e.directionFlagsFromDirection=function(t){return 1<<t}},function(t,e,i){"use strict";var r;Object.defineProperty(e,"__esModule",{value:!0}),function(t){t[t.NORTH=0]="NORTH",t[t.EAST=1]="EAST",t[t.SOUTH=2]="SOUTH",t[t.WEST=3]="WEST"}(r=e.Direction||(e.Direction={})),e.DIRECTIONS=[r.NORTH,r.EAST,r.SOUTH,r.WEST],e.directionOpposite=function(t){return t+2&3}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r,n=i(0);!function(t){t[t.WALL_NORTH=1]="WALL_NORTH",t[t.WALL_EAST=2]="WALL_EAST",t[t.WALL_WEST=8]="WALL_WEST",t[t.WALL_SOUTH=4]="WALL_SOUTH",t[t.BODY=1<<n.DIRECTIONS.length]="BODY"}(r||(r={}));var o=0,s=1,u=2,h=new n.Offset,f=function(){function t(t,e){this._size=new n.Size,this._size.set(t,e),this._tileFlags=new Array(this._size.area).fill(0)}return t.prototype._addFlag=function(t,e){var i=this._size.index(t);this._tileFlags[i]|=e},t.prototype._removeFlag=function(t,e){var i=this._size.index(t);this._tileFlags[i]&=~e},t.prototype.addWall=function(t,e,i){h.set(t,e).addCardinalDirection(i),this._size.containsOffset(h)&&(this._addFlag(h,1<<n.directionOpposite(i)),h.set(t,e),this._addFlag(h,1<<i))},t.prototype.removeWall=function(t,e,i){h.set(t,e).addCardinalDirection(i),this._size.containsOffset(h)&&(this._removeFlag(h,1<<n.directionOpposite(i)),h.set(t,e),this._removeFlag(h,1<<i))},t.prototype.getWalls=function(t,e){h.set(t,e);var i=this._size.index(h);return this._tileFlags[i]&n.DirectionFlags.ALL},t.prototype.addBody=function(t,e){h.set(t,e),this._addFlag(h,r.BODY)},t.prototype.removeBody=function(t,e){h.set(t,e),this._removeFlag(h,r.BODY)},t.prototype.getBody=function(t,e){h.set(t,e);var i=this._size.index(h);return this._tileFlags[i]&r.BODY},t.prototype.getFieldOfView=function(t,e,i){var r=new n.Offset(t,e),o=new n.Rectangle(r.x-i,r.y-i,2*i+1,2*i+1),s=new n.MaskRect(o);return s.set(r,!0),this._quadrant(s,r,i,-1,-1),this._quadrant(s,r,i,1,-1),this._quadrant(s,r,i,-1,1),this._quadrant(s,r,i,1,1),s},t.prototype._quadrant=function(t,e,i,n,h){var f=e.x,a=e.y,p=(Math.min(Math.max(f+n*(i+1),-1),this._size.width)-f)*n,l=(Math.min(Math.max(a+h*(i+1),-1),this._size.height)-a)*h;if(!(p<0||l<0))for(var d=1===h?r.WALL_SOUTH:r.WALL_NORTH,y=1===n?r.WALL_EAST:r.WALL_WEST,g=this._size.index(e),_=t.index(e),O=[0,Number.POSITIVE_INFINITY],b=0,v=g,m=_;b!==l&&O.length>0;b++,v+=h*this._size.width,m+=h*t.width)for(var w=1/(b+.5),S=0===b?Number.POSITIVE_INFINITY:1/(b-.5),T=0,x=0,F=v,W=m,z=-.5*w,A=.5*S;x!==p&&T!==O.length;x++,F+=n,W+=n,z+=w,A+=S){for(;z>=O[T+s]&&!((T+=u)>=O.length););if(T>=O.length)break;if(!(A<=O[T+o])){t.setAt(W,!0);var P=0!=(this._tileFlags[F]&d),j=0!=(this._tileFlags[F]&y);if(j&&P)T=c(O,T,z-1e-5/10,A+1e-5/10);else if((0!==x||0!==b)&&0!=(this._tileFlags[F]&r.BODY))T=j?c(O,T,z+1e-5,A+1e-5/10):c(O,T,P?z-1e-5/10:z+1e-5,A-1e-5);else if(j){T=c(O,T,z+w-1e-5/10,A+1e-5/10)}else if(P){T=c(O,T,z-1e-5/10,z+w+1e-5/10)}}}},t}();function c(t,e,i,r){for(;;){if(e===t.length)return e;if(i<=t[e+s])break;e+=u}if(i<=t[e+o]){if(r>=t[e+s])return t.splice(e,u),c(t,e,i,r);r>=t[e+o]&&(t[e+o]=r)}else{if(r>=t[e+s])return t[e+s]=i,c(t,e+=u,i,r);t.splice(e,0,t[e+o],i),t[(e+=u)+o]=r}return e}e.FieldOfViewMap=f},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=i(8);e.FieldOfViewMap=r.FieldOfViewMap;var n=i(0);e.Direction=n.Direction,e.DirectionFlags=n.DirectionFlags,e.MaskRect=n.MaskRect}]);
//# sourceMappingURL=wally-fov-1.0.0.js.map