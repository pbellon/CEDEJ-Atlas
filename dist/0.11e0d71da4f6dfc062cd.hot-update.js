webpackHotUpdate(0,{

/***/ "./src/components/molecules/TemperatureLegendRow/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _templateObject = _taggedTemplateLiteral(['\n  padding-left: 7px;\n'], ['\n  padding-left: 7px;\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _temperatures = __webpack_require__("./src/utils/temperatures.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var SummerName = (0, _styledComponents2.default)(Reduced)(_templateObject);

var VeryHotSummer = function VeryHotSummer() {
  return _react2.default.createElement(
    SummerName,
    null,
    '\xE9t\xE9 tr\xE8s chaud (plus de 30\xB0)'
  );
};

var HotSummer = function HotSummer() {
  return _react2.default.createElement(
    SummerName,
    null,
    '\xE9t\xE9 chaud (20 \xE0 30\xB0)'
  );
};
var TemperedSummer = function TemperedSummer() {
  return _react2.default.createElement(
    SummerName,
    null,
    '\xE9t\xE9 temp\xE9r\xE9 (10 \xE0 20\xB0)'
  );
};
var WinterName = function WinterName(_ref) {
  var children = _ref.children;
  return _react2.default.createElement(
    'tr',
    null,
    _react2.default.createElement(
      Th,
      { align: 'left' },
      _react2.default.createElement(
        LegendCategoryName,
        null,
        _react2.default.createElement(
          Reduced,
          null,
          children
        )
      )
    )
  );
};
WinterName.propTypes = {
  children: _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.arrayOf(_propTypes2.default.node)])
};

var TemperatureRow = function TemperatureRow(_ref2) {
  var name = _ref2.name,
      temperature = _ref2.temperature,
      patterns = _ref2.patterns,
      aridity = _ref2.aridity,
      showAridity = _ref2.layers.aridity.visible;

  var temp = (0, _temperatures.findByValue)(temperature);
  var visibleAridities = showAridity ? visibleTypes(aridity) : [];
  return _react2.default.createElement(
    'tr',
    null,
    _react2.default.createElement(
      Td,
      { align: 'left' },
      name
    ),
    visibleAridities.map(function (ar, key) {
      return _react2.default.createElement(TemperatureLegendPattern, {
        key: key,
        patterns: patterns,
        aridity: ar,
        temperature: temp
      });
    }),
    visibleAridities.length === 0 && _react2.default.createElement(TemperatureLegendPattern, { temperature: temp })
  );
};
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(SummerName, 'SummerName', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperatureLegendRow/index.js');

  __REACT_HOT_LOADER__.register(VeryHotSummer, 'VeryHotSummer', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperatureLegendRow/index.js');

  __REACT_HOT_LOADER__.register(HotSummer, 'HotSummer', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperatureLegendRow/index.js');

  __REACT_HOT_LOADER__.register(TemperedSummer, 'TemperedSummer', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperatureLegendRow/index.js');

  __REACT_HOT_LOADER__.register(WinterName, 'WinterName', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperatureLegendRow/index.js');

  __REACT_HOT_LOADER__.register(TemperatureRow, 'TemperatureRow', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperatureLegendRow/index.js');
}();

;

/***/ })

})
//# sourceMappingURL=0.11e0d71da4f6dfc062cd.hot-update.js.map