webpackHotUpdate(0,{

/***/ "./src/components/atoms/CanvasDelegate/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _d3Path = __webpack_require__("./node_modules/d3-path/index.js");

var _geojsonVt = __webpack_require__("./node_modules/geojson-vt/src/index.js");

var _geojsonVt2 = _interopRequireDefault(_geojsonVt);

var _utils = __webpack_require__("./src/utils/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CanvasDelegate = function () {
  function CanvasDelegate(data) {
    _classCallCheck(this, CanvasDelegate);

    this.tiled = {};
    this.tileOptions = {
      maxZoom: 7,
      tolerance: 2,
      extent: 4096,
      buffer: 64,
      debug: 0,
      indexMaxZoom: 3,
      indexMaxPoints: 10000,
      solidChildren: false
    };
    this.processData(data);
  }

  _createClass(CanvasDelegate, [{
    key: 'processData',
    value: function processData(data) {
      var _this = this;

      Object.keys(data).forEach(function (key) {
        _this.tiled[key] = (0, _geojsonVt2.default)(data[key], _this.tileOptions);
      });
    }
  }, {
    key: 'getTileFeatures',
    value: function getTileFeatures(_ref) {
      var _this2 = this;

      var x = _ref.x,
          y = _ref.y,
          z = _ref.z;

      var res = {};
      Object.keys(this.tiled).forEach(function (key) {
        var fTiled = _this2.tiled[key].getTile(z, x, y);
        res[key] = fTiled ? fTiled.features : [];
      });
      return res;
    }
  }, {
    key: 'createCanvas',
    value: function createCanvas(modelCanvas) {
      var canvas = document.createElement('canvas');
      canvas.width = modelCanvas.width;
      canvas.height = modelCanvas.height;
      return canvas;
    }
  }, {
    key: 'setLayer',
    value: function setLayer(layer) {
      this.layer = layer;
    }
  }, {
    key: 'updateData',
    value: function updateData(data) {
      this.processData(data);
    }
  }, {
    key: 'draw',
    value: function draw() {
      throw new Error('You have to implement the draw method !');
    }
  }, {
    key: 'drawPath',
    value: function drawPath(feature, ctx) {
      var pad = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      var type = feature.type;
      var ratio = ctx.canvas.height / 4096;
      var path = (0, _d3Path.path)();
      var j = 0;
      var k = 0;
      var glen = feature.geometry.length;
      for (j; j < feature.geometry.length; j += 1) {
        var geom = feature.geometry[j];
        var sglen = geo.length;
        if (type === 1) {
          path.arc(geom[0] * ratio + pad, geom[1] * ratio + pad, 2, 0, 2 * Math.PI, false);
          continue;
        }

        for (k = 0; k < sglen; k += 1) {
          var p = geom[k];
          if (k) {
            path.lineTo(p[0] * ratio + pad, p[1] * ratio + pad);
          } else {
            path.moveTo(p[0] * ratio + pad, p[1] * ratio + pad);
          }
        }
      }
      return path;
    }
  }, {
    key: 'drawArea',
    value: function drawArea(_ref2) {
      var context = _ref2.context,
          area = _ref2.area,
          fillStyle = _ref2.fillStyle,
          strokeStyle = _ref2.strokeStyle,
          _ref2$strokeWidth = _ref2.strokeWidth,
          strokeWidth = _ref2$strokeWidth === undefined ? 1 : _ref2$strokeWidth;

      context.lineWidth = strokeWidth;
      context.fillStyle = fillStyle;
      if (strokeStyle) {
        context.strokeStyle = strokeStyle;
      }
      var path = new Path2D(this.drawPath(area, context));
      if (strokeWidth > 0) {
        context.stroke(path);
      }
      context.fill(path, 'evenodd');
    }
  }, {
    key: 'drawAreas',
    value: function drawAreas(_ref3) {
      var context = _ref3.context,
          features = _ref3.features,
          fillStyle = _ref3.fillStyle,
          strokeStyle = _ref3.strokeStyle,
          _ref3$strokeWidth = _ref3.strokeWidth,
          strokeWidth = _ref3$strokeWidth === undefined ? 1 : _ref3$strokeWidth,
          stopCondition = _ref3.stopCondition;

      var i = 0;
      var n = features.length;
      for (i; i < n; i++) {
        var area = features[i];
        if (stopCondition) {
          if (stopCondition(area)) {
            continue;
          }
        }

        var fill = (0, _utils.isFunction)(fillStyle) ? fillStyle(area) : fillStyle;
        var stroke = (0, _utils.isFunction)(strokeStyle) ? strokeStyle(area) : strokeStyle;
        var strokeW = (0, _utils.isFunction)(strokeWidth) ? strokeWidth(area) : strokeWidth;
        // draw zones with different colors to do
        this.drawArea({
          area: area,
          context: context,
          fillStyle: fill,
          strokeStyle: stroke,
          strokeWidth: strokeW
        });
      }
    }
  }]);

  return CanvasDelegate;
}();

var _default = CanvasDelegate;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(CanvasDelegate, 'CanvasDelegate', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/CanvasDelegate/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/CanvasDelegate/index.js');
}();

;

/***/ })

})
//# sourceMappingURL=0.b791d2270f92c8a71ca9.hot-update.js.map