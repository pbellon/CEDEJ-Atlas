webpackHotUpdate(0,{

/***/ "./src/components/molecules/TemperatureLegendRows/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _components = __webpack_require__("./src/components/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WinterName = function WinterName(_ref) {
  var children = _ref.children;
  return _react2.default.createElement(
    'tr',
    null,
    _react2.default.createElement(
      Th,
      { align: 'left' },
      _react2.default.createElement(
        _components.LegendCategoryName,
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
var TemperaturesRows = function TemperaturesRows(_ref2) {
  var _ref2$temperatures = _ref2.temperatures,
      summer = _ref2$temperatures.summer,
      winter = _ref2$temperatures.winter,
      aridity = _ref2.aridity,
      patterns = _ref2.patterns,
      layers = _ref2.layers;
  return [_react2.default.createElement(
    'tr',
    { key: 'h-h' },
    _react2.default.createElement(
      _components.TrName,
      null,
      _react2.default.createElement(
        _components.TrNameContent,
        null,
        'Temp\xE9ratures'
      )
    )
  ), winter.A.visible && [_react2.default.createElement(
    WinterName,
    { key: 'h-0' },
    'Hiver chaud (20 \xE0 30\xB0C)'
  ), summer.A.visible ? _react2.default.createElement(_components.TemperatureRow, {
    layers: layers,
    name: _react2.default.createElement(VeryHotSummer, null),
    key: 0,
    temperature: 1,
    patterns: patterns,
    aridity: aridity
  }) : null, summer.B.visible ? _react2.default.createElement(_components.TemperatureRow, {
    layers: layers,
    key: 1,
    name: _react2.default.createElement(HotSummer, null),
    aridity: aridity,
    temperature: 2,
    patterns: patterns
  }) : null], winter.B.visible && [_react2.default.createElement(
    WinterName,
    { key: 'h-1' },
    'Hiver temp\xE9r\xE9 (10 \xE0 20\xB0)'
  ), summer.A.visible ? _react2.default.createElement(_components.TemperatureRow, {
    layers: layers,
    key: 2,
    name: _react2.default.createElement(VeryHotSummer, null),
    temperature: 3,
    patterns: patterns,
    aridity: aridity
  }) : null, summer.B.visible ? _react2.default.createElement(_components.TemperatureRow, {
    layers: layers,
    key: 3,
    name: _react2.default.createElement(HotSummer, null),
    temperature: 4,
    patterns: patterns,
    aridity: aridity
  }) : null, summer.C.visible ? _react2.default.createElement(_components.TemperatureRow, {
    layers: layers,
    key: 4,
    name: _react2.default.createElement(TemperedSummer, null),
    temperature: 5,
    patterns: patterns,
    aridity: aridity
  }) : null], winter.C.visible && [_react2.default.createElement(
    WinterName,
    { key: 'h-2' },
    'Hiver frais (0 \xE0 10\xB0)'
  ), summer.A.visible ? _react2.default.createElement(_components.TemperatureRow, {
    layers: layers,
    key: 5,
    name: _react2.default.createElement(VeryHotSummer, null),
    temperature: 6,
    patterns: patterns,
    aridity: aridity
  }) : null, summer.B.visible ? _react2.default.createElement(_components.TemperatureRow, {
    layers: layers,
    key: 6,
    name: _react2.default.createElement(HotSummer, null),
    temperature: 7,
    patterns: patterns,
    aridity: aridity
  }) : null, summer.C.visible ? _react2.default.createElement(_components.TemperatureRow, {
    layers: layers,
    key: 7,
    name: _react2.default.createElement(TemperedSummer, null),
    temperature: 8,
    patterns: patterns,
    aridity: aridity
  }) : null], winter.D.visible && [_react2.default.createElement(
    WinterName,
    { key: 'h-3' },
    'Hiver froid (moins de 0\xB0)'
  ), summer.A.visible ? _react2.default.createElement(_components.TemperatureRow, {
    layers: layers,
    key: 8,
    name: _react2.default.createElement(VeryHotSummer, null),
    temperature: 9,
    patterns: patterns,
    aridity: aridity
  }) : null, summer.B.visible ? _react2.default.createElement(_components.TemperatureRow, {
    layers: layers,
    key: 9,
    name: _react2.default.createElement(HotSummer, null),
    temperature: 10,
    patterns: patterns,
    aridity: aridity
  }) : null, summer.C.visible ? _react2.default.createElement(_components.TemperatureRow, {
    layers: layers,
    key: 10,
    name: _react2.default.createElement(TemperedSummer, null),
    temperature: 11,
    patterns: patterns,
    aridity: aridity
  }) : null]];
};
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(WinterName, 'WinterName', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperatureLegendRows/index.js');

  __REACT_HOT_LOADER__.register(TemperaturesRows, 'TemperaturesRows', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperatureLegendRows/index.js');
}();

;

/***/ })

})
//# sourceMappingURL=0.3bdca749dbb91a14d9be.hot-update.js.map