webpackHotUpdate(0,{

/***/ "./src/components/molecules/TemperatureLegendRows/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  padding-left: 7px;\n'], ['\n  padding-left: 7px;\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _components = __webpack_require__("./src/components/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

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

var SummerName = styled(Reduced)(_templateObject);

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

var _default = TemperaturesRows;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(WinterName, 'WinterName', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperatureLegendRows/index.js');

  __REACT_HOT_LOADER__.register(SummerName, 'SummerName', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperatureLegendRows/index.js');

  __REACT_HOT_LOADER__.register(VeryHotSummer, 'VeryHotSummer', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperatureLegendRows/index.js');

  __REACT_HOT_LOADER__.register(HotSummer, 'HotSummer', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperatureLegendRows/index.js');

  __REACT_HOT_LOADER__.register(TemperedSummer, 'TemperedSummer', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperatureLegendRows/index.js');

  __REACT_HOT_LOADER__.register(TemperaturesRows, 'TemperaturesRows', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperatureLegendRows/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperatureLegendRows/index.js');
}();

;

/***/ })

})
//# sourceMappingURL=0.4d8135f73509547cd077.hot-update.js.map