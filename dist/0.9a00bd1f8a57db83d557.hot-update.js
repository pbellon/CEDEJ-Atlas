webpackHotUpdate(0,{

/***/ "./src/components/organisms/AtlasLegend/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  font-family: ', ';\n  background: ', ';\n  position: absolute;\n  z-index: 1000;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  transform: translate(', ', 0);\n  padding: 5px;\n  padding-top: 0;\n  max-width: ', 'px;\n  overflow: ', ';\n  transition: transform .5s ease-in-out;\n\n  &.legend--print {\n    font-family: Arial, sans-serif;\n    max-width: 700px;\n    position: static;\n    top: auto;\n    overflow: visible;\n    [data-tip]:after {\n      display: none;\n    }\n  }\n'], ['\n  font-family: ', ';\n  background: ', ';\n  position: absolute;\n  z-index: 1000;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  transform: translate(', ', 0);\n  padding: 5px;\n  padding-top: 0;\n  max-width: ', 'px;\n  overflow: ', ';\n  transition: transform .5s ease-in-out;\n\n  &.legend--print {\n    font-family: Arial, sans-serif;\n    max-width: 700px;\n    position: static;\n    top: auto;\n    overflow: visible;\n    [data-tip]:after {\n      display: none;\n    }\n  }\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  transition: opacity .5s ease;\n  opacity: ', ';\n  pointer-events: ', ';\n'], ['\n  transition: opacity .5s ease;\n  opacity: ', ';\n  pointer-events: ', ';\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _styledTheme = __webpack_require__("./node_modules/styled-theme/index.js");

var _components = __webpack_require__("./src/components/index.js");

var _styles = __webpack_require__("./src/utils/styles.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Legend = _styledComponents2.default.div(_templateObject, (0, _styledTheme.font)('primary'), (0, _styledTheme.palette)('white', 1), function (_ref) {
  var isOpened = _ref.isOpened;
  return isOpened ? 0 : '-87%';
}, _styles.legend.width, function (_ref2) {
  var isOpened = _ref2.isOpened;
  return isOpened ? 'auto' : 'hidden';
});

var VisibleIfOpened = _styledComponents2.default.div(_templateObject2, function (_ref3) {
  var isOpened = _ref3.isOpened;
  return isOpened ? 1 : 0;
}, function (_ref4) {
  var isOpened = _ref4.isOpened;
  return isOpened ? 'auto' : 'none';
});

var visibilityButtonStyle = {
  position: 'absolute',
  right: 0,
  left: 0
};

var AtlasLegend = function AtlasLegend(_ref5) {
  var isOpened = _ref5.isOpened,
      filters = _ref5.filters,
      layers = _ref5.layers,
      print = _ref5.print,
      circleSizes = _ref5.circleSizes;

  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      Legend,
      {
        className: 'legend ' + (print ? 'legend--print' : ''),
        isOpened: isOpened
      },
      !print && _react2.default.createElement(_components.LegendToggleButton, { style: visibilityButtonStyle }),
      _react2.default.createElement(
        VisibleIfOpened,
        { isOpened: isOpened },
        _react2.default.createElement(_components.LegendContent, {
          circleSizes: circleSizes,
          print: print,
          layers: layers,
          filters: filters
        })
      )
    ),
    _react2.default.createElement(_components.LegendTooltips, { layers: layers, filters: filters })
  );
};

AtlasLegend.propTypes = {
  layers: _propTypes2.default.object.isRequired,
  filters: _propTypes2.default.object.isRequired,
  circleSizes: _propTypes2.default.object.isRequired,
  print: _propTypes2.default.bool,
  isOpened: _propTypes2.default.bool

};

AtlasLegend.defaultProps = {
  print: false,
  isOpened: true
};

var _default = AtlasLegend;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Legend, 'Legend', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/AtlasLegend/index.js');

  __REACT_HOT_LOADER__.register(VisibleIfOpened, 'VisibleIfOpened', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/AtlasLegend/index.js');

  __REACT_HOT_LOADER__.register(visibilityButtonStyle, 'visibilityButtonStyle', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/AtlasLegend/index.js');

  __REACT_HOT_LOADER__.register(AtlasLegend, 'AtlasLegend', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/AtlasLegend/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/AtlasLegend/index.js');
}();

;

/***/ })

})
//# sourceMappingURL=0.9a00bd1f8a57db83d557.hot-update.js.map