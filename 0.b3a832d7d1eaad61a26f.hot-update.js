webpackHotUpdate(0,{

/***/ "./src/components/organisms/AridityTemperaturesLayer/delegate.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _components = __webpack_require__("./src/components/index.js");

var _patterns = __webpack_require__("./src/utils/patterns.js");

var patternsUtil = _interopRequireWildcard(_patterns);

var _boundaries = __webpack_require__("./src/utils/boundaries.js");

var boundaries = _interopRequireWildcard(_boundaries);

var _styles = __webpack_require__("./src/components/organisms/AridityTemperaturesLayer/styles.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Delegate = function (_CanvasDelegate) {
  _inherits(Delegate, _CanvasDelegate);

  function Delegate(data) {
    _classCallCheck(this, Delegate);

    var _this = _possibleConstructorReturn(this, (Delegate.__proto__ || Object.getPrototypeOf(Delegate)).call(this, data));

    _this.shouldUseMask = false;
    _this.visibility = {
      aridity: true,
      temperatures: true
    };
    return _this;
  }

  _createClass(Delegate, [{
    key: 'updateAridityVisibility',
    value: function updateAridityVisibility(visibility) {
      this.visibility.aridity = visibility;
    }
  }, {
    key: 'updateTemperaturesVisibility',
    value: function updateTemperaturesVisibility(visibility) {
      this.visibility.temperatures = visibility;
    }
  }, {
    key: 'enableMask',
    value: function enableMask() {
      this.shouldUseMask = true;
    }
  }, {
    key: 'disableMask',
    value: function disableMask() {
      this.shouldUseMask = false;
    }
  }, {
    key: 'createMask',
    value: function createMask(modelCanvas, temperatures, aridity) {
      var canvas = void 0;
      if (this.shouldUseMask) {
        canvas = this.createCanvas(modelCanvas);
        var aridityCanvas = this.createCanvas(modelCanvas);
        var temperaturesCanvas = this.createCanvas(modelCanvas);
        this.drawAreas({
          context: aridityCanvas.getContext('2d'),
          features: aridity,
          fillStyle: 'black',
          strokeWidth: 2
        });

        this.drawAreas({
          context: temperaturesCanvas.getContext('2d'),
          features: temperatures,
          fillStyle: 'black',
          strokeWidth: 1
        });

        var ctx = canvas.getContext('2d');
        ctx.drawImage(aridityCanvas, 0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'xor';
        ctx.drawImage(temperaturesCanvas, 0, 0, canvas.width, canvas.height);
        ctx.clip();
      }
      return canvas;
    }
  }, {
    key: 'draw',
    value: function draw(_ref) {
      var canvas = _ref.canvas,
          coords = _ref.coords;

      var _getTileFeatures = this.getTileFeatures(coords),
          aridity = _getTileFeatures.aridity,
          temperatures = _getTileFeatures.temperatures;

      var _visibility = this.visibility,
          isAridityVisible = _visibility.aridity,
          isTemperaturesVisible = _visibility.temperatures;


      var mask = this.createMask(canvas, temperatures, aridity);
      var context = canvas.getContext('2d');

      this.patterns = this.patterns || patternsUtil.initPatterns(context);
      var patterns = this.patterns;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.globalCompositeOperation = 'source-over';

      try {
        if (isTemperaturesVisible) {
          this.drawAreas({
            context: context,
            features: temperatures,
            fillStyle: function fillStyle(feature) {
              return (0, _styles.areaColor)(feature.tags.Temperatur);
            },
            strokeStyle: function strokeStyle(feature) {
              return (0, _styles.areaColor)(feature.tags.Temperatur);
            },
            strokeWidth: 1
          });
        }

        if (isAridityVisible) {
          this.drawAreas({
            context: context,
            features: aridity,
            fillStyle: function fillStyle(feature) {
              return patterns.findByKey(feature.tags.d_TYPE).canvasPattern;
            },
            stopCondition: function stopCondition(feature) {
              var pattern = patterns.findByKey(feature.tags.d_TYPE);
              if (!pattern) {
                return true;
              }
              if (!pattern.stripes) {
                return true;
              }
              return false;
            },
            strokeWidth: 0
          });

          boundaries.addBoundaries({
            context: context,
            patterns: patterns,
            drawPath: this.drawPath,
            boundaries: aridity,
            layer: this.layer
          });
        }

        if (mask) {
          context.globalCompositeOperation = 'destination-out';
          context.drawImage(mask, 0, 0, mask.width, mask.height);
        }

        context.clip();
      } catch (e) {
        console.error('error while drawing', e);
        throw e;
      }

      return canvas;
    }
  }]);

  return Delegate;
}(_components.CanvasDelegate);

var _default = Delegate;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Delegate, 'Delegate', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/AridityTemperaturesLayer/delegate.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/AridityTemperaturesLayer/delegate.js');
}();

;

/***/ })

})
//# sourceMappingURL=0.b3a832d7d1eaad61a26f.hot-update.js.map