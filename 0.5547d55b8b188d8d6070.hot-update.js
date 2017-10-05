webpackHotUpdate(0,{

/***/ "./src/components/molecules/TemperaturesLegend/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

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

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Temperatures = function Temperatures(_ref) {
  var print = _ref.print,
      _ref$filters = _ref.filters,
      _ref$filters$temperat = _ref$filters.temperatures,
      summer = _ref$filters$temperat.summer,
      winter = _ref$filters$temperat.winter,
      aridity = _ref$filters.aridity,
      _ref$layers = _ref.layers,
      showTemperatures = _ref$layers.temperatures.visible,
      showAridity = _ref$layers.aridity.visible;

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

  __REACT_HOT_LOADER__.register(Temperatures, 'Temperatures', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperaturesLegend/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/TemperaturesLegend/index.js');
}();

;

/***/ })

})
//# sourceMappingURL=0.5547d55b8b188d8d6070.hot-update.js.map