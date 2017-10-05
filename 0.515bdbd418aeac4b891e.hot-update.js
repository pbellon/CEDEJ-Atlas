webpackHotUpdate(0,{

/***/ "./src/components/atoms/Link/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.styles = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _templateObject = _taggedTemplateLiteral(['\n  font-family: ', ';\n  text-decoration: none;\n  font-weight: 500;\n  color: ', ';\n\n  &:hover {\n    text-decoration: underline;\n  }\n\n  &.active {\n    color: ', ';\n  }\n'], ['\n  font-family: ', ';\n  text-decoration: none;\n  font-weight: 500;\n  color: ', ';\n\n  &:hover {\n    text-decoration: underline;\n  }\n\n  &.active {\n    color: ', ';\n  }\n']),
    _templateObject2 = _taggedTemplateLiteral(['', ''], ['', '']);

var _react = __webpack_require__("./node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__("./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__("./node_modules/styled-components/dist/styled-components.es.js");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _styledTheme = __webpack_require__("./node_modules/styled-theme/index.js");

var _reactRouterDom = __webpack_require__("./node_modules/react-router-dom/es/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var styles = exports.styles = (0, _styledComponents.css)(_templateObject, (0, _styledTheme.font)('primary'), (0, _styledTheme.palette)({ grayscale: 0 }, 1), (0, _styledTheme.palette)({ primary: 0 }, 1));

var StyledLink = (0, _styledComponents2.default)(function (_ref) {
  var theme = _ref.theme,
      reverse = _ref.reverse,
      palette = _ref.palette,
      props = _objectWithoutProperties(_ref, ['theme', 'reverse', 'palette']);

  return _react2.default.createElement(_reactRouterDom.Link, props);
})(_templateObject2, styles);

var Anchor = _styledComponents2.default.a(_templateObject2, styles);

var Link = function Link(_ref2) {
  var to = _ref2.to,
      nodeKey = _ref2.nodeKey,
      href = _ref2.href,
      literal = _ref2.literal,
      props = _objectWithoutProperties(_ref2, ['to', 'nodeKey', 'href', 'literal']);

  var _to = to;
  if (href && href.startsWith('/')) {
    _to = href;
  }
  if (_to) {
    return _react2.default.createElement(StyledLink, _extends({ to: _to }, props));
  }
  return _react2.default.createElement(Anchor, _extends({ href: href }, props));
};

Link.propTypes = {
  palette: _propTypes2.default.string,
  reverse: _propTypes2.default.bool,
  to: _propTypes2.default.string
};

Link.defaultProps = {
  palette: 'primary'
};

var _default = Link;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(styles, 'styles', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Link/index.js');

  __REACT_HOT_LOADER__.register(StyledLink, 'StyledLink', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Link/index.js');

  __REACT_HOT_LOADER__.register(Anchor, 'Anchor', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Link/index.js');

  __REACT_HOT_LOADER__.register(Link, 'Link', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Link/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/toutenrab/Dev/_PRO/Skoli/CEDEJ/Atlas/src/components/atoms/Link/index.js');
}();

;

/***/ })

})
//# sourceMappingURL=0.515bdbd418aeac4b891e.hot-update.js.map