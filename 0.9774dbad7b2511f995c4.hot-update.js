webpackHotUpdate(0,{

/***/ "./src/components/molecules/TemperaturesLegend/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  padding-left: 7px;\n'], ['\n  padding-left: 7px;\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  font-size: 0.65rem;\n  line-height: 0.7rem;\n  .legend--print & {\n    width: 60px;\n    font-weight: bold;\n  }\n'], ['\n  font-size: 0.65rem;\n  line-height: 0.7rem;\n  .legend--print & {\n    width: 60px;\n    font-weight: bold;\n  }\n']),
    _templateObject3 = _taggedTemplateLiteral(['\n  font-size: 0.6rem;\n  line-height: 0.6rem;\n'], ['\n  font-size: 0.6rem;\n  line-height: 0.6rem;\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _reactAddonsCreateFragment = __webpack_require__("./node_modules/react-addons-create-fragment/index.js");

var _reactAddonsCreateFragment2 = _interopRequireDefault(_reactAddonsCreateFragment);

var _components = __webpack_require__("./src/components/index.js");

var _utils = __webpack_require__("./src/utils/index.js");

var _patterns = __webpack_require__("./src/utils/patterns.js");

var patternUtils = _interopRequireWildcard(_patterns);

var _aridity = __webpack_require__("./src/utils/aridity.js");

var aridityUtils = _interopRequireWildcard(_aridity);

var _temperatures = __webpack_require__("./src/utils/temperatures.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var SummerName = (0, _styledComponents2.default)(_components.Reduced)(_templateObject);

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
      _components.Th,
      { align: 'left' },
      _react2.default.createElement(
        _components.LegendCategoryName,
        null,
        _react2.default.createElement(
          _components.Reduced,
          null,
          children
        )
      )
    )
  );
};
WinterName.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)])
};

var TemperatureRow = function TemperatureRow(_ref2) {
  var name = _ref2.name,
      temperature = _ref2.temperature,
      patterns = _ref2.patterns,
      aridity = _ref2.aridity,
      showAridity = _ref2.layers.aridity.visible;

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
        patterns: patterns, aridity: ar,
        temperature: temp });
    }),
    visibleAridities.length === 0 && _react2.default.createElement(_components.TemperatureLegendPattern, { temperature: temp })
  );
};

var ATh = (0, _styledComponents2.default)(_components.Td)(_templateObject2);

var AridityName = function AridityName(_ref3) {
  var aridity = _ref3.aridity;
  return _react2.default.createElement(
    ATh,
    {
      width: 40,
      'data-tip': true,
      'data-for': 'tooltip-aridity-' + aridity.name },
    aridityUtils.getName(aridity)
  );
};

var ATd = (0, _styledComponents2.default)(_components.Td)(_templateObject3);

var AridityPrecipitations = function AridityPrecipitations(_ref4) {
  var aridity = _ref4.aridity;
  return _react2.default.createElement(
    ATd,
    null,
    'P/Etp',
    _react2.default.createElement('br', null),
    aridityUtils.getPrecipitations(aridity)
  );
};

var AridityNames = function AridityNames(_ref5) {
  var aridity = _ref5.aridity,
      print = _ref5.print;

  var visibleAridities = (0, _utils.visibleTypes)(aridity);
  if (!visibleAridities.length) {
    return null;
  }
  return [_react2.default.createElement(
    'tr',
    null,
    _react2.default.createElement(
      _components.TrName,
      null,
      _react2.default.createElement(
        _components.TrNameContent,
        null,
        'Aridit\xE9'
      )
    ),
    visibleAridities.map(function (aridity, key) {
      return _react2.default.createElement(AridityName, { aridity: aridity, key: key });
    })
  ), print ? _react2.default.createElement(
    'tr',
    null,
    _react2.default.createElement('td', null),
    visibleAridities.map(function (aridity, key) {
      return _react2.default.createElement(AridityPrecipitations, { key: key, aridity: aridity });
    })
  ) : null];
};

var TemperaturesRows = function TemperaturesRows(_ref6) {
  var _ref6$temperatures = _ref6.temperatures,
      summer = _ref6$temperatures.summer,
      winter = _ref6$temperatures.winter,
      aridity = _ref6.aridity,
      patterns = _ref6.patterns,
      layers = _ref6.layers;
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
  ), summer.A.visible ? _react2.default.createElement(TemperatureRow, { layers: layers,
    name: _react2.default.createElement(VeryHotSummer, null),
    key: 0,
    temperature: 1,
    patterns: patterns,
    aridity: aridity
  }) : null, summer.B.visible ? _react2.default.createElement(TemperatureRow, { layers: layers,
    key: 1,
    name: _react2.default.createElement(HotSummer, null),
    aridity: aridity,
    temperature: 2,
    patterns: patterns
  }) : null], winter.B.visible && [_react2.default.createElement(
    WinterName,
    { key: 'h-1' },
    'Hiver temp\xE9r\xE9 (10 \xE0 20\xB0)'
  ), summer.A.visible ? _react2.default.createElement(TemperatureRow, { layers: layers,
    key: 2,
    name: _react2.default.createElement(VeryHotSummer, null),
    temperature: 3,
    patterns: patterns,
    aridity: aridity
  }) : null, summer.B.visible ? _react2.default.createElement(TemperatureRow, { layers: layers,
    key: 3,
    name: _react2.default.createElement(HotSummer, null),
    temperature: 4,
    patterns: patterns,
    aridity: aridity
  }) : null, summer.C.visible ? _react2.default.createElement(TemperatureRow, { layers: layers,
    key: 4,
    name: _react2.default.createElement(TemperedSummer, null),
    temperature: 5,
    patterns: patterns,
    aridity: aridity
  }) : null], winter.C.visible && [_react2.default.createElement(
    WinterName,
    { key: 'h-2' },
    'Hiver frais (0 \xE0 10\xB0)'
  ), summer.A.visible ? _react2.default.createElement(TemperatureRow, { layers: layers,
    key: 5,
    name: _react2.default.createElement(VeryHotSummer, null),
    temperature: 6,
    patterns: patterns,
    aridity: aridity
  }) : null, summer.B.visible ? _react2.default.createElement(TemperatureRow, { layers: layers,
    key: 6,
    name: _react2.default.createElement(HotSummer, null),
    temperature: 7,
    patterns: patterns,
    aridity: aridity
  }) : null, summer.C.visible ? _react2.default.createElement(TemperatureRow, { layers: layers,
    key: 7,
    name: _react2.default.createElement(TemperedSummer, null),
    temperature: 8,
    patterns: patterns,
    aridity: aridity }) : null], winter.D.visible && [_react2.default.createElement(
    WinterName,
    { key: 'h-3' },
    'Hiver froid (moins de 0\xB0)'
  ), summer.A.visible ? _react2.default.createElement(TemperatureRow, { layers: layers,
    key: 8,
    name: _react2.default.createElement(VeryHotSummer, null),
    temperature: 9,
    patterns: patterns,
    aridity: aridity }) : null, summer.B.visible ? _react2.default.createElement(TemperatureRow, { layers: layers,
    key: 9,
    name: _react2.default.createElement(HotSummer, null),
    temperature: 10,
    patterns: patterns,
    aridity: aridity }) : null, summer.C.visible ? _react2.default.createElement(TemperatureRow, { layers: layers,
    key: 10,
    name: _react2.default.createElement(TemperedSummer, null),
    temperature: 11,
    patterns: patterns,
    aridity: aridity }) : null]];
};
var Temperatures = function Temperatures(_ref7) {
  var print = _ref7.print,
      _ref7$filters = _ref7.filters,
      _ref7$filters$tempera = _ref7$filters.temperatures,
      summer = _ref7$filters$tempera.summer,
      winter = _ref7$filters$tempera.winter,
      aridity = _ref7$filters.aridity,
      _ref7$layers = _ref7.layers,
      showTemperatures = _ref7$layers.temperatures.visible,
      showAridity = _ref7$layers.aridity.visible;

  var layers = {
    temperatures: { visible: showTemperatures },
    aridity: { visible: showAridity }
  };
  var hasVisibleAridity = showAridity && (0, _utils.visibleTypes)(aridity).length > 0;
  var hasVisibleTemperatures = showTemperatures && (0, _utils.visibleTypes)(winter).length > 0 && (0, _utils.visibleTypes)(summer).length > 0;

  var patterns = patternUtils.initPatterns();
  var temperatureRows = hasVisibleTemperatures ? TemperaturesRows({
    temperatures: { summer: summer, winter: winter },
    aridity: aridity,
    patterns: patterns,
    layers: layers
  }) : null;
  var tempsRowsFragment = (0, _reactAddonsCreateFragment2.default)({ temperatures: temperatureRows });

  var aridityNamesRows = hasVisibleAridity ? AridityNames({
    aridity: aridity,
    print: print
  }) : null;
  var aridityNamesFragment = (0, _reactAddonsCreateFragment2.default)({ aridity: aridityNamesRows });
  return _react2.default.createElement(
    'tbody',
    null,
    [aridityNamesFragment, tempsRowsFragment, !hasVisibleTemperatures && hasVisibleAridity ? _react2.default.createElement(TemperatureRow, { layers: layers,
      key: 'aridity-row',
      aridity: aridity,
      patterns: patterns }) : null]
  );
};

var _default = Temperatures;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(SummerName, 'SummerName', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperaturesLegend/index.js');

  __REACT_HOT_LOADER__.register(VeryHotSummer, 'VeryHotSummer', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperaturesLegend/index.js');

  __REACT_HOT_LOADER__.register(HotSummer, 'HotSummer', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperaturesLegend/index.js');

  __REACT_HOT_LOADER__.register(TemperedSummer, 'TemperedSummer', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperaturesLegend/index.js');

  __REACT_HOT_LOADER__.register(WinterName, 'WinterName', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperaturesLegend/index.js');

  __REACT_HOT_LOADER__.register(TemperatureRow, 'TemperatureRow', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperaturesLegend/index.js');

  __REACT_HOT_LOADER__.register(ATh, 'ATh', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperaturesLegend/index.js');

  __REACT_HOT_LOADER__.register(AridityName, 'AridityName', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperaturesLegend/index.js');

  __REACT_HOT_LOADER__.register(ATd, 'ATd', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperaturesLegend/index.js');

  __REACT_HOT_LOADER__.register(AridityPrecipitations, 'AridityPrecipitations', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperaturesLegend/index.js');

  __REACT_HOT_LOADER__.register(AridityNames, 'AridityNames', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperaturesLegend/index.js');

  __REACT_HOT_LOADER__.register(TemperaturesRows, 'TemperaturesRows', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperaturesLegend/index.js');

  __REACT_HOT_LOADER__.register(Temperatures, 'Temperatures', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperaturesLegend/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperaturesLegend/index.js');
}();

;

/***/ })

})
//# sourceMappingURL=0.9774dbad7b2511f995c4.hot-update.js.map