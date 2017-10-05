webpackHotUpdate(0,{

/***/ "./src/components/molecules/LoadingIndicator/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  transition: opacity .33 ease-in-out;\n  position: absolute;\n  display: flex;\n  align-items: center;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-color: rgba(255,255,255,0.8);\n  z-index: 800;\n  opacity: ', ';\n  pointer-events: ', ';\n'], ['\n  transition: opacity .33 ease-in-out;\n  position: absolute;\n  display: flex;\n  align-items: center;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-color: rgba(255,255,255,0.8);\n  z-index: 800;\n  opacity: ', ';\n  pointer-events: ', ';\n']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _components = __webpack_require__("./src/components/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Holder = _styledComponents2.default.div(_templateObject, function (_ref) {
  var isLoading = _ref.isLoading;
  return isLoading ? 1 : 0;
}, function (_ref2) {
  var isLoading = _ref2.isLoading;
  return isLoading ? 'auto' : 'none';
});

var LoadingIndicator = function LoadingIndicator(_ref3) {
  var _ref3$isLoading = _ref3.isLoading,
      isLoading = _ref3$isLoading === undefined ? false : _ref3$isLoading;
  return _react2.default.createElement(
    Holder,
    { isLoading: isLoading },
    _react2.default.createElement(_components.LoadingIcon, null)
  );
};

_components.LoadingIcon.propTypes = {
  isLoading: _propTypes2.default.bool
};

var _default = LoadingIndicator;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(Holder, 'Holder', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/LoadingIndicator/index.js');

  __REACT_HOT_LOADER__.register(LoadingIndicator, 'LoadingIndicator', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/LoadingIndicator/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/molecules/LoadingIndicator/index.js');
}();

;

/***/ })

})
//# sourceMappingURL=0.911aab200c2f3a3d39df.hot-update.js.map