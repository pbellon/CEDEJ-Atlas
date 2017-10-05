webpackHotUpdate(0,{

/***/ "./src/components/organisms/AridityFilters/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  display: flex;\n  justify-content: space-around;\n'], ['\n  display: flex;\n  justify-content: space-around;\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  flex-grow: 1;\n  flex-base: 1;\n'], ['\n  flex-grow: 1;\n  flex-base: 1;\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _components = __webpack_require__("./src/components/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Cols = _styledComponents2.default.div(_templateObject);

var Col = _styledComponents2.default.div(_templateObject2);

var AridityFilters = function AridityFilters() {
  return _react2.default.createElement(
    Cols,
    null,
    _react2.default.createElement(
      Col,
      null,
      _react2.default.createElement(_components.ToggleAridityVisibility, { label: 'Hyper Aride', aridity: 'hyper' }),
      _react2.default.createElement(_components.ToggleAridityVisibility, { label: 'Aride', aridity: 'arid' })
    ),
    _react2.default.createElement(
      Col,
      null,
      _react2.default.createElement(_components.ToggleAridityVisibility, { label: 'Semi Aride', aridity: 'semi' }),
      _react2.default.createElement(_components.ToggleAridityVisibility, { label: 'Sub Humide', aridity: 'subHumide' })
    )
  );
};

var _default = AridityFilters;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Cols, 'Cols', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/AridityFilters/index.js');

  __REACT_HOT_LOADER__.register(Col, 'Col', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/AridityFilters/index.js');

  __REACT_HOT_LOADER__.register(AridityFilters, 'AridityFilters', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/AridityFilters/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/organisms/AridityFilters/index.js');
}();

;

/***/ })

})
//# sourceMappingURL=0.63522e9e719788d89f5d.hot-update.js.map