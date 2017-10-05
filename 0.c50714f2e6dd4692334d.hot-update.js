webpackHotUpdate(0,{

/***/ "./src/components/organisms/AridityTemperaturesLayer/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _components = __webpack_require__("./src/components/index.js");

var _delegate = __webpack_require__("./src/components/organisms/AridityTemperaturesLayer/delegate.js");

var _delegate2 = _interopRequireDefault(_delegate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AridityTemperaturesLayer = function (_CanvasTiles) {
  _inherits(AridityTemperaturesLayer, _CanvasTiles);

  function AridityTemperaturesLayer() {
    _classCallCheck(this, AridityTemperaturesLayer);

    return _possibleConstructorReturn(this, (AridityTemperaturesLayer.__proto__ || Object.getPrototypeOf(AridityTemperaturesLayer)).apply(this, arguments));
  }

  _createClass(AridityTemperaturesLayer, [{
    key: 'updateAridityVisiblity',
    value: function updateAridityVisiblity(visibility) {
      if (!visibility) {
        this.delegate.disableMask();
      } else {
        this.delegate.enableMask();
      }
      this.delegate.updateAridityVisibility(visibility);
      this.redraw();
    }
  }, {
    key: 'updateTemperaturesVisiblity',
    value: function updateTemperaturesVisiblity(visibility) {
      if (!visibility) {
        this.delegate.disableMask();
      } else {
        this.delegate.enableMask();
      }
      this.delegate.updateTemperaturesVisibility(visibility);
      this.redraw();
    }
  }, {
    key: 'updateLeafletElement',
    value: function updateLeafletElement(_ref, _ref2) {
      var fromAridityVisibility = _ref.showAridity,
          fromTemperaturesVisibility = _ref.showTemperatures,
          _ref$data = _ref.data,
          fromTemps = _ref$data.temperatures,
          fromAridity = _ref$data.aridity;
      var toAridityVisibility = _ref2.showAridity,
          toTemperaturesVisibility = _ref2.showTemperatures,
          _ref2$data = _ref2.data,
          toTemps = _ref2$data.temperatures,
          toAridity = _ref2$data.aridity,
          _ref2$counts = _ref2.counts,
          tempsCounts = _ref2$counts.temperatures,
          aridityCounts = _ref2$counts.aridity;

      var shouldEnableMask = (tempsCounts.original != tempsCounts.current && tempsCounts.current > 0 || aridityCounts.original != aridityCounts.current && aridityCounts.current > 0) && toAridityVisibility && toTemperaturesVisibility && toTemps.features.length > 0 && toAridity.features.length > 0;

      var diffAridity = fromAridity.features.length !== toAridity.features.length;
      var diffTemps = fromTemps.features.length !== toTemps.features.length;
      if (diffTemps || diffAridity) {
        if (shouldEnableMask) {
          this.delegate.enableMask();
        } else {
          this.delegate.disableMask();
        }
        this.updateData({
          aridity: toAridity,
          temperatures: toTemps
        });
      } else {
        this.onRendered();
      }

      if (fromAridityVisibility !== toAridityVisibility) {
        this.updateAridityVisiblity(toAridityVisibility);
      }

      if (fromTemperaturesVisibility !== toTemperaturesVisibility) {
        this.updateTemperaturesVisiblity(toTemperaturesVisibility);
      }
    }
  }]);

  return AridityTemperaturesLayer;
}(_components.CanvasTiles);

AridityTemperaturesLayer.propTypes = _extends({}, _components.CanvasTiles.propTypes, {
  showAridity: _propTypes2.default.bool,
  showTemperatures: _propTypes2.default.bool,
  counts: _propTypes2.default.shape({
    temperatures: _propTypes2.default.object,
    aridity: _propTypes2.default.object
  })
});
AridityTemperaturesLayer.defaultProps = _extends({}, _components.CanvasTiles.defaultProps, {
  delegate: _delegate2.default
});
var _default = AridityTemperaturesLayer;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(AridityTemperaturesLayer, 'AridityTemperaturesLayer', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/AridityTemperaturesLayer/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/AridityTemperaturesLayer/index.js');
}();

;

/***/ })

})
//# sourceMappingURL=0.c50714f2e6dd4692334d.hot-update.js.map