webpackHotUpdate(0,{

/***/ "./src/components/molecules/TemperatureLegendRow/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = __webpack_require__("./src/utils/index.js");

var _temperatures = __webpack_require__("./src/utils/temperatures.js");

var _components = __webpack_require__("./src/components/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TemperatureRow = function TemperatureRow(_ref) {
  var name = _ref.name,
      temperature = _ref.temperature,
      patterns = _ref.patterns,
      aridity = _ref.aridity,
      showAridity = _ref.layers.aridity.visible;

  var temp = (0, _temperatures.findByValue)(temperature);
  var visibleAridities = showAridity ? (0, _utils.visibleTypes)(aridity) : [];
  return _react2.default.createElement(
    'tr',
    null,
    _react2.default.createElement(
      _components.Td,
      { align: 'left' },
      name
    ),
    visibleAridities.map(function (ar, key) {
      return _react2.default.createElement(_components.TemperatureLegendPattern, {
        key: key,
        patterns: patterns,
        aridity: ar,
        temperature: temp
      });
    }),
    visibleAridities.length === 0 && _react2.default.createElement(_components.TemperatureLegendPattern, { temperature: temp })
  );
};

TemperatureRow.propTypes = {
  name: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.node]),
  temperature: _propTypes2.default.number,
  patterns: _propTypes2.default.object,
  aridity: _propTypes2.default.object,
  layers: _propTypes2.default.object
};

var _default = TemperatureRow;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(TemperatureRow, 'TemperatureRow', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperatureLegendRow/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperatureLegendRow/index.js');
}();

;

/***/ })

})
//# sourceMappingURL=0.3f5d9c55179383c340e8.hot-update.js.map