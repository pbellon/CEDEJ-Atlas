webpackHotUpdate(0,{

/***/ "./src/components/molecules/AridityLegendNames/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _templateObject = _taggedTemplateLiteral(['\n  font-size: 0.65rem;\n  line-height: 0.7rem;\n  .legend--print & {\n    width: 60px;\n    font-weight: bold;\n  }\n'], ['\n  font-size: 0.65rem;\n  line-height: 0.7rem;\n  .legend--print & {\n    width: 60px;\n    font-weight: bold;\n  }\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  font-size: 0.6rem;\n  line-height: 0.6rem;\n'], ['\n  font-size: 0.6rem;\n  line-height: 0.6rem;\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _components = __webpack_require__("./src/components/index.js");

var _aridity = __webpack_require__("./src/utils/aridity.js");

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
    (0, _aridity.getName)(aridity)
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
    (0, _aridity.getPrecipitations)(aridity)
  );
};

var AridityNames = function AridityNames(_ref3) {
  var aridity = _ref3.aridity,
      print = _ref3.print;

  var visibleAridities = visibleTypes(aridity);
  if (!visibleAridities.length) {
    return null;
  }
  return [_react2.default.createElement(
    'tr',
    null,
    _react2.default.createElement(
      TrName,
      null,
      _react2.default.createElement(
        TrNameContent,
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
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(ATh, 'ATh', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/AridityLegendNames/index.js');

  __REACT_HOT_LOADER__.register(AridityName, 'AridityName', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/AridityLegendNames/index.js');

  __REACT_HOT_LOADER__.register(ATd, 'ATd', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/AridityLegendNames/index.js');

  __REACT_HOT_LOADER__.register(AridityPrecipitations, 'AridityPrecipitations', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/AridityLegendNames/index.js');

  __REACT_HOT_LOADER__.register(AridityNames, 'AridityNames', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/AridityLegendNames/index.js');
}();

;

/***/ })

})
//# sourceMappingURL=0.f0e818f847327eedc7c9.hot-update.js.map