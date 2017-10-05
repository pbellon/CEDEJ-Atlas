webpackHotUpdate(0,{

/***/ "./src/components/molecules/TemperaturesLegend/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  font-size: 0.65rem;\n  line-height: 0.7rem;\n  .legend--print & {\n    width: 60px;\n    font-weight: bold;\n  }\n'], ['\n  font-size: 0.65rem;\n  line-height: 0.7rem;\n  .legend--print & {\n    width: 60px;\n    font-weight: bold;\n  }\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  font-size: 0.6rem;\n  line-height: 0.6rem;\n'], ['\n  font-size: 0.6rem;\n  line-height: 0.6rem;\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

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

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var ATh = (0, _styledComponents2.default)(_components.Td)(_templateObject);

var AridityName = function AridityName(_ref) {
  var aridity = _ref.aridity;
  return _react2.default.createElement(
    ATh,
    {
      width: 40,
      'data-tip': true,
      'data-for': 'tooltip-aridity-' + aridity.name },
    aridityUtils.getName(aridity)
  );
};

var ATd = (0, _styledComponents2.default)(_components.Td)(_templateObject2);

var AridityPrecipitations = function AridityPrecipitations(_ref2) {
  var aridity = _ref2.aridity;
  return _react2.default.createElement(
    ATd,
    null,
    'P/Etp',
    _react2.default.createElement('br', null),
    aridityUtils.getPrecipitations(aridity)
  );
};

var AridityNames = function AridityNames(_ref3) {
  var aridity = _ref3.aridity,
      print = _ref3.print;

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

var Temperatures = function Temperatures(_ref4) {
  var print = _ref4.print,
      _ref4$filters = _ref4.filters,
      _ref4$filters$tempera = _ref4$filters.temperatures,
      summer = _ref4$filters$tempera.summer,
      winter = _ref4$filters$tempera.winter,
      aridity = _ref4$filters.aridity,
      _ref4$layers = _ref4.layers,
      showTemperatures = _ref4$layers.temperatures.visible,
      showAridity = _ref4$layers.aridity.visible;

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
    [aridityNamesFragment, tempsRowsFragment, !hasVisibleTemperatures && hasVisibleAridity ? _react2.default.createElement(TemperatureRow, {
      layers: layers,
      key: 'aridity-row',
      aridity: aridity,
      patterns: patterns
    }) : null]
  );
};

var _default = Temperatures;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(ATh, 'ATh', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperaturesLegend/index.js');

  __REACT_HOT_LOADER__.register(AridityName, 'AridityName', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperaturesLegend/index.js');

  __REACT_HOT_LOADER__.register(ATd, 'ATd', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperaturesLegend/index.js');

  __REACT_HOT_LOADER__.register(AridityPrecipitations, 'AridityPrecipitations', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperaturesLegend/index.js');

  __REACT_HOT_LOADER__.register(AridityNames, 'AridityNames', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperaturesLegend/index.js');

  __REACT_HOT_LOADER__.register(Temperatures, 'Temperatures', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperaturesLegend/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperaturesLegend/index.js');
}();

;

/***/ })

})
//# sourceMappingURL=0.39657020c6c7986c3be6.hot-update.js.map